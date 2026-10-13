'use client';

import React, { useState, useEffect } from 'react';
import { RundownData, FavoritesState } from '@/types';
import { Header } from '@/components/Header';
import { OverviewHero } from '@/components/OverviewHero';
import { MatchResultsView } from '@/components/MatchResultsView';
import { PlayerPerformancesView } from '@/components/PlayerPerformancesView';
import { LeagueTableView } from '@/components/LeagueTableView';
import { PlayerNewsView } from '@/components/PlayerNewsView';
import { FavoritesModal } from '@/components/FavoritesModal';

const FAVORITES_STORAGE_KEY = 'epl_digest_favorites_v1';

interface RundownDashboardProps {
  initialData: RundownData;
}

export function RundownDashboard({ initialData }: RundownDashboardProps) {
  const [data, setData] = useState<RundownData>(initialData);
  const [favorites, setFavorites] = useState<FavoritesState>({
    teamIds: [1, 15], // Default starter: Arsenal and Man City
    playerIds: [411, 101, 115], // Default starter: Haaland, Henderson, De Cuyper
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [myFeedOnly, setMyFeedOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'matches' | 'performers' | 'table' | 'news'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedText, setLastRefreshedText] = useState('Just now');

  // Load favorites from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.teamIds) && Array.isArray(parsed.playerIds)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored favorites', e);
    }
  }, []);

  const handleUpdateFavorites = (newFavorites: FavoritesState) => {
    setFavorites(newFavorites);
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage', e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/rundown');
      if (res.ok) {
        const updatedData = await res.json();
        setData(updatedData);
        setLastRefreshedText(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sticky Header Navigation */}
      <Header
        currentGameweek={data.currentGameweek}
        season={data.season}
        favorites={favorites}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        myFeedOnly={myFeedOnly}
        onToggleMyFeed={() => setMyFeedOnly(!myFeedOnly)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Overview Hero Summary Banner */}
        <OverviewHero
          data={data}
          favorites={favorites}
          onOpenFavorites={() => setIsFavoritesOpen(true)}
          myFeedOnly={myFeedOnly}
        />

        {/* View Switcher Container */}
        {activeTab === 'all' && (
          <div className="space-y-10">
            {/* 1. Impressive Player Performances */}
            <section>
              <PlayerPerformancesView
                performances={data.topPerformers}
                favorites={favorites}
                onOpenFavorites={() => setIsFavoritesOpen(true)}
                myFeedOnly={myFeedOnly}
              />
            </section>

            {/* 2. Match Results & Upcoming Fixtures */}
            <section>
              <MatchResultsView
                recentMatches={data.recentMatches}
                upcomingMatches={data.upcomingMatches}
                favorites={favorites}
                onOpenFavorites={() => setIsFavoritesOpen(true)}
                myFeedOnly={myFeedOnly}
              />
            </section>

            {/* 3. League Table & Position Movers */}
            <section>
              <LeagueTableView
                table={data.table}
                favorites={favorites}
                onOpenFavorites={() => setIsFavoritesOpen(true)}
                myFeedOnly={myFeedOnly}
              />
            </section>

            {/* 4. Player News & Injury Bulletins */}
            <section>
              <PlayerNewsView
                newsItems={data.injuryNews}
                favorites={favorites}
                onOpenFavorites={() => setIsFavoritesOpen(true)}
                myFeedOnly={myFeedOnly}
              />
            </section>
          </div>
        )}

        {activeTab === 'matches' && (
          <section>
            <MatchResultsView
              recentMatches={data.recentMatches}
              upcomingMatches={data.upcomingMatches}
              favorites={favorites}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
              myFeedOnly={myFeedOnly}
            />
          </section>
        )}

        {activeTab === 'performers' && (
          <section>
            <PlayerPerformancesView
              performances={data.topPerformers}
              favorites={favorites}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
              myFeedOnly={myFeedOnly}
            />
          </section>
        )}

        {activeTab === 'table' && (
          <section>
            <LeagueTableView
              table={data.table}
              favorites={favorites}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
              myFeedOnly={myFeedOnly}
            />
          </section>
        )}

        {activeTab === 'news' && (
          <section>
            <PlayerNewsView
              newsItems={data.injuryNews}
              favorites={favorites}
              onOpenFavorites={() => setIsFavoritesOpen(true)}
              myFeedOnly={myFeedOnly}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 py-8 px-4 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-neutral-300">EPL Digest</span> • Premier League matchday intelligence & news.
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Last synchronized: {lastRefreshedText}</span>
            <span>•</span>
            <span>Free Premier League & FPL Public Datasets</span>
          </div>
        </div>
      </footer>

      {/* Favorites Selector Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        allTeams={data.allTeams}
        allPlayers={data.allPlayers}
        favorites={favorites}
        onUpdateFavorites={handleUpdateFavorites}
      />
    </div>
  );
}
