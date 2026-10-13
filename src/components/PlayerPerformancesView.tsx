'use client';

import React, { useState } from 'react';
import { PlayerPerformance, FavoritesState } from '@/types';
import { Flame, Star, Award, Heart, Sparkles } from 'lucide-react';

interface PlayerPerformancesViewProps {
  performances: PlayerPerformance[];
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
}

export function PlayerPerformancesView({
  performances,
  favorites,
  onOpenFavorites,
  myFeedOnly,
}: PlayerPerformancesViewProps) {
  const [selectedPos, setSelectedPos] = useState<string>('ALL');

  const filtered = performances.filter(p => {
    if (selectedPos !== 'ALL' && p.position !== selectedPos) return false;
    if (!myFeedOnly) return true;
    if (favorites.playerIds.length === 0) return true;
    return favorites.playerIds.includes(p.playerId);
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400" />
            Standout Match Performances
          </h2>
          <p className="text-xs text-neutral-400">
            Gameweek MVPs, multi-goal heroes, creative playmakers, and defensive stalwarts
          </p>
        </div>

        {/* Position Filter Chips */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto text-xs">
          {['ALL', 'FWD', 'MID', 'DEF', 'GKP'].map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedPos === pos
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-8 text-center space-y-3">
          <Heart className="w-8 h-8 text-rose-400/50 mx-auto" />
          <h3 className="text-base font-semibold text-white">No standout performances found for current filter</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            None of your tracked players had standout metrics recorded this gameweek or match the position filter.
          </p>
          <button
            onClick={onOpenFavorites}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl text-xs font-semibold transition"
          >
            Manage Tracked Players
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((perf, index) => {
            const isFavoritePlayer = favorites.playerIds.includes(perf.playerId);
            const isFavoriteTeam = favorites.teamIds.length > 0; // check if team is tracked
            const isGameweekTop = index === 0;

            return (
              <div
                key={perf.playerId}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/80 border p-5 transition-all ${
                  isFavoritePlayer
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : isGameweekTop
                    ? 'border-orange-500/40 bg-gradient-to-b from-neutral-900 via-neutral-900/90 to-neutral-950 shadow-md'
                    : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Top Badge Indicators */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {perf.position}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {perf.teamName} ({perf.teamShortName})
                    </span>
                  </div>

                  {isFavoritePlayer && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      Favorite
                    </div>
                  )}

                  {!isFavoritePlayer && isGameweekTop && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      GW Leader
                    </div>
                  )}
                </div>

                {/* Player Identity & Score */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                      {perf.playerName}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      {perf.fixtureSummary}
                    </p>
                  </div>

                  {/* Gameweek Points Bubble */}
                  <div className="flex flex-col items-center justify-center px-3 py-1.5 bg-gradient-to-b from-emerald-500/20 to-emerald-500/10 border border-emerald-500/30 rounded-xl shrink-0">
                    <span className="text-xl font-black text-emerald-400 leading-none">
                      {perf.points}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-300/80 mt-0.5">
                      Points
                    </span>
                  </div>
                </div>

                {/* Performance Stat Metrics Grid */}
                <div className="grid grid-cols-4 gap-2 bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-2.5 mb-3 text-center">
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">Goals</div>
                    <div className="text-sm font-bold text-white mt-0.5">{perf.goals}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">Assists</div>
                    <div className="text-sm font-bold text-white mt-0.5">{perf.assists}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                      {perf.position === 'GKP' ? 'Saves' : 'Clean Sh.'}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {perf.position === 'GKP' ? perf.saves : (perf.cleanSheet ? 'Yes' : 'No')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">Bonus</div>
                    <div className="text-sm font-bold text-amber-400 mt-0.5">
                      {perf.bonus > 0 ? `+${perf.bonus}` : '0'}
                    </div>
                  </div>
                </div>

                {/* Highlight Tag Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {perf.highlightTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
