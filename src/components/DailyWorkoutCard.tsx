import React from 'react';
import { Zap, Play, Clock, Award, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface Props {
  user: User;
  onStartWorkout: () => void;
  targetDomain?: string;
  isCompletedToday?: boolean;
}

export const DailyWorkoutCard: React.FC<Props> = ({
  user,
  onStartWorkout,
  targetDomain = 'Advanced Math: Nonlinear Equations & Parabolas',
  isCompletedToday = false,
}) => {
  const streak = user.streakDays || 5;
  const xpReward = 20;
  const estimatedMins = 10;
  const questionCount = 5;

  return (
    <div className="rounded-2xl bg-[#1E1B18] text-[#F8FAFC] dark:bg-[#121A2F] border border-[#1E1B18] dark:border-[#1E293B] p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Side: Priority Banner & Details */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#FAF8F5]/10 border border-white/15 text-[#FAF8F5] text-[10px] font-mono uppercase tracking-wider">
              <Zap size={13} className="text-[#E07A5F]" />
              <span>Daily Routine</span>
            </span>

            {/* Streak Multiplier */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF8F5]/10 border border-white/15 text-[#FAF8F5] text-[10px] font-mono font-medium">
              <span>{streak}-Day Active Streak</span>
            </span>

            {/* XP Reward Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FAF8F5]/10 border border-white/15 text-[#94A3B8] text-[10px] font-mono">
              <Award size={13} />
              <span>+{xpReward} XP</span>
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>Daily 5-Question Habit Loop</span>
              {isCompletedToday && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Completed ✓
                </span>
              )}
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
              Targeted adaptive set focused on eliminating your highest-frequency error pattern:
            </p>
          </div>

          {/* Target Weakness Focus pill */}
          <div className="p-3 rounded-xl bg-[#2A2622] dark:bg-[#0A0F1D] border border-white/10 dark:border-[#1E293B] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center shrink-0">
                <Target size={15} />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] uppercase font-mono tracking-wider text-[#94A3B8]">
                  Target Domain
                </div>
                <div className="text-xs font-semibold text-white truncate max-w-md">
                  {user.weakestSubSkills?.[0] || targetDomain}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono text-[#94A3B8] shrink-0">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-[#E07A5F]" />
                ~{estimatedMins} min
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={13} />
                {questionCount} questions
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="shrink-0 flex flex-col items-stretch sm:items-end justify-center gap-2">
          <button
            onClick={onStartWorkout}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#E07A5F] hover:bg-[#d66e53] text-white font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Play size={15} className="fill-current" />
            <span>{isCompletedToday ? 'Practice Again' : 'Launch Daily Workout'}</span>
            <ChevronRight size={15} />
          </button>
          <span className="text-[10px] font-mono text-[#94A3B8] text-center sm:text-right">
            5 questions • Instant Socratic feedback
          </span>
        </div>
      </div>
    </div>
  );
};
