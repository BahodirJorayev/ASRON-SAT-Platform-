import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Crown,
  Sparkles,
  ShieldAlert,
  Bell,
  UserCheck,
  Send,
  HelpCircle,
  LayoutDashboard,
  BrainCircuit,
  BookMarked,
  Layers,
  MessagesSquare,
  Compass,
  FileCheck2,
  Globe,
  LogIn,
  UserPlus,
  X,
  Search,
  BookOpen,
  User as UserIcon,
} from 'lucide-react';
import { User, PlanTier } from '../types';
import { SiteBrandingConfig } from '../data/blogAndBrandingData';
import { ThemeToggle } from './ThemeToggle';
import { AsronLogo } from './AsronLogo';

interface Props {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  siteBranding?: SiteBrandingConfig;
  onOpenDailyWorkout: () => void;
  onOpenDiagnostic: () => void;
  onOpenPaywall: () => void;
  onOpenTelegramLogs: () => void;
  onSwitchUserRole: () => void;
  onOpenAuthModal: (mode?: 'signin' | 'signup') => void;
  onOpenProfileSearch?: () => void;
  onOpenCurrentUserProfile?: () => void;
  onOpenMilestoneModal?: (days?: number) => void;
  unreadAlertCount: number;
}

export const Header: React.FC<Props> = ({
  user,
  activeTab,
  setActiveTab,
  siteBranding,
  onOpenDailyWorkout,
  onOpenDiagnostic,
  onOpenPaywall,
  onOpenTelegramLogs,
  onSwitchUserRole,
  onOpenAuthModal,
  onOpenProfileSearch,
  onOpenCurrentUserProfile,
  onOpenMilestoneModal,
  unreadAlertCount,
}) => {
  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const isPro = user.planTier === 'PRO';

  const brandName = siteBranding?.brandName || 'ASRON SAT';
  const brandTagline = siteBranding?.brandTagline || 'Digital SAT Platform';
  const logoIcon = siteBranding?.logoIcon || 'Σ';
  const isLandingOrBlog = activeTab === 'landing' || activeTab === 'blog';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/95 dark:bg-[#13161F]/95 backdrop-blur-md border-b border-[#E8E2D5] dark:border-[#262B3D] select-none font-sans transition-colors">
      {/* Main Nav Header */}
      <div className="px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Left Section: Active View Title / Breadcrumbs or Logo */}
        <div className="flex items-center gap-4">
          {isLandingOrBlog ? (
            <div
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-3 cursor-pointer select-none"
            >
              <AsronLogo size={36} variant="mark-only" />
              <div>
                <div className="text-base font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] tracking-tight leading-none flex items-center gap-1.5">
                  <span>{brandName}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#0B1B3D]/10 dark:bg-blue-900/40 text-[#0B1B3D] dark:text-blue-400 border border-[#0B1B3D]/20 dark:border-blue-800">
                    {siteBranding?.logoBadgeYear || '2026'}
                  </span>
                </div>
                <div className="text-[10px] uppercase font-mono tracking-wider text-[#78716C] dark:text-[#94A3B8] mt-0.5">
                  {brandTagline}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('landing')}
                  className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer"
                >
                  {brandName}
                </button>
                <span className="text-[10px] text-[#A8A29E]">•</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
                  Bosh Sahifa
                </span>
              </div>
              <div className="text-sm font-extrabold text-[#1C1917] dark:text-[#EAEBED] capitalize">
                {activeTab === 'dashboard' && 'Bosh Sahifa • Student Mission Control'}
                {activeTab === 'vault' && 'AI Mistake Vault (Leitner SRS)'}
                {activeTab === 'bluebook' && 'Official 2-Stage MST Testing Center'}
                {activeTab === 'qbank' && 'Digital SAT Question Bank (3,000+)'}
                {activeTab === 'roadmap' && '30-Day Score Growth Roadmap'}
                {activeTab === 'community' && 'Community & Live Study Cohorts'}
                {activeTab === 'blog' && 'Blog & Social Strategy Guides'}
                {activeTab === 'admin' && 'Staff Verification & Plan Manager'}
                {activeTab === 'profile' && 'Talaba Portfeli & Shaxsiy Profil'}
                {activeTab === 'arena' && 'SAT Multiplayer Arena & Real-time Duels'}
              </div>
            </div>
          )}
        </div>

        {/* Middle Navigation (Landing / Blog pages) */}
        {isLandingOrBlog && (
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-[#57534E] dark:text-[#94A3B8]">
            <button
              onClick={() => setActiveTab('landing')}
              className={`hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer ${
                activeTab === 'landing' ? 'text-[#2563EB] dark:text-[#4EA8DE] font-bold' : ''
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-1 hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer ${
                activeTab === 'blog' ? 'text-[#2563EB] dark:text-[#4EA8DE] font-bold' : ''
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Blog & Social</span>
            </button>
            <button
              onClick={onOpenDiagnostic}
              className="hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer"
            >
              Diagnostic Test
            </button>
            <button
              onClick={onOpenDailyWorkout}
              className="hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer"
            >
              10-Min Drills
            </button>
            <button
              onClick={onOpenPaywall}
              className="hover:text-[#2563EB] dark:hover:text-[#4EA8DE] transition-colors cursor-pointer"
            >
              Pricing Plans
            </button>
          </div>
        )}

        {/* Right Section: Controls, Search, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Top Header Theme Toggle */}
          <ThemeToggle />

          {isLandingOrBlog ? (
            <>
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="px-4 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#181B26] hover:bg-[#F3EFE6] dark:hover:bg-[#202534] border border-[#D6CEBE] dark:border-[#262B3D] text-[#1C1917] dark:text-[#EAEBED] text-xs font-semibold transition-colors cursor-pointer"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#3B82F6] dark:hover:bg-[#2563EB] text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Sign Up Free
              </button>
            </>
          ) : (
            <>
              {/* Profile Search Button */}
              {onOpenProfileSearch && (
                <button
                  onClick={onOpenProfileSearch}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] dark:bg-[#181B26] hover:bg-[#F3EFE6] dark:hover:bg-[#202534] border border-[#E8E2D5] dark:border-[#262B3D] text-[#57534E] dark:text-[#94A3B8] hover:text-[#1C1917] dark:hover:text-[#EAEBED] text-xs font-semibold transition-colors cursor-pointer"
                  title="Talabalar profillarini qidirish"
                >
                  <Search className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#4EA8DE]" />
                  <span className="hidden sm:inline">Search Profiles</span>
                </button>
              )}

              {/* Current User Quick Profile Button */}
              <div
                onClick={onOpenCurrentUserProfile}
                className="flex items-center gap-2.5 pl-2 pr-3.5 py-1.5 rounded-xl bg-[#FAF7F2] dark:bg-[#181B26] hover:bg-[#F3EFE6] dark:hover:bg-[#202534] border border-[#E8E2D5] dark:border-[#262B3D] hover:border-[#2563EB]/40 dark:hover:border-blue-500/40 cursor-pointer transition-all shadow-2xs"
                title="Mening Profilim sahifasini ochish"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-[#E8E2D5] dark:border-[#262B3D]"
                />
                <div className="text-left">
                  <div className="text-[12px] font-bold text-[#1C1917] dark:text-[#EAEBED] leading-tight flex items-center gap-1">
                    <span>{user.fullName.split(' ')[0]}</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-900/40 text-[#2563EB] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      {user.planTier}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
                    @{user.username || 'user'}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

