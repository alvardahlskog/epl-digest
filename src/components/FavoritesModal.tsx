'use client';

import React, { useState } from 'react';
import { Team, Player, FavoritesState } from '@/types';
import { X, Search, Star, Heart, Check, Trash2, Sparkles, Shield } from 'lucide-react';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTeams: Team[];
  allPlayers: Player[];
  favorites: FavoritesState;
  onUpdateFavorites: (favorites: FavoritesState) => void;
}

export function FavoritesModal({
  isOpen,
  onClose,
  allTeams,
  allPlayers,
  favorites,
  onUpdateFavorites,
}: FavoritesModalProps) {
  const [activeTab, setActiveTab] = useState<'teams' | 'players'>('teams');
  const [playerSearch, setPlayerSearch] = useState('');
  const [teamSearch, setTeamSearch] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<number | 'all'>('all');
  const [onlyStarsFilter, setOnlyStarsFilter] = useState(false);

  if (!isOpen) return null;

  const toggleTeam = (teamId: number) => {
    const exists = favorites.teamIds.includes(teamId);
    const newTeamIds = exists
      ? favorites.teamIds.filter(id => id !== teamId)
      : [...favorites.teamIds, teamId];
    onUpdateFavorites({ ...favorites, teamIds: newTeamIds });
  };

  const togglePlayer = (playerId: number) => {
    const exists = favorites.playerIds.includes(playerId);
    const newPlayerIds = exists
      ? favorites.playerIds.filter(id => id !== playerId)
      : [...favorites.playerIds, playerId];
    onUpdateFavorites({ ...favorites, playerIds: newPlayerIds });
  };

  const selectBigSix = () => {
    // Man City, Arsenal, Liverpool, Chelsea, Man Utd, Spurs
    const bigSixShorts = ['MCI', 'ARS', 'LIV', 'CHE', 'MUN', 'TOT'];
    const bigSixIds = allTeams.filter(t => bigSixShorts.includes(t.shortName)).map(t => t.id);
    const combined = Array.from(new Set([...favorites.teamIds, ...bigSixIds]));
    onUpdateFavorites({ ...favorites, teamIds: combined });
  };

  const selectTopStars = () => {
    const starIds = allPlayers.filter(p => p.isStar).slice(0, 8).map(p => p.id);
    const combined = Array.from(new Set([...favorites.playerIds, ...starIds]));
    onUpdateFavorites({ ...favorites, playerIds: combined });
  };

  const clearAllFavorites = () => {
    onUpdateFavorites({ teamIds: [], playerIds: [] });
  };

  const filteredTeams = allTeams.filter(t =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
    t.shortName.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredPlayers = allPlayers.filter(p => {
    const matchesSearch =
      p.webName.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.firstName.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.secondName.toLowerCase().includes(playerSearch.toLowerCase()) ||
      p.teamName.toLowerCase().includes(playerSearch.toLowerCase());
    const matchesTeam = selectedTeamFilter === 'all' || p.teamId === selectedTeamFilter;
    const matchesStar = !onlyStarsFilter || p.isStar;
    return matchesSearch && matchesTeam && matchesStar;
  }).slice(0, 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-100 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20">
              <Star className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Personalize Favorites</h2>
              <p className="text-xs text-neutral-400">
                Choose your favorite teams and star players to customize your Premier League feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher & quick presets */}
        <div className="px-6 py-3 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'teams'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              Teams ({favorites.teamIds.length})
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                activeTab === 'players'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
              Players ({favorites.playerIds.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {activeTab === 'teams' ? (
              <button
                onClick={selectBigSix}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Big Six
              </button>
            ) : (
              <button
                onClick={selectTopStars}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700/50 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Select Top Talismans
              </button>
            )}

            {(favorites.teamIds.length > 0 || favorites.playerIds.length > 0) && (
              <button
                onClick={clearAllFavorites}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'teams' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search clubs (e.g. Arsenal, Liverpool, City)..."
                  value={teamSearch}
                  onChange={(e) => setTeamSearch(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredTeams.map((team) => {
                  const isSelected = favorites.teamIds.includes(team.id);
                  return (
                    <button
                      key={team.id}
                      onClick={() => toggleTeam(team.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500/60 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/40'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs text-white shadow"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.shortName}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate text-white">{team.name}</div>
                        <div className="text-[11px] text-neutral-400">{team.shortName}</div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950'
                            : 'border border-neutral-700 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'players' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search players (e.g. Haaland, Saka, Salah, Palmer)..."
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTeamFilter}
                    onChange={(e) => setSelectedTeamFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none focus:border-neutral-600"
                  >
                    <option value="all">All Teams</option>
                    {allTeams.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => setOnlyStarsFilter(!onlyStarsFilter)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition ${
                      onlyStarsFilter
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Star Players
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredPlayers.map((player) => {
                  const isSelected = favorites.playerIds.includes(player.id);
                  return (
                    <div
                      key={player.id}
                      onClick={() => togglePlayer(player.id)}
                      className={`cursor-pointer relative flex items-center justify-between p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-neutral-800 border-amber-500/60 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                          : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-xs text-neutral-200">
                          {player.position}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-white truncate">{player.webName}</span>
                            {player.isStar && (
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-neutral-400 flex items-center gap-2">
                            <span>{player.teamShortName}</span>
                            <span>•</span>
                            <span>{player.goals}G {player.assists}A</span>
                            <span>•</span>
                            <span className="text-amber-400/90 font-medium">{player.totalPoints} pts</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`p-2 rounded-lg transition ${
                          isSelected
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isSelected ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            Selected: <span className="text-white font-medium">{favorites.teamIds.length} Teams</span>,{' '}
            <span className="text-white font-medium">{favorites.playerIds.length} Players</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
}
