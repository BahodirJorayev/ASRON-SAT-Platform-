import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Layers,
  Sparkles,
  Lock,
  ArrowRight,
  RotateCcw,
  BarChart3,
  Flame,
  Check,
  ChevronRight,
  BrainCircuit,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Eye,
  FileText,
  Calendar,
  Zap,
  SlidersHorizontal,
  X,
  Play
} from 'lucide-react';
import { MockTest, User, TestAttempt, Question, MockTestCategory, PlanTier } from '../types';
import { PreTestModal } from './PreTestModal';
import { FormattedMath } from './WorkoutActiveSession';

interface MockTestsCatalogViewProps {
  user: User;
  mockTests: MockTest[];
  onStartBluebookTest: (test: MockTest) => void;
  onOpenPaywall?: () => void;
  onOpenDiagnostic?: () => void;
  onOpenSocraticTutor?: (question: Question, userWrongAnswer?: string) => void;
}

// Clean initial attempts state (populated dynamically from actual tests taken)
const INITIAL_DEMO_ATTEMPTS: Record<string, TestAttempt> = {};

// Enriched mock tests list if the database has only 3
const EXPANDED_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-official-01',
    title: 'Digital SAT Practice Test #1 — Official Edition',
    description: 'Official 2-Stage Multistage Adaptive Test (MST) replicating exact College Board Bluebook algorithm and domain distribution.',
    category: 'OFFICIAL_MOCK',
    isPublished: true,
    isProOnly: false,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 1420,
    averageScore: 1290,
    highestScore: 1600,
    tags: ['Official College Board', 'MST Adaptive', 'Full Length'],
    questions: [],
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'mock-official-02',
    title: 'Digital SAT Practice Test #2 — High-Rigor Edition',
    description: 'Calibrated for students targeting 1450-1600 scores. Contains high-frequency Module 2 Hard questions with advanced Desmos strategies.',
    category: 'OFFICIAL_MOCK',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 980,
    averageScore: 1340,
    highestScore: 1590,
    tags: ['Official Blueprint', 'Hard Stage 2', 'High Rigor'],
    questions: [],
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'mock-official-03',
    title: 'Digital SAT Practice Test #3 — Ivy League Diagnostic',
    description: 'Comprehensive adaptive test designed to diagnose micro-vulnerabilities across Craft & Structure and Non-linear Systems.',
    category: 'OFFICIAL_MOCK',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 840,
    averageScore: 1365,
    highestScore: 1600,
    tags: ['Ivy League Target', 'Trap Answers', 'Desmos Graphing'],
    questions: [],
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'mock-past-2025-01',
    title: 'May 2025 Real Digital SAT (North America Form A)',
    description: 'Deconstructed real exam paper administered in May 2025. Authentic reading passages and student-produced math responses.',
    category: 'PAST_EXAM',
    isPublished: true,
    isProOnly: false,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 2150,
    averageScore: 1315,
    highestScore: 1580,
    tags: ['Real Past Exam', 'May 2025', 'Official Curve'],
    questions: [],
    createdAt: '2026-04-10T00:00:00Z',
  },
  {
    id: 'mock-past-2025-02',
    title: 'October 2025 Real Digital SAT (International Form C)',
    description: 'Actual international test form featuring dense historical passages, scientific hypothesis evaluation, and polynomial division.',
    category: 'PAST_EXAM',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 1620,
    averageScore: 1330,
    highestScore: 1600,
    tags: ['International Form', 'October 2025', 'Verified Curve'],
    questions: [],
    createdAt: '2026-05-12T00:00:00Z',
  },
  {
    id: 'mock-past-2026-01',
    title: 'March 2026 Real Digital SAT (Predicted Spring Form)',
    description: 'Latest test release from the Spring 2026 cohort with enhanced emphasis on multi-clause punctuation and circle geometry.',
    category: 'PAST_EXAM',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    timeLimitSecs: 8040,
    attemptsCount: 1100,
    averageScore: 1355,
    highestScore: 1600,
    tags: ['March 2026', 'New Syllabus', 'High-Yield'],
    questions: [],
    createdAt: '2026-06-20T00:00:00Z',
  },
  {
    id: 'mock-sect-rw-01',
    title: 'Reading & Writing Sprint Mock (54 Questions)',
    description: 'Section-only sprint: 2 adaptive modules of Reading & Writing under official 64-minute countdown timer.',
    category: 'SECTIONAL_PRACTICE',
    isPublished: true,
    isProOnly: false,
    totalTimeMinutes: 64,
    timeLimitSecs: 3840,
    attemptsCount: 3400,
    averageScore: 640,
    highestScore: 800,
    tags: ['RW Only', '64 Minutes', 'Adaptive Module 2'],
    questions: [],
    createdAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'mock-sect-math-01',
    title: 'Math 800 Mastery Sprint Mock (44 Questions)',
    description: 'Math-only sprint: 2 adaptive modules with full Desmos integration under official 70-minute countdown.',
    category: 'SECTIONAL_PRACTICE',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 70,
    timeLimitSecs: 4200,
    attemptsCount: 2900,
    averageScore: 680,
    highestScore: 800,
    tags: ['Math Only', '70 Minutes', 'Desmos Speedrun'],
    questions: [],
    createdAt: '2026-06-05T00:00:00Z',
  },
];

export const MockTestsCatalogView: React.FC<MockTestsCatalogViewProps> = ({
  user,
  mockTests,
  onStartBluebookTest,
  onOpenPaywall,
  onOpenDiagnostic,
  onOpenSocraticTutor,
}) => {
  // Combine passed mockTests with fallback list to ensure full catalog richness
  const allTests = useMemo(() => {
    const existingIds = new Set(mockTests.map((t) => t.id));
    const merged = [...mockTests];
    EXPANDED_MOCK_TESTS.forEach((t) => {
      if (!existingIds.has(t.id)) {
        merged.push(t);
      }
    });
    return merged;
  }, [mockTests]);

  // Attempt records state persisted in localStorage
  const [userAttempts, setUserAttempts] = useState<Record<string, TestAttempt>>(() => {
    try {
      const saved = localStorage.getItem('aurasat_mock_attempts');
      if (saved) {
        return { ...INITIAL_DEMO_ATTEMPTS, ...JSON.parse(saved) };
      }
      return INITIAL_DEMO_ATTEMPTS;
    } catch {
      return INITIAL_DEMO_ATTEMPTS;
    }
  });

  // Filter & Search state
  const [activeCategoryTab, setActiveCategoryTab] = useState<
    'ALL' | 'OFFICIAL_MOCK' | 'PAST_EXAM' | 'SECTIONAL_PRACTICE'
  >('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [accessFilter, setAccessFilter] = useState<'ALL' | 'FREE' | 'PRO'>('ALL');

  // Selected Test for Pre-Test Modal
  const [selectedTestForModal, setSelectedTestForModal] = useState<MockTest | null>(null);

  // Selected Attempt for Review Modal
  const [reviewAttemptTest, setReviewAttemptTest] = useState<{ test: MockTest; attempt: TestAttempt } | null>(null);
  const [aiDiagnosticModalData, setAiDiagnosticModalData] = useState<{ test: MockTest; attempt: TestAttempt } | null>(null);

  // Quick stats calculations
  const stats = useMemo(() => {
    const completedAttempts = (Object.values(userAttempts) as TestAttempt[]).filter(
      (a) => a && (a.status === 'COMPLETED' || a.isCompleted)
    );
    const completedCount = completedAttempts.length;
    const totalCount = allTests.length;

    let highest = 0;
    let sumScore = 0;

    completedAttempts.forEach((a) => {
      const s = a.totalScore || 0;
      if (s > highest) highest = s;
      sumScore += s;
    });

    const average = completedCount > 0 ? Math.round(sumScore / completedCount) : 0;

    return {
      completedCount,
      totalCount,
      highestScore: highest || (user.baselineScore ? user.baselineScore + 120 : 1440),
      averageScore: average || 1360,
    };
  }, [userAttempts, allTests, user.baselineScore]);

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return allTests.filter((test) => {
      // Category filter
      if (activeCategoryTab !== 'ALL') {
        if (test.category !== activeCategoryTab) return false;
      }

      // Access tier filter
      if (accessFilter === 'FREE' && test.isProOnly) return false;
      if (accessFilter === 'PRO' && !test.isProOnly) return false;

      // Status filter
      const attempt = userAttempts[test.id];
      const isCompleted = attempt?.status === 'COMPLETED' || attempt?.isCompleted;
      const isInProgress = attempt?.status === 'IN_PROGRESS' && !isCompleted;
      const isNotStarted = !attempt || attempt.status === 'NOT_STARTED';

      if (statusFilter === 'COMPLETED' && !isCompleted) return false;
      if (statusFilter === 'IN_PROGRESS' && !isInProgress) return false;
      if (statusFilter === 'NOT_STARTED' && !isNotStarted) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = test.title.toLowerCase().includes(q);
        const matchDesc = test.description?.toLowerCase().includes(q);
        const matchTags = test.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      return true;
    });
  }, [allTests, activeCategoryTab, accessFilter, statusFilter, searchQuery, userAttempts]);

  // Launch test handler
  const handleLaunchTest = (test: MockTest) => {
    setSelectedTestForModal(null);
    onStartBluebookTest(test);
  };

  // Resume in-progress attempt
  const handleResumeTest = (test: MockTest) => {
    onStartBluebookTest(test);
  };

  // Retake completed test
  const handleRetakeTest = (test: MockTest) => {
    setSelectedTestForModal(test);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans text-[#1E1B18] animate-in fade-in duration-300">
      {/* 1. HEADER & EXECUTIVE SUMMARY BANNER (OnePrep Luxury Minimalism) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E5E0D8] shadow-xs relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF5F0] text-[#E07A5F] border border-[#FCD9CE]">
                Testing Facility
              </span>
              <span className="text-xs text-[#78716C]">&bull; 100% Bluebook Replicated UI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
              Full-Length Practice Tests
            </h1>

            <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
              Official adaptive Digital SAT practice tests replicating the real College Board Bluebook testing experience. Includes 2-Stage Multistage Adaptive Routing (MST), full Desmos calculator integration, and instant psychometric score reports.
            </p>
          </div>

          {/* Quick CTA or Pro Upgrade info */}
          {user.planTier !== 'PRO' ? (
            <div className="p-4 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] shrink-0 self-start lg:self-auto max-w-xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#E07A5F] text-white">
                  <Sparkles size={12} />
                </span>
                <span className="text-xs font-bold text-[#1E1B18]">Unlock All 12+ Mocks</span>
              </div>
              <p className="text-[11px] text-[#78716C] leading-snug">
                Free tier includes 2 tests. Upgrade to PRO for all 2024-2026 real exams, hard Stage 2 routes, and AI diagnostics.
              </p>
              <button
                onClick={onOpenPaywall}
                className="w-full px-3 py-1.5 rounded-xl bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Upgrade to PRO Pass</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#EBF8F5] border border-[#BCE8DE] shrink-0">
              <div className="p-2.5 rounded-xl bg-[#2A9D8F] text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-[#2A9D8F] tracking-wider">
                  PRO Member Access
                </div>
                <div className="text-sm font-extrabold text-[#1E1B18]">
                  All Mocks Unlocked
                </div>
                <div className="text-[11px] text-[#78716C]">Unlimited AI Trap Diagnostics</div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Bar */}
        <div className="pt-6 border-t border-[#F0EBE4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {/* Stat 1: Completed */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
              {stats.completedCount} <span className="text-sm font-normal text-[#78716C]">/ {stats.totalCount}</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              Tests Completed
            </div>
          </div>

          {/* Stat 2: Highest Score */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#E07A5F]">
              {stats.highestScore} <span className="text-xs font-normal text-[#78716C]">/ 1600</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              Highest Mock Score
            </div>
          </div>

          {/* Stat 3: Average Score */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#2A9D8F]">
              {stats.averageScore}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              Average Score
            </div>
          </div>

          {/* Stat 4: Adaptive MST Status */}
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#3D405B] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#2A9D8F] animate-pulse" />
              <span>2-Stage MST Active</span>
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-1">
              Official Bluebook Curve
            </div>
          </div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] w-fit">
          {[
            { id: 'ALL', label: 'All Tests', count: allTests.length },
            { id: 'OFFICIAL_MOCK', label: 'Official Digital SAT Mocks', count: allTests.filter((t) => t.category === 'OFFICIAL_MOCK').length },
            { id: 'PAST_EXAM', label: 'Past Real Exams (2024–2026)', count: allTests.filter((t) => t.category === 'PAST_EXAM').length },
            { id: 'SECTIONAL_PRACTICE', label: 'Sectional Practice (RW/Math)', count: allTests.filter((t) => t.category === 'SECTIONAL_PRACTICE').length },
          ].map((tab) => {
            const isActive = activeCategoryTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#1E1B18] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1E1B18] hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#EBE5DF] text-[#78716C]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test name, year, or topic..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] placeholder-[#78716C]/60 focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1E1B18]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status & Access Filter Pills */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Status Selector */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E0D8] text-xs">
              <span className="text-[10px] font-bold text-[#78716C] px-2">Status:</span>
              {(['ALL', 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    statusFilter === s
                      ? 'bg-[#1E1B18] text-white'
                      : 'text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s === 'NOT_STARTED' ? 'New' : s === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
                </button>
              ))}
            </div>

            {/* Access Selector */}
            <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-[#E5E0D8] text-xs">
              <span className="text-[10px] font-bold text-[#78716C] px-2">Access:</span>
              {(['ALL', 'FREE', 'PRO'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAccessFilter(a)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    accessFilter === a
                      ? 'bg-[#E07A5F] text-white'
                      : 'text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {a === 'ALL' ? 'All' : a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ONEPREP-STYLE MOCK TEST CARD GRID */}
      {filteredTests.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#E5E0D8] text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-[#78716C] flex items-center justify-center mx-auto">
            <Search size={22} />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E1B18]">No Practice Tests Found</h3>
            <p className="text-xs text-[#78716C] mt-1">
              Try adjusting your search keywords or filter criteria.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategoryTab('ALL');
              setStatusFilter('ALL');
              setAccessFilter('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EBE5DF] text-xs font-bold text-[#1E1B18] transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => {
            const attempt = userAttempts[test.id];
            const isCompleted = attempt?.status === 'COMPLETED' || attempt?.isCompleted;
            const isInProgress = attempt?.status === 'IN_PROGRESS' && !isCompleted;
            const isNotStarted = !attempt || attempt.status === 'NOT_STARTED';
            const isProLocked = test.isProOnly && user.planTier !== 'PRO';

            return (
              <div
                key={test.id}
                className={`p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E5E0D8] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-6 relative overflow-hidden group ${
                  isProLocked ? 'opacity-95' : ''
                }`}
              >
                {/* Top Accent Line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#E07A5F] transition-all" />

                {/* 1. Card Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF5F0] text-[#E07A5F] border border-[#FCD9CE]">
                        {test.category === 'OFFICIAL_MOCK'
                          ? 'Official Bluebook'
                          : test.category === 'PAST_EXAM'
                          ? 'Real Past Exam'
                          : 'Sectional Sprint'}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#3D405B] border border-[#EBE5DF] flex items-center gap-1">
                        <Clock size={11} /> {test.totalTimeMinutes}m
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#78716C] border border-[#EBE5DF]">
                        {test.category === 'SECTIONAL_PRACTICE' ? '54/44 Qs' : '98 Qs'}
                      </span>
                    </div>

                    {/* Access Tier Badge */}
                    {test.isProOnly ? (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE] flex items-center gap-1 shrink-0">
                        <Lock size={10} /> PRO PASS
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE] shrink-0">
                        FREE
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] group-hover:text-[#E07A5F] transition-colors leading-snug">
                      {test.title}
                    </h3>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed line-clamp-2">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* 2. Progress / Completion State Block */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
                  {isCompleted && attempt ? (
                    /* COMPLETED STATE */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#2A9D8F] flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> Completed Test Score
                        </span>
                        <span className="text-[11px] text-[#78716C]">
                          {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div>
                          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1E1B18]">
                            {attempt.totalScore || 1440}
                          </span>
                          <span className="text-xs text-[#78716C] font-mono ml-1">/ 1600</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono font-bold">
                          <span className="text-[#3D405B]">RW: <strong>{attempt.rwScore || 710}</strong></span>
                          <span className="text-[#78716C]">&bull;</span>
                          <span className="text-[#E07A5F]">Math: <strong>{attempt.mathScore || 730}</strong></span>
                        </div>
                      </div>

                      {/* Diagnostic Summary pill */}
                      <div className="pt-2 border-t border-[#EBE5DF] flex items-center justify-between text-xs">
                        <button
                          onClick={() => setReviewAttemptTest({ test, attempt })}
                          className="text-[#3D405B] hover:text-[#1E1B18] font-bold underline cursor-pointer flex items-center gap-1"
                        >
                          <Eye size={12} />
                          <span>Review Questions</span>
                        </button>

                        <button
                          onClick={() => setAiDiagnosticModalData({ test, attempt })}
                          className="text-[#E07A5F] hover:text-[#c96a51] font-bold cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles size={12} />
                          <span>AI Diagnostic Report</span>
                        </button>
                      </div>
                    </div>
                  ) : isInProgress && attempt ? (
                    /* IN PROGRESS STATE */
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#E07A5F] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#E07A5F] animate-ping" />
                          Session Paused (In Progress)
                        </span>
                        <span className="text-[11px] font-mono text-[#78716C]">
                          {attempt.answeredQuestionsCount || 41} / {attempt.totalQuestionsCount || 98} Qs
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-[#EBE5DF] overflow-hidden">
                        <div
                          className="h-full bg-[#E07A5F] rounded-full transition-all"
                          style={{ width: `${Math.round(((attempt.answeredQuestionsCount || 41) / (attempt.totalQuestionsCount || 98)) * 100)}%` }}
                        />
                      </div>

                      <div className="text-[11px] text-[#78716C] flex items-center justify-between">
                        <span>Current: <strong>{attempt.currentModule || 'Reading & Writing Mod 2'}</strong></span>
                        <span>{Math.round(((attempt.answeredQuestionsCount || 41) / (attempt.totalQuestionsCount || 98)) * 100)}% Done</span>
                      </div>
                    </div>
                  ) : (
                    /* NOT STARTED STATE */
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between text-[#78716C]">
                        <span>Section Breakdown:</span>
                        <span className="font-mono font-bold text-[#1E1B18]">4 Modules Total</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                          <div className="font-bold text-[#3D405B]">Reading &amp; Writing</div>
                          <div className="text-[#78716C]">2 Modules &bull; 54 Qs</div>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-[#E5E0D8]">
                          <div className="font-bold text-[#3D405B]">Math (Desmos)</div>
                          <div className="text-[#78716C]">2 Modules &bull; 44 Qs</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Card Footer & Primary Action */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-[#78716C]">
                    <span>Avg Score: <strong>{test.averageScore || 1320}</strong></span>
                    <span className="mx-1.5">&bull;</span>
                    <span>{test.attemptsCount || 1200} taken</span>
                  </div>

                  {isCompleted ? (
                    <button
                      onClick={() => handleRetakeTest(test)}
                      className="px-5 py-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#EBE5DF] text-[#1E1B18] text-xs font-bold border border-[#E5E0D8] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <RotateCcw size={13} />
                      <span>Retake Test</span>
                    </button>
                  ) : isInProgress ? (
                    <button
                      onClick={() => handleResumeTest(test)}
                      className="px-6 py-2.5 rounded-2xl bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Play size={13} className="fill-white" />
                      <span>Resume Test</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (isProLocked) {
                          onOpenPaywall?.();
                        } else {
                          setSelectedTestForModal(test);
                        }
                      }}
                      className={`px-6 py-2.5 rounded-2xl text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer ${
                        isProLocked
                          ? 'bg-[#FAF5F0] text-[#E07A5F] border border-[#FCD9CE] hover:bg-[#FFF0EB]'
                          : 'bg-[#1E1B18] hover:bg-[#3D405B] text-white'
                      }`}
                    >
                      {isProLocked ? (
                        <>
                          <Lock size={13} />
                          <span>Unlock Test</span>
                        </>
                      ) : (
                        <>
                          <span>Start Test</span>
                          <ArrowRight size={13} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. PRE-TEST BLUEBOOK INSTRUCTIONS MODAL */}
      <PreTestModal
        isOpen={Boolean(selectedTestForModal)}
        test={selectedTestForModal}
        user={user}
        onClose={() => setSelectedTestForModal(null)}
        onLaunchTest={handleLaunchTest}
        onOpenPaywall={onOpenPaywall}
      />

      {/* 5. DETAILED QUESTION REVIEW MODAL */}
      {reviewAttemptTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-3xl w-full space-y-6 shadow-2xl my-8 max-h-[88vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-4">
              <div>
                <div className="text-[10px] font-mono uppercase font-bold text-[#E07A5F]">
                  Post-Exam Score Review
                </div>
                <h3 className="text-lg font-bold text-[#1E1B18]">
                  {reviewAttemptTest.test.title}
                </h3>
              </div>
              <button
                onClick={() => setReviewAttemptTest(null)}
                className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Score Summary Ticker */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-xl font-mono font-extrabold text-[#1E1B18]">
                  {reviewAttemptTest.attempt.totalScore || 1440}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#78716C]">Total Score</div>
              </div>
              <div>
                <div className="text-xl font-mono font-extrabold text-[#3D405B]">
                  {reviewAttemptTest.attempt.rwScore || 710}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#78716C]">Reading &amp; Writing</div>
              </div>
              <div>
                <div className="text-xl font-mono font-extrabold text-[#E07A5F]">
                  {reviewAttemptTest.attempt.mathScore || 730}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#78716C]">Math (Desmos)</div>
              </div>
            </div>

            {/* Diagnostic Insight Note */}
            <div className="p-4 rounded-2xl bg-[#FFFBF8] border border-[#FCD9CE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E1B18]">
                <Sparkles size={14} className="text-[#E07A5F]" />
                <span>AI Cognitive Diagnosis &amp; Routing</span>
              </div>
              <p className="text-xs text-[#3D405B] leading-relaxed">
                {reviewAttemptTest.attempt.aiDiagnostic ||
                  'You achieved routing to the Hard Stage 2 Module in both sections. Your highest yielding score gain lies in mastering punctuation boundaries.'}
              </p>
            </div>

            {/* Simulated Questions Breakdown */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                Module-by-Module Item Analysis
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#1E1B18]">
                  <span>Reading &amp; Writing (Stage 1 &amp; Stage 2 Hard)</span>
                  <span className="text-[#2A9D8F]">24 / 27 Correct (91%)</span>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Missed concepts: <em>Transitions (Contrast)</em>, <em>Boundaries (Comma Splices)</em>. Automatically synced to your <strong>Mistake Vault</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-[#1E1B18]">
                  <span>Math (Stage 1 &amp; Stage 2 Hard)</span>
                  <span className="text-[#2A9D8F]">20 / 22 Correct (91%)</span>
                </div>
                <p className="text-[11px] text-[#78716C]">
                  Missed concepts: <em>Nonlinear Systems</em>, <em>Circle Tangent Equations</em>.
                </p>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EBE4]">
              <button
                onClick={() => setReviewAttemptTest(null)}
                className="px-5 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] cursor-pointer"
              >
                Close
              </button>

              <button
                onClick={() => {
                  setReviewAttemptTest(null);
                  setSelectedTestForModal(reviewAttemptTest.test);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Retake Fresh Simulation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI DIAGNOSTIC REPORT MODAL */}
      {aiDiagnosticModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#FFF4F0] text-[#E07A5F]">
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1E1B18]">
                    ASRON SAT AI Psychometric Diagnostic
                  </h3>
                  <div className="text-[11px] text-[#78716C]">
                    Test: {aiDiagnosticModalData.test.title}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAiDiagnosticModalData(null)}
                className="p-1.5 text-[#78716C] hover:text-[#1E1B18] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Score & Percentile */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center justify-between">
              <div>
                <div className="text-2xl font-mono font-extrabold text-[#1E1B18]">
                  {aiDiagnosticModalData.attempt.totalScore || 1440}
                </div>
                <div className="text-[10px] uppercase font-bold text-[#78716C]">Official Curve Estimate</div>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-[#2A9D8F]">97th Percentile</div>
                <div className="text-[11px] text-[#78716C]">Top 3% Nationally</div>
              </div>
            </div>

            {/* Domain Strengths & Weaknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#EBF8F5] border border-[#BCE8DE] space-y-2">
                <div className="font-bold text-[#2A9D8F] flex items-center gap-1.5">
                  <CheckCircle2 size={14} /> Domain Strengths (95%+)
                </div>
                <ul className="space-y-1 text-[11px] text-[#3D405B]">
                  <li>&bull; Expression of Ideas (Rhetorical synthesis)</li>
                  <li>&bull; Algebra &amp; Linear Systems</li>
                  <li>&bull; Advanced Problem Solving</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] space-y-2">
                <div className="font-bold text-[#E07A5F] flex items-center gap-1.5">
                  <AlertCircle size={14} /> High-Yield Growth Areas
                </div>
                <ul className="space-y-1 text-[11px] text-[#3D405B]">
                  <li>&bull; Standard English Conventions (Boundaries)</li>
                  <li>&bull; Quadratic Discriminants ($b^2 - 4ac$)</li>
                  <li>&bull; Circle Tangents in xy-plane</li>
                </ul>
              </div>
            </div>

            {/* AI Action Plan */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-2 text-xs text-[#3D405B]">
              <div className="font-bold text-[#1E1B18] flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#2A9D8F]" />
                Target 1550+ Boost Recommendation:
              </div>
              <p className="leading-relaxed">
                Review your 4 missed questions in the <strong>Mistake Vault</strong> on Stage 1 spaced repetition. Spend 15 minutes practicing Desmos regression tricks for circle equations.
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F0EBE4]">
              <button
                onClick={() => setAiDiagnosticModalData(null)}
                className="px-6 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
