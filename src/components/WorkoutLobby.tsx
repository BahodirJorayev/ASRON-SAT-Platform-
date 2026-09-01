import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Clock,
  Zap,
  Target,
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  BookOpen,
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sliders,
  TrendingUp,
  Award,
  CircleDot
} from 'lucide-react';
import { User, WorkoutMode, StudyPlan } from '../types';
import { SAT_STUDY_PLANS } from '../data/studyPlansData';

interface WorkoutLobbyProps {
  user: User;
  selectedMode: WorkoutMode;
  onSelectMode: (mode: WorkoutMode) => void;
  onLaunchWorkout: (mode: WorkoutMode, planDay?: number) => void;
  isLoading?: boolean;
}

export const WorkoutLobby: React.FC<WorkoutLobbyProps> = ({
  user,
  selectedMode,
  onSelectMode,
  onLaunchWorkout,
  isLoading = false,
}) => {
  const [activePlanTab, setActivePlanTab] = useState<'MODES' | 'STUDY_PLANS'>('MODES');
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan>(SAT_STUDY_PLANS[0]);
  const [selectedPlanDay, setSelectedPlanDay] = useState<number>(3); // current active day

  // Target Exam Countdown calculation
  const targetDateStr = user.targetExamDate || '2026-10-03';
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number }>({
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = Math.max(0, targetTime - now);

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, mins, secs });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // Weakest subskills list
  const weakSkills = user.weakestSubSkills && user.weakestSubSkills.length > 0
    ? user.weakestSubSkills
    : ['Transitions', 'Nonlinear Equations', 'Boundaries'];

  // Consistency dots for the current week (7 days)
  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedDaysMask = [true, true, true, true, true, false, false]; // e.g. 5 days active this week

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Status Header: Target SAT Countdown & Daily Streak Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Card: Exam Countdown */}
        <div className="md:col-span-6 p-5 sm:p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#FAF5F0] text-[#E07A5F] border border-[#EBE3D9]">
                <Calendar size={16} />
              </span>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#78716C]">
                  Target Exam Countdown
                </span>
                <div className="text-xs text-[#3D405B] font-medium">
                  {new Date(targetDateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#FAF5F0] text-[#E07A5F] border border-[#EBE3D9]">
              Goal: {user.targetScore || 1550}+
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EBE4] grid grid-cols-4 gap-2 text-center">
            <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">Days</div>
            </div>
            <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">Hours</div>
            </div>
            <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
                {String(timeLeft.mins).padStart(2, '0')}
              </div>
              <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">Mins</div>
            </div>
            <div className="p-2 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#E07A5F]">
                {String(timeLeft.secs).padStart(2, '0')}
              </div>
              <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">Secs</div>
            </div>
          </div>
        </div>

        {/* Right Card: Streak & Consistency Heatmap */}
        <div className="md:col-span-6 p-5 sm:p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
                className="p-2 rounded-xl bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE]"
              >
                <Flame size={18} className="fill-[#E07A5F]" />
              </motion.div>
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#78716C]">
                  Daily Habit Momentum
                </span>
                <div className="text-sm font-bold text-[#1E1B18] flex items-center gap-1.5">
                  🔥 {user.streakDays || 7} Days Active
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE]">
                    Protected
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-[#78716C]">Freezes Left</div>
              <div className="text-xs font-mono font-bold text-[#3D405B]">🛡️ {user.streakFreezes ?? 2} Available</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EBE4]">
            <div className="flex items-center justify-between text-[11px] text-[#78716C] mb-2 font-medium">
              <span>Weekly Consistency Heatmap</span>
              <span className="text-[#2A9D8F] font-bold">5 / 7 Complete</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {weekdayNames.map((day, idx) => {
                const isDone = completedDaysMask[idx];
                const isToday = idx === 4; // Friday
                return (
                  <div
                    key={day}
                    className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-[#2A9D8F]/10 border-[#2A9D8F]/30 text-[#2A9D8F]'
                        : isToday
                        ? 'bg-[#E07A5F]/10 border-[#E07A5F] text-[#E07A5F] ring-1 ring-[#E07A5F]/30'
                        : 'bg-[#FAF8F5] border-[#EBE5DF] text-[#A8A29E]'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase">{day}</span>
                    <div className="mt-1">
                      {isDone ? (
                        <CheckCircle2 size={13} className="fill-[#2A9D8F] text-white" />
                      ) : (
                        <div className={`w-2.5 h-2.5 rounded-full ${isToday ? 'bg-[#E07A5F] animate-pulse' : 'bg-[#D6D3D1]'}`} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Controller: Mode Selection vs Structured Study Plans */}
      <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F0EBE4] pb-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#E07A5F]">
              Curated Cognitive Training
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E1B18] tracking-tight mt-0.5">
              Daily SAT Focus Engine
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              Complete 5 high-yield questions every morning to protect your streak and lock in permanent score gains.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] self-start sm:self-auto">
            <button
              onClick={() => setActivePlanTab('MODES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activePlanTab === 'MODES'
                  ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#78716C] hover:text-[#1E1B18]'
              }`}
            >
              Workout Modes
            </button>
            <button
              onClick={() => setActivePlanTab('STUDY_PLANS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activePlanTab === 'STUDY_PLANS'
                  ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#78716C] hover:text-[#1E1B18]'
              }`}
            >
              <BookOpen size={13} className="text-[#E07A5F]" />
              Study Plans & Roadmap
            </button>
          </div>
        </div>

        {/* TAB 1: WORKOUT MODES (Adaptive Weakness, Speed Blitz, Mixed Daily Mix) */}
        {activePlanTab === 'MODES' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mode 1: Adaptive Weakness */}
              <div
                onClick={() => onSelectMode('ADAPTIVE_WEAKNESS')}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  selectedMode === 'ADAPTIVE_WEAKNESS'
                    ? 'bg-[#FAF5F0] border-[#E07A5F] ring-2 ring-[#E07A5F]/20 shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE]">
                      <BrainCircuit size={18} />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E07A5F] text-white">
                      RECOMMENDED
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Adaptive Weakness</h3>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      5 targeted questions precisely calibrated to your 3 lowest-scoring subskills.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE4] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                    Targeting Weak Skills:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {weakSkills.slice(0, 2).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#3D405B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode 2: Speed Blitz */}
              <div
                onClick={() => onSelectMode('SPEED_BLITZ')}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  selectedMode === 'SPEED_BLITZ'
                    ? 'bg-[#FAF5F0] border-[#E07A5F] ring-2 ring-[#E07A5F]/20 shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-[#FFF8EE] text-[#D97706] border border-[#FDE68A]">
                      <Zap size={18} />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FFF8EE] text-[#D97706] border border-[#FDE68A]">
                      45s / Question
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Speed Blitz Sprint</h3>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      High-adrenaline rapid drill under strict 45-second per-question constraints.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE4] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                    Pacing Target:
                  </div>
                  <div className="text-xs font-mono font-bold text-[#3D405B]">
                    ⚡ Total Time: 3 mins 45 secs
                  </div>
                </div>
              </div>

              {/* Mode 3: Mixed Daily Mix */}
              <div
                onClick={() => onSelectMode('MIXED_DAILY')}
                className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left ${
                  selectedMode === 'MIXED_DAILY'
                    ? 'bg-[#FAF5F0] border-[#E07A5F] ring-2 ring-[#E07A5F]/20 shadow-xs'
                    : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8]'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-[#F0F5FA] text-[#3D405B] border border-[#D5E0EB]">
                      <Layers size={18} />
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F0F5FA] text-[#3D405B] border border-[#D5E0EB]">
                      Official Balance
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1E1B18]">Mixed Daily Mix</h3>
                    <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                      3 Reading & Writing + 2 Math questions mirroring official SAT section balance.
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#F0EBE4] space-y-2">
                  <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
                    Structure:
                  </div>
                  <div className="text-xs font-mono font-bold text-[#3D405B]">
                    📖 3 R&W &bull; 📐 2 Math
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STRUCTURED DAILY STUDY PLANS (Kunlik mashqlar rejalari) */}
        {activePlanTab === 'STUDY_PLANS' && (
          <div className="space-y-5">
            {/* Plan Selector Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAT_STUDY_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedPlan.id === plan.id
                      ? 'bg-[#FAF5F0] border-[#E07A5F] ring-1 ring-[#E07A5F]'
                      : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E1B18]">{plan.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[#78716C]">
                      {plan.durationDays} Days
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78716C] mt-1">{plan.dailyCommitment}</div>
                </button>
              ))}
            </div>

            {/* Curriculum Roadmap Grid */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs uppercase font-bold text-[#78716C] tracking-wider">
                    {selectedPlan.title} &bull; Daily Workout Schedule
                  </h4>
                  <p className="text-xs text-[#3D405B] mt-0.5">{selectedPlan.description}</p>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE]">
                  Target: {selectedPlan.targetScore}
                </span>
              </div>

              <div className="divide-y divide-[#EBE5DF] mt-2">
                {selectedPlan.curriculum.map((dayItem) => {
                  const isCurrent = dayItem.day === selectedPlanDay;
                  return (
                    <div
                      key={dayItem.day}
                      onClick={() => setSelectedPlanDay(dayItem.day)}
                      className={`py-3 px-3 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-white shadow-xs border border-[#E07A5F]/40'
                          : 'hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            dayItem.isCompleted
                              ? 'bg-[#2A9D8F] text-white'
                              : isCurrent
                              ? 'bg-[#E07A5F] text-white'
                              : 'bg-[#EBE5DF] text-[#78716C]'
                          }`}
                        >
                          {dayItem.isCompleted ? '✓' : dayItem.day}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#1E1B18] truncate">
                            Day {dayItem.day}: {dayItem.title}
                          </div>
                          <div className="text-[11px] text-[#78716C] flex items-center gap-2">
                            <span>{dayItem.section === 'MATH' ? '📐 Math' : dayItem.section === 'READING_AND_WRITING' ? '📖 R&W' : '⚡ Mixed'}</span>
                            <span>&bull;</span>
                            <span className="truncate">{dayItem.targetSkill}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {dayItem.isCompleted ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EBF8F5] text-[#2A9D8F]">
                            {dayItem.score}/5 Score
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE]">
                            Today's Focus
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#A8A29E]">10 min</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. Target Rewards Preview Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF8EE] text-[#D97706] border border-[#FDE68A]">
              <Trophy size={20} />
            </div>
            <div>
              <div className="text-xs font-bold text-[#1E1B18]">Guaranteed Workout Rewards</div>
              <div className="text-[11px] text-[#78716C] mt-0.5 flex flex-wrap items-center gap-2">
                <span>⭐ <strong>+25 Base XP</strong></span>
                <span>&bull;</span>
                <span>🔥 <strong>Streak Preserved</strong></span>
                <span>&bull;</span>
                <span className="text-[#2A9D8F]">⚡ <strong>+10 XP Speed Bonus</strong> (&lt; 7 mins &amp; &ge;80% accuracy)</span>
              </div>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-[#E07A5F]">Total Potential: +35 XP</span>
          </div>
        </div>

        {/* 4. Primary High-Contrast Launch CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#78716C] text-center sm:text-left">
            Estimated time: <strong className="text-[#1E1B18]">{selectedMode === 'SPEED_BLITZ' ? '3:45 mins' : '10:00 mins'}</strong> &bull; 5 Questions &bull; Bluebook Format
          </div>

          <button
            onClick={() => {
              if (activePlanTab === 'STUDY_PLANS') {
                onLaunchWorkout('TARGET_PLAN', selectedPlanDay);
              } else {
                onLaunchWorkout(selectedMode);
              }
            }}
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing Session...</span>
              </>
            ) : (
              <>
                <span>{selectedMode === 'SPEED_BLITZ' ? 'Launch Speed Blitz (3:45)' : 'Launch Workout (10:00)'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
