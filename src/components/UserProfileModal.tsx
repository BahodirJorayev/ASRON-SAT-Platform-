import React, { useState, useEffect } from 'react';
import {
  X,
  User as UserIcon,
  Flame,
  Shield,
  Zap,
  Target,
  Award,
  BookOpen,
  Calendar,
  Mail,
  Send,
  CheckCircle2,
  TrendingUp,
  Search,
  Check,
  ChevronRight,
  Sparkles,
  Crown
} from 'lucide-react';
import { User, PlanTier } from '../types';
import { BadgeCollection } from './BadgeCollection';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedUser: User | null;
  usersList: User[];
  onSelectUser: (user: User) => void;
  isAdmin?: boolean;
  onUpdatePlan?: (userId: string, planTier: PlanTier, daysToAdd: number) => void;
}

export const UserProfileModal: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedUser,
  usersList,
  onSelectUser,
  isAdmin = false,
  onUpdatePlan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !selectedUser) return null;

  const cleanQuery = searchQuery.trim().toLowerCase().replace(/^@/, '');
  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(cleanQuery) ||
      u.email.toLowerCase().includes(cleanQuery) ||
      (u.username || '').toLowerCase().includes(cleanQuery) ||
      (u.phoneNumber || '').replace(/\s+/g, '').includes(cleanQuery.replace(/\s+/g, '')) ||
      (u.telegramId && u.telegramId.toLowerCase().includes(cleanQuery)) ||
      u.id.toLowerCase().includes(cleanQuery)
  );

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 font-sans overflow-y-auto overscroll-contain"
    >
      <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[86vh] my-auto text-[#1C1917] relative">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-[#FFFFFF] border-b border-[#E8E2D5] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#2563EB]">
              Talaba Profili
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF7F2] transition-colors cursor-pointer border border-[#E8E2D5]"
            title="Yopish (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Strip inside modal */}
        <div className="p-3 bg-[#FAF7F2] border-b border-[#E8E2D5]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search other student profiles by name, email, or @handle..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {searchQuery.trim() && (
            <div className="mt-2 max-h-32 overflow-y-auto divide-y divide-[#E8E2D5] bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] shadow-xs">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    onSelectUser(u);
                    setSearchQuery('');
                  }}
                  className={`p-2 px-3 flex items-center justify-between text-xs cursor-pointer hover:bg-[#FAF7F2] ${
                    u.id === selectedUser.id ? 'bg-blue-50 font-bold text-[#2563EB]' : 'text-[#1C1917]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={u.fullName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{u.fullName}</span>
                    <span className="text-[10px] text-[#78716C]">({u.email})</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#FAF7F2] border border-[#E8E2D5]">
                    {u.planTier}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FAF7F2]">
          {/* Main User Card */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={selectedUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={selectedUser.fullName}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E8E2D5]"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    selectedUser.isOnline !== false ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  title={selectedUser.isOnline !== false ? 'Online Now' : 'Offline'}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-[#1C1917]">{selectedUser.fullName}</h3>
                  <span
                    className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                      selectedUser.planTier === 'PRO'
                        ? 'bg-blue-50 text-[#2563EB] border border-blue-200'
                        : selectedUser.planTier === 'STANDARD'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : 'bg-[#FAF7F2] text-[#78716C] border border-[#E8E2D5]'
                    }`}
                  >
                    {selectedUser.planTier}
                  </span>
                </div>

                <div className="text-xs text-[#78716C] mt-0.5 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[#2563EB]">@{selectedUser.username || 'user'}</span>
                  <span>•</span>
                  <span>{selectedUser.email}</span>
                  {selectedUser.phoneNumber && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-emerald-700">{selectedUser.phoneNumber}</span>
                    </>
                  )}
                  {selectedUser.telegramId && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-[#2563EB]">{selectedUser.telegramId}</span>
                    </>
                  )}
                </div>

                {selectedUser.bio && (
                  <p className="text-xs text-[#57534E] mt-2 italic max-w-md">"{selectedUser.bio}"</p>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-[#E8E2D5]">
              <div className="text-[11px] text-[#78716C]">
                Status:{' '}
                <strong className={selectedUser.isOnline !== false ? 'text-emerald-600' : 'text-slate-500'}>
                  {selectedUser.isOnline !== false ? 'Active Now' : 'Offline (Recent)'}
                </strong>
              </div>
              <div className="text-[11px] text-[#78716C]">
                Role: <strong className="text-[#1C1917]">{selectedUser.role}</strong>
              </div>
            </div>
          </div>

          {/* Academic & Test Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Target Score</div>
              <div className="text-2xl font-black text-[#2563EB] font-mono mt-1">
                {selectedUser.targetScore || 1550}
              </div>
              <div className="text-[10px] text-[#A8A29E] mt-0.5">Goal</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Predicted Score</div>
              <div className="text-2xl font-black text-emerald-600 font-mono mt-1">
                {selectedUser.predictedScore || 1420}
              </div>
              <div className="text-[10px] text-[#A8A29E] mt-0.5">MST Curve</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Daily Streak</div>
              <div className="text-2xl font-black text-amber-600 font-mono mt-1 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{selectedUser.streakDays}d</span>
              </div>
              <div className="text-[10px] text-[#A8A29E] mt-0.5">{selectedUser.streakFreezes} Freezes</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] text-center shadow-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Experience XP</div>
              <div className="text-2xl font-black text-[#1C1917] font-mono mt-1 flex items-center justify-center gap-1">
                <Zap className="w-5 h-5 fill-emerald-500 text-emerald-500" />
                <span>{selectedUser.xpPoints}</span>
              </div>
              <div className="text-[10px] text-[#A8A29E] mt-0.5">{selectedUser.testsCompletedCount || 5} Mocks</div>
            </div>
          </div>

          {/* Weakest Sub-Skills Focus */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Active Skill Focus Areas
            </h4>
            <div className="flex flex-wrap gap-2">
              {(selectedUser.weakestSubSkills || ['Nonlinear Equations', 'Transitions', 'Boundaries']).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D5] text-xs font-semibold text-[#1C1917] flex items-center gap-1.5"
                >
                  <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Automated SAT Badges Matrix */}
          <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Talaba SAT Yutuqlari & Nishonlari
            </h4>
            <BadgeCollection user={selectedUser} isPublicView={true} />
          </div>

          {/* Admin Quick Membership Manager (If Admin) */}
          {isAdmin && onUpdatePlan && (
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#D6CEBE] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1917]">Staff Subscription Controller</span>
                <span className="text-[10px] text-[#78716C]">Direct Membership Override</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdatePlan(selectedUser.id, 'PRO', 30)}
                  className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  +30 Days PRO
                </button>
                <button
                  onClick={() => onUpdatePlan(selectedUser.id, 'STANDARD', 30)}
                  className="flex-1 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#D6CEBE] text-[#1C1917] font-bold text-xs transition-colors cursor-pointer"
                >
                  +30 Days STANDARD
                </button>
                <button
                  onClick={() => onUpdatePlan(selectedUser.id, 'FREE', 0)}
                  className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Reset Free
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFFFFF] border-t border-[#E8E2D5] flex items-center justify-between text-xs">
          <span className="text-[#78716C]">
            Target Exam Date: <strong className="text-[#1C1917]">{selectedUser.targetExamDate || 'October 2026'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#D6CEBE] font-bold text-[#1C1917] transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
