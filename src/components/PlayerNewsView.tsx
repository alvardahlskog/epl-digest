'use client';

import React, { useState } from 'react';
import { PlayerNewsItem, FavoritesState } from '@/types';
import { ShieldAlert, Star, Search, AlertCircle, Heart, XCircle, Clock } from 'lucide-react';

interface PlayerNewsViewProps {
  newsItems: PlayerNewsItem[];
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
}

export function PlayerNewsView({
  newsItems,
  favorites,
  onOpenFavorites,
  myFeedOnly,
}: PlayerNewsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyStars, setOnlyStars] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'medium'>('all');

  const filteredNews = newsItems.filter(item => {
    // Search
    const matchesSearch =
      item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.news.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    // Star filter
    if (onlyStars && !item.isStarPlayer) return false;

    // Severity filter
    if (severityFilter !== 'all' && item.severity !== severityFilter) return false;

    // My feed only
    if (myFeedOnly) {
      const isFavPlayer = favorites.playerIds.includes(item.playerId);
      // Also match if user's favorite team is this player's team
      const isFavTeam = favorites.teamIds.length > 0 && false; // playerIds prioritised
      if (favorites.playerIds.length > 0 && !isFavPlayer) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Player News & Injury Intel
          </h2>
          <p className="text-xs text-neutral-400">
            Medical updates, fitness doubts, suspension notices, and availability percentage
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search injured players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 w-44 sm:w-56"
            />
          </div>

          {/* Star Filter */}
          <button
            onClick={() => setOnlyStars(!onlyStars)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              onlyStars
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Star Talismans</span>
          </button>

          {/* Severity selector */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as 'all' | 'high' | 'medium')}
            className="bg-neutral-950 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600"
          >
            <option value="all">All Severities</option>
            <option value="high">Ruled Out / Suspended</option>
            <option value="medium">Doubtful (25%-75%)</option>
          </select>
        </div>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <div className="bg-neutral-900/40 border border-dashed border-neutral-800 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">No injury alerts matching criteria</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            No news items found for current filters. Try relaxing search query or viewing all players.
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
          {filteredNews.map((item) => {
            const isFavPlayer = favorites.playerIds.includes(item.playerId);

            let statusBg = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
            let statusIcon = XCircle;
            let statusLabel = 'Ruled Out';

            if (item.status === 'suspended') {
              statusBg = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
              statusIcon = ShieldAlert;
              statusLabel = 'Suspended';
            } else if (item.status === 'doubtful') {
              statusBg = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
              statusIcon = Clock;
              statusLabel = item.chanceOfPlaying !== null ? `${item.chanceOfPlaying}% Doubt` : 'Doubtful';
            } else if (item.status === 'unavailable') {
              statusBg = 'bg-neutral-700/30 text-neutral-400 border-neutral-700';
              statusIcon = AlertCircle;
              statusLabel = 'Unavailable';
            }

            const StatusIconComponent = statusIcon;

            return (
              <div
                key={item.playerId}
                className={`relative flex flex-col justify-between overflow-hidden rounded-2xl bg-neutral-900/80 border p-5 transition-all ${
                  isFavPlayer
                    ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-neutral-800 text-neutral-300">
                        {item.position}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">
                        {item.teamName} ({item.teamShortName})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.isStarPlayer && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          Star Player
                        </span>
                      )}

                      {isFavPlayer && (
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      )}
                    </div>
                  </div>

                  {/* Player Name & Status Tag */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-lg font-black text-white tracking-tight">
                      {item.playerName}
                    </h3>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusBg}`}>
                      <StatusIconComponent className="w-3.5 h-3.5" />
                      {statusLabel}
                    </span>
                  </div>

                  {/* News Description */}
                  <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-3 mb-4">
                    {item.news}
                  </p>
                </div>

                {/* Chance of Playing Progress Bar */}
                {item.chanceOfPlaying !== null && (
                  <div className="space-y-1.5 pt-2 border-t border-neutral-800/60">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 font-medium">
                      <span>Playing Probability:</span>
                      <span className={item.chanceOfPlaying >= 75 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                        {item.chanceOfPlaying}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.chanceOfPlaying >= 75
                            ? 'bg-amber-400'
                            : item.chanceOfPlaying >= 25
                            ? 'bg-orange-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${item.chanceOfPlaying}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
