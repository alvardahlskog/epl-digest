'use client';

import React, { useState } from 'react';
import { MatchResult, FavoritesState } from '@/types';
import { Trophy, Calendar, Star, Clock, Sparkles } from 'lucide-react';

interface MatchResultsViewProps {
  recentMatches: MatchResult[];
  upcomingMatches: MatchResult[];
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
}

export function MatchResultsView({
  recentMatches,
  upcomingMatches,
  favorites,
  onOpenFavorites,
  myFeedOnly,
}: MatchResultsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'recent' | 'upcoming'>('recent');

  const matchesToFilter = activeSubTab === 'recent' ? recentMatches : upcomingMatches;

  const filteredMatches = matchesToFilter.filter(match => {
    if (!myFeedOnly) return true;
    if (favorites.teamIds.length === 0) return true;
    return favorites.teamIds.includes(match.homeTeam.id) || favorites.teamIds.includes(match.awayTeam.id);
  });

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-emerald-400" />
            Match Results & Fixtures
          </h2>
          <p className="text-xs text-neutral-400">
            Official scores, matchday highlights, scorers, and key contributors
          </p>
        </div>

        {/* Sub-tab: Recent Results vs Upcoming Fixtures */}
        <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('recent')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'recent'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Completed Results ({recentMatches.length})
          </button>
          <button
            onClick={() => setActiveSubTab('upcoming')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'upcoming'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Upcoming Next GW ({upcomingMatches.length})
          </button>
        </div>
      </div>

      {/* Match Cards Grid */}
      {filteredMatches.length === 0 ? (
        <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-8 text-center space-y-3">
          <Star className="w-8 h-8 text-amber-400/50 mx-auto" />
          <h3 className="text-base font-semibold text-white">No matches for current filter</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            None of your favorite teams have matches under the current filter. Try adding more clubs or turning off "My Feed Only".
          </p>
          <button
            onClick={onOpenFavorites}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-300 rounded-xl text-xs font-semibold transition"
          >
            Configure Favorite Clubs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map(match => {
            const isHomeFavorite = favorites.teamIds.includes(match.homeTeam.id);
            const isAwayFavorite = favorites.teamIds.includes(match.awayTeam.id);
            const hasFavorite = isHomeFavorite || isAwayFavorite;

            return (
              <div
                key={match.id}
                className={`relative overflow-hidden rounded-2xl bg-neutral-900/80 border transition-all ${
                  hasFavorite
                    ? 'border-amber-500/40 shadow-lg shadow-amber-500/5 bg-gradient-to-b from-neutral-900 to-neutral-950'
                    : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Favorite badge ribbon */}
                {hasFavorite && (
                  <div className="absolute top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    Tracked Club
                  </div>
                )}

                {/* Match Header */}
                <div className="px-5 py-3 border-b border-neutral-800/60 bg-neutral-950/40 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    {formatDate(match.kickoffTime)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-800 text-neutral-300">
                    {match.finished ? 'Full Time' : `GW ${match.event}`}
                  </span>
                </div>

                {/* Teams & Scoreboard */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-2 min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/10 shrink-0"
                          style={{ backgroundColor: match.homeTeam.primaryColor }}
                        >
                          {match.homeTeam.shortName}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate flex items-center gap-1">
                            {match.homeTeam.name}
                            {isHomeFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          </div>
                          <div className="text-[11px] text-neutral-400">{match.homeTeam.shortName}</div>
                        </div>
                      </div>
                    </div>

                    {/* Score or VS */}
                    <div className="shrink-0 flex flex-col items-center justify-center px-4 py-2 bg-neutral-950/80 rounded-xl border border-neutral-800 min-w-[72px]">
                      {match.finished ? (
                        <div className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
                          <span>{match.homeScore}</span>
                          <span className="text-neutral-500 font-light">-</span>
                          <span>{match.awayScore}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-neutral-400 tracking-widest">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center sm:items-end text-center sm:text-right gap-2 min-w-0">
                      <div className="flex items-center justify-end gap-2">
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white truncate flex items-center justify-end gap-1">
                            {isAwayFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                            {match.awayTeam.name}
                          </div>
                          <div className="text-[11px] text-neutral-400">{match.awayTeam.shortName}</div>
                        </div>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white shadow-md border border-white/10 shrink-0"
                          style={{ backgroundColor: match.awayTeam.primaryColor }}
                        >
                          {match.awayTeam.shortName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Scorers & Assists Breakdown */}
                  {match.finished && (
                    <div className="mt-4 pt-4 border-t border-neutral-800/60 grid grid-cols-2 gap-4 text-xs">
                      {/* Home events */}
                      <div className="space-y-1">
                        {match.homeScorers.length > 0 ? (
                          match.homeScorers.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-neutral-300 font-medium truncate">
                              <span>⚽</span>
                              <span className="truncate">{s.name} {s.count > 1 ? `(x${s.count})` : ''}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] text-neutral-500 italic">No goals</span>
                        )}

                        {match.homeAssists.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-neutral-400 text-[11px] truncate">
                            <span>🎯</span>
                            <span className="truncate">{a.name}</span>
                          </div>
                        ))}
                      </div>

                      {/* Away events */}
                      <div className="space-y-1 text-right">
                        {match.awayScorers.length > 0 ? (
                          match.awayScorers.map((s, idx) => (
                            <div key={idx} className="flex items-center justify-end gap-1.5 text-neutral-300 font-medium truncate">
                              <span className="truncate">{s.name} {s.count > 1 ? `(x${s.count})` : ''}</span>
                              <span>⚽</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] text-neutral-500 italic">No goals</span>
                        )}

                        {match.awayAssists.map((a, idx) => (
                          <div key={idx} className="flex items-center justify-end gap-1.5 text-neutral-400 text-[11px] truncate">
                            <span className="truncate">{a.name}</span>
                            <span>🎯</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Match MVP Badge */}
                  {match.mvp && (
                    <div className="mt-3 pt-3 border-t border-neutral-800/40 flex items-center justify-between text-[11px] bg-neutral-950/40 -mx-5 -mb-5 px-5 py-2.5">
                      <span className="flex items-center gap-1.5 text-neutral-400 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Match MVP: <span className="text-white font-bold">{match.mvp.name} ({match.mvp.team})</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                        {match.mvp.points} Pts
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
