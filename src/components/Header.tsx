'use client';

import React from 'react';
import { Star, RefreshCw, Filter, Sparkles, Trophy } from 'lucide-react';
import { FavoritesState } from '@/types';

interface HeaderProps {
  currentGameweek: number;
  season: string;
  favorites: FavoritesState;
  onOpenFavorites: () => void;
  myFeedOnly: boolean;
  onToggleMyFeed: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeTab: 'all' | 'matches' | 'performers' | 'table' | 'news';
  onChangeTab: (tab: 'all' | 'matches' | 'performers' | 'table' | 'news') => void;
}

export function Header({
  currentGameweek,
  season,
  favorites,
  onOpenFavorites,
  myFeedOnly,
  onToggleMyFeed,
  onRefresh,
  isRefreshing,
  activeTab,
  onChangeTab,
}: HeaderProps) {
  const totalFavoritesCount = favorites.teamIds.length + favorites.playerIds.length;

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-emerald-400 p-0.5 shadow-lg shadow-purple-500/10">
              <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-white">EPL Digest</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  GW {currentGameweek}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Premier League Rundown & Player Intel • {season}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* My Feed Only Toggle */}
            <button
              onClick={onToggleMyFeed}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                myFeedOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
              }`}
              title="Filter rundown to show only your favorite teams and players"
            >
              <Filter className={`w-3.5 h-3.5 ${myFeedOnly ? 'text-amber-400' : ''}`} />
              <span className="hidden sm:inline">My Feed Only</span>
              <span className="sm:hidden">My Feed</span>
              {myFeedOnly && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </button>

            {/* Manage Favorites Button */}
            <button
              onClick={onOpenFavorites}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-white transition"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Favorites</span>
              {totalFavoritesCount > 0 ? (
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-400 text-neutral-950 font-bold">
                  {totalFavoritesCount}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-500 hidden md:inline">Setup</span>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition disabled:opacity-50"
              title="Refresh live match data and news"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-neutral-900 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'Full Rundown', icon: Sparkles },
            { id: 'matches', label: 'Match Results', icon: Trophy },
            { id: 'performers', label: 'Star Performers', icon: Star },
            { id: 'table', label: 'League Table & Movers', icon: Trophy },
            { id: 'news', label: 'Injuries & News', icon: Filter },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id as HeaderProps['activeTab'])}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                  isActive
                    ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-neutral-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
