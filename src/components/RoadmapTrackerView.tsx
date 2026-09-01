import React, { useState, useMemo, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Target,
  Flame,
  CheckCircle2,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Sliders,
  Filter,
  Search,
  BookOpen,
  Award,
  ArrowUpRight,
  TrendingUp,
  FileText,
  AlertCircle,
  X,
  Check,
  Zap,
  Edit2
} from 'lucide-react';
import {
  User,
  MasterCurriculumDay,
  UserRoadmap,
  RoadmapTaskProgress,
  Question
} from '../types';
import {
  getMasterCurriculum,
  getUserRoadmap,
  saveUserRoadmap,
  initializeUserRoadmap
} from '../data/masterCurriculumData';
import { DailyTaskCard } from './DailyTaskCard';
import { FormulaReferenceSheet } from './FormulaReferenceSheet';
import { RoadmapBuilderView } from './RoadmapBuilderView';
import {
  getRoadmapTierCapabilities,
  rebalanceRoadmapMissedDays,
} from '../utils/RoadmapAccessController';
import { LiveWhiteboard } from './LiveWhiteboard';

interface Props {
  user: User;
  onOpenPlanBuilder?: () => void;
  onOpenPaywall?: () => void;
  onOpenDailyWorkout?: () => void;
  onOpenQuestionBank?: (category?: string) => void;
  onOpenVocabTrainer?: (day?: MasterCurriculumDay) => void;
  onOpenMockTests?: (mockTestId?: string) => void;
  onOpenSocraticTutor?: (question?: Question) => void;
  onOpenMistakeVault?: () => void;
  onOpenCommunity?: () => void;
}

export const RoadmapTrackerView: React.FC<Props> = ({
  user,
  onOpenPlanBuilder,
  onOpenPaywall,
  onOpenDailyWorkout,
  onOpenQuestionBank,
  onOpenVocabTrainer,
  onOpenMockTests,
  onOpenSocraticTutor,
  onOpenMistakeVault,
  onOpenCommunity,
}) => {
  const tier = user.planTier || 'STANDARD';
  const caps = getRoadmapTierCapabilities(tier);

  // Master curriculum & User roadmap state
  const [curriculum, setCurriculum] = useState<MasterCurriculumDay[]>(() => getMasterCurriculum());
  const [roadmap, setRoadmap] = useState<UserRoadmap>(() => getUserRoadmap(user));

  // Builder Modal / Toggle State
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isWhiteboardOpen, setIsWhiteboardOpen] = useState(false);
  const [recalibrationNotice, setRecalibrationNotice] = useState<string | null>(null);

  // Navigation & Filtering
  const [selectedWeek, setSelectedWeek] = useState<number | 'ALL'>(1);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'INCOMPLETE' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [isExamDateModalOpen, setIsExamDateModalOpen] = useState(false);
  const [isFormulaSheetOpen, setIsFormulaSheetOpen] = useState(false);
  const [newTargetExamDate, setNewTargetExamDate] = useState(
    roadmap.targetExamDate ? roadmap.targetExamDate.slice(0, 10) : ''
  );
  const [newTargetScore, setNewTargetScore] = useState(roadmap.targetScore || 1500);

  // Sync state with user
  useEffect(() => {
    const fresh = getUserRoadmap(user);
    setRoadmap(fresh);
    setCurriculum(getMasterCurriculum());
  }, [user.id]);

  // Days left calculation
  const daysLeft = useMemo(() => {
    if (!roadmap.targetExamDate) return 42;
    const target = new Date(roadmap.targetExamDate).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [roadmap.targetExamDate]);

  // Toggle single task
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = roadmap.tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.isCompleted;
        return {
          ...t,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    const completedTasksCount = updatedTasks.filter((t) => t.isCompleted).length;
    const completionRate = Math.round((completedTasksCount / updatedTasks.length) * 100);

    const completedDayNumbers: number[] = [];
    for (let d = 1; d <= 30; d++) {
      const dayTasks = updatedTasks.filter((t) => t.dayNumber === d);
      if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
        completedDayNumbers.push(d);
      }
    }

    const updatedRoadmap: UserRoadmap = {
      ...roadmap,
      tasks: updatedTasks,
      completionRate,
      completedDayNumbers,
      lastActiveDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
  };

  // Mark all tasks of a day
  const handleMarkAllDayTasks = (dayNumber: number, complete: boolean) => {
    const updatedTasks = roadmap.tasks.map((t) => {
      if (t.dayNumber === dayNumber) {
        return {
          ...t,
          isCompleted: complete,
          completedAt: complete ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    const completedTasksCount = updatedTasks.filter((t) => t.isCompleted).length;
    const completionRate = Math.round((completedTasksCount / updatedTasks.length) * 100);

    const completedDayNumbers: number[] = [];
    for (let d = 1; d <= 30; d++) {
      const dayTasks = updatedTasks.filter((t) => t.dayNumber === d);
      if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
        completedDayNumbers.push(d);
      }
    }

    const updatedRoadmap: UserRoadmap = {
      ...roadmap,
      tasks: updatedTasks,
      completionRate,
      completedDayNumbers,
      lastActiveDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
  };

  // Recalibrate Plan logic
  const handleRecalibratePlan = () => {
    // Collect uncompleted past tasks and adjust current day pointer
    const currentDay = roadmap.currentDay || 5;
    
    // Find next uncompleted day
    let nextUnfinishedDay = 1;
    for (let d = 1; d <= 30; d++) {
      const dayTasks = roadmap.tasks.filter((t) => t.dayNumber === d);
      if (dayTasks.some((t) => !t.isCompleted)) {
        nextUnfinishedDay = d;
        break;
      }
    }

    const updatedRoadmap: UserRoadmap = {
      ...roadmap,
      currentDay: nextUnfinishedDay,
      targetScore: newTargetScore,
      targetExamDate: newTargetExamDate ? new Date(newTargetExamDate).toISOString() : roadmap.targetExamDate,
      updatedAt: new Date().toISOString(),
    };

    setRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
    setIsRecalibrateOpen(false);

    // Also auto-select the week of that day
    const weekOfUnfinishedDay = Math.ceil(nextUnfinishedDay / 7);
    setSelectedWeek(weekOfUnfinishedDay <= 4 ? weekOfUnfinishedDay : 4);
  };

  // Filtered curriculum days
  const filteredDays = useMemo(() => {
    return curriculum.filter((day) => {
      // Week filter
      if (selectedWeek !== 'ALL' && day.weekNumber !== selectedWeek) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = day.title.toLowerCase().includes(q);
        const matchDomain = day.domainFocus.toLowerCase().includes(q);
        const matchConcept = day.conceptTitle.toLowerCase().includes(q);
        if (!matchTitle && !matchDomain && !matchConcept) return false;
      }

      // Status filter
      const dayTasks = roadmap.tasks.filter((t) => t.dayNumber === day.dayNumber);
      const isDayComplete = dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted);

      if (filterStatus === 'COMPLETED' && !isDayComplete) return false;
      if (filterStatus === 'INCOMPLETE' && isDayComplete) return false;

      return true;
    });
  }, [curriculum, selectedWeek, searchQuery, filterStatus, roadmap.tasks]);

  // Week summaries for navigation tabs
  const weekSummaries = useMemo(() => {
    return [1, 2, 3, 4].map((wk) => {
      const weekDays = curriculum.filter((d) => d.weekNumber === wk);
      const dayNumbers = weekDays.map((d) => d.dayNumber);
      const completedDaysInWeek = dayNumbers.filter((d) => roadmap.completedDayNumbers.includes(d)).length;
      return {
        week: wk,
        title:
          wk === 1
            ? 'Week 1: Fundamentals'
            : wk === 2
            ? 'Week 2: Advanced & Desmos'
            : wk === 3
            ? 'Week 3: Speed & Strategy'
            : 'Week 4: Final Mock Sprint',
        daysCount: weekDays.length,
        completedCount: completedDaysInWeek,
        isFullyComplete: completedDaysInWeek === weekDays.length && weekDays.length > 0,
      };
    });
  }, [curriculum, roadmap.completedDayNumbers]);

  const scrollToDay = (dayNum: number) => {
    const wk = Math.ceil(dayNum / 7);
    if (selectedWeek !== 'ALL' && selectedWeek !== wk) {
      setSelectedWeek(wk <= 4 ? wk : 4);
    }
    setTimeout(() => {
      const el = document.getElementById(`roadmap-day-${dayNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  if (isBuilderOpen) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsBuilderOpen(false)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#3D405B] bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to 30-Day Tracker</span>
          </button>
        </div>

        <RoadmapBuilderView
          user={user}
          currentRoadmap={roadmap}
          onSaveRoadmap={(newRoadmap) => {
            setRoadmap(newRoadmap);
            setIsBuilderOpen(false);
          }}
          onOpenPaywall={onOpenPaywall}
          onOpenSocraticTutor={onOpenSocraticTutor}
          onOpenMistakeVault={onOpenMistakeVault}
          onOpenMockTests={onOpenMockTests}
          onOpenCommunity={onOpenCommunity}
          onCancel={() => setIsBuilderOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 text-[#1E1B18] font-sans">
      {/* 1. HEADER & MILESTONE PROGRESS BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Title & Status */}
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20">
                <Compass className="w-3.5 h-3.5" />
                Adaptive Study Plan
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${caps.badgeBg} ${caps.badgeText}`}
              >
                {caps.badgeLabel}
              </span>
              <span className="text-xs font-medium text-[#8C827A]">
                Day {roadmap.currentDay} of 30
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
              30-Day SAT Mastery Roadmap
            </h1>
            <p className="text-sm text-[#6B645C] max-w-2xl">
              Precision daily syllabus systematically targeting point bleeds, Desmos power-hacks, high-frequency vocabulary, and official Bluebook adaptive simulations.
            </p>
          </div>

          {/* Right Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-2xl border border-[#E5E0D8]">
            {/* Countdown */}
            <div className="text-center px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A] flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-[#3D405B]" />
                Exam
              </span>
              <div className="text-lg sm:text-xl font-bold text-[#1E1B18] mt-0.5">
                {daysLeft}d <span className="text-xs font-normal text-[#8C827A]">left</span>
              </div>
            </div>

            {/* Target Score */}
            <div className="text-center px-2 border-x border-[#E5E0D8]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A] flex items-center justify-center gap-1">
                <Target className="w-3 h-3 text-[#E07A5F]" />
                Target
              </span>
              <div className="text-lg sm:text-xl font-bold text-[#E07A5F] mt-0.5">
                {roadmap.targetScore}+
              </div>
            </div>

            {/* Streak */}
            <div className="text-center px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A] flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-[#E9C46A]" />
                Streak
              </span>
              <div className="text-lg sm:text-xl font-bold text-[#1E1B18] mt-0.5">
                {roadmap.streakDays}d
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Completion Bar */}
        <div className="mt-6 pt-6 border-t border-[#E5E0D8]/70 space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1E1B18] text-sm">
                Overall Progress: {roadmap.completionRate}% Completed
              </span>
              <span className="text-[#8C827A]">
                ({roadmap.tasks.filter((t) => t.isCompleted).length} of {roadmap.tasks.length} total tasks)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsFormulaSheetOpen(true)}
                className="font-medium text-[#3D405B] hover:text-[#E07A5F] flex items-center gap-1 transition-colors px-2 py-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Formula Sheet</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBuilderOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#3D405B] hover:bg-[#2F3146] text-white shadow-xs transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-[#E9C46A]" />
                <span>Customize Plan / AI Engine</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRecalibrateOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] hover:bg-[#E5E0D8]/50 text-[#3D405B] border border-[#E5E0D8] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>Recalibrate Plan</span>
              </button>
            </div>
          </div>

          <div className="w-full h-2.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E0D8]">
            <div
              className="h-full bg-[#2A9D8F] transition-all duration-300 rounded-full"
              style={{ width: `${roadmap.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recalibration Notice if Any */}
      {recalibrationNotice && (
        <div className="p-4 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-[#2A9D8F] text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{recalibrationNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setRecalibrationNotice(null)}
            className="text-xs underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TIER-SPECIFIC INTEGRATION BANNERS */}
      {/* STANDARD TIER: Upgrade Trigger Banner */}
      {(!caps.canAutoGenerateAI || tier === 'STANDARD' || tier === 'FREE') && (
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-2xl bg-[#E07A5F]/10 text-[#E07A5F] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#1E1B18]">
                  Want AI to automatically build and optimize your 30-day roadmap based on your weak points?
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                  Standard Mode
                </span>
              </div>
              <p className="text-xs text-[#6B645C] mt-0.5">
                Pro Tier analyzes your diagnostic sub-skill error patterns, assigns 5-10 targeted SQB drills, syncs Leitner Mistake Vault, and unlocks 24/7 Socratic AI Tutor guidance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsBuilderOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#3D405B] bg-[#FAF8F5] hover:bg-[#E5E0D8]/40 border border-[#E5E0D8] transition-colors"
            >
              Manual Plan Builder
            </button>
            <button
              type="button"
              onClick={onOpenPaywall}
              className="px-4 py-2 rounded-xl bg-[#E07A5F] text-white hover:bg-[#D0694E] text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Upgrade to PRO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* VIP TIER: Mentor Oversight Card */}
      {tier === 'VIP' && (
        <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#3D405B] text-[#E9C46A] flex items-center justify-center font-bold text-base shrink-0 border border-[#E5E0D8]">
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#1E1B18]">Dr. Alisher Rustamov (1580 Lead Instructor)</h4>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/30">
                  Assigned Mentor • Active
                </span>
              </div>
              <p className="text-xs text-[#6B645C] mt-0.5">
                Your 30-day roadmap is monitored with custom homework injections and live 1-on-1 WebRTC whiteboard coaching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsWhiteboardOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#3D405B] text-[#E9C46A] hover:bg-[#2F3146] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Whiteboard</span>
            </button>
            {onOpenCommunity && (
              <button
                type="button"
                onClick={onOpenCommunity}
                className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] text-[#3D405B] border border-[#E5E0D8] hover:bg-[#E5E0D8]/40 text-xs font-semibold transition-colors"
              >
                VIP Chat
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. 30-DAY HABIT CONSISTENCY HEATMAP & STREAK MATRIX */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#1E1B18] flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#E07A5F]" />
              30-Day Habit Matrix & Consistency Heatmap
            </h2>
            <p className="text-xs text-[#6B645C]">
              Click any day tile to inspect tasks or jump directly to that date in your timeline.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs text-[#8C827A]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2A9D8F]" /> 100% Done
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#E9C46A]" /> Partial (1-2)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#FAF8F5] border border-[#E5E0D8]" /> Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm border-2 border-[#E07A5F]" /> Today
            </span>
          </div>
        </div>

        {/* 30-Day Grid */}
        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-30 gap-1.5 pt-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNum) => {
            const dayTasks = roadmap.tasks.filter((t) => t.dayNumber === dayNum);
            const completedCount = dayTasks.filter((t) => t.isCompleted).length;
            const isFull = dayTasks.length > 0 && completedCount === dayTasks.length;
            const isPartial = completedCount > 0 && !isFull;
            const isToday = dayNum === roadmap.currentDay;
            const currDayMeta = curriculum.find((d) => d.dayNumber === dayNum);

            let bgClass = 'bg-[#FAF8F5] border-[#E5E0D8] text-[#8C827A] hover:bg-[#E5E0D8]/40';
            if (isFull) {
              bgClass = 'bg-[#2A9D8F] border-[#2A9D8F] text-white hover:bg-[#248277]';
            } else if (isPartial) {
              bgClass = 'bg-[#E9C46A] border-[#D4AC50] text-[#1E1B18] hover:bg-[#D4AC50]';
            }

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => scrollToDay(dayNum)}
                title={`Day ${dayNum}: ${currDayMeta?.title || ''} (${completedCount}/3 tasks completed)`}
                className={`relative h-10 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center ${bgClass} ${
                  isToday ? 'ring-2 ring-[#E07A5F] ring-offset-1 z-10' : ''
                }`}
              >
                <span>{dayNum}</span>
                {currDayMeta?.isMockDay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] absolute bottom-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. WEEKLY HORIZON NAVIGATION STRIP & SEARCH */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Week Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] w-fit">
            {weekSummaries.map((w) => {
              const isActive = selectedWeek === w.week;
              return (
                <button
                  key={w.week}
                  type="button"
                  onClick={() => setSelectedWeek(w.week)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                      : 'text-[#6B645C] hover:text-[#1E1B18] hover:bg-white/50'
                  }`}
                >
                  <span>{w.title}</span>
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-md ${
                      w.isFullyComplete
                        ? 'bg-[#2A9D8F]/15 text-[#2A9D8F]'
                        : 'bg-[#E5E0D8]/60 text-[#8C827A]'
                    }`}
                  >
                    {w.completedCount}/{w.daysCount}
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setSelectedWeek('ALL')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedWeek === 'ALL'
                  ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#6B645C] hover:text-[#1E1B18] hover:bg-white/50'
              }`}
            >
              All 30 Days
            </button>
          </div>

          {/* Search & Status Filter */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, Desmos, rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] placeholder-[#8C827A] focus:outline-none focus:border-[#E07A5F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C827A] hover:text-[#1E1B18]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs sm:text-sm font-medium text-[#3D405B] focus:outline-none focus:border-[#E07A5F]"
            >
              <option value="ALL">All Status</option>
              <option value="INCOMPLETE">Pending Only</option>
              <option value="COMPLETED">Completed Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. DAILY TASK ROADMAP CARDS (TIMELINE STREAM) */}
      <div className="space-y-6">
        {filteredDays.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E5E0D8] space-y-3">
            <Compass className="w-10 h-10 text-[#C4BCB3] mx-auto" />
            <h3 className="text-base font-bold text-[#1E1B18]">No Days Match Your Criteria</h3>
            <p className="text-xs text-[#8C827A] max-w-sm mx-auto">
              Try adjusting your search query or reset your status filters to view the full curriculum.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('ALL');
                setSelectedWeek('ALL');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] text-[#3D405B] border border-[#E5E0D8] hover:bg-[#E5E0D8]/40 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredDays.map((day) => {
            const isToday = day.dayNumber === roadmap.currentDay;
            const isPast = day.dayNumber < roadmap.currentDay;
            const isFuture = day.dayNumber > roadmap.currentDay;
            const isCompleted = roadmap.completedDayNumbers.includes(day.dayNumber);

            return (
              <DailyTaskCard
                key={day.dayNumber}
                day={day}
                tasks={roadmap.tasks}
                isToday={isToday}
                isPast={isPast}
                isFuture={isFuture}
                isCompleted={isCompleted}
                onToggleTask={handleToggleTask}
                onMarkAllDayTasks={handleMarkAllDayTasks}
                onOpenFormulaSheet={() => setIsFormulaSheetOpen(true)}
                onOpenPractice={(d) => {
                  if (onOpenQuestionBank) {
                    onOpenQuestionBank(d.domainFocus);
                  } else if (onOpenDailyWorkout) {
                    onOpenDailyWorkout();
                  }
                }}
                onOpenVocabTrainer={(d) => {
                  if (onOpenVocabTrainer) {
                    onOpenVocabTrainer(d);
                  }
                }}
                onOpenMockTest={(mockId) => {
                  if (onOpenMockTests) {
                    onOpenMockTests(mockId);
                  }
                }}
              />
            );
          })
        )}
      </div>

      {/* 5. RECALIBRATE PLAN MODAL */}
      {isRecalibrateOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E5E0D8] shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#E07A5F]/10 text-[#E07A5F]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1E1B18]">Recalibrate Study Plan</h3>
                  <p className="text-xs text-[#8C827A]">Evenly re-distribute pace across remaining days</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRecalibrateOpen(false)}
                className="text-[#8C827A] hover:text-[#1E1B18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#3D405B]">
              <p className="leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-[#E5E0D8]">
                Recalibrating checks your uncompleted past days and sets your next focus to the earliest unfinished topic (e.g. Day {roadmap.currentDay}), keeping your habit streak intact without falling behind.
              </p>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1B18] block">Target SAT Exam Date</label>
                <input
                  type="date"
                  value={newTargetExamDate}
                  onChange={(e) => setNewTargetExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-[#1E1B18] bg-white focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#1E1B18] block">Target Score Benchmark</label>
                <div className="grid grid-cols-4 gap-2">
                  {[1400, 1450, 1500, 1550].map((sc) => (
                    <button
                      key={sc}
                      type="button"
                      onClick={() => setNewTargetScore(sc)}
                      className={`py-1.5 rounded-lg border font-bold transition-colors ${
                        newTargetScore === sc
                          ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                          : 'bg-[#FAF8F5] text-[#3D405B] border-[#E5E0D8] hover:bg-[#E5E0D8]/40'
                      }`}
                    >
                      {sc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRecalibrateOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B645C] hover:bg-[#FAF8F5] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRecalibratePlan}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E07A5F] text-white hover:bg-[#D0694E] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Recalibration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FORMULA REFERENCE SHEET MODAL */}
      {isFormulaSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 border border-[#E5E0D8] shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E07A5F]" />
                <h3 className="text-lg font-bold text-[#1E1B18]">Official SAT Formula & Rules Reference</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulaSheetOpen(false)}
                className="text-[#8C827A] hover:text-[#1E1B18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormulaReferenceSheet />
          </div>
        </div>
      )}

      {/* 7. VIP LIVE WHITEBOARD MODAL */}
      {isWhiteboardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-[#E5E0D8] shadow-2xl">
            <div className="px-6 py-3 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#3D405B] text-[#E9C46A]">
                  <Zap className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1E1B18]">
                    VIP 1-on-1 Live Whiteboard Coaching: Dr. Alisher Rustamov
                  </h3>
                  <p className="text-[11px] text-[#8C827A]">Interactive WebRTC Collaborative Canvas</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWhiteboardOpen(false)}
                className="p-1.5 rounded-xl text-xs font-semibold bg-white border border-[#E5E0D8] text-[#1E1B18] hover:bg-[#FAF8F5]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-2 bg-[#FAF8F5] overflow-hidden">
              <LiveWhiteboard isHost={true} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
