import React, { useState } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, Crown, Zap, 
  Calendar, CheckCircle2, X, AlertTriangle, RefreshCw, 
  Send, Ban, Unlock, UserCheck, ShieldAlert, Sparkles,
  ExternalLink, RotateCcw, Clock, Lock
} from 'lucide-react';
import { User, PlanTier } from '../types';

interface AdminUsersManagerProps {
  users: User[];
  onUpdateUser: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  adminTelegram?: string;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({
  users,
  onUpdateUser,
  onDeleteUser,
  adminTelegram = '@rcmnx',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | PlanTier>('ALL');
  const [selectedUserForGrant, setSelectedUserForGrant] = useState<User | null>(null);
  const [selectedUserForRescue, setSelectedUserForRescue] = useState<User | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Quick Grant Modal State
  const [selectedTier, setSelectedTier] = useState<PlanTier>('PRO');
  const [durationOption, setDurationOption] = useState<'1_MONTH' | '3_MONTHS' | '6_MONTHS' | '1_YEAR' | 'LIFETIME' | 'CUSTOM'>('3_MONTHS');
  const [customExpiryDate, setCustomExpiryDate] = useState('');
  const [permissions, setPermissions] = useState({
    desmosAccess: true,
    whiteboardStreamHosting: true,
    aiSocraticTutor: true,
    fullQuestionBank: true,
    unlimitedMocks: true,
  });

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      (u.fullName || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.scholarId || '').toLowerCase().includes(q);

    const matchesTier = tierFilter === 'ALL' || u.planTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleOpenGrantModal = (user: User) => {
    setSelectedUserForGrant(user);
    setSelectedTier(user.planTier || 'PRO');
    setPermissions({
      desmosAccess: user.permissions?.desmosAccess ?? true,
      whiteboardStreamHosting: user.permissions?.whiteboardStreamHosting ?? (user.planTier === 'VIP' || user.planTier === 'PRO'),
      aiSocraticTutor: user.permissions?.aiSocraticTutor ?? (user.planTier !== 'FREE'),
      fullQuestionBank: user.permissions?.fullQuestionBank ?? true,
      unlimitedMocks: user.permissions?.unlimitedMocks ?? (user.planTier !== 'FREE'),
    });
  };

  const handleSaveTierGrant = () => {
    if (!selectedUserForGrant) return;

    let expiresAt: string | undefined = undefined;
    const now = new Date();

    if (durationOption === '1_MONTH') {
      now.setMonth(now.getMonth() + 1);
      expiresAt = now.toISOString();
    } else if (durationOption === '3_MONTHS') {
      now.setMonth(now.getMonth() + 3);
      expiresAt = now.toISOString();
    } else if (durationOption === '6_MONTHS') {
      now.setMonth(now.getMonth() + 6);
      expiresAt = now.toISOString();
    } else if (durationOption === '1_YEAR') {
      now.setFullYear(now.getFullYear() + 1);
      expiresAt = now.toISOString();
    } else if (durationOption === 'CUSTOM' && customExpiryDate) {
      expiresAt = new Date(customExpiryDate).toISOString();
    } else {
      expiresAt = undefined; // Lifetime
    }

    const updated: User = {
      ...selectedUserForGrant,
      planTier: selectedTier,
      tierExpiresAt: expiresAt,
      unseenTierUpgrade: selectedTier !== 'FREE', // Arm 3D celebration modal!
      scholarId: selectedUserForGrant.scholarId || `ASRON-2026-${selectedUserForGrant.id.slice(-4).toUpperCase()}`,
      permissions: permissions,
    };

    onUpdateUser(updated);
    setSelectedUserForGrant(null);
    showNotification(`⚡ Successfully granted ${selectedTier} tier to @${updated.username}! 3D celebration armed.`);
  };

  const handleToggleBan = (user: User) => {
    const isBanned = !user.isBanned;
    const updated: User = {
      ...user,
      isBanned,
    };
    onUpdateUser(updated);
    showNotification(isBanned ? `🚫 Scholar @${user.username} has been suspended.` : `✅ Scholar @${user.username} unbanned.`);
  };

  const handleResetStuckAttempts = (user: User) => {
    // Reset test attempts
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem(`aurasat_active_attempt_${user.id}`);
        localStorage.removeItem(`bluebook_attempt_${user.id}`);
      } catch (e) {
        // ignore
      }
    }
    showNotification(`🔄 Active test state & sessions cleared for @${user.username}.`);
    setSelectedUserForRescue(null);
  };

  return (
    <div id="admin-users-manager" className="space-y-6">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Telegram Billing Context Box */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0B1B3D] dark:text-blue-300 text-xs font-mono font-bold border border-[#0B1B3D]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Scholar Directory & Manual Billing Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
            Scholar Subscriptions & Tier Control
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
            Directly verify manual payments from Telegram <span className="font-mono font-bold text-[#E07A5F]">{adminTelegram}</span>, grant custom tier passes, and arm 3D unlock celebrations.
          </p>
        </div>

        <a
          href={`https://t.me/${adminTelegram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#0B1B3D] dark:bg-[#1E293B] hover:bg-[#1a2d5a] text-white text-xs font-bold flex items-center gap-2 shrink-0 transition-colors shadow-xs"
        >
          <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Open Telegram Desk ({adminTelegram})</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </a>
      </div>

      {/* Search & Tier Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-search-scholars"
            type="text"
            placeholder="Search by @username, name, email, or scholar ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-xs text-[#0B1B3D] dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-[#D4AF37]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {(['ALL', 'FREE', 'STANDARD', 'PRO', 'VIP'] as const).map((tier) => (
            <button
              key={tier}
              id={`filter-tier-${tier.toLowerCase()}`}
              onClick={() => setTierFilter(tier)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                tierFilter === tier
                  ? 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] shadow-xs'
                  : 'bg-white dark:bg-[#121A2F] text-slate-600 dark:text-slate-400 border border-[#E5E0D8] dark:border-[#1E293B] hover:bg-slate-50'
              }`}
            >
              {tier === 'ALL' ? 'All Scholars' : tier}
            </button>
          ))}
        </div>
      </div>

      {/* Scholars Table */}
      <div className="rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-[#E5E0D8] dark:border-[#1E293B] text-[#78716C] dark:text-[#94A3B8] uppercase font-mono text-[10px] bg-slate-50/50 dark:bg-slate-900/30">
                <th className="py-3.5 px-5 font-semibold">Scholar Info</th>
                <th className="py-3.5 px-4 font-semibold">Target & Predicted</th>
                <th className="py-3.5 px-4 font-semibold">Registered</th>
                <th className="py-3.5 px-4 font-semibold">Current Tier</th>
                <th className="py-3.5 px-4 font-semibold">Expiration / Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8] dark:divide-[#1E293B]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No scholars found matching your filter or search query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isBanned = u.isBanned;
                  const tierBadgeColor = {
                    FREE: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300',
                    STANDARD: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800',
                    PRO: 'bg-amber-50 dark:bg-amber-950/40 text-[#D4AF37] border-[#D4AF37]/50',
                    VIP: 'bg-rose-50 dark:bg-rose-950/40 text-[#E07A5F] border-[#E07A5F]/50',
                  }[u.planTier || 'FREE'];

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                      {/* Scholar Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                            alt={u.username}
                            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-[#0B1B3D] dark:text-[#EAEBED] truncate flex items-center gap-1.5">
                              <span>{u.fullName || u.username}</span>
                              {isBanned && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-500 border border-rose-500/30">
                                  BANNED
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#78716C] dark:text-[#94A3B8] font-mono flex items-center gap-2">
                              <span>@{u.username}</span>
                              <span>•</span>
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Target & Predicted Score */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-[#0B1B3D] dark:text-slate-200">
                          {u.targetScore || 1550} <span className="text-[10px] text-slate-400 font-normal">target</span>
                        </div>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400">
                          {u.predictedScore ? `${u.predictedScore} predicted` : `${u.streakDays || 0}d streak`}
                        </div>
                      </td>

                      {/* Registered Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>

                      {/* Current Tier */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${tierBadgeColor}`}>
                          {u.planTier === 'PRO' || u.planTier === 'VIP' ? <Crown className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                          <span>{u.planTier || 'FREE'}</span>
                        </span>
                      </td>

                      {/* Expiration / Status */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {u.tierExpiresAt ? (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{new Date(u.tierExpiresAt).toLocaleDateString()}</span>
                          </div>
                        ) : u.planTier && u.planTier !== 'FREE' ? (
                          <span className="text-[#D4AF37] font-bold">LIFETIME</span>
                        ) : (
                          <span className="text-slate-400">Standard Free</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`btn-grant-${u.id}`}
                            onClick={() => handleOpenGrantModal(u)}
                            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c59b27] text-[#0B1B3D] text-[11px] font-extrabold flex items-center gap-1 transition-colors shadow-xs"
                          >
                            <Zap className="w-3 h-3 stroke-[2.5]" />
                            <span>Grant Tier</span>
                          </button>

                          <button
                            id={`btn-rescue-${u.id}`}
                            onClick={() => setSelectedUserForRescue(u)}
                            title="Session Rescue & Attempt Reset"
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`btn-ban-${u.id}`}
                            onClick={() => handleToggleBan(u)}
                            title={isBanned ? 'Unban Scholar' : 'Suspend Scholar'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isBanned
                                ? 'bg-rose-500 text-white hover:bg-rose-600'
                                : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-600 dark:text-slate-300 hover:text-rose-600'
                            }`}
                          >
                            {isBanned ? <Unlock className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK GRANT MODAL */}
      {selectedUserForGrant && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-6 shadow-2xl space-y-5 text-[#0B1B3D] dark:text-[#EAEBED]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-[#D4AF37]">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold">Grant Tier & Arm 3D Celebration</h3>
                  <p className="text-xs text-slate-400">Scholar: @{selectedUserForGrant.username}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUserForGrant(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Tier */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">1. Select Membership Tier</label>
              <div className="grid grid-cols-4 gap-2">
                {(['FREE', 'STANDARD', 'PRO', 'VIP'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedTier(tier)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all text-center ${
                      selectedTier === tier
                        ? 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] border-transparent shadow-sm scale-102'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Duration */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">2. Select Pass Duration</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: '1_MONTH', label: '1 Month' },
                  { id: '3_MONTHS', label: '3 Months' },
                  { id: '6_MONTHS', label: '6 Months' },
                  { id: '1_YEAR', label: '1 Year' },
                  { id: 'LIFETIME', label: 'Lifetime Pass' },
                  { id: 'CUSTOM', label: 'Custom Date' },
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDurationOption(d.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-mono font-semibold transition-all ${
                      durationOption === d.id
                        ? 'bg-amber-500/15 border-amber-500/50 text-[#D4AF37] font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              {durationOption === 'CUSTOM' && (
                <div className="pt-2">
                  <input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Granular Permission Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">3. Granular Privileges</label>
              <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs">
                {[
                  { key: 'desmosAccess', label: 'Desmos 20-Sec Shortcut Engine' },
                  { key: 'whiteboardStreamHosting', label: 'WebRTC Masterclass & Whiteboard Hosting' },
                  { key: 'aiSocraticTutor', label: '24/7 Gemini Socratic AI Tutor' },
                  { key: 'fullQuestionBank', label: 'Official SQB 10,000+ Question Bank' },
                  { key: 'unlimitedMocks', label: 'Unlimited Adaptive Multistage Mocks' },
                ].map((perm) => (
                  <label key={perm.key} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-slate-700 dark:text-slate-300">{perm.label}</span>
                    <input
                      type="checkbox"
                      checked={(permissions as any)[perm.key]}
                      onChange={(e) =>
                        setPermissions({ ...permissions, [perm.key]: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForGrant(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                id="btn-confirm-save-tier-grant"
                onClick={handleSaveTierGrant}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Arm & Apply Tier</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SESSION RESCUE MODAL */}
      {selectedUserForRescue && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-6 shadow-2xl space-y-4 text-[#0B1B3D] dark:text-[#EAEBED]">
            <div className="flex items-center gap-3 text-[#E07A5F]">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-extrabold">Student State & Session Rescue</h3>
            </div>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8] leading-relaxed">
              If scholar <span className="font-bold font-mono text-[#0B1B3D] dark:text-slate-100">@{selectedUserForRescue.username}</span> suffered a network drop or crash during an active 2-hour Bluebook MST simulation, clicking below will reset their stuck test locks and purge rogue locks safely.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-mono text-[11px] text-slate-500">Target Scholar: @{selectedUserForRescue.username}</div>
              <div className="font-mono text-[11px] text-slate-500">Email: {selectedUserForRescue.email}</div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedUserForRescue(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResetStuckAttempts(selectedUserForRescue)}
                className="flex-1 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#c96950] text-white text-xs font-bold transition-colors"
              >
                Execute Rescue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
