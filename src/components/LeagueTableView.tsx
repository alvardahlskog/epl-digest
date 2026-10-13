'use client';

import React, { useState } from 'react';
import { LeagueTableEntry, FavoritesState } from '@/types';
import { Trophy, ArrowUp, ArrowDown, Minus, Star, TrendingUp } from 'lucide-react';

interface LeagueTableViewProps {
  table: LeagueTableEntry[];
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
}

export function LeagueTableView({
  table,
  favorites,
  onOpenFavorites,
  myFeedOnly,
}: LeagueTableViewProps) {
  const [showMoversOnly, setShowMoversOnly] = useState(false);

  const filteredTable = table.filter(entry => {
    if (showMoversOnly && entry.change === 0) return false;
    if (!myFeedOnly) return true;
    if (favorites.teamIds.length === 0) return true;
    return favorites.teamIds.includes(entry.team.id);
  });

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            League Table & Position Shifts
          </h2>
          <p className="text-xs text-neutral-400">
            Current standings, European qualification zones, relegation battle, and Gameweek table shifts
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowMoversOnly(!showMoversOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              showMoversOnly
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Table Movers Only ({table.filter(t => t.change !== 0).length})</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 shadow-xl">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 pl-4 pr-2 w-12 text-center">Pos</th>
              <th className="py-3.5 px-2 w-16 text-center">Shift</th>
              <th className="py-3.5 px-3">Club</th>
              <th className="py-3.5 px-2.5 text-center">Pl</th>
              <th className="py-3.5 px-2 text-center hidden sm:table-cell">W</th>
              <th className="py-3.5 px-2 text-center hidden sm:table-cell">D</th>
              <th className="py-3.5 px-2 text-center hidden sm:table-cell">L</th>
              <th className="py-3.5 px-2 text-center hidden md:table-cell">GF</th>
              <th className="py-3.5 px-2 text-center hidden md:table-cell">GA</th>
              <th className="py-3.5 px-2.5 text-center">GD</th>
              <th className="py-3.5 px-3 text-center font-bold text-white">Pts</th>
              <th className="py-3.5 pl-2 pr-4 text-center hidden lg:table-cell">Last 5 Form</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/60">
            {filteredTable.map((row) => {
              const isFavorite = favorites.teamIds.includes(row.team.id);

              // Qualification zone styles
              let zoneBorderColor = 'border-l-transparent';
              if (row.rank <= 4) zoneBorderColor = 'border-l-blue-500'; // Champions League
              else if (row.rank === 5) zoneBorderColor = 'border-l-orange-500'; // Europa League
              else if (row.rank === 6) zoneBorderColor = 'border-l-emerald-500'; // Conference League
              else if (row.rank >= 18) zoneBorderColor = 'border-l-rose-500'; // Relegation

              return (
                <tr
                  key={row.team.id}
                  className={`border-l-4 transition-colors ${zoneBorderColor} ${
                    isFavorite
                      ? 'bg-amber-500/10 hover:bg-amber-500/15 ring-1 ring-amber-500/30'
                      : 'hover:bg-neutral-800/40'
                  }`}
                >
                  {/* Position */}
                  <td className="py-3 pl-4 pr-2 text-center font-bold text-neutral-300">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                        row.rank === 1
                          ? 'bg-amber-400 text-neutral-950 font-black shadow-sm'
                          : row.rank <= 4
                          ? 'bg-blue-500/20 text-blue-300'
                          : row.rank >= 18
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'text-neutral-400'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>

                  {/* Movers Change indicator */}
                  <td className="py-3 px-2 text-center">
                    {row.change > 0 ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold text-[10px]">
                        <ArrowUp className="w-3 h-3 stroke-[2.5]" />
                        +{row.change}
                      </span>
                    ) : row.change < 0 ? (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 font-bold text-[10px]">
                        <ArrowDown className="w-3 h-3 stroke-[2.5]" />
                        {row.change}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-neutral-600 text-[11px]">
                        <Minus className="w-3 h-3" />
                      </span>
                    )}
                  </td>

                  {/* Club Details */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] text-white shadow-sm shrink-0 border border-white/10"
                        style={{ backgroundColor: row.team.primaryColor }}
                      >
                        {row.team.shortName}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`font-semibold ${isFavorite ? 'text-amber-300 font-bold' : 'text-white'}`}>
                          {row.team.name}
                        </span>
                        {isFavorite && (
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Match record */}
                  <td className="py-3 px-2.5 text-center font-medium text-neutral-300">{row.played}</td>
                  <td className="py-3 px-2 text-center text-neutral-400 hidden sm:table-cell">{row.won}</td>
                  <td className="py-3 px-2 text-center text-neutral-400 hidden sm:table-cell">{row.drawn}</td>
                  <td className="py-3 px-2 text-center text-neutral-400 hidden sm:table-cell">{row.lost}</td>
                  <td className="py-3 px-2 text-center text-neutral-400 hidden md:table-cell">{row.gf}</td>
                  <td className="py-3 px-2 text-center text-neutral-400 hidden md:table-cell">{row.ga}</td>
                  
                  {/* Goal Difference */}
                  <td className="py-3 px-2.5 text-center font-medium">
                    <span className={row.gd > 0 ? 'text-emerald-400' : row.gd < 0 ? 'text-rose-400' : 'text-neutral-400'}>
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </span>
                  </td>

                  {/* Points */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-black text-sm text-white px-2 py-0.5 rounded bg-neutral-950/70 border border-neutral-800">
                      {row.points}
                    </span>
                  </td>

                  {/* Form */}
                  <td className="py-3 pl-2 pr-4 text-center hidden lg:table-cell">
                    <div className="flex items-center justify-center gap-1">
                      {row.form.map((res, i) => (
                        <span
                          key={i}
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black ${
                            res === 'W'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : res === 'D'
                              ? 'bg-neutral-700/50 text-neutral-300 border border-neutral-700'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {res}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Legend */}
        <div className="px-4 py-3 bg-neutral-950/80 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
              Champions League (1-4)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
              Europa League (5)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
              Conference League (6)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
              Relegation Zone (18-20)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Highlighted = Tracked Clubs</span>
          </div>
        </div>
      </div>
    </div>
  );
}
