export interface Team {
  id: number;
  name: string;
  shortName: string;
  code: number;
  primaryColor: string;
  secondaryColor: string;
}

export interface Player {
  id: number;
  webName: string;
  firstName: string;
  secondName: string;
  teamId: number;
  teamName: string;
  teamShortName: string;
  position: 'GKP' | 'DEF' | 'MID' | 'FWD';
  totalPoints: number;
  form: string;
  goals: number;
  assists: number;
  cleanSheets: number;
  cost: number;
  selectedByPercent: string;
  news?: string;
  chanceOfPlaying?: number | null;
  status?: string;
  isStar?: boolean;
}

export interface MatchScorer {
  name: string;
  count: number;
}

export interface MatchResult {
  id: number;
  event: number;
  kickoffTime: string;
  finished: boolean;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  homeScorers: MatchScorer[];
  awayScorers: MatchScorer[];
  homeAssists: MatchScorer[];
  awayAssists: MatchScorer[];
  mvp?: {
    name: string;
    points: number;
    team: string;
  };
}

export interface PlayerPerformance {
  playerId: number;
  playerName: string;
  playerFullName: string;
  teamShortName: string;
  teamName: string;
  position: string;
  fixtureSummary: string;
  points: number;
  goals: number;
  assists: number;
  cleanSheet: boolean;
  saves: number;
  bonus: number;
  bps: number;
  highlightTags: string[];
}

export interface LeagueTableEntry {
  rank: number;
  previousRank: number;
  change: number; // >0 is moved up, <0 is moved down, 0 is unchanged
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
}

export interface PlayerNewsItem {
  playerId: number;
  playerName: string;
  teamShortName: string;
  teamName: string;
  position: string;
  news: string;
  chanceOfPlaying: number | null;
  status: 'injured' | 'doubtful' | 'suspended' | 'unavailable';
  isStarPlayer: boolean;
  severity: 'high' | 'medium' | 'low';
}

export interface FavoritesState {
  teamIds: number[];
  playerIds: number[];
}

export interface RundownData {
  currentGameweek: number;
  season: string;
  lastUpdated: string;
  table: LeagueTableEntry[];
  recentMatches: MatchResult[];
  upcomingMatches: MatchResult[];
  topPerformers: PlayerPerformance[];
  injuryNews: PlayerNewsItem[];
  allTeams: Team[];
  allPlayers: Player[];
}
