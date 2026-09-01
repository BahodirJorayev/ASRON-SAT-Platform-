import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Users,
  Flame,
  Shield,
  Trophy,
  Zap,
  BookOpen,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  Copy,
  Check,
  Share2,
  Lock,
  Play,
  RotateCcw,
  Target
} from 'lucide-react';
import { User, ArenaMode, ArenaCategory, ArenaTier, Question } from '../types';
import { LiveDuelRoom } from './LiveDuelRoom';
import { ArenaLeaderboard } from './ArenaLeaderboard';
import { getAvatarUrlByIndex } from '../data/creativeAvatars';

interface Props {
  user: User;
  usersList?: User[];
  onOpenPaywall?: () => void;
  onSelectUserProfile?: (selectedUser: User) => void;
  onDepositMistake?: (question: Question, wrongAnswer: string) => void;
  onOpenSocraticTutor?: (question: Question) => void;
}

export const MultiplayerArenaView: React.FC<Props> = ({
  user,
  usersList,
  onOpenPaywall,
  onSelectUserProfile,
  onDepositMistake,
  onOpenSocraticTutor,
}) => {
  // Navigation tabs inside Arena: 'LOBBY' | 'DUEL' | 'LEADERBOARD'
  const [arenaTab, setArenaTab] = useState<'LOBBY' | 'DUEL' | 'LEADERBOARD'>('LOBBY');

  // Matchmaking configuration
  const [selectedMode, setSelectedMode] = useState<ArenaMode>('QUICK_DUEL');
  const [selectedCategory, setSelectedCategory] = useState<ArenaCategory>('MIXED');
  const [roomCode, setRoomCode] = useState<string>('');
  const [customRoomCodeInput, setCustomRoomCodeInput] = useState<string>('');
  const [isPrivateRoomModalOpen, setIsPrivateRoomModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [targetOpponentUsername, setTargetOpponentUsername] = useState<string | undefined>(undefined);

  // Player Stats
  const playerRating = user.baselineScore ? user.targetScore - 130 : 1420;
  const playerWins = 34;
  const playerLosses = 12;
  const playerStreak = 6;
  const playerLeague: ArenaTier = 'GOLD';

  // Topic Categories
  const CATEGORIES: { id: ArenaCategory; label: string; description: string; icon: any }[] = [
    {
      id: 'MIXED',
      label: 'Mixed SAT (Standard)',
      description: 'Balanced 5-question speed clash across Math & Reading/Writing.',
      icon: Compass,
    },
    {
      id: 'RW',
      label: 'Reading & Writing Focus',
      description: 'Transitions, rhetorical synthesis, and boundaries.',
      icon: BookOpen,
    },
    {
      id: 'MATH_DESMOS',
      label: 'Math Desmos Blitz',
      description: 'Algebraic tricks, nonlinear systems, and vertex shortcuts.',
      icon: Calculator,
    },
    {
      id: 'VOCAB',
      label: 'SAT Vocab 400',
      description: 'High-frequency College Panda vocabulary in official context.',
      icon: Target,
    },
  ];

  // Quick Start Duel
  const handleStartDuel = (mode: ArenaMode, customOpponent?: string) => {
    setSelectedMode(mode);
    setTargetOpponentUsername(customOpponent);
    setArenaTab('DUEL');
  };

  // Generate 6-Character Private Code
  const handleCreatePrivateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
    setIsPrivateRoomModalOpen(true);
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}/#/arena?room=${roomCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 1. ACTIVE DUEL ROOM VIEW
  if (arenaTab === 'DUEL') {
    return (
      <div className="max-w-5xl mx-auto py-4 px-4 sm:px-6">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setArenaTab('LOBBY')}
            className="text-xs font-bold text-[#64748B] hover:text-[#1E1B18] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            ← Exit Duel to Lobby
          </button>
          <div className="text-xs font-mono font-bold text-[#64748B]">
            Arena Session #{roomCode || 'LIVE-PVP'}
          </div>
        </div>

        <LiveDuelRoom
          currentUser={user}
          mode={selectedMode}
          category={selectedCategory}
          roomCode={roomCode}
          opponentUsername={targetOpponentUsername}
          onExit={() => setArenaTab('LOBBY')}
          onDepositMistake={onDepositMistake}
          onOpenSocraticTutor={onOpenSocraticTutor}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      {/* Top Header & Sub-Tab Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1E1B18] text-white flex items-center justify-center shadow-2xs">
              <Swords size={20} className="text-[#E07A5F]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#1E1B18] tracking-tight">Multiplayer SAT Arena</h1>
              <p className="text-xs text-[#64748B]">
                High-stakes, distraction-free live duels and synchronized group speed clashes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs gap-1">
          <button
            onClick={() => setArenaTab('LOBBY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              arenaTab === 'LOBBY'
                ? 'bg-[#1E1B18] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            Arena Matchmaking Hub
          </button>
          <button
            onClick={() => setArenaTab('LEADERBOARD')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              arenaTab === 'LEADERBOARD'
                ? 'bg-[#1E1B18] text-white shadow-2xs'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            <Trophy size={13} className="text-[#E07A5F]" />
            Elo Leaderboard
          </button>
        </div>
      </div>

      {/* RENDER LEADERBOARD VIEW */}
      {arenaTab === 'LEADERBOARD' ? (
        <ArenaLeaderboard
          currentUser={user}
          onChallengeUser={(targetUser) => handleStartDuel('QUICK_DUEL', targetUser)}
        />
      ) : (
        /* RENDER LOBBY & MATCHMAKING HUB */
        <div className="space-y-8">
          {/* 1. Player Rank Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E5E0D8] shadow-2xs relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Left Profile details */}
              <div className="flex items-center gap-4">
                <img
                  src={user.avatarUrl || getAvatarUrlByIndex(0)}
                  alt={user.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1E1B18] shadow-2xs"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-[#1E1B18] tracking-tight">{user.fullName}</h2>
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] font-mono font-bold text-[10px] uppercase">
                      {playerLeague} Tier
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#64748B] mt-0.5">@{user.username}</div>
                  <div className="text-xs text-[#64748B] mt-1 flex items-center gap-2">
                    <span>Ranked Competitor</span>
                    <span>•</span>
                    <span className="text-[#2A9D8F] font-bold">Top 8% Nationwide</span>
                  </div>
                </div>
              </div>

              {/* Right Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Arena Elo Rating
                  </div>
                  <div className="text-lg font-black font-mono text-[#1E1B18] mt-0.5">
                    {playerRating.toLocaleString()}
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Win / Loss Record
                  </div>
                  <div className="text-lg font-black font-mono text-[#1E1B18] mt-0.5">
                    <span className="text-[#2A9D8F]">{playerWins}W</span> -{' '}
                    <span className="text-[#E76F51]">{playerLosses}L</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Win Streak
                  </div>
                  <div className="text-lg font-black font-mono text-[#E07A5F] flex items-center justify-center gap-1 mt-0.5">
                    <Flame size={16} />
                    {playerStreak} Duels
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                    Survival Best
                  </div>
                  <div className="text-lg font-black font-mono text-[#1E1B18] mt-0.5">
                    17 Cleared
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Challenge Topic Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E1B18] tracking-tight">Select Duel Topic Category</h3>
              <span className="text-xs text-[#64748B]">Questions sampled from official College Board Question Bank</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const IconComponent = cat.icon;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                      isSelected
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-xs'
                        : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8] text-[#1E1B18]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <IconComponent size={18} className={isSelected ? 'text-[#E07A5F]' : 'text-[#64748B]'} />
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{cat.label}</div>
                      <div className={`text-[11px] leading-snug mt-1 ${isSelected ? 'text-stone-300' : 'text-[#64748B]'}`}>
                        {cat.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Game Mode Cards (3 Clean Minimalist Tiles) */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#1E1B18] tracking-tight">Choose Arena Game Mode</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Mode 1: 1v1 Quick Ranked Duel */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-5 hover:border-[#1E1B18] transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] flex items-center justify-center">
                    <Swords size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1B18]">1v1 Quick Ranked Duel</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Instant 1-click matchmaking pairing two active students with comparable ratings for a 5-question speed clash.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">5 Questions</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">45s / Question</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">Elo Stakes</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartDuel('QUICK_DUEL')}
                  className="w-full py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                >
                  <Play size={14} className="fill-white" />
                  Find Opponent (Quick Match)
                </button>
              </div>

              {/* Mode 2: Private Group Challenge */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-5 hover:border-[#1E1B18] transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#1E1B18] flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1B18]">Private Group Challenge</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Create custom study lobby with a 6-character room code or direct share link to study groups (2–30 participants).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">2-30 Players</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">Custom Code</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">Study Groups</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreatePrivateRoom}
                    className="flex-1 py-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] text-[#1E1B18] text-xs font-bold transition-all cursor-pointer"
                  >
                    Create Room
                  </button>
                  <button
                    onClick={() => {
                      const code = prompt('Enter 6-character Room Code:');
                      if (code && code.trim().length >= 4) {
                        setRoomCode(code.trim().toUpperCase());
                        handleStartDuel('GROUP_ROOM');
                      }
                    }}
                    className="flex-1 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    Join Code
                  </button>
                </div>
              </div>

              {/* Mode 3: Survival Gauntlet */}
              <div className="bg-white rounded-3xl p-6 border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-5 hover:border-[#1E1B18] transition-all">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#E07A5F] flex items-center justify-center">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#1E1B18]">Survival Gauntlet</h4>
                    <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                      Endless question ladder until the first mistake. Real-time high-score tracking and weekly streak leaderboard.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#64748B] pt-1">
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">Endless</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">1 Mistake = Out</span>
                    <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">High-Score Ladder</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartDuel('SURVIVAL')}
                  className="w-full py-3 rounded-2xl bg-[#E07A5F] hover:bg-[#D0694E] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                >
                  <Flame size={14} />
                  Enter Survival Gauntlet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Private Room Modal */}
      {isPrivateRoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E5E0D8] max-w-md w-full p-6 space-y-6 shadow-xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#1E1B18] flex items-center justify-center mx-auto mb-2">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-black text-[#1E1B18]">Private Study Group Lobby</h3>
              <p className="text-xs text-[#64748B]">
                Share this 6-character room code with your study partners or Telegram group chat.
              </p>
            </div>

            {/* Room Code Display */}
            <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E5E0D8] text-center space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#64748B]">
                Room Passcode
              </div>
              <div className="text-3xl font-black font-mono tracking-widest text-[#1E1B18]">
                {roomCode}
              </div>
            </div>

            {/* Copy Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCopyInviteLink}
                className="w-full py-2.5 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#1E1B18] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check size={14} className="text-[#2A9D8F]" /> : <Copy size={14} />}
                {copiedLink ? 'Invite Link Copied!' : 'Copy Direct Room Link'}
              </button>

              <button
                onClick={() => {
                  setIsPrivateRoomModalOpen(false);
                  handleStartDuel('GROUP_ROOM');
                }}
                className="w-full py-3 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
              >
                Launch Private Match
              </button>
            </div>

            <button
              onClick={() => setIsPrivateRoomModalOpen(false)}
              className="w-full text-center text-xs font-bold text-[#64748B] hover:text-[#1E1B18] transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
