import React, { useState } from 'react';
import {
  LayoutGrid,
  Zap,
  Brain,
  BookOpenCheck,
  Layers,
  BookA,
  MessageSquareQuote,
  Swords,
  Bot,
  Target,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldAlert,
} from 'lucide-react';
import { User } from '../types';
import { SiteBrandingConfig } from '../data/blogAndBrandingData';
import { SidebarFooter } from './SidebarFooter';
import { AsronLogo } from './AsronLogo';

export interface AppSidebarProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  siteBranding?: SiteBrandingConfig;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenDailyWorkout?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenPaywall?: () => void;
  onOpenVocabTrainer?: () => void;
  onOpenMultiplayerArena?: () => void;
  onOpenSocraticTutor?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenTelegramLogs?: () => void;
  onSwitchUserRole?: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup') => void;
  onOpenAdminLogin?: () => void;
  onLogout?: () => void;
  unreadAlertCount?: number;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  activeTab,
  setActiveTab,
  siteBranding,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapse,
  onOpenDailyWorkout,
  onOpenDiagnostic,
  onOpenPaywall,
  onOpenVocabTrainer,
  onOpenMultiplayerArena,
  onOpenSocraticTutor,
  onOpenSettings,
  onOpenProfile,
  onOpenTelegramLogs,
  onSwitchUserRole,
  onOpenAuthModal,
  onOpenAdminLogin,
  onLogout,
  unreadAlertCount = 0,
}) => {
  // Local state with localStorage persistence for fallback / controlled syncing
  const [internalCollapsed, setInternalCollapsed] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('aurasat_sidebar_collapsed');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return controlledIsCollapsed ?? false;
  });

  const isCollapsed = controlledIsCollapsed !== undefined ? controlledIsCollapsed : internalCollapsed;

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setInternalCollapsed(nextVal);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('aurasat_sidebar_collapsed', String(nextVal));
    }
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  const brandName = siteBranding?.brandName || 'ASRON SAT';
  const brandTagline = siteBranding?.brandTagline || 'Digital SAT Platform';
  const logoIcon = siteBranding?.logoIcon || 'Σ';

  // GROUP 1: ASOSIY
  const coreNavItems = [
    {
      id: 'dashboard',
      label: 'Bosh Sahifa',
      icon: LayoutGrid,
      onClick: () => setActiveTab('dashboard'),
    },
    {
      id: 'daily-workout',
      label: 'Kunlik Mashq',
      icon: Zap,
      onClick: () => {
        if (onOpenDailyWorkout) {
          onOpenDailyWorkout();
        } else {
          setActiveTab('dashboard');
        }
      },
    },
    {
      id: 'vault',
      label: 'Xatolar Ombori',
      icon: Brain,
      onClick: () => setActiveTab('vault'),
    },
  ];

  // GROUP 2: TEST VA AMALIYOT
  const practiceNavItems = [
    {
      id: 'bluebook',
      label: 'Bluebook Testlar',
      icon: BookOpenCheck,
      onClick: () => setActiveTab('bluebook'),
    },
    {
      id: 'qbank',
      label: 'Savollar Banki',
      icon: Layers,
      onClick: () => setActiveTab('qbank'),
    },
    {
      id: 'vocab',
      label: 'SAT Lug‘at',
      icon: BookA,
      onClick: () => {
        if (onOpenVocabTrainer) {
          onOpenVocabTrainer();
        } else {
          setActiveTab('dashboard');
        }
      },
    },
  ];

  // GROUP 3: HAMJAMIYAT VA REJA
  const socialAndAiNavItems = [
    {
      id: 'community',
      label: 'Hamjamiyat & Chat',
      icon: MessageSquareQuote,
      onClick: () => setActiveTab('community'),
    },
    {
      id: 'arena',
      label: 'Multiplayer Arena',
      icon: Swords,
      onClick: () => {
        if (onOpenMultiplayerArena) {
          onOpenMultiplayerArena();
        } else {
          setActiveTab('arena');
        }
      },
    },
    {
      id: 'ai-tutor',
      label: 'AI Repititor',
      icon: Bot,
      onClick: () => {
        if (onOpenSocraticTutor) {
          onOpenSocraticTutor();
        } else if (onOpenDiagnostic) {
          onOpenDiagnostic();
        } else {
          onOpenPaywall?.();
        }
      },
    },
    {
      id: 'roadmap',
      label: '30-Kunlik Reja',
      icon: Target,
      onClick: () => setActiveTab('roadmap'),
    },
    ...(user.role === 'ADMIN'
      ? [
          {
            id: 'admin',
            label: 'Admin Panel',
            icon: ShieldAlert,
            onClick: () => setActiveTab('admin'),
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`relative h-screen sticky top-0 shrink-0 z-30 select-none flex flex-col justify-between transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-56'
      } bg-[#FAF8F5] dark:bg-[#0F1117] border-r border-[#EBE5DF] dark:border-[#262B3D] text-[#1E1B18] dark:text-[#EAEBED] overflow-visible`}
    >
      {/* ========================================================================= */}
      {/* 1. HEADER (Brand & Collapse/Expand Toggle) */}
      {/* ========================================================================= */}
      {isCollapsed ? (
        // COLLAPSED HEADER: Centered logo with smart hover-reveal expand button
        <div className="relative h-16 py-4 flex items-center justify-center border-b border-[#EBE5DF] dark:border-[#262B3D] group">
          <button
            type="button"
            onClick={handleToggleCollapse}
            aria-label="Kengaytirish (Expand sidebar)"
            className="w-9 h-9 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center font-extrabold text-sm shadow-xs border border-[#0B1B3D]/30 dark:border-[#262B3D] hover:bg-[#122756] transition-all duration-200 cursor-pointer relative overflow-hidden p-1.5"
          >
            {/* Default State: Asron Logo */}
            <span className="transition-all duration-200 group-hover:opacity-0 group-hover:scale-75 group-hover:rotate-12 w-full h-full flex items-center justify-center">
              <AsronLogo size={22} variant="monochrome" />
            </span>

            {/* Hover State: Reveal Expand Icon */}
            <span className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 text-[#FAF8F5]">
              <PanelLeftOpen size={17} />
            </span>
          </button>

          {/* Collapsed Header Tooltip */}
          <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#0B1B3D] dark:bg-[#181B26] text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 border border-[#3D405B]/30 dark:border-[#262B3D] flex items-center gap-1.5">
            <span>Kengaytirish</span>
            <span className="text-[10px] text-[#A8A29E] dark:text-[#94A3B8] font-mono">(w-56)</span>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#0B1B3D] dark:border-r-[#181B26]" />
          </div>
        </div>
      ) : (
        // EXPANDED HEADER: Clean Flex Row with Logo + Text & Collapse Button
        <div className="h-16 px-3.5 py-4 border-b border-[#EBE5DF] dark:border-[#262B3D] bg-[#FAF8F5] dark:bg-[#0F1117] flex items-center justify-between gap-2 shrink-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group min-w-0"
            title={`${brandName} - Bosh Sahifa`}
          >
            {/* Logo Square */}
            <div className="w-8 h-8 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center shadow-xs border border-[#0B1B3D]/30 dark:border-[#262B3D] group-hover:scale-105 transition-transform shrink-0 p-1">
              <AsronLogo size={22} variant="monochrome" />
            </div>

            {/* Title and Subtitle */}
            <div className="min-w-0 leading-tight">
              <div className="font-extrabold text-sm tracking-tight text-[#0B1B3D] dark:text-[#EAEBED] truncate flex items-center gap-1.5">
                <span>{brandName}</span>
              </div>
              <p className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] font-medium truncate mt-0.5">
                {brandTagline}
              </p>
            </div>
          </div>

          {/* Compact Collapse Toggle Button */}
          <button
            type="button"
            onClick={handleToggleCollapse}
            aria-label="Menyuni yig'ish (Collapse sidebar)"
            className="p-1.5 rounded-lg text-[#78716C] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-[#EAEBED] hover:bg-[#EBE5DF]/60 dark:hover:bg-[#181B26] transition-colors cursor-pointer shrink-0"
            title="Menyuni yig'ish"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NAVIGATION MENU (3 Clean Sections, No Item Badges) */}
      {/* ========================================================================= */}
      <nav className="flex-1 px-2 py-3 space-y-4 overflow-y-auto overflow-x-visible [&::-webkit-scrollbar]:hidden scrollbar-none">
        {/* SECTION 1: ASOSIY */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
              Asosiy
            </div>
          )}
          {coreNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'justify-between px-3 py-2'
                  } rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1B18] dark:bg-[#181B26] text-white dark:text-[#EAEBED] font-medium shadow-sm border border-transparent dark:border-[#262B3D]'
                      : 'text-[#57534E] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-[#EAEBED] hover:bg-[#EFEAE3]/80 dark:hover:bg-[#181B26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-white dark:text-[#EAEBED]' : 'text-[#78716C] dark:text-[#94A3B8] group-hover:text-[#1E1B18] dark:group-hover:text-[#EAEBED]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Active Indicator Dot */}
                  {!isCollapsed && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51] shrink-0" />
                  )}
                  {isCollapsed && isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51]" />
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1E1B18] dark:bg-[#181B26] text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 border border-[#3D405B]/30 dark:border-[#262B3D] flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B18] dark:border-r-[#181B26]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SECTION 2: TEST VA AMALIYOT */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
              Test va Amaliyot
            </div>
          )}
          {practiceNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'justify-between px-3 py-2'
                  } rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1B18] dark:bg-[#181B26] text-white dark:text-[#EAEBED] font-medium shadow-sm border border-transparent dark:border-[#262B3D]'
                      : 'text-[#57534E] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-[#EAEBED] hover:bg-[#EFEAE3]/80 dark:hover:bg-[#181B26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-white dark:text-[#EAEBED]' : 'text-[#78716C] dark:text-[#94A3B8] group-hover:text-[#1E1B18] dark:group-hover:text-[#EAEBED]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Active Indicator Dot */}
                  {!isCollapsed && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51] shrink-0" />
                  )}
                  {isCollapsed && isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51]" />
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1E1B18] dark:bg-[#181B26] text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 border border-[#3D405B]/30 dark:border-[#262B3D] flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B18] dark:border-r-[#181B26]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* SECTION 3: HAMJAMIYAT VA REJA */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2.5 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
              Hamjamiyat va Reja
            </div>
          )}
          {socialAndAiNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id} className="relative group">
                <button
                  type="button"
                  onClick={item.onClick}
                  aria-label={item.label}
                  className={`w-full flex items-center ${
                    isCollapsed ? 'justify-center h-10 w-10 mx-auto' : 'justify-between px-3 py-2'
                  } rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1E1B18] dark:bg-[#181B26] text-white dark:text-[#EAEBED] font-medium shadow-sm border border-transparent dark:border-[#262B3D]'
                      : 'text-[#57534E] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-[#EAEBED] hover:bg-[#EFEAE3]/80 dark:hover:bg-[#181B26]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      size={18}
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-white dark:text-[#EAEBED]' : 'text-[#78716C] dark:text-[#94A3B8] group-hover:text-[#1E1B18] dark:group-hover:text-[#EAEBED]'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {/* Active Indicator Dot */}
                  {!isCollapsed && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51] shrink-0" />
                  )}
                  {isCollapsed && isActive && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E07A5F] dark:bg-[#E76F51]" />
                  )}
                </button>

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1E1B18] dark:bg-[#181B26] text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 border border-[#3D405B]/30 dark:border-[#262B3D] flex items-center gap-1.5">
                    <span>{item.label}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B18] dark:border-r-[#181B26]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. REFACTORED PINNED FOOTER PROFILE WITH SHADCN DROPDOWN (No Bottom Icons) */}
      {/* ========================================================================= */}
      <SidebarFooter
        user={user}
        isCollapsed={isCollapsed}
        activeTab={activeTab}
        onOpenProfile={onOpenProfile || (() => setActiveTab('profile'))}
        onOpenSettings={onOpenSettings || (() => setActiveTab('profile'))}
        onOpenPaywall={onOpenPaywall}
        onOpenAdminLogin={onOpenAdminLogin}
        onLogout={onLogout}
      />
    </aside>
  );
};
