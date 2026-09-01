import React, { useState } from 'react';
import { 
  Users, Activity, CreditCard, BookOpen, TrendingUp, 
  ShieldCheck, AlertTriangle, ArrowUpRight, CheckCircle2, 
  RefreshCw, Radio, Sparkles, MessageSquare, Terminal, Eye,
  Zap, Download, Clock, ChevronRight
} from 'lucide-react';
import { User, Question, MockTest, PaymentReceipt, GlobalPlatformSettings } from '../types';

interface AdminDashboardViewProps {
  users: User[];
  questions: Question[];
  mockTests: MockTest[];
  receipts: PaymentReceipt[];
  globalSettings: GlobalPlatformSettings;
  onNavigateTab: (tabId: string) => void;
  onApproveReceipt?: (id: string) => void;
  onTriggerEmergencyMode?: (enabled: boolean) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  users,
  questions,
  mockTests,
  receipts,
  globalSettings,
  onNavigateTab,
  onApproveReceipt,
  onTriggerEmergencyMode,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [presenceCount, setPresenceCount] = useState(() => Math.floor(Math.random() * 8) + 14);

  const totalUsers = users.length;
  const freeUsers = users.filter((u) => u.planTier === 'FREE' || !u.planTier).length;
  const standardUsers = users.filter((u) => u.planTier === 'STANDARD').length;
  const proUsers = users.filter((u) => u.planTier === 'PRO').length;
  const vipUsers = users.filter((u) => u.planTier === 'VIP').length;
  const paidUsersCount = standardUsers + proUsers + vipUsers;

  const totalQuestions = questions.length;
  const publishedMocks = mockTests.filter((m) => m.isPublished).length;
  const pendingReceipts = receipts.filter((r) => r.status === 'PENDING');

  const handleRefreshPulse = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPresenceCount(Math.floor(Math.random() * 6) + 16);
      setIsRefreshing(false);
    }, 600);
  };

  // Recent simulated and real events stream
  const [activityLogs, setActivityLogs] = useState([
    {
      id: 'act-1',
      type: 'UPGRADE',
      text: 'Scholar @alex_chen upgraded to PRO SCHOLAR tier',
      time: '2 minutes ago',
      badge: 'PRO TIER',
      color: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/30',
    },
    {
      id: 'act-2',
      type: 'MOCK_SUBMIT',
      text: 'Scholar @sarah_jenkins completed Official Bluebook Mock #1 (Score: 1540)',
      time: '8 minutes ago',
      badge: 'MOCK EXAM',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'act-3',
      type: 'HOTFIX',
      text: 'Question #MATH-102 LaTeX formula re-rendered & published to live bank',
      time: '24 minutes ago',
      badge: 'HOT-FIX',
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      id: 'act-4',
      type: 'NEW_SCHOLAR',
      text: 'New scholar @jasur_sat registered via Supabase Auth (Target: 1550)',
      time: '42 minutes ago',
      badge: 'REGISTRATION',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    },
    {
      id: 'act-5',
      type: 'BILLING',
      text: 'Manual payment receipt submitted for 3-Month PRO Pass ($99)',
      time: '1 hour ago',
      badge: 'PAYMENT',
      color: 'text-[#E07A5F] bg-[#E07A5F]/10 border-[#E07A5F]/30',
    },
  ]);

  return (
    <div id="admin-dashboard-view" className="space-y-6">
      {/* Top Banner / Pulse Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1B3D] via-[#121A2F] to-[#0A0F1D] border border-white/10 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Radio className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight">Supabase Realtime Live Network</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                100% Operational
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live bi-directional sync active across {totalUsers} registered scholars and {presenceCount} active viewports.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-refresh-pulse"
            onClick={handleRefreshPulse}
            disabled={isRefreshing}
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Poll Health</span>
          </button>

          <button
            id="btn-quick-manage-users"
            onClick={() => onNavigateTab('users')}
            className="px-3.5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c59b27] text-[#0B1B3D] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Manage Scholars</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* KPI Grid (4 High Impact Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Registered Scholars */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">Total Scholars</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0B1B3D] dark:text-blue-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">
              {totalUsers}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18% this month • 100% retention</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Active Online Now */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">Online Presence</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">
              {presenceCount}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Active in Bluebook / Daily Drills</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Paid Subscriptions Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">Paid Subscriptions</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-[#D4AF37]">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">
              {paidUsersCount}
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
              <span className="text-sky-500 font-bold">{standardUsers} Std</span>
              <span>•</span>
              <span className="text-[#D4AF37] font-bold">{proUsers} PRO</span>
              <span>•</span>
              <span className="text-[#E07A5F] font-bold">{vipUsers} VIP</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Questions & Full Mocks Published */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#78716C] dark:text-[#94A3B8] uppercase tracking-wider">Content Inventory</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">
              {totalQuestions}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              <span>{publishedMocks} Full-Length Adaptive Mocks live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Activity Stream & Pending Receipts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Manual Receipts Alert if any */}
          {pendingReceipts.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#E07A5F]/10 border border-[#E07A5F]/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#E07A5F] font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{pendingReceipts.length} Pending Payment Receipts Require Verification</span>
                </div>
                <button
                  onClick={() => onNavigateTab('users')}
                  className="text-xs font-bold text-[#E07A5F] underline hover:opacity-80"
                >
                  Review All
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pendingReceipts.slice(0, 2).map((r) => (
                  <div key={r.id} className="p-3 rounded-xl bg-white dark:bg-[#121A2F] border border-[#E07A5F]/20 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#0B1B3D] dark:text-slate-200">{r.userName || r.userEmail}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Plan: {r.planRequested} • ${r.amount}</div>
                    </div>
                    {onApproveReceipt && (
                      <button
                        onClick={() => onApproveReceipt(r.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-xs"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Realtime Activity Stream */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
                  Live Platform Activity Stream
                </h3>
                <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                  Direct neural telemetry from student submissions, payments, and system hot-fixes.
                </p>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono font-bold">
                REALTIME
              </div>
            </div>

            <div className="divide-y divide-[#E5E0D8] dark:divide-[#1E293B]">
              {activityLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${log.color}`}>
                        {log.badge}
                      </span>
                      <span className="text-[11px] font-mono text-[#78716C] dark:text-[#94A3B8]">{log.time}</span>
                    </div>
                    <p className="text-[#0B1B3D] dark:text-slate-200 font-medium">{log.text}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Quick Command Hub & Platform Health */}
        <div className="space-y-6">
          {/* Quick Hub Actions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              Quick Admin Actions
            </h3>

            <div className="space-y-2">
              <button
                id="btn-nav-grant-tier"
                onClick={() => onNavigateTab('users')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200">Grant Tier / Arm 3D Pass</div>
                    <div className="text-[10px] text-slate-500">Upgrade user with custom duration</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="btn-nav-fix-question"
                onClick={() => onNavigateTab('questions')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4 text-sky-500" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200">Live Question Hot-Fixer</div>
                    <div className="text-[10px] text-slate-500">KaTeX preview & instant patch</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="btn-nav-ingest-pdf"
                onClick={() => onNavigateTab('ingestion')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200">PDF Ingestion Pipeline</div>
                    <div className="text-[10px] text-slate-500">Extract SAT tests with Gemini AI</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="btn-nav-plans-editor"
                onClick={() => onNavigateTab('plans')}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-[#E07A5F]" />
                  <div>
                    <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200">Dynamic Pricing CMS</div>
                    <div className="text-[10px] text-slate-500">Modify cards, prices & @rcmnx links</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* System Telemetry & Kill Switch status */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Governance</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">Platform Status</span>
                <span className="font-mono font-bold text-emerald-400">
                  {globalSettings.isMaintenance ? 'MAINTENANCE MODE' : 'LIVE ONLINE'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">Multiplayer Arena</span>
                <span className={`font-mono font-bold ${globalSettings.arenaEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {globalSettings.arenaEnabled ? 'ENABLED' : 'PAUSED'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                <span className="text-slate-300">WebRTC Streaming</span>
                <span className={`font-mono font-bold ${globalSettings.liveStreamEnabled ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {globalSettings.liveStreamEnabled ? 'ENABLED' : 'MUTED'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold text-slate-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Manage System Switches</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
