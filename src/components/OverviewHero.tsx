'use client';

import React from 'react';
import { RundownData, FavoritesState } from '@/types';
import { TrendingUp, Flame, ShieldAlert, Award, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewHeroProps {
  data: RundownData;
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
}

export function OverviewHero({
  data,
  favorites,
  onOpenFavorites,
  myFeedOnly,
}: OverviewHeroProps) {
  const leader = data.table[0];
  
  // Find biggest mover up
  const biggestMoverUp = [...data.table]
    .filter(t => t.change > 0)
    .sort((a, b) => b.change - a.change)[0];

  // Find biggest mover down
  const biggestMoverDown = [...data.table]
    .filter(t => t.change < 0)
    .sort((a, b) => a.change - b.change)[0];

  // Top performer of GW
  const topPerformer = data.topPerformers[0];

  // Star injury count
  const starInjuriesCount = data.injuryNews.filter(n => n.isStarPlayer).length;

  // Selected favorites
  const favoriteTeams = data.allTeams.filter(t => favorites.teamIds.includes(t.id));
  const favoritePlayers = data.allPlayers.filter(p => favorites.playerIds.includes(p.id));

  return (
    <div className="space-y-4">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-800 p-6 shadow-xl">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Gameweek {data.currentGameweek} Rundown
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Premier League Matchday Digest
            </h1>

            <p className="text-sm text-neutral-400 leading-relaxed">
              {myFeedOnly ? (
                <span className="text-amber-400 font-medium">
                  Showing your personalized feed for {favoriteTeams.length} favorite club{favoriteTeams.length !== 1 ? 's' : ''} and {favoritePlayers.length} tracked player{favoritePlayers.length !== 1 ? 's' : ''}.
                </span>
              ) : (
                <span>
                  Comprehensive analysis covering recent results, player ratings, standing shifts, and injury intel across all 20 clubs.
                </span>
              )}
            </p>
          </div>

          {/* Quick Favorite Clubs Bar */}
          <div className="flex flex-col gap-2 shrink-0 bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400 font-medium flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Tracked Clubs
              </span>
              <button
                onClick={onOpenFavorites}
                className="text-amber-400 hover:underline text-[11px]"
              >
                {favoriteTeams.length > 0 ? 'Edit' : '+ Add Clubs'}
              </button>
            </div>

            {favoriteTeams.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {favoriteTeams.map(team => (
                  <span
                    key={team.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm border border-white/10"
                    style={{ backgroundColor: team.primaryColor }}
                  >
                    {team.shortName}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic mt-1">
                No clubs selected yet. Click to pick your favorites!
              </p>
            )}
          </div>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          {/* Tile 1: League Leader */}
          <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                Table Leader
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">1st</span>
            </div>
            <div className="text-base font-bold text-white truncate">
              {leader ? leader.team.name : 'Manchester City'}
            </div>
            <div className="text-[11px] text-neutral-400">
              {leader ? `${leader.points} pts • ${leader.played} played` : ''}
            </div>
          </div>

          {/* Tile 2: Table Movers */}
          <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Table Shift
              </span>
              {biggestMoverUp && (
                <span className="flex items-center text-xs font-bold text-emerald-400">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  +{biggestMoverUp.change}
                </span>
              )}
            </div>
            <div className="text-base font-bold text-white truncate">
              {biggestMoverUp ? `${biggestMoverUp.team.name}` : 'No changes'}
            </div>
            <div className="text-[11px] text-neutral-400">
              {biggestMoverDown 
                ? `Biggest drop: ${biggestMoverDown.team.name} (${biggestMoverDown.change})`
                : 'Steady table'}
            </div>
          </div>

          {/* Tile 3: Top Performer */}
          <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Gameweek MVP
              </span>
              {topPerformer && (
                <span className="text-xs font-bold text-orange-400">
                  {topPerformer.points} pts
                </span>
              )}
            </div>
            <div className="text-base font-bold text-white truncate">
              {topPerformer ? `${topPerformer.playerName} (${topPerformer.teamShortName})` : 'N/A'}
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              {topPerformer ? topPerformer.highlightTags.join(' • ') : ''}
            </div>
          </div>

          {/* Tile 4: Injury Intel */}
          <div className="bg-neutral-950/50 border border-neutral-800/60 rounded-xl p-3.5 space-y-1">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                Star News & Doubts
              </span>
              <span className="text-xs font-bold text-rose-400">
                {starInjuriesCount} Alerts
              </span>
            </div>
            <div className="text-base font-bold text-white truncate">
              Medical Bulletins
            </div>
            <div className="text-[11px] text-neutral-400">
              Key players sidelined or doubtful
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
