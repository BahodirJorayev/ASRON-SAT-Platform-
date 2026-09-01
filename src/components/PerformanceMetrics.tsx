import React from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Target,
  Crown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { User, MistakeVaultItem } from '../types';

interface Props {
  user: User;
  mistakes: MistakeVaultItem[];
  onOpenMistakeVault: () => void;
  onOpenDiagnostic?: () => void;
  onOpenPaywall?: () => void;
}

export const PerformanceMetrics: React.FC<Props> = ({
  user,
  mistakes,
  onOpenMistakeVault,
  onOpenDiagnostic,
  onOpenPaywall,
}) => {
  const isPro = user.planTier === 'PRO';

  // Card 1 values: Predicted Score
  const predictedScore = user.predictedScore || 1470;
  const targetScore = user.targetScore || 1550;
  const baselineScore = user.baselineScore || 1280;
  
  // Math & RW breakdown
  const mathScore = 760;
  const rwScore = 710;

  // Card 2 values: Accuracy & Volume
  const accuracyRate = 91.4; // %
  const totalQuestionsSolved = (user.testsCompletedCount || 1) * 54 + (user.streakDays || 5) * 5 + 48;
  const avgTimePerQuestionSec = 56; // 56 seconds

  // Card 3 values: Mistake Vault & SRS
  const totalMistakes = mistakes.length || 14;
  const dueTodayCount = mistakes.filter(
    (m) => new Date(m.nextReviewAt) <= new Date() && !m.isMastered
  ).length || 3;
  const masteredCount = mistakes.filter((m) => m.isMastered).length || 8;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-sans">
      {/* CARD 1: AI PREDICTED SCORE */}
      <div className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                Predicted Score
              </span>
            </div>

            {isPro ? (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#1E1B18] dark:text-[#F8FAFC] font-semibold">
                PRO MODEL
              </span>
            ) : (
              <button
                onClick={onOpenPaywall}
                className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
              >
                <span>Upgrade</span>
                <ChevronRight size={11} />
              </button>
            )}
          </div>

          {/* Big Score Display */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#1E1B18] dark:text-[#F8FAFC]">
                {predictedScore}
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5 flex items-center gap-1.5 font-mono">
                <span>96% confidence</span>
                <span>•</span>
                <span className="text-[#0F766E] dark:text-[#14B8A6] font-semibold">+{predictedScore - baselineScore} pts growth</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[#64748B] dark:text-[#94A3B8]">Target</div>
              <div className="text-lg font-bold font-mono text-[#E07A5F] dark:text-[#E76F51]">{targetScore}</div>
            </div>
          </div>

          {/* RW vs Math Split Bars */}
          <div className="space-y-2.5 pt-2 border-t border-[#E5E0D8] dark:border-[#1E293B]">
            {/* Reading & Writing */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                <span>Reading & Writing</span>
                <span className="font-semibold text-[#1E1B18] dark:text-[#F8FAFC]">{rwScore} / 800</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1E1B18] dark:bg-[#94A3B8] rounded-full"
                  style={{ width: `${(rwScore / 800) * 100}%` }}
                />
              </div>
            </div>

            {/* Math */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                <span>Math (Desmos)</span>
                <span className="font-semibold text-[#1E1B18] dark:text-[#F8FAFC]">{mathScore} / 800</span>
              </div>
              <div className="w-full h-1.5 bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E07A5F] dark:bg-[#E76F51] rounded-full"
                  style={{ width: `${(mathScore / 800) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <button
          onClick={onOpenDiagnostic}
          className="w-full py-2 rounded-lg bg-[#FAF8F5] dark:bg-[#0A0F1D] hover:bg-[#F5F0EB] dark:hover:bg-[#1E293B] border border-[#E5E0D8] dark:border-[#1E293B] text-xs font-medium text-[#1E1B18] dark:text-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Score Forecast Diagnostic</span>
          <ArrowUpRight size={13} className="text-[#64748B] dark:text-[#94A3B8]" />
        </button>
      </div>

      {/* CARD 2: ACCURACY RATE & VOLUME */}
      <div className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Precision & Velocity
            </span>

            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0F766E] dark:text-[#14B8A6] font-semibold">
              Top 3% Speed
            </span>
          </div>

          {/* Big Accuracy Display */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#1E1B18] dark:text-[#F8FAFC]">
                {accuracyRate}%
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Overall Accuracy</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[#64748B] dark:text-[#94A3B8]">Solved</div>
              <div className="text-lg font-bold font-mono text-[#1E1B18] dark:text-[#F8FAFC]">{totalQuestionsSolved} items</div>
            </div>
          </div>

          {/* Stats Subgrid */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E0D8] dark:border-[#1E293B]">
            {/* Avg Time */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B]">
              <div className="text-[10px] font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">
                Pace / Item
              </div>
              <div className="text-base font-bold font-mono text-[#1E1B18] dark:text-[#F8FAFC] mt-0.5">
                {avgTimePerQuestionSec}s
              </div>
              <div className="text-[10px] font-mono text-[#0F766E] dark:text-[#14B8A6] mt-0.5">14s under budget</div>
            </div>

            {/* Hard Tier Acc */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B]">
              <div className="text-[10px] font-mono uppercase text-[#64748B] dark:text-[#94A3B8]">
                Hard Module 2
              </div>
              <div className="text-base font-bold font-mono text-[#1E1B18] dark:text-[#F8FAFC] mt-0.5">
                86.2%
              </div>
              <div className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] mt-0.5">High routing rate</div>
            </div>
          </div>
        </div>

        {/* Footer info pill */}
        <div className="py-2 px-3 rounded-lg bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center justify-between">
          <span>Weekly quota:</span>
          <span className="font-semibold text-[#1E1B18] dark:text-[#F8FAFC]">180 / 200 items (90%)</span>
        </div>
      </div>

      {/* CARD 3: MISTAKE VAULT & SRS TRACKER */}
      <div className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xs">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Mistake Vault SRS
            </span>

            {dueTodayCount > 0 ? (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E07A5F]/40 text-[#E07A5F] dark:text-[#E76F51] font-semibold">
                {dueTodayCount} DUE TODAY
              </span>
            ) : (
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0F766E] dark:text-[#14B8A6]">
                Up to date
              </span>
            )}
          </div>

          {/* Big Mistakes Counter */}
          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-[#1E1B18] dark:text-[#F8FAFC]">
                {totalMistakes}
              </div>
              <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">Cataloged Question Traps</div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-[#64748B] dark:text-[#94A3B8]">Mastered</div>
              <div className="text-lg font-bold font-mono text-[#0F766E] dark:text-[#14B8A6]">{masteredCount} items</div>
            </div>
          </div>

          {/* Leitner SRS Stages */}
          <div className="p-3 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono font-medium text-[#1E1B18] dark:text-[#F8FAFC]">
              <span>Leitner SRS Stages</span>
              <span className="text-[#E07A5F] dark:text-[#E76F51]">{dueTodayCount} due</span>
            </div>
            
            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
              <div className="p-1.5 rounded-md bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B]">
                <div className="font-bold text-[#E07A5F] dark:text-[#E76F51]">Stage 1</div>
                <div className="text-[#64748B] dark:text-[#94A3B8]">Day 3 ({dueTodayCount})</div>
              </div>
              <div className="p-1.5 rounded-md bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B]">
                <div className="font-bold text-[#1E1B18] dark:text-[#F8FAFC]">Stage 2</div>
                <div className="text-[#64748B] dark:text-[#94A3B8]">Day 7 (4)</div>
              </div>
              <div className="p-1.5 rounded-md bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B]">
                <div className="font-bold text-[#0F766E] dark:text-[#14B8A6]">Stage 3</div>
                <div className="text-[#64748B] dark:text-[#94A3B8]">Day 21 (7)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <button
          onClick={onOpenMistakeVault}
          className="w-full py-2 rounded-lg bg-[#1E1B18] hover:bg-[#2A2622] dark:bg-[#E07A5F] dark:hover:bg-[#d66e53] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Review Due Vault Traps ({dueTodayCount})</span>
        </button>
      </div>
    </div>
  );
};
