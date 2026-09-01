import React, { useState, useMemo } from 'react';
import {
  BrainCircuit,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Crown,
  BookOpen,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Flame,
  Check,
  X,
  Award,
  RotateCcw,
  Trophy,
  Target,
  Search,
  Volume2,
  VolumeX,
  HelpCircle,
  Zap,
  Clock,
  ShieldCheck,
  Calculator,
  Compass,
  FileText
} from 'lucide-react';
import katex from 'katex';
import { MistakeVaultItem, Question, User } from '../types';

interface Props {
  mistakes: MistakeVaultItem[];
  user: User;
  onOpenSocraticTutor: (question: Question, userWrongAnswer?: string) => void;
  onOpenPaywall: () => void;
  onUpdateMistakeItem: (updatedItem: MistakeVaultItem) => void;
}

// Math and LaTeX rendering helper component
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const rendered = useMemo(() => {
    if (!text) return '';
    if (!text.includes('$') && !text.includes('\\')) {
      return text;
    }

    try {
      let formatted = text;
      // Replace block math $$...$$
      formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-2 py-1 overflow-x-auto text-center font-mono">${katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Replace inline math $...$
      formatted = formatted.replace(/\$([^\$\n]+?)\$/g, (_, math) => {
        try {
          return katex.renderToString(math.trim(), {
            displayMode: false,
            throwOnError: false,
          });
        } catch {
          return `$${math}$`;
        }
      });

      return formatted;
    } catch {
      return text;
    }
  }, [text]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

export const MistakeVaultView: React.FC<Props> = ({
  mistakes,
  user,
  onOpenSocraticTutor,
  onOpenPaywall,
  onUpdateMistakeItem,
}) => {
  // Filter States
  const [selectedStageFilter, setSelectedStageFilter] = useState<'ALL' | 'DUE' | 1 | 2 | 3 | 'MASTERED'>('ALL');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState<'ALL' | 'READING_AND_WRITING' | 'MATH'>('ALL');
  const [selectedDomainFilter, setSelectedDomainFilter] = useState<string>('ALL');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<'ALL' | 'MOCK_TEST' | 'DAILY_WORKOUT' | 'QUESTION_BANK'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Active View State
  const [activeItemId, setActiveItemId] = useState<string>(mistakes[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'RETEST' | 'TRAP_ANALYSIS' | 'CLONE_STUDIO'>('TRAP_ANALYSIS');

  // Practice Re-test State
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  const [lastPracticeCorrect, setLastPracticeCorrect] = useState<boolean | null>(null);

  // AI Clone State
  const [isGeneratingClone, setIsGeneratingClone] = useState(false);
  const [cloneError, setCloneError] = useState<string | null>(null);
  const [clonePracticeAnswer, setClonePracticeAnswer] = useState<string>('');
  const [clonePracticeSubmitted, setClonePracticeSubmitted] = useState(false);

  // AI Trap Analysis State
  const [isLoadingTrapAnalysis, setIsLoadingTrapAnalysis] = useState(false);
  const [trapAnalysisError, setTrapAnalysisError] = useState<string | null>(null);
  const [isSpeakingTrap, setIsSpeakingTrap] = useState(false);

  const isPro = user.planTier === 'PRO';

  // Find active item
  const activeItem = useMemo(() => {
    return mistakes.find((m) => m.id === activeItemId) || mistakes[0] || null;
  }, [mistakes, activeItemId]);

  // Derived Metrics
  const dueCount = useMemo(() => {
    return mistakes.filter(
      (m) => new Date(m.nextReviewAt) <= new Date() && !(m.isMastered || (m.consecutiveCorrectCount ?? 0) >= 3)
    ).length;
  }, [mistakes]);

  const masteredCount = useMemo(() => {
    return mistakes.filter((m) => m.isMastered || (m.consecutiveCorrectCount ?? 0) >= 3).length;
  }, [mistakes]);

  const stage1Count = useMemo(() => {
    return mistakes.filter((m) => m.stage === 1 && !m.isMastered && (m.consecutiveCorrectCount ?? 0) < 3).length;
  }, [mistakes]);

  const stage2Count = useMemo(() => {
    return mistakes.filter((m) => m.stage === 2 && !m.isMastered && (m.consecutiveCorrectCount ?? 0) < 3).length;
  }, [mistakes]);

  // Unique Domains for Filter Dropdown
  const availableDomains = useMemo(() => {
    const set = new Set<string>();
    mistakes.forEach((m) => {
      if (m.question?.domain) set.add(m.question.domain);
    });
    return Array.from(set);
  }, [mistakes]);

  // Filtered Mistakes List
  const filteredMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      const isItemMastered = m.isMastered || (m.consecutiveCorrectCount ?? 0) >= 3;
      const isDue = new Date(m.nextReviewAt) <= new Date() && !isItemMastered;

      // Stage Filter
      if (selectedStageFilter === 'DUE' && !isDue) return false;
      if (selectedStageFilter === 'MASTERED' && !isItemMastered) return false;
      if (typeof selectedStageFilter === 'number') {
        if (m.stage !== selectedStageFilter || isItemMastered) return false;
      }

      // Section Filter
      if (selectedSectionFilter !== 'ALL' && m.question.section !== selectedSectionFilter) {
        return false;
      }

      // Domain Filter
      if (selectedDomainFilter !== 'ALL' && m.question.domain !== selectedDomainFilter) {
        return false;
      }

      // Source Filter
      if (selectedSourceFilter !== 'ALL') {
        if (m.source && m.source !== selectedSourceFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const textMatch = (m.question.questionText || '').toLowerCase().includes(q);
        const passageMatch = (m.question.passage || '').toLowerCase().includes(q);
        const skillMatch = (m.question.skill || '').toLowerCase().includes(q);
        const domainMatch = (m.question.domain || '').toLowerCase().includes(q);
        if (!textMatch && !passageMatch && !skillMatch && !domainMatch) return false;
      }

      return true;
    });
  }, [mistakes, selectedStageFilter, selectedSectionFilter, selectedDomainFilter, selectedSourceFilter, searchQuery]);

  // Generate Trap Analysis via Gemini API
  const handleFetchTrapAnalysis = async (item: MistakeVaultItem) => {
    if (item.aiTrapAnalysis) return; // Already cached

    setIsLoadingTrapAnalysis(true);
    setTrapAnalysisError(null);

    try {
      const res = await fetch('/api/gemini/trap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: item.question,
          userWrongAnswer: item.userWrongAnswer,
          correctAnswer: item.question.correctAnswer,
        }),
      });

      const data = await res.json();
      if (data.analysis) {
        const updated: MistakeVaultItem = {
          ...item,
          aiTrapAnalysis: data.analysis,
        };
        onUpdateMistakeItem(updated);
      }
    } catch (err: any) {
      console.error('Error fetching trap analysis:', err);
      setTrapAnalysisError('Unable to generate AI trap diagnosis right now. Using offline heuristic.');
    } finally {
      setIsLoadingTrapAnalysis(false);
    }
  };

  // Generate AI Clone Question
  const handleGenerateClone = async (item: MistakeVaultItem) => {
    if (!isPro) {
      onOpenPaywall();
      return;
    }

    setIsGeneratingClone(true);
    setCloneError(null);

    try {
      const res = await fetch('/api/gemini/clone-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalQuestion: item.question }),
      });
      const data = await res.json();
      if (data.clonedQuestion) {
        const updated: MistakeVaultItem = { ...item, clonedQuestion: data.clonedQuestion };
        onUpdateMistakeItem(updated);
        setActiveTab('CLONE_STUDIO');
      }
    } catch (err: any) {
      console.error('Error generating clone:', err);
      setCloneError('Failed to synthesize cloned question variant. Please try again.');
    } finally {
      setIsGeneratingClone(false);
    }
  };

  // Leitner SRS Stage Progression
  const handleAdvanceStage = (item: MistakeVaultItem, correct: boolean) => {
    let nextStage = item.stage;
    let nextDate = new Date();
    const prevStreak = item.consecutiveCorrectCount ?? 0;
    let nextStreak = correct ? prevStreak + 1 : 0;
    let isMastered = nextStreak >= 3;

    if (correct) {
      if (isMastered) {
        nextStage = 3;
        nextDate.setDate(nextDate.getDate() + 60); // 60-day maintenance interval
      } else if (item.stage === 1) {
        nextStage = 2;
        nextDate.setDate(nextDate.getDate() + 3); // 3-day Leitner interval
      } else if (item.stage === 2) {
        nextStage = 3;
        nextDate.setDate(nextDate.getDate() + 7); // 7-day Leitner interval
      } else {
        isMastered = true;
        nextStage = 3;
        nextDate.setDate(nextDate.getDate() + 60);
      }
    } else {
      nextStage = 1; // Reset to Stage 1 (Learning) on error
      isMastered = false;
      nextStreak = 0;
      nextDate.setDate(nextDate.getDate() + 1); // Review tomorrow
    }

    const updated: MistakeVaultItem = {
      ...item,
      stage: nextStage,
      consecutiveCorrectCount: nextStreak,
      isMastered,
      nextReviewAt: nextDate.toISOString(),
    };

    onUpdateMistakeItem(updated);
    setPracticeSubmitted(false);
    setPracticeAnswer('');
    setLastPracticeCorrect(correct);
  };

  // Original Question Practice Submission
  const handlePracticeSubmit = (item: MistakeVaultItem, targetQuestion: Question) => {
    if (!practiceAnswer) return;
    const isCorrect = practiceAnswer.trim().toUpperCase() === targetQuestion.correctAnswer.trim().toUpperCase();
    setPracticeSubmitted(true);
    setLastPracticeCorrect(isCorrect);
    handleAdvanceStage(item, isCorrect);
  };

  // Cloned Question Practice Submission
  const handleClonePracticeSubmit = (item: MistakeVaultItem, cloneQuestion: Question) => {
    if (!clonePracticeAnswer) return;
    const isCorrect = clonePracticeAnswer.trim().toUpperCase() === cloneQuestion.correctAnswer.trim().toUpperCase();
    setClonePracticeSubmitted(true);
    handleAdvanceStage(item, isCorrect);
  };

  // Text to Speech for Trap Analysis
  const handleToggleSpeakTrap = (analysis: any) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeakingTrap) {
      window.speechSynthesis.cancel();
      setIsSpeakingTrap(false);
      return;
    }

    window.speechSynthesis.cancel();
    const narrationText = `Core Rule: ${analysis.coreRuleMissed}. Why the trap was tempting: ${analysis.trapReason}. 10-Second Prevention Strategy: ${analysis.preventionStrategy}`;
    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeakingTrap(false);
    utterance.onerror = () => setIsSpeakingTrap(false);

    setIsSpeakingTrap(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 text-[#1E1B18] font-sans">
      {/* 1. METRICS & EXECUTIVE DASHBOARD HEADER */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-[#E5E0D8] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#E07A5F] uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4 text-[#E07A5F]" />
            <span>Digital SAT Spaced-Repetition Leitner System (SRS)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
            Mistake Vault & Error Mastery Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#78716C] leading-relaxed">
            Eliminate recurring error patterns through Leitner 3-stage intervals, deep Gemini AI trap diagnosis, and novel clone questions. Answer <strong className="text-[#2A9D8F] font-bold">3 times consecutively</strong> to permanently Master a skill.
          </p>
        </div>

        {/* Executive Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
          {/* Total Vaulted */}
          <div className="px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-center shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">Total Logged</div>
            <div className="text-2xl font-black font-mono text-[#1E1B18] mt-0.5">{mistakes.length}</div>
          </div>

          {/* Due Today (Terracotta Accent) */}
          <div className={`px-4 py-3 rounded-2xl border text-center shadow-2xs transition-all ${
            dueCount > 0
              ? 'bg-[#E07A5F]/10 border-[#E07A5F]/40 text-[#E07A5F] ring-2 ring-[#E07A5F]/20'
              : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#78716C]'
          }`}>
            <div className="text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 text-[#E07A5F]">
              <Flame className="w-3 h-3" /> Due Today
            </div>
            <div className="text-2xl font-black font-mono text-[#E07A5F] mt-0.5">{dueCount}</div>
          </div>

          {/* In Learning Cycle */}
          <div className="px-4 py-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-center shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#3D405B]">In Cycle (S1/S2)</div>
            <div className="text-2xl font-black font-mono text-[#3D405B] mt-0.5">{stage1Count + stage2Count}</div>
          </div>

          {/* Mastered Skills (Emerald Accent) */}
          <div className="px-4 py-3 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/40 text-center shadow-2xs">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#2A9D8F] flex items-center justify-center gap-1">
              <Award className="w-3 h-3 text-[#2A9D8F]" /> Mastered 🎯
            </div>
            <div className="text-2xl font-black font-mono text-[#2A9D8F] mt-0.5">{masteredCount}</div>
          </div>
        </div>
      </div>

      {/* 2. ADVANCED FILTER & SEARCH CONTROLS */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-[#E5E0D8] shadow-2xs space-y-3.5">
        {/* Stage Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'ALL', label: `All Mistakes (${mistakes.length})` },
            { id: 'DUE', label: `🔥 Due for Review (${dueCount})`, isDue: true },
            { id: 1, label: `Stage 1: Learning (${stage1Count})` },
            { id: 2, label: `Stage 2: Review Due (${stage2Count})` },
            { id: 'MASTERED', label: `🎯 Mastered (${masteredCount})`, isMastered: true },
          ].map((tab) => {
            const isSelected = selectedStageFilter === tab.id;
            return (
              <button
                key={String(tab.id)}
                onClick={() => setSelectedStageFilter(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 text-xs ${
                  isSelected
                    ? tab.isMastered
                      ? 'bg-[#2A9D8F] text-white shadow-sm ring-2 ring-[#2A9D8F]/30'
                      : tab.isDue
                      ? 'bg-[#E07A5F] text-white shadow-sm ring-2 ring-[#E07A5F]/30'
                      : 'bg-[#1E1B18] text-white shadow-sm'
                    : tab.isMastered
                    ? 'bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-[#2A9D8F] hover:bg-[#2A9D8F]/20'
                    : tab.isDue
                    ? 'bg-[#E07A5F]/10 border border-[#E07A5F]/30 text-[#E07A5F] hover:bg-[#E07A5F]/20'
                    : 'bg-[#FAF8F5] border border-[#E5E0D8] text-[#57534E] hover:text-[#1E1B18] hover:bg-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Secondary Filter Bar: Section, Domain, Source, Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-2 border-t border-[#E5E0D8] text-xs">
          {/* Section Filter */}
          <div className="lg:col-span-3 flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8]">
            <button
              onClick={() => setSelectedSectionFilter('ALL')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                selectedSectionFilter === 'ALL' ? 'bg-white text-[#1E1B18] shadow-xs' : 'text-[#78716C]'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setSelectedSectionFilter('READING_AND_WRITING')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                selectedSectionFilter === 'READING_AND_WRITING' ? 'bg-white text-[#1E1B18] shadow-xs' : 'text-[#78716C]'
              }`}
            >
              RW
            </button>
            <button
              onClick={() => setSelectedSectionFilter('MATH')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition-all text-[11px] ${
                selectedSectionFilter === 'MATH' ? 'bg-white text-[#1E1B18] shadow-xs' : 'text-[#78716C]'
              }`}
            >
              Math
            </button>
          </div>

          {/* Domain Dropdown */}
          <div className="lg:col-span-3">
            <select
              value={selectedDomainFilter}
              onChange={(e) => setSelectedDomainFilter(e.target.value)}
              aria-label="Filter by Domain"
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E07A5F]"
            >
              <option value="ALL">All Domains</option>
              {availableDomains.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedSourceFilter}
              onChange={(e) => setSelectedSourceFilter(e.target.value as any)}
              aria-label="Filter by Source"
              className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E07A5F]"
            >
              <option value="ALL">All Sources</option>
              <option value="MOCK_TEST">Mock Test</option>
              <option value="DAILY_WORKOUT">Daily Workout</option>
              <option value="QUESTION_BANK">Question Bank</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill, passage, or problem text..."
              className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs text-[#1E1B18] placeholder-[#A8A29E] focus:outline-none focus:border-[#E07A5F]"
            />
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: LEFT LIST (5 COLS) + RIGHT ACTIVE STUDIO (7 COLS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Mistake Queue List */}
        <div className="lg:col-span-5 space-y-3">
          {filteredMistakes.length === 0 ? (
            <div className="p-8 text-center bg-white border border-[#E5E0D8] rounded-3xl text-[#78716C] text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#2A9D8F] mx-auto" />
              <p className="font-bold text-sm text-[#1E1B18]">No mistakes found in this view!</p>
              <p className="text-[#78716C]">Try selecting another filter or complete new tests to populate your vault.</p>
            </div>
          ) : (
            filteredMistakes.map((item) => {
              const isSelected = activeItem?.id === item.id;
              const streak = item.consecutiveCorrectCount ?? 0;
              const isMastered = item.isMastered || streak >= 3;
              const isDue = new Date(item.nextReviewAt) <= new Date() && !isMastered;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveItemId(item.id);
                    setPracticeSubmitted(false);
                    setPracticeAnswer('');
                    setClonePracticeSubmitted(false);
                    setClonePracticeAnswer('');
                    setLastPracticeCorrect(null);
                    if (!item.aiTrapAnalysis) {
                      handleFetchTrapAnalysis(item);
                    }
                  }}
                  className={`p-4 rounded-2xl border-l-4 cursor-pointer transition-all shadow-2xs relative ${
                    isMastered
                      ? 'border-l-[#2A9D8F] bg-[#2A9D8F]/5'
                      : isDue
                      ? 'border-l-[#E07A5F] bg-[#E07A5F]/5'
                      : item.stage === 2
                      ? 'border-l-[#E9C46A]'
                      : 'border-l-[#3D405B]'
                  } ${
                    isSelected
                      ? isMastered
                        ? 'bg-[#2A9D8F]/10 border-y border-r border-[#2A9D8F]/50 shadow-sm ring-2 ring-[#2A9D8F]/30'
                        : 'bg-white border-y border-r border-[#E07A5F] shadow-sm ring-2 ring-[#E07A5F]/20'
                      : 'bg-white border-y border-r border-[#E5E0D8] hover:border-[#D6CEBE] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isMastered ? (
                        <span className="px-2 py-0.5 rounded-full font-extrabold text-[10px] bg-[#2A9D8F] text-white flex items-center gap-1 shadow-2xs uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Mastered (3/3)
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          item.stage === 2
                            ? 'bg-[#E9C46A]/20 text-[#854D0E] border border-[#E9C46A]/40'
                            : 'bg-[#FAF8F5] text-[#3D405B] border border-[#E5E0D8]'
                        }`}>
                          STAGE {item.stage} ({item.stage === 1 ? 'Learning' : 'Review Due'})
                        </span>
                      )}

                      <span className="text-[#D6CEBE]">•</span>
                      <span className="text-[#57534E] font-bold truncate max-w-[130px]">{item.question.skill}</span>
                    </div>

                    {isDue && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full border border-[#E07A5F]/30 shrink-0 animate-pulse">
                        <Flame className="w-3 h-3" /> Due Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#1E1B18] line-clamp-2 leading-relaxed font-sans font-medium">
                    {item.question.passage || item.question.questionText}
                  </p>

                  {/* 3-Dot Leitner Streak Tracker */}
                  <div className="mt-3 pt-2.5 border-t border-[#E5E0D8] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            streak >= 1 ? 'bg-[#2A9D8F] ring-1 ring-[#2A9D8F]/40' : 'bg-[#E5E0D8]'
                          }`}
                          title="Stage 1 Review Check"
                        />
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            streak >= 2 ? 'bg-[#2A9D8F] ring-1 ring-[#2A9D8F]/40' : 'bg-[#E5E0D8]'
                          }`}
                          title="Stage 2 Review Check"
                        />
                        <span
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            streak >= 3 ? 'bg-[#2A9D8F] ring-1 ring-[#2A9D8F]/40 animate-pulse' : 'bg-[#E5E0D8]'
                          }`}
                          title="Stage 3 Mastery Lock"
                        />
                      </div>

                      <span className={`text-[10px] font-bold ${isMastered ? 'text-[#2A9D8F]' : 'text-[#78716C]'}`}>
                        {isMastered ? '3/3 Retained' : `${streak}/3 Mastery Streak`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.clonedQuestion ? (
                        <span className="text-[10px] text-[#3D405B] flex items-center gap-1 font-bold">
                          <Sparkles className="w-3 h-3 text-[#E07A5F]" /> Clone Ready
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#78716C]">
                          Missed: <strong className="text-rose-600">{item.userWrongAnswer}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Side: Active Diagnostic & Clone Studio */}
        <div className="lg:col-span-7">
          {activeItem ? (
            <div className="bg-white/90 backdrop-blur-md border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Mastered Celebration Banner */}
              {(activeItem.isMastered || (activeItem.consecutiveCorrectCount ?? 0) >= 3) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2A9D8F] to-[#1E6B61] text-white shadow-md border border-[#2A9D8F]/50 flex items-center justify-between gap-4 animate-in zoom-in-95">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black shrink-0">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#2A9D8F] text-[10px] font-mono font-black uppercase">
                        ★ SKILL MASTERED 🎯
                      </span>
                      <h4 className="text-sm font-bold mt-0.5">3 Consecutive Correct Reviews Recorded!</h4>
                      <p className="text-[11px] text-emerald-100">Next scheduled maintenance re-test in 60 days.</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-white text-[#2A9D8F] font-black text-xs shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> MASTERED
                  </span>
                </div>
              )}

              {/* Header Info & Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E5E0D8]">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-[#1E1B18]">{activeItem.question.skill}</span>
                    <span className="text-[#D6CEBE]">•</span>
                    <span className="text-[#78716C]">{activeItem.question.domain}</span>
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-0.5 flex items-center gap-2">
                    <span>
                      Next Review: <strong className="text-[#1E1B18]">{new Date(activeItem.nextReviewAt).toLocaleDateString()}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-[#2A9D8F] font-bold">
                      Streak: {activeItem.consecutiveCorrectCount ?? 0}/3
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenSocraticTutor(activeItem.question, activeItem.userWrongAnswer)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F0EB] border border-[#E5E0D8] text-[#3D405B] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Socratic Coach</span>
                  </button>

                  <button
                    onClick={() => handleGenerateClone(activeItem)}
                    disabled={isGeneratingClone}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-[#E9C46A] ${isGeneratingClone ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingClone ? 'Synthesizing...' : 'Generate Practice Clone'}</span>
                    {!isPro && <Crown className="w-3 h-3 fill-[#E9C46A] text-[#E9C46A] ml-0.5" />}
                  </button>
                </div>
              </div>

              {/* 3-Way Mode Switcher (Trap Analysis / Retest / AI Clone) */}
              <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] text-xs font-bold">
                <button
                  onClick={() => {
                    setActiveTab('TRAP_ANALYSIS');
                    if (!activeItem.aiTrapAnalysis) handleFetchTrapAnalysis(activeItem);
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'TRAP_ANALYSIS'
                      ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                      : 'text-[#78716C] hover:text-[#1E1B18]'
                  }`}
                >
                  <Search className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>AI Trap Diagnostic</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('RETEST');
                    setPracticeSubmitted(false);
                    setPracticeAnswer('');
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'RETEST'
                      ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                      : 'text-[#78716C] hover:text-[#1E1B18]'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#3D405B]" />
                  <span>Original Re-Test</span>
                </button>

                <button
                  onClick={() => {
                    if (!activeItem.clonedQuestion) {
                      handleGenerateClone(activeItem);
                    } else {
                      setActiveTab('CLONE_STUDIO');
                      setClonePracticeSubmitted(false);
                      setClonePracticeAnswer('');
                    }
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'CLONE_STUDIO'
                      ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                      : 'text-[#78716C] hover:text-[#1E1B18]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>{activeItem.clonedQuestion ? 'AI Cloned Variant' : 'Generate Clone'}</span>
                </button>
              </div>

              {/* TAB 1: AI TRAP DIAGNOSTIC MODE */}
              {activeTab === 'TRAP_ANALYSIS' && (
                <div className="space-y-4">
                  {isLoadingTrapAnalysis ? (
                    <div className="p-10 text-center bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] space-y-3">
                      <BrainCircuit className="w-8 h-8 text-[#E07A5F] animate-pulse mx-auto" />
                      <p className="text-xs font-bold text-[#1E1B18]">Gemini AI is performing cognitive trap diagnosis...</p>
                      <p className="text-[11px] text-[#78716C]">Analyzing distractor psychology for option {activeItem.userWrongAnswer}.</p>
                    </div>
                  ) : activeItem.aiTrapAnalysis ? (
                    <div className="space-y-4">
                      {/* Audio Narration Bar */}
                      <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-[#E07A5F]/10 text-[#E07A5F] font-mono font-bold text-[10px]">
                            {activeItem.aiTrapAnalysis.cognitiveBias || 'Psychological Trap'}
                          </span>
                          <span className="text-[#78716C] text-[11px]">Cognitive Error Breakdown</span>
                        </div>

                        <button
                          onClick={() => handleToggleSpeakTrap(activeItem.aiTrapAnalysis)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                            isSpeakingTrap
                              ? 'bg-[#E07A5F] text-white border-[#E07A5F] animate-pulse'
                              : 'bg-white text-[#78716C] hover:text-[#1E1B18] border-[#E5E0D8]'
                          }`}
                        >
                          {isSpeakingTrap ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>Stop Narration</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-[#E07A5F]" />
                              <span>Listen to Diagnostic</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* 1. Core Rule Missed */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                        <div className="text-[11px] font-mono font-bold text-[#3D405B] uppercase flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#3D405B]" />
                          <span>1. Core Rule / Formula Overlooked</span>
                        </div>
                        <FormattedMathText
                          text={activeItem.aiTrapAnalysis.coreRuleMissed}
                          className="text-xs text-[#1E1B18] leading-relaxed"
                        />
                      </div>

                      {/* 2. Why the Trap Was Chosen */}
                      <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-rose-800 uppercase flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-rose-600" />
                          <span>2. Why Choice "{activeItem.userWrongAnswer}" Was Psychologically Tempting</span>
                        </div>
                        <FormattedMathText
                          text={activeItem.aiTrapAnalysis.trapReason}
                          className="text-xs text-rose-950 leading-relaxed"
                        />
                      </div>

                      {/* 3. 10-Second Prevention Strategy */}
                      <div className="p-4 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-[#2A9D8F] uppercase flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-[#2A9D8F]" />
                          <span>3. 10-Second Prevention Strategy & Mental Filter</span>
                        </div>
                        <FormattedMathText
                          text={activeItem.aiTrapAnalysis.preventionStrategy}
                          className="text-xs text-emerald-950 leading-relaxed font-medium"
                        />
                      </div>

                      {/* Launch Re-Test CTA */}
                      <button
                        onClick={() => {
                          setActiveTab('RETEST');
                          setPracticeSubmitted(false);
                          setPracticeAnswer('');
                        }}
                        className="w-full py-3 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Ready to Re-test Now (Update Mastery Streak)</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8]">
                      <button
                        onClick={() => handleFetchTrapAnalysis(activeItem)}
                        className="px-4 py-2 rounded-xl bg-[#E07A5F] text-white text-xs font-bold cursor-pointer"
                      >
                        Generate AI Trap Diagnosis
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ORIGINAL QUESTION RE-TEST */}
              {activeTab === 'RETEST' && (
                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3D405B]">
                      <RotateCcw className="w-3.5 h-3.5 text-[#E07A5F]" />
                      <span>Original Question Re-Test (Attempt #{((activeItem.consecutiveCorrectCount ?? 0) + 1)})</span>
                    </span>

                    <span className="text-[11px] font-bold text-[#78716C]">
                      Streak: <strong className="text-[#2A9D8F]">{activeItem.consecutiveCorrectCount ?? 0}/3</strong>
                    </span>
                  </div>

                  {activeItem.question.passage && (
                    <div className="p-4 bg-white rounded-xl text-xs text-[#1E1B18] font-serif leading-relaxed border border-[#E5E0D8]">
                      {activeItem.question.passage}
                    </div>
                  )}

                  <FormattedMathText
                    text={activeItem.question.questionText}
                    className="text-xs sm:text-sm font-semibold text-[#1E1B18] whitespace-pre-line leading-relaxed"
                  />

                  {/* Options */}
                  {activeItem.question.options && (
                    <div className="space-y-2 pt-2">
                      {Object.entries(activeItem.question.options).map(([k, optText]) => {
                        const isSelected = practiceAnswer === k;
                        const isCorrect = k.trim().toUpperCase() === activeItem.question.correctAnswer.trim().toUpperCase();
                        const isOldWrong = k.trim().toUpperCase() === activeItem.userWrongAnswer.trim().toUpperCase();

                        return (
                          <button
                            key={k}
                            onClick={() => {
                              if (!practiceSubmitted) setPracticeAnswer(k);
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                              practiceSubmitted
                                ? isCorrect
                                  ? 'bg-[#2A9D8F]/15 border-[#2A9D8F] text-[#1E1B18] font-bold ring-1 ring-[#2A9D8F]'
                                  : isSelected
                                  ? 'bg-rose-50 border-rose-400 text-rose-900'
                                  : 'bg-white border-[#E5E0D8] opacity-50'
                                : isSelected
                                ? 'bg-white border-[#E07A5F] text-[#1E1B18] font-bold ring-2 ring-[#E07A5F]'
                                : 'bg-white border-[#E5E0D8] hover:bg-[#F5F0EB] text-[#1E1B18]'
                            }`}
                          >
                            <span className="font-bold font-mono text-[#3D405B] shrink-0">{k}.</span>
                            <span className="flex-1">
                              <FormattedMathText text={optText} />
                            </span>
                            {!practiceSubmitted && isOldWrong && (
                              <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 font-semibold shrink-0">
                                Your past mistake
                              </span>
                            )}
                            {practiceSubmitted && isCorrect && (
                              <span className="text-[10px] font-bold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded shrink-0">
                                ✓ Correct Answer
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Submit Button & Feedback */}
                  {!practiceSubmitted ? (
                    <button
                      onClick={() => handlePracticeSubmit(activeItem, activeItem.question)}
                      disabled={!practiceAnswer}
                      className="w-full py-3 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Answer & Update SRS Streak</span>
                    </button>
                  ) : (
                    <div className="pt-3 border-t border-[#E5E0D8] space-y-3">
                      <div className={`p-4 rounded-xl text-xs space-y-1.5 ${
                        lastPracticeCorrect
                          ? 'bg-[#2A9D8F]/10 text-emerald-950 border border-[#2A9D8F]/30'
                          : 'bg-rose-50 text-rose-950 border border-rose-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <strong className="text-sm font-extrabold flex items-center gap-1.5">
                            {lastPracticeCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
                                <span>Brilliant! Correctly Solved.</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                                <span>Incorrect Choice.</span>
                              </>
                            )}
                          </strong>

                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white border border-[#E5E0D8]">
                            Mastery Streak: {activeItem.consecutiveCorrectCount ?? 0} / 3
                          </span>
                        </div>

                        <FormattedMathText
                          text={activeItem.question.explanation}
                          className="text-[#57534E] leading-relaxed pt-1"
                        />
                      </div>

                      {/* Manual Leitner Override Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <span className="text-xs text-[#78716C]">Manual Leitner Override:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdvanceStage(activeItem, false)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
                          >
                            Reset Streak (0/3)
                          </button>
                          <button
                            onClick={() => handleAdvanceStage(activeItem, true)}
                            className="px-3.5 py-1.5 rounded-xl bg-[#2A9D8F] hover:bg-[#1E6B61] text-white text-xs font-bold shadow-2xs cursor-pointer flex items-center gap-1"
                          >
                            <span>+1 Correct Review</span>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: AI CLONE QUESTION STUDIO */}
              {activeTab === 'CLONE_STUDIO' && (
                <div className="space-y-4">
                  {activeItem.clonedQuestion ? (
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#3D405B]">
                          <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
                          <span>AI Cloned Problem Twin (Isomorphic Skill Test)</span>
                        </span>

                        <button
                          onClick={() => handleGenerateClone(activeItem)}
                          disabled={isGeneratingClone}
                          className="text-[11px] font-bold text-[#E07A5F] hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Regenerate Variant
                        </button>
                      </div>

                      {activeItem.clonedQuestion.passage && (
                        <div className="p-4 bg-white rounded-xl text-xs text-[#1E1B18] font-serif leading-relaxed border border-[#E5E0D8]">
                          {activeItem.clonedQuestion.passage}
                        </div>
                      )}

                      <FormattedMathText
                        text={activeItem.clonedQuestion.questionText}
                        className="text-xs sm:text-sm font-semibold text-[#1E1B18] whitespace-pre-line leading-relaxed"
                      />

                      {/* Cloned Options */}
                      {activeItem.clonedQuestion.options && (
                        <div className="space-y-2 pt-2">
                          {Object.entries(activeItem.clonedQuestion.options).map(([k, optText]) => {
                            const isSelected = clonePracticeAnswer === k;
                            const isCorrect = k.trim().toUpperCase() === activeItem.clonedQuestion?.correctAnswer.trim().toUpperCase();

                            return (
                              <button
                                key={k}
                                onClick={() => {
                                  if (!clonePracticeSubmitted) setClonePracticeAnswer(k);
                                }}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                                  clonePracticeSubmitted
                                    ? isCorrect
                                      ? 'bg-[#2A9D8F]/15 border-[#2A9D8F] text-[#1E1B18] font-bold ring-1 ring-[#2A9D8F]'
                                      : isSelected
                                      ? 'bg-rose-50 border-rose-400 text-rose-900'
                                      : 'bg-white border-[#E5E0D8] opacity-50'
                                    : isSelected
                                    ? 'bg-white border-[#E07A5F] text-[#1E1B18] font-bold ring-2 ring-[#E07A5F]'
                                    : 'bg-white border-[#E5E0D8] hover:bg-[#F5F0EB] text-[#1E1B18]'
                                }`}
                              >
                                <span className="font-bold font-mono text-[#3D405B] shrink-0">{k}.</span>
                                <span className="flex-1">
                                  <FormattedMathText text={optText} />
                                </span>
                                {clonePracticeSubmitted && isCorrect && (
                                  <span className="text-[10px] font-bold text-[#2A9D8F] bg-[#2A9D8F]/10 px-2 py-0.5 rounded shrink-0">
                                    ✓ Correct Key
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Cloned Submission */}
                      {!clonePracticeSubmitted ? (
                        <button
                          onClick={() => handleClonePracticeSubmit(activeItem, activeItem.clonedQuestion!)}
                          disabled={!clonePracticeAnswer}
                          className="w-full py-3 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] disabled:opacity-40 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          <span>Validate Cloned Variant Answer</span>
                        </button>
                      ) : (
                        <div className="pt-3 border-t border-[#E5E0D8] space-y-3">
                          <div className="p-4 rounded-xl text-xs bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                            <strong className="text-sm font-bold text-[#1E1B18] flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
                              <span>Step-by-Step Solution Breakdown</span>
                            </strong>
                            <FormattedMathText
                              text={activeItem.clonedQuestion.explanation}
                              className="text-[#57534E] leading-relaxed pt-1"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] space-y-3">
                      <Sparkles className="w-8 h-8 text-[#E9C46A] mx-auto" />
                      <p className="font-bold text-sm text-[#1E1B18]">No Cloned Variant Generated Yet</p>
                      <p className="text-xs text-[#78716C]">
                        Generate an isomorphic problem twin targeting the exact same skill with novel numbers.
                      </p>
                      <button
                        onClick={() => handleGenerateClone(activeItem)}
                        disabled={isGeneratingClone}
                        className="px-5 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                        <span>{isGeneratingClone ? 'Synthesizing Clone...' : 'Generate Practice Clone'}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-white border border-[#E5E0D8] rounded-3xl text-[#78716C] text-sm">
              Select a mistake item from the left queue to open the diagnostic studio.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
