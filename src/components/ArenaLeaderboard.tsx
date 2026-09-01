import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Medal,
  Flame,
  Search,
  Users,
  Shield,
  TrendingUp,
  Award,
  Zap,
  Target,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { User, ArenaPlayerProfile, ArenaTier } from '../types';
import { getAvatarUrlByIndex } from '../data/creativeAvatars';

interface Props {
  currentUser: User;
  onSelectUserProfile?: (user: User) => void;
  onChallengeUser?: (username: string) => void;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  rating: number;
  tier: ArenaTier;
  wins: number;
  losses: number;
  winRate: number;
  winStreak: number;
  survivalScore: number;
  isCurrentUser?: boolean;
}

export const ArenaLeaderboard: React.FC<Props> = ({
  currentUser,
  onChallengeUser,
}) => {
  const [activeTab, setActiveTab] = useState<'WEEKLY_TOP' | 'GROUP_STANDINGS' | 'SURVIVAL'>('WEEKLY_TOP');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');

  // Dynamically derive leaderboard from currentUser and real registered users in storage
  const leaderboardEntries = useMemo<LeaderboardEntry[]>(() => {
    try {
      const savedRegistered = localStorage.getItem('aurasat_registered_users');
      const realUsers: User[] = savedRegistered ? JSON.parse(savedRegistered) : [];
      const allUsers = [currentUser, ...realUsers.filter(u => u.id !== currentUser.id)];
      
      return allUsers.map((u, idx) => {
        const rating = u.predictedScore || u.targetScore || 1400;
        let tier: ArenaTier = 'GOLD';
        if (rating >= 1550) tier = 'MASTER';
        else if (rating >= 1500) tier = 'DIAMOND';
        else if (rating >= 1450) tier = 'PLATINUM';
        else if (rating >= 1350) tier = 'GOLD';
        else if (rating >= 1200) tier = 'SILVER';
        else tier = 'BRONZE';

        return {
          rank: idx + 1,
          userId: u.id,
          username: u.username || 'student',
          fullName: u.fullName ? `${u.fullName}${u.id === currentUser.id ? ' (Siz)' : ''}` : 'Talaba',
          avatarUrl: u.avatarUrl || getAvatarUrlByIndex(0),
          rating: rating,
          tier: tier,
          wins: u.testsCompletedCount || 0,
          losses: 0,
          winRate: u.testsCompletedCount ? 100 : 0,
          winStreak: u.streakDays || 0,
          survivalScore: u.streakDays || 0,
          isCurrentUser: u.id === currentUser.id,
        };
      });
    } catch {
      return [{
        rank: 1,
        userId: currentUser.id,
        username: currentUser.username || 'student',
        fullName: `${currentUser.fullName || 'Talaba'} (Siz)`,
        avatarUrl: currentUser.avatarUrl || getAvatarUrlByIndex(0),
        rating: currentUser.predictedScore || 1400,
        tier: 'GOLD',
        wins: currentUser.testsCompletedCount || 0,
        losses: 0,
        winRate: 100,
        winStreak: currentUser.streakDays || 0,
        survivalScore: currentUser.streakDays || 0,
        isCurrentUser: true,
      }];
    }
  }, [currentUser]);

  // Sorted and filtered list
  const filteredEntries = useMemo(() => {
    let list = [...leaderboardEntries];

    if (activeTab === 'SURVIVAL') {
      list.sort((a, b) => b.survivalScore - a.survivalScore);
      list = list.map((item, idx) => ({ ...item, rank: idx + 1 }));
    } else {
      list.sort((a, b) => b.rating - a.rating);
      list = list.map((item, idx) => ({ ...item, rank: idx + 1 }));
    }

    if (selectedTier !== 'ALL') {
      list = list.filter((item) => item.tier === selectedTier);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.username.toLowerCase().includes(q) ||
          item.fullName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [leaderboardEntries, activeTab, selectedTier, searchQuery]);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#E07A5F] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
          #1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#3D405B] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
          #2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-7 h-7 rounded-lg bg-[#81B29A] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
          #3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] text-[#64748B] flex items-center justify-center font-mono font-bold text-xs">
        #{rank}
      </div>
    );
  };

  const getTierBadge = (tier: ArenaTier) => {
    const tierMap: Record<ArenaTier, { label: string; color: string; border: string; bg: string }> = {
      MASTER: { label: 'Master', color: 'text-amber-800', border: 'border-amber-300', bg: 'bg-amber-50' },
      DIAMOND: { label: 'Diamond', color: 'text-cyan-800', border: 'border-cyan-300', bg: 'bg-cyan-50' },
      PLATINUM: { label: 'Platinum', color: 'text-indigo-800', border: 'border-indigo-300', bg: 'bg-indigo-50' },
      GOLD: { label: 'Gold', color: 'text-[#E07A5F]', border: 'border-[#FCD9CE]', bg: 'bg-[#FFF4F0]' },
      SILVER: { label: 'Silver', color: 'text-slate-700', border: 'border-slate-300', bg: 'bg-slate-50' },
      BRONZE: { label: 'Bronze', color: 'text-stone-700', border: 'border-stone-300', bg: 'bg-stone-50' },
    };
    const t = tierMap[tier] || tierMap.GOLD;
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${t.bg} ${t.color} border ${t.border}`}>
        {t.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Trophy size={20} className="text-[#E07A5F]" />
            <h2 className="text-lg font-black text-[#1E1B18] tracking-tight">Arena Elo Leaderboard</h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Official ratings calculated following standard competitive Elo psychometrics. Weekly rating resets every Sunday at 23:59 UTC.
          </p>
        </div>

        {/* Global Tab Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] gap-1">
          {[
            { id: 'WEEKLY_TOP', label: 'Weekly Global Top 50' },
            { id: 'GROUP_STANDINGS', label: 'Study Group Standings' },
            { id: 'SURVIVAL', label: 'Survival Gauntlet Records' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1E1B18] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#1E1B18]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name or @username..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs text-[#1E1B18] placeholder-[#64748B] focus:outline-none focus:border-[#1E1B18]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider shrink-0">Tier:</span>
          {['ALL', 'MASTER', 'PLATINUM', 'GOLD', 'SILVER'].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                selectedTier === tier
                  ? 'bg-[#E07A5F] text-white'
                  : 'bg-white border border-[#E5E0D8] text-[#64748B] hover:text-[#1E1B18]'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                <th className="py-3.5 px-6 text-center w-16">Rank</th>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">League Tier</th>
                <th className="py-3.5 px-6 text-right">
                  {activeTab === 'SURVIVAL' ? 'Max Streak' : 'Arena Elo Rating'}
                </th>
                <th className="py-3.5 px-6 text-center">W / L Ratio</th>
                <th className="py-3.5 px-6 text-center">Win Rate</th>
                <th className="py-3.5 px-6 text-center">Current Streak</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.userId}
                  className={`transition-colors ${
                    entry.isCurrentUser
                      ? 'bg-[#FFF4F0]/60 hover:bg-[#FFF4F0]'
                      : 'hover:bg-[#FAF8F5]/80'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center">{getRankBadge(entry.rank)}</div>
                  </td>

                  {/* Student Name & Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatarUrl}
                        alt={entry.fullName}
                        className="w-9 h-9 rounded-xl object-cover border border-[#E5E0D8]"
                      />
                      <div>
                        <div className="font-bold text-[#1E1B18] flex items-center gap-1.5">
                          <span>{entry.fullName}</span>
                          {entry.isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded bg-[#1E1B18] text-white text-[9px] font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-[#64748B]">@{entry.username}</div>
                      </div>
                    </div>
                  </td>

                  {/* Tier */}
                  <td className="py-4 px-6">{getTierBadge(entry.tier)}</td>

                  {/* Rating / Score */}
                  <td className="py-4 px-6 text-right font-mono font-bold text-sm text-[#1E1B18]">
                    {activeTab === 'SURVIVAL' ? (
                      <span className="text-[#E07A5F]">{entry.survivalScore} Questions</span>
                    ) : (
                      <span>{entry.rating.toLocaleString()} pts</span>
                    )}
                  </td>

                  {/* W / L */}
                  <td className="py-4 px-6 text-center font-mono text-[#64748B]">
                    <span className="text-[#2A9D8F] font-bold">{entry.wins}W</span> -{' '}
                    <span className="text-[#E76F51]">{entry.losses}L</span>
                  </td>

                  {/* Win Rate */}
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#1E1B18]">{entry.winRate}%</span>
                      <div className="w-12 h-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] overflow-hidden">
                        <div
                          className="h-full bg-[#2A9D8F] rounded-full"
                          style={{ width: `${entry.winRate}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Win Streak */}
                  <td className="py-4 px-6 text-center">
                    {entry.winStreak > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] font-mono font-bold text-[10px]">
                        <Flame size={11} />
                        {entry.winStreak} Streak
                      </span>
                    ) : (
                      <span className="text-[#64748B] font-mono">-</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right">
                    {!entry.isCurrentUser && (
                      <button
                        onClick={() => onChallengeUser?.(entry.username)}
                        className="px-3 py-1.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        1v1 Duel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
