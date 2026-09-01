import React, { useState } from 'react';
import {
  User as UserIcon,
  Settings,
  CreditCard,
  LogOut,
  MoreVertical,
  Crown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from './ui/dropdown-menu';
import { User } from '../types';
import { supabase, signOutUser } from '../lib/supabase';

export interface SidebarFooterProps {
  user: User;
  isCollapsed?: boolean;
  activeTab?: string;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onOpenPaywall?: () => void;
  onOpenAdminLogin?: () => void;
  onLogout?: () => void;
  router?: {
    push: (url: string) => void;
  };
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  user,
  isCollapsed = false,
  activeTab,
  onOpenProfile,
  onOpenSettings,
  onOpenPaywall,
  onOpenAdminLogin,
  onLogout,
  router,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const isPro = user.planTier === 'PRO' || user.planTier === 'VIP';
  const isStandard = user.planTier === 'STANDARD';

  // Navigation handlers supporting Next.js router or tab callbacks
  const navigateTo = (path: string, fallbackAction?: () => void) => {
    if (router && typeof router.push === 'function') {
      router.push(path);
      return;
    }
    if (fallbackAction) {
      fallbackAction();
      return;
    }
    // Deep link fallback for SPA / hash router
    if (typeof window !== 'undefined') {
      const tab = path.replace('/dashboard/', '').replace('/', '');
      window.location.hash = `#/${tab}`;
    }
  };

  const handleProfileClick = () => {
    navigateTo('/dashboard/profile', onOpenProfile);
  };

  const handleSettingsClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      navigateTo('/dashboard/profile', onOpenProfile);
    }
  };

  const handleBillingClick = () => {
    if (onOpenPaywall) {
      onOpenPaywall();
    } else {
      navigateTo('/dashboard/billing', onOpenPaywall);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      // Supabase auth sign-out
      if (supabase && supabase.auth) {
        await supabase.auth.signOut().catch(() => {});
      }
      await signOutUser().catch(() => {});

      if (onLogout) {
        onLogout();
      } else if (router && typeof router.push === 'function') {
        router.push('/login');
      } else if (typeof window !== 'undefined') {
        window.location.hash = '#/landing';
      }
    } catch (error) {
      console.error('Error during signOut:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Avatar source fallback
  const avatarSrc =
    user.avatarUrl ||
    `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
      user.id || user.username || 'Student'
    )}`;

  // =========================================================================
  // COLLAPSED VIEW (isCollapsed === true)
  // =========================================================================
  if (isCollapsed) {
    return (
      <div className="sticky bottom-0 z-20 w-full bg-[#FAF8F5]/95 dark:bg-[#0F1117]/95 backdrop-blur-md p-2.5 border-t border-[#EBE5DF] dark:border-[#262B3D] flex items-center justify-center shrink-0">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <div className="relative group">
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Foydalanuvchi menyusi"
                className="w-10 h-10 rounded-2xl bg-white/90 dark:bg-[#181B26] border border-[#E5E0D8] dark:border-[#262B3D] p-0.5 hover:border-[#1E1B18] dark:hover:border-[#FAF8F5] transition-all cursor-pointer relative shadow-2xs flex items-center justify-center overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1E1B18]/20"
              >
                <img
                  src={avatarSrc}
                  alt={user.fullName || 'User'}
                  className="w-full h-full rounded-xl object-cover"
                />
                {/* Green Online Status Dot */}
                <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#181B26] rounded-full shadow-xs" />
              </button>
            </DropdownMenuTrigger>

            {/* Hover Tooltip (only when menu is closed) */}
            {!dropdownOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#1E1B18] dark:bg-[#181B26] text-white text-xs font-medium rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 border border-[#3D405B]/30 dark:border-[#262B3D] flex items-center gap-1.5">
                <div className="text-left">
                  <div className="font-semibold text-white leading-tight">
                    {user.fullName || 'Student'}
                  </div>
                  <div className="text-[10px] text-[#A8A29E] dark:text-[#94A3B8] font-mono">
                    @{user.username || 'user'}
                  </div>
                </div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#1E1B18] dark:border-r-[#181B26]" />
              </div>
            )}
          </div>

          {/* Collapsed Dropdown Content */}
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={12}
            className="w-56 p-1.5 bg-[#FAF8F5] dark:bg-[#181B26] border border-[#E5E0D8] dark:border-[#262B3D] rounded-2xl shadow-xl shadow-black/8 dark:shadow-black/50 font-sans z-50"
          >
            <div className="px-2.5 py-2 border-b border-[#EBE5DF]/80 dark:border-[#262B3D] mb-1">
              <div className="font-semibold text-xs text-[#1E1B18] dark:text-[#EAEBED] truncate">
                {user.fullName || 'Student'}
              </div>
              <div className="text-[10px] text-[#A8A29E] dark:text-[#94A3B8] font-mono truncate">
                @{user.username || 'user'} • {user.planTier || 'FREE'}
              </div>
            </div>

            <DropdownMenuItem
              onClick={handleProfileClick}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
            >
              <UserIcon size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
              <span>Mening Profilim</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleSettingsClick}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
            >
              <Settings size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
              <span>Platforma Sozlamalari</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleBillingClick}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
            >
              <CreditCard size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
              <span>Obuna & Tariflar</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-[#EBE5DF] dark:bg-[#262B3D]" />

            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer transition-colors"
            >
              <LogOut size={14} className="text-red-500 dark:text-red-400" />
              <span>{isSigningOut ? 'Chiqilmoqda...' : 'Hisobdan Chiqish'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // =========================================================================
  // EXPANDED VIEW (isCollapsed === false)
  // =========================================================================
  return (
    <div className="sticky bottom-0 z-20 w-full bg-[#FAF8F5]/95 dark:bg-[#0F1117]/95 backdrop-blur-md p-3 border-t border-[#EBE5DF] dark:border-[#262B3D] shrink-0 space-y-2">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        {/* Pinned User Profile Card with Interactive Profile Navigation */}
        <div
          onClick={handleProfileClick}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-white/80 dark:bg-[#181B26] border border-[#E5E0D8] dark:border-[#262B3D] hover:bg-white dark:hover:bg-[#202534] hover:border-[#D5CEC5] dark:hover:border-[#3D405B] transition-all cursor-pointer shadow-2xs group"
          title="Mening Profilim sahifasiga o'tish"
        >
          {/* Left: Avatar + Green Online Dot */}
          <div className="relative shrink-0 mr-2.5">
            <img
              src={avatarSrc}
              alt={user.fullName || 'User'}
              className="w-8 h-8 rounded-xl object-cover border border-[#EBE5DF] dark:border-[#262B3D] bg-white dark:bg-[#181B26] shadow-2xs"
            />
            {/* Clean Green Online Status Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#181B26] rounded-full shadow-xs" />
          </div>

          {/* Middle: Name, Handle & Tier Badge */}
          <div className="flex-1 min-w-0 text-left leading-tight pr-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-[#1E1B18] dark:text-[#EAEBED] truncate group-hover:text-[#E07A5F] dark:group-hover:text-[#E76F51] transition-colors">
                {user.fullName || 'Student'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono truncate">
                @{user.username || 'user'}
              </span>
              {/* Tier Badge */}
              {isPro ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 flex items-center gap-0.5 shrink-0">
                  <Crown size={9} className="text-amber-600 dark:text-amber-400 fill-amber-500" />
                  <span>PRO</span>
                </span>
              ) : isStandard ? (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 shrink-0">
                  STD
                </span>
              ) : (
                <span className="text-[9px] font-mono font-medium px-1.5 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shrink-0">
                  FREE
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Actions Menu Trigger */}
          <div className="shrink-0 pl-1">
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                aria-label="Amallar menyusini ochish"
                className="p-1 rounded-lg text-[#78716C] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-[#EAEBED] hover:bg-[#EFEAE3] dark:hover:bg-[#202534] transition-colors cursor-pointer focus:outline-none"
                title="Qo'shimcha amallar"
              >
                <MoreVertical size={15} />
              </button>
            </DropdownMenuTrigger>
          </div>
        </div>

        {/* Dropdown Actions Menu Content (Aligned top-right) */}
        <DropdownMenuContent
          side="top"
          align="end"
          sideOffset={8}
          className="w-56 p-1.5 bg-[#FAF8F5] dark:bg-[#181B26] border border-[#E5E0D8] dark:border-[#262B3D] rounded-2xl shadow-xl shadow-black/8 dark:shadow-black/50 font-sans z-50 animate-in fade-in-0 zoom-in-95"
        >
          <div className="px-2.5 py-2 border-b border-[#EBE5DF]/80 dark:border-[#262B3D] mb-1">
            <div className="font-semibold text-xs text-[#1E1B18] dark:text-[#EAEBED] truncate">
              {user.fullName || 'Student'}
            </div>
            <div className="text-[10px] text-[#A8A29E] dark:text-[#94A3B8] font-mono truncate">
              {user.email || 'student@asronsat.uz'}
            </div>
          </div>

          {/* 👤 Mening Profilim */}
          <DropdownMenuItem
            onClick={handleProfileClick}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
          >
            <UserIcon size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
            <span>Mening Profilim</span>
          </DropdownMenuItem>

          {/* ⚙️ Platforma Sozlamalari */}
          <DropdownMenuItem
            onClick={handleSettingsClick}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
          >
            <Settings size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
            <span>Platforma Sozlamalari</span>
          </DropdownMenuItem>

          {/* 💳 Obuna & Tariflar */}
          <DropdownMenuItem
            onClick={handleBillingClick}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-[#1E1B18] dark:text-[#EAEBED] hover:bg-white dark:hover:bg-[#202534] rounded-xl cursor-pointer transition-colors"
          >
            <CreditCard size={14} className="text-[#78716C] dark:text-[#94A3B8]" />
            <span>Obuna & Tariflar</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 bg-[#EBE5DF] dark:bg-[#262B3D]" />

          {/* 🚪 Hisobdan Chiqish */}
          <DropdownMenuItem
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut size={14} className="text-red-500 dark:text-red-400" />
            <span>{isSigningOut ? 'Chiqilmoqda...' : 'Hisobdan Chiqish'}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default SidebarFooter;
