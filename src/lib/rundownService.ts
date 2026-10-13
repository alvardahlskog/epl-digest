import { 
  RundownData, 
  Team, 
  Player, 
  LeagueTableEntry, 
  MatchResult, 
  PlayerPerformance, 
  PlayerNewsItem, 
  MatchScorer 
} from '@/types';
import { TEAM_BRAND_MAP, STAR_PLAYERS_KEYWORDS } from './constants';
import { FALLBACK_RUNDOWN_DATA } from './mockData';

// In-memory cache for live requests
let cachedRundown: { data: RundownData; timestamp: number } | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

interface FplTeam {
  id: number;
  name: string;
  short_name: string;
  code: number;
}

interface FplElement {
  id: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number;
  now_cost: number;
  selected_by_percent: string;
  total_points: number;
  form: string;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  saves: number;
  news?: string;
  chance_of_playing_next_round?: number | null;
  status: string;
}

interface FplFixtureStatItem {
  value: number;
  element: number;
}

interface FplFixtureStat {
  identifier: string;
  a: FplFixtureStatItem[];
  h: FplFixtureStatItem[];
}

interface FplFixture {
  id: number;
  event: number;
  kickoff_time: string;
  finished: boolean;
  team_h: number;
  team_a: number;
  team_h_score: number | null;
  team_a_score: number | null;
  stats?: FplFixtureStat[];
}

interface FplLiveElement {
  id: number;
  stats: {
    total_points: number;
    goals_scored: number;
    assists: number;
    clean_sheets: number;
    saves: number;
    bonus: number;
    bps: number;
  };
}

export async function getPremierLeagueRundown(): Promise<RundownData> {
  const now = performance.now();
  if (cachedRundown && (now - cachedRundown.timestamp < CACHE_TTL_MS)) {
    return cachedRundown.data;
  }

  try {
    const signal = AbortSignal.timeout(8000);

    const [bootstrapRes, fixturesRes] = await Promise.all([
      fetch('https://fantasy.premierleague.com/api/bootstrap-static/', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal,
        cache: 'no-store'
      }),
      fetch('https://fantasy.premierleague.com/api/fixtures/', {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal,
        cache: 'no-store'
      })
    ]);

    if (!bootstrapRes.ok || !fixturesRes.ok) {
      console.warn('FPL endpoints returned non-OK status. Using fallback data.');
      return FALLBACK_RUNDOWN_DATA;
    }

    const bootstrap = await bootstrapRes.json();
    const fixtures: FplFixture[] = await fixturesRes.json();

    // Determine current active/finished gameweek
    const currentEvent = bootstrap.events.find((e: { is_current: boolean }) => e.is_current) 
      || bootstrap.events.filter((e: { finished: boolean }) => e.finished).pop()
      || { id: 6 };
    const currentGw: number = currentEvent.id || 6;

    // Fetch live gameweek stats
    let liveElements: FplLiveElement[] = [];
    try {
      const liveRes = await fetch(`https://fantasy.premierleague.com/api/event/${currentGw}/live/`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(8000),
        cache: 'no-store'
      });
      if (liveRes.ok) {
        const liveData = await liveRes.json();
        liveElements = liveData.elements || [];
      }
    } catch {
      console.warn('Failed to fetch event live data, continuing with general stats');
    }

    const liveStatsMap = new Map<number, FplLiveElement['stats']>();
    liveElements.forEach(el => liveStatsMap.set(el.id, el.stats));

    // Map Teams
    const teamsMap = new Map<number, Team>();
    const allTeams: Team[] = (bootstrap.teams as FplTeam[]).map(t => {
      const brand = TEAM_BRAND_MAP[t.short_name] || { primary: '#37003c', secondary: '#00ff85', nickname: t.name };
      const teamObj: Team = {
        id: t.id,
        name: t.name,
        shortName: t.short_name,
        code: t.code,
        primaryColor: brand.primary,
        secondaryColor: brand.secondary,
      };
      teamsMap.set(t.id, teamObj);
      return teamObj;
    });

    // Map Players
    const posMap: Record<number, Player['position']> = { 1: 'GKP', 2: 'DEF', 3: 'MID', 4: 'FWD' };
    const playersMap = new Map<number, Player>();
    const allPlayers: Player[] = (bootstrap.elements as FplElement[]).map(e => {
      const team = teamsMap.get(e.team);
      const isStar = STAR_PLAYERS_KEYWORDS.has(e.web_name.toLowerCase()) || 
                     STAR_PLAYERS_KEYWORDS.has(e.second_name.toLowerCase()) || 
                     parseFloat(e.selected_by_percent) > 20 ||
                     e.total_points > 40;
      
      const playerObj: Player = {
        id: e.id,
        webName: e.web_name,
        firstName: e.first_name,
        secondName: e.second_name,
        teamId: e.team,
        teamName: team ? team.name : 'Unknown',
        teamShortName: team ? team.shortName : 'UNK',
        position: posMap[e.element_type] || 'MID',
        totalPoints: e.total_points,
        form: e.form,
        goals: e.goals_scored,
        assists: e.assists,
        cleanSheets: e.clean_sheets,
        cost: e.now_cost / 10,
        selectedByPercent: `${e.selected_by_percent}%`,
        news: e.news || undefined,
        chanceOfPlaying: e.chance_of_playing_next_round ?? null,
        status: e.status,
        isStar
      };
      playersMap.set(e.id, playerObj);
      return playerObj;
    });

    // Compute Standings Table (up to current GW)
    const computeTable = (upToGw: number) => {
      const teamRecords: Record<number, {
        team: Team;
        played: number;
        won: number;
        drawn: number;
        lost: number;
        gf: number;
        ga: number;
        gd: number;
        points: number;
        form: ('W' | 'D' | 'L')[];
      }> = {};

      allTeams.forEach(t => {
        teamRecords[t.id] = {
          team: t,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          points: 0,
          form: []
        };
      });

      const finishedFixtures = fixtures.filter(f => f.finished && f.event <= upToGw);
      // Sort chronologically for correct form
      finishedFixtures.sort((a, b) => new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime());

      finishedFixtures.forEach(f => {
        const h = teamRecords[f.team_h];
        const a = teamRecords[f.team_a];
        if (!h || !a || f.team_h_score === null || f.team_a_score === null) return;

        h.played += 1;
        a.played += 1;
        h.gf += f.team_h_score;
        h.ga += f.team_a_score;
        a.gf += f.team_a_score;
        a.ga += f.team_h_score;

        if (f.team_h_score > f.team_a_score) {
          h.won += 1;
          h.points += 3;
          h.form.push('W');
          a.lost += 1;
          a.form.push('L');
        } else if (f.team_h_score < f.team_a_score) {
          a.won += 1;
          a.points += 3;
          a.form.push('W');
          h.lost += 1;
          h.form.push('L');
        } else {
          h.drawn += 1;
          h.points += 1;
          h.form.push('D');
          a.drawn += 1;
          a.points += 1;
          a.form.push('D');
        }
      });

      return Object.values(teamRecords).map(r => ({
        ...r,
        gd: r.gf - r.ga,
        form: r.form.slice(-5)
      })).sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);
    };

    const currentStandings = computeTable(currentGw);
    const prevStandings = computeTable(Math.max(1, currentGw - 1));

    const prevRankMap = new Map<number, number>();
    prevStandings.forEach((item, index) => {
      prevRankMap.set(item.team.id, index + 1);
    });

    const table: LeagueTableEntry[] = currentStandings.map((item, index) => {
      const rank = index + 1;
      const previousRank = prevRankMap.get(item.team.id) || rank;
      const change = previousRank - rank; // positive means moved up
      return {
        rank,
        previousRank,
        change,
        team: item.team,
        played: item.played,
        won: item.won,
        drawn: item.drawn,
        lost: item.lost,
        gf: item.gf,
        ga: item.ga,
        gd: item.gd,
        points: item.points,
        form: item.form
      };
    });

    // Recent Matches (current gameweek)
    const extractScorers = (statArray: FplFixtureStatItem[] | undefined): MatchScorer[] => {
      if (!statArray) return [];
      const map = new Map<string, number>();
      statArray.forEach(item => {
        const player = playersMap.get(item.element);
        const name = player ? player.webName : `Player ${item.element}`;
        map.set(name, (map.get(name) || 0) + item.value);
      });
      return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    };

    const recentMatches: MatchResult[] = fixtures
      .filter(f => f.event === currentGw && f.finished)
      .map(f => {
        const homeTeam = teamsMap.get(f.team_h)!;
        const awayTeam = teamsMap.get(f.team_a)!;
        
        const goalsStat = f.stats?.find(s => s.identifier === 'goals_scored');
        const assistsStat = f.stats?.find(s => s.identifier === 'assists');
        const bonusStat = f.stats?.find(s => s.identifier === 'bonus');

        const homeScorers = extractScorers(goalsStat?.h);
        const awayScorers = extractScorers(goalsStat?.a);
        const homeAssists = extractScorers(assistsStat?.h);
        const awayAssists = extractScorers(assistsStat?.a);

        // Find MVP from bonus or bps
        let mvp: MatchResult['mvp'] = undefined;
        if (bonusStat && (bonusStat.h.length > 0 || bonusStat.a.length > 0)) {
          const allBonus = [...bonusStat.h, ...bonusStat.a].sort((x, y) => y.value - x.value);
          if (allBonus.length > 0) {
            const mvpPlayer = playersMap.get(allBonus[0].element);
            if (mvpPlayer) {
              const live = liveStatsMap.get(mvpPlayer.id);
              mvp = {
                name: mvpPlayer.webName,
                points: live ? live.total_points : 3,
                team: mvpPlayer.teamShortName
              };
            }
          }
        }

        return {
          id: f.id,
          event: f.event,
          kickoffTime: f.kickoff_time,
          finished: f.finished,
          homeTeam,
          awayTeam,
          homeScore: f.team_h_score,
          awayScore: f.team_a_score,
          homeScorers,
          awayScorers,
          homeAssists,
          awayAssists,
          mvp
        };
      });

    // Upcoming Matches (next gameweek)
    const upcomingMatches: MatchResult[] = fixtures
      .filter(f => f.event === currentGw + 1 && !f.finished)
      .slice(0, 8)
      .map(f => ({
        id: f.id,
        event: f.event,
        kickoffTime: f.kickoff_time,
        finished: false,
        homeTeam: teamsMap.get(f.team_h)!,
        awayTeam: teamsMap.get(f.team_a)!,
        homeScore: null,
        awayScore: null,
        homeScorers: [],
        awayScorers: [],
        homeAssists: [],
        awayAssists: []
      }));

    // Impressive Player Performances
    const topPerformers: PlayerPerformance[] = [];
    if (liveElements.length > 0) {
      const sortedByPoints = [...liveElements]
        .filter(el => el.stats.total_points >= 8 || el.stats.goals_scored >= 1 || el.stats.assists >= 2)
        .sort((a, b) => b.stats.total_points - a.stats.total_points || b.stats.bps - a.stats.bps)
        .slice(0, 10);

      sortedByPoints.forEach(el => {
        const player = playersMap.get(el.id);
        if (!player) return;

        const tags: string[] = [];
        if (el.stats.goals_scored >= 3) tags.push('Hat-Trick 🎩⚽');
        else if (el.stats.goals_scored === 2) tags.push('Brace ⚽⚽');
        else if (el.stats.goals_scored === 1) tags.push('Goal ⚽');

        if (el.stats.assists >= 2) tags.push(`${el.stats.assists} Assists 🎯`);
        else if (el.stats.assists === 1) tags.push('Assist 🎯');

        if (el.stats.clean_sheets > 0 && (player.position === 'DEF' || player.position === 'GKP')) {
          tags.push('Clean Sheet 🛡️');
        }

        if (el.stats.saves >= 4) {
          tags.push(`${el.stats.saves} Saves 🧤`);
        }

        if (el.stats.bonus === 3) tags.push('3 Bonus Pts ⭐');

        // Find match fixture summary
        const teamFixture = recentMatches.find(m => 
          m.homeTeam.id === player.teamId || m.awayTeam.id === player.teamId
        );
        const fixtureSummary = teamFixture 
          ? `${teamFixture.homeTeam.shortName} ${teamFixture.homeScore} - ${teamFixture.awayScore} ${teamFixture.awayTeam.shortName}`
          : `${player.teamShortName} Fixture`;

        topPerformers.push({
          playerId: player.id,
          playerName: player.webName,
          playerFullName: `${player.firstName} ${player.secondName}`,
          teamShortName: player.teamShortName,
          teamName: player.teamName,
          position: player.position,
          fixtureSummary,
          points: el.stats.total_points,
          goals: el.stats.goals_scored,
          assists: el.stats.assists,
          cleanSheet: el.stats.clean_sheets > 0,
          saves: el.stats.saves,
          bonus: el.stats.bonus,
          bps: el.stats.bps,
          highlightTags: tags.length > 0 ? tags : ['Top Form 🌟']
        });
      });
    }

    // Player News & Injuries
    const injuryNews: PlayerNewsItem[] = allPlayers
      .filter(p => p.news && p.news.trim().length > 0)
      .map(p => {
        let statusType: PlayerNewsItem['status'] = 'injured';
        let severity: PlayerNewsItem['severity'] = 'high';

        const chance = (p.chanceOfPlaying !== null && p.chanceOfPlaying !== undefined) ? p.chanceOfPlaying : null;
        if (p.status === 's') {
          statusType = 'suspended';
          severity = 'high';
        } else if (p.status === 'd') {
          statusType = 'doubtful';
          severity = (chance !== null && chance >= 75) ? 'medium' : 'high';
        } else if (p.status === 'u') {
          statusType = 'unavailable';
          severity = 'low';
        }

        return {
          playerId: p.id,
          playerName: p.webName,
          teamShortName: p.teamShortName,
          teamName: p.teamName,
          position: p.position,
          news: p.news!,
          chanceOfPlaying: chance,
          status: statusType,
          isStarPlayer: !!p.isStar,
          severity
        };
      })
      .sort((a, b) => {
        // Star players first, then high severity
        if (a.isStarPlayer && !b.isStarPlayer) return -1;
        if (!a.isStarPlayer && b.isStarPlayer) return 1;
        const sevOrder = { high: 0, medium: 1, low: 2 };
        return sevOrder[a.severity] - sevOrder[b.severity];
      })
      .slice(0, 25);

    const result: RundownData = {
      currentGameweek: currentGw,
      season: '2026/27',
      lastUpdated: new Date().toISOString(),
      table,
      recentMatches,
      upcomingMatches,
      topPerformers: topPerformers.length > 0 ? topPerformers : FALLBACK_RUNDOWN_DATA.topPerformers,
      injuryNews: injuryNews.length > 0 ? injuryNews : FALLBACK_RUNDOWN_DATA.injuryNews,
      allTeams,
      allPlayers
    };

    cachedRundown = { data: result, timestamp: performance.now() };
    return result;
  } catch (error) {
    console.error('Error fetching live Premier League data:', error);
    return FALLBACK_RUNDOWN_DATA;
  }
}
