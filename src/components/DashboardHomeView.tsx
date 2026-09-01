import React, { useState } from 'react';
import {
  Flame,
  Search,
  User as UserIcon,
  ChevronDown,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Award
} from 'lucide-react';
import { User, MistakeVaultItem, MockTest, Question } from '../types';
import { ExamCountdown } from './ExamCountdown';
import { DailyWorkoutCard } from './DailyWorkoutCard';
import { PerformanceMetrics } from './PerformanceMetrics';
import { QuickHubs } from './QuickHubs';
import { VocabTrainerModal } from './VocabTrainerModal';
import { MultiplayerArenaModal } from './MultiplayerArenaModal';

interface Props {
  user: User;
  mistakes: MistakeVaultItem[];
  mockTests: MockTest[];
  onOpenDailyWorkout: () => void;
  onOpenDiagnostic: () => void;
  onOpenMistakeVault: () => void;
  onStartBluebookTest: (test: MockTest) => void;
  onOpenQuestionBank: (subSkill?: string) => void;
  onOpenCommunity: () => void;
  onOpenRoadmap: () => void;
  onOpenPaywall: () => void;
  onOpenSocraticTutor: (question: Question) => void;
  onOpenMilestoneModal?: (days?: number) => void;
  onOpenProfile?: () => void;
  siteBranding?: any;
}

export const DashboardHomeView: React.FC<Props> = ({
  user,
  mistakes,
  mockTests,
  onOpenDailyWorkout,
  onOpenDiagnostic,
  onOpenMistakeVault,
  onStartBluebookTest,
  onOpenQuestionBank,
  onOpenCommunity,
  onOpenRoadmap,
  onOpenPaywall,
  onOpenSocraticTutor,
  onOpenMilestoneModal,
  onOpenProfile,
  siteBranding,
}) => {
  const isPro = user.planTier === 'PRO';
  const brandName = siteBranding?.brandName || 'ASRON SAT';

  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Modals for Quick Hubs
  const [isVocabModalOpen, setIsVocabModalOpen] = useState(false);
  const [isArenaModalOpen, setIsArenaModalOpen] = useState(false);

  // 7-Day Habit Tracker State
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(5); // default Saturday (Today)

  const weeklyHabits = [
    { day: 'Mon', fullDay: 'Monday', date: 'Aug 25', questions: 28, minutes: 42, mathCount: 16, rwCount: 12, accuracy: 93, completed: true, xpEarned: 330 },
    { day: 'Tue', fullDay: 'Tuesday', date: 'Aug 26', questions: 35, minutes: 55, mathCount: 22, rwCount: 13, accuracy: 89, completed: true, xpEarned: 410 },
    { day: 'Wed', fullDay: 'Wednesday', date: 'Aug 27', questions: 20, minutes: 30, mathCount: 10, rwCount: 10, accuracy: 95, completed: true, xpEarned: 260 },
    { day: 'Thu', fullDay: 'Thursday', date: 'Aug 28', questions: 40, minutes: 60, mathCount: 25, rwCount: 15, accuracy: 91, completed: true, xpEarned: 490 },
    { day: 'Fri', fullDay: 'Friday', date: 'Aug 29', questions: 30, minutes: 48, mathCount: 18, rwCount: 12, accuracy: 94, completed: true, xpEarned: 360 },
    { day: 'Sat', fullDay: 'Today (Saturday)', date: 'Aug 30', questions: 15, minutes: 25, mathCount: 10, rwCount: 5, accuracy: 96, completed: true, isToday: true, xpEarned: 210 },
    { day: 'Sun', fullDay: 'Sunday (Plan)', date: 'Aug 31', questions: 0, minutes: 0, mathCount: 0, rwCount: 0, accuracy: 0, completed: false, targetGoal: 30 },
  ];

  const totalWeeklyQuestions = weeklyHabits.reduce((sum, h) => sum + h.questions, 0);
  const totalWeeklyMinutes = weeklyHabits.reduce((sum, h) => sum + h.minutes, 0);
  const weeklyTarget = 180;
  const weeklyProgressPercent = Math.min(100, Math.round((totalWeeklyQuestions / weeklyTarget) * 100));
  const activeDayData = weeklyHabits[selectedDayIndex];

  const handleLaunchFirstBluebook = () => {
    if (mockTests && mockTests.length > 0) {
      onStartBluebookTest(mockTests[0]);
    } else {
      onOpenQuestionBank();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0A0F1D] text-[#1E1B18] dark:text-[#F8FAFC] font-sans pb-16">
      
      {/* EXECUTIVE TOP BAR */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0A0F1D]/95 backdrop-blur-xs border-b border-[#E5E0D8] dark:border-[#1E293B] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand and Page Indicator */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1E1B18] text-[#FAF8F5] dark:bg-[#F8FAFC] dark:text-[#0A0F1D] flex items-center justify-center font-bold text-sm tracking-tight">
              {siteBranding?.logoIcon || 'Σ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#1E1B18] dark:text-[#F8FAFC]">
                  {brandName}
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8] text-[10px] font-mono uppercase">
                  Overview
                </span>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={14} className="text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    onOpenQuestionBank(searchQuery.trim());
                  }
                }}
                placeholder="Search question bank, skills, formulas..."
                className="w-full pl-8 pr-12 py-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-xs text-[#1E1B18] dark:text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#1E1B18] dark:focus:border-[#94A3B8] transition-colors"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0A0F1D] px-1 py-0.5 rounded-sm border border-[#E5E0D8] dark:border-[#1E293B]">
                ↵
              </span>
            </div>
          </div>

          {/* Streak, Tier Indicator & User Profile Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Streak Badge */}
            <button
              onClick={() => onOpenMilestoneModal?.(user.streakDays)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-xs font-mono text-[#1E1B18] dark:text-[#F8FAFC] hover:border-[#1E1B18] dark:hover:border-[#94A3B8] transition-colors cursor-pointer"
              title="Active Streak"
            >
              <Flame size={14} className="text-[#E07A5F]" />
              <span>{user.streakDays || 5}d Streak</span>
            </button>

            {/* Plan Tier Badge */}
            {isPro ? (
              <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#1E1B18] dark:text-[#F8FAFC] text-xs font-mono font-semibold">
                PRO ACTIVE
              </span>
            ) : (
              <button
                onClick={onOpenPaywall}
                className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg bg-[#1E1B18] hover:bg-[#2A2622] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Upgrade to Pro
              </button>
            )}

            {/* User Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-md bg-[#1E1B18] text-white flex items-center justify-center text-xs font-semibold">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'S'}
                </div>
                <span className="text-xs font-medium text-[#1E1B18] dark:text-[#F8FAFC] hidden sm:block max-w-[90px] truncate">
                  {user.fullName || 'Student'}
                </span>
                <ChevronDown size={13} className="text-[#64748B] dark:text-[#94A3B8]" />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] rounded-xl shadow-md p-1.5 space-y-1 z-40 text-xs text-[#1E1B18] dark:text-[#F8FAFC]">
                  <div className="p-2 border-b border-[#E5E0D8] dark:border-[#1E293B]">
                    <div className="font-semibold truncate">{user.fullName || 'Student'}</div>
                    <div className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] truncate">{user.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenProfile?.();
                    }}
                    className="w-full text-left p-1.5 rounded-md hover:bg-[#FAF8F5] dark:hover:bg-[#0A0F1D] flex items-center gap-2 font-medium cursor-pointer transition-colors"
                  >
                    <UserIcon size={14} className="text-[#64748B] dark:text-[#94A3B8]" />
                    <span>My Account</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenDiagnostic();
                    }}
                    className="w-full text-left p-1.5 rounded-md hover:bg-[#FAF8F5] dark:hover:bg-[#0A0F1D] flex items-center gap-2 font-medium cursor-pointer transition-colors"
                  >
                    <TrendingUp size={14} className="text-[#E07A5F]" />
                    <span>Diagnostic Forecast</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenPaywall();
                    }}
                    className="w-full text-left p-1.5 rounded-md hover:bg-[#FAF8F5] dark:hover:bg-[#0A0F1D] flex items-center gap-2 font-medium cursor-pointer transition-colors"
                  >
                    <Award size={14} className="text-[#0F766E] dark:text-[#14B8A6]" />
                    <span>Manage Subscription</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-7 space-y-7">
        
        {/* 1. LIVE EXAM COUNTDOWN */}
        <section>
          <ExamCountdown
            targetDate={user.targetExamDate || '2026-10-04T08:00:00'}
            onOpenDiagnostic={onOpenDiagnostic}
          />
        </section>

        {/* 2. DAILY WORKOUT CARD (5-Question Habit Loop) */}
        <section>
          <DailyWorkoutCard
            user={user}
            onStartWorkout={onOpenDailyWorkout}
            targetDomain={user.weakestSubSkills?.[0] || 'Advanced Math: Nonlinear Equations & Parabolas'}
          />
        </section>

        {/* 3. PERFORMANCE METRICS 3-CARD GRID */}
        <section>
          <PerformanceMetrics
            user={user}
            mistakes={mistakes}
            onOpenMistakeVault={onOpenMistakeVault}
            onOpenDiagnostic={onOpenDiagnostic}
            onOpenPaywall={onOpenPaywall}
          />
        </section>

        {/* 4. PRACTICE MODULES */}
        <section>
          <QuickHubs
            onOpenBluebook={handleLaunchFirstBluebook}
            onOpenQuestionBank={() => onOpenQuestionBank()}
            onOpenVocabTrainer={() => setIsVocabModalOpen(true)}
            onOpenMultiplayerArena={() => setIsArenaModalOpen(true)}
            mockTestsCount={mockTests?.length || 6}
            questionsCount={3200}
          />
        </section>

        {/* 5. 7-DAY HABIT TRACKER (Data-dense table/bar matrix) */}
        <section className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#64748B] dark:text-[#94A3B8] px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B]">
                  Consistency Matrix
                </span>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  Streak: <strong className="text-[#E07A5F] dark:text-[#E76F51]">{user.streakDays || 5} Days</strong>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] dark:text-[#F8FAFC] mt-1">
                7-Day Study Cadence & Accuracy
              </h3>
            </div>

            {/* Weekly summary badge */}
            <div className="flex items-center gap-3 bg-[#FAF8F5] dark:bg-[#0A0F1D] p-2.5 px-3.5 rounded-xl border border-[#E5E0D8] dark:border-[#1E293B]">
              <div className="text-right">
                <div className="text-[9px] text-[#64748B] dark:text-[#94A3B8] uppercase font-mono">Weekly Volume</div>
                <div className="text-xs font-bold font-mono text-[#1E1B18] dark:text-[#F8FAFC]">
                  {totalWeeklyQuestions} <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal">/ {weeklyTarget} items ({weeklyProgressPercent}%)</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#1E1B18] dark:text-[#F8FAFC] flex items-center justify-center font-bold text-xs font-mono">
                {Math.round((totalWeeklyMinutes / 60) * 10) / 10}h
              </div>
            </div>
          </div>

          {/* 7-Days Visual Pillars */}
          <div className="grid grid-cols-7 gap-2 pt-1">
            {weeklyHabits.map((item, idx) => {
              const isSelected = selectedDayIndex === idx;
              const maxDayQ = 45;
              const heightPercent = Math.max(14, Math.min(100, Math.round((item.questions / maxDayQ) * 100)));

              return (
                <button
                  key={item.day}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-colors cursor-pointer text-center group ${
                    isSelected
                      ? 'bg-[#FAF8F5] dark:bg-[#0A0F1D] border-[#1E1B18] dark:border-[#F8FAFC]'
                      : item.isToday
                      ? 'bg-white dark:bg-[#121A2F] border-[#E07A5F]'
                      : item.completed
                      ? 'bg-white dark:bg-[#121A2F] border-[#E5E0D8] dark:border-[#1E293B] hover:border-[#1E1B18] dark:hover:border-[#94A3B8]'
                      : 'bg-[#FAF8F5]/50 dark:bg-[#0A0F1D]/50 border-dashed border-[#E5E0D8] dark:border-[#1E293B] opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#1E1B18] dark:group-hover:text-white">
                    {item.day}
                  </span>

                  {/* Clean Bar Visualization */}
                  <div className="h-16 w-full flex items-end justify-center py-1">
                    <div
                      className={`w-full max-w-[20px] rounded-xs transition-all ${
                        item.completed
                          ? 'bg-[#1E1B18] dark:bg-[#F8FAFC]'
                          : 'bg-[#E5E0D8] dark:bg-[#1E293B]'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <div className="mt-1">
                    <span className="text-[11px] font-mono font-semibold text-[#1E1B18] dark:text-[#F8FAFC] block">
                      {item.questions}
                    </span>
                    <span className="text-[9px] font-mono text-[#64748B] dark:text-[#94A3B8] block">
                      {item.completed ? `${item.minutes}m` : 'Plan'}
                    </span>
                  </div>

                  {item.completed ? (
                    <CheckCircle2 size={12} className="text-[#0F766E] dark:text-[#14B8A6] mt-1" />
                  ) : item.isToday ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] mt-1.5"></span>
                  ) : (
                    <span className="text-[9px] text-[#64748B] dark:text-[#94A3B8] mt-1 font-mono">--</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Drill-Down Details */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-xs text-[#1E1B18] dark:text-[#F8FAFC]">
                  {activeDayData.fullDay} ({activeDayData.date})
                </h4>
                {activeDayData.completed && (
                  <span className="text-[10px] font-mono text-[#0F766E] dark:text-[#14B8A6]">
                    ✓ {activeDayData.accuracy}% Accuracy
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                {activeDayData.completed
                  ? `${activeDayData.questions} questions solved (${activeDayData.mathCount} Math, ${activeDayData.rwCount} R&W) across ${activeDayData.minutes} minutes.`
                  : `Target: 30 questions drill set.`}
              </p>
            </div>

            <button
              onClick={onOpenDailyWorkout}
              className="px-3 py-1.5 rounded-lg bg-[#1E1B18] hover:bg-[#2A2622] dark:bg-[#F8FAFC] dark:hover:bg-white text-white dark:text-[#0A0F1D] font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Play size={12} className="fill-current" />
              <span>Launch Drill</span>
            </button>
          </div>
        </section>

      </main>

      {/* Interactive Modals for Hubs */}
      <VocabTrainerModal
        isOpen={isVocabModalOpen}
        onClose={() => setIsVocabModalOpen(false)}
      />

      <MultiplayerArenaModal
        isOpen={isArenaModalOpen}
        onClose={() => setIsArenaModalOpen(false)}
        currentUser={user}
      />
    </div>
  );
};
