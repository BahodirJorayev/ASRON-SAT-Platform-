import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Flame,
  Trophy,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  Volume2,
  VolumeX,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';
import { Question, User, WorkoutSessionSummary, MistakeVaultItem } from '../types';
import { FormattedMath } from './WorkoutActiveSession';

interface WorkoutSummaryViewProps {
  summary: WorkoutSessionSummary;
  user: User;
  onReturnToDashboard: () => void;
  onOpenMistakeVault: () => void;
  onStartAnotherWorkout: () => void;
  onOpenSocraticTutor?: (question: Question, userWrongAnswer?: string) => void;
}

export const WorkoutSummaryView: React.FC<WorkoutSummaryViewProps> = ({
  summary,
  user,
  onReturnToDashboard,
  onOpenMistakeVault,
  onStartAnotherWorkout,
  onOpenSocraticTutor,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    summary.missedQuestions[0]?.id || null
  );

  // Gemini AI Trap Diagnosis State per question
  const [aiDiagnoses, setAiDiagnoses] = useState<Record<string, any>>({});
  const [loadingAiTrapId, setLoadingAiTrapId] = useState<string | null>(null);

  // Audio state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Instant AI Clone testing modal state
  const [activeCloneQuestion, setActiveCloneQuestion] = useState<Question | null>(null);
  const [cloneSelectedAnswer, setCloneSelectedAnswer] = useState<string>('');
  const [cloneSubmitted, setCloneSubmitted] = useState<boolean>(false);
  const [isGeneratingClone, setIsGeneratingClone] = useState<boolean>(false);

  // Trigger celebratory confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#E07A5F', '#2A9D8F', '#F4A261', '#3D405B'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const totalQuestions = summary.totalQuestions || 5;
  const isHighAccuracy = summary.accuracyPercentage >= 80;

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Fetch AI Trap Diagnosis from Gemini API
  const handleFetchAiTrapAnalysis = async (q: Question) => {
    if (aiDiagnoses[q.id]) return;

    setLoadingAiTrapId(q.id);
    const userWrong = summary.userAnswers[q.id] || 'Selected Wrong Choice';

    try {
      const res = await fetch('/api/gemini/trap-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          userWrongAnswer: userWrong,
          correctAnswer: q.correctAnswer,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiDiagnoses((prev) => ({ ...prev, [q.id]: data.analysis }));
      }
    } catch (err) {
      console.error('Error fetching trap analysis:', err);
    } finally {
      setLoadingAiTrapId(null);
    }
  };

  // Trigger Voice TTS for AI Trap Diagnosis
  const handlePlayAudio = (qId: string, text: string) => {
    if (playingAudioId === qId) {
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/\$|[*#]/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
      setPlayingAudioId(qId);
    }
  };

  // Generate and solve Instant AI Clone Question
  const handleSolveClone = async (originalQ: Question) => {
    setIsGeneratingClone(true);
    setCloneSelectedAnswer('');
    setCloneSubmitted(false);

    try {
      const res = await fetch('/api/gemini/clone-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalQuestion: originalQ }),
      });
      const data = await res.json();
      if (data.clonedQuestion) {
        setActiveCloneQuestion(data.clonedQuestion);
      }
    } catch (err) {
      console.error('Error generating clone:', err);
    } finally {
      setIsGeneratingClone(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 font-sans text-[#1E1B18]">
      {/* 1. CELEBRATION & STREAK UPDATE HERO CARD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE]">
                Workout Session Complete
              </span>
              <span className="text-xs text-[#78716C]">&bull; {summary.modeTitle}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight flex items-center gap-2.5">
              <span>{isHighAccuracy ? 'Exceptional Mastery!' : 'Daily Training Complete!'}</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-[#E07A5F]"
              >
                🔥
              </motion.span>
            </h1>

            <p className="text-xs sm:text-sm text-[#78716C] max-w-xl leading-relaxed">
              Your 5-question workout has been scored and analyzed. All missed concepts were automatically synced to your <strong>Mistake Vault</strong> with spaced repetition intervals.
            </p>
          </div>

          {/* Animated Flame & Streak Increment Badge */}
          <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] shrink-0 self-start sm:self-auto">
            <div className="p-3 rounded-2xl bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE]">
              <Flame size={26} className="fill-[#E07A5F]" />
            </div>
            <div>
              <div className="text-[11px] uppercase font-bold text-[#78716C] tracking-wider">
                Streak Saved
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-[#1E1B18]">
                🔥 {summary.streakDays} Days!
              </div>
              <div className="text-[10px] text-[#2A9D8F] font-bold mt-0.5">
                Active for today
              </div>
            </div>
          </div>
        </div>

        {/* 2. REWARDS & METRICS TICKER ROW */}
        <div className="mt-6 pt-6 border-t border-[#F0EBE4] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {/* Metric 1: Accuracy */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
              {summary.score} / {totalQuestions}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              Accuracy ({summary.accuracyPercentage}%)
            </div>
          </div>

          {/* Metric 2: Time Spent */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#1E1B18]">
              {formatTime(summary.timeSpentSeconds)}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              Pacing ({Math.round(summary.timeSpentSeconds / totalQuestions)}s / q)
            </div>
          </div>

          {/* Metric 3: XP Gained */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#2A9D8F] flex items-center justify-center gap-1">
              +{summary.xpEarned} XP
              {summary.speedBonusXP > 0 && <span className="text-xs text-[#E07A5F]">⚡</span>}
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              XP Earned {summary.speedBonusXP > 0 ? '(+10 Speed)' : ''}
            </div>
          </div>

          {/* Metric 4: Estimated Score Gain & Leaderboard Ticker */}
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-[#E07A5F] flex items-center justify-center gap-1">
              <TrendingUp size={16} /> +{summary.estimatedScoreGain} pts
            </div>
            <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
              ▲ Leaderboard +2 Ranks
            </div>
          </div>
        </div>
      </div>

      {/* 3. MISTAKE VAULT AUTO-SYNC & COGNITIVE TRAP DIAGNOSIS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0EBE4] pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#E07A5F]">
              Cognitive Diagnostic Breakdown
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#1E1B18]">
              Question-by-Question Deep Analysis
            </h3>
          </div>

          {summary.missedQuestions.length > 0 ? (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE] self-start sm:self-auto">
              Auto-Synced {summary.missedQuestions.length} Mistake(s) to Vault
            </span>
          ) : (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE] self-start sm:self-auto">
              ✨ 100% Perfect Score!
            </span>
          )}
        </div>

        {/* Accordion of questions */}
        <div className="space-y-4">
          {summary.missedQuestions.map((q, idx) => {
            const userWrong = summary.userAnswers[q.id] || 'N/A';
            const isExpanded = expandedQuestionId === q.id;
            const diagnosis = aiDiagnoses[q.id];

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-4 transition-all"
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center font-bold text-xs shrink-0">
                      ✗
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1E1B18] truncate">
                        Missed Item #{idx + 1}: {q.skill}
                      </div>
                      <div className="text-[11px] text-[#78716C] flex items-center gap-2">
                        <span>{q.section === 'MATH' ? '📐 Math' : '📖 R&W'}</span>
                        <span>&bull;</span>
                        <span>{q.domain}</span>
                        <span>&bull;</span>
                        <span className="text-[#E07A5F]">Your Choice: {userWrong}</span>
                        <span>&bull;</span>
                        <span className="text-[#2A9D8F]">Correct: {q.correctAnswer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSolveClone(q);
                      }}
                      className="px-3 py-1 rounded-lg bg-white hover:bg-[#FAF5F0] text-[#E07A5F] border border-[#E5E0D8] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles size={12} />
                      <span className="hidden sm:inline">Solve AI Clone</span>
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-[#78716C]" /> : <ChevronDown size={16} className="text-[#78716C]" />}
                  </div>
                </div>

                {/* Expanded Details: Official Explanation & Gemini Trap Diagnosis */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-3 border-t border-[#EBE5DF]"
                    >
                      {/* Question Context & Prompt */}
                      <div className="p-4 rounded-xl bg-white border border-[#E5E0D8] space-y-2 text-xs">
                        {q.passage && (
                          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#EBE5DF] italic text-[#3D405B]">
                            <FormattedMath text={q.passage} />
                          </div>
                        )}
                        <div className="font-bold text-[#1E1B18]">
                          <FormattedMath text={q.questionText} />
                        </div>
                      </div>

                      {/* Official Explanation */}
                      <div className="p-4 rounded-xl bg-white border border-[#E5E0D8] space-y-1.5 text-xs text-[#3D405B]">
                        <div className="font-bold text-[#1E1B18] flex items-center gap-1.5">
                          <BookOpen size={13} className="text-[#2A9D8F]" />
                          Official College Board Solution:
                        </div>
                        <p className="leading-relaxed">
                          <FormattedMath text={q.explanation} />
                        </p>
                      </div>

                      {/* Gemini AI Trap Diagnosis Box */}
                      <div className="p-4 sm:p-5 rounded-xl bg-[#FFFBF8] border border-[#FCD9CE] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded-lg bg-[#FFF4F0] text-[#E07A5F]">
                              <BrainCircuit size={14} />
                            </span>
                            <span className="text-xs font-bold text-[#1E1B18]">
                              Gemini Psychometric Trap Diagnostic
                            </span>
                          </div>

                          {diagnosis && (
                            <button
                              onClick={() => handlePlayAudio(q.id, `${diagnosis.coreRuleMissed}. ${diagnosis.trapReason}. ${diagnosis.preventionStrategy}`)}
                              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                playingAudioId === q.id
                                  ? 'bg-[#E07A5F] text-white border-[#E07A5F]'
                                  : 'border-[#E5E0D8] text-[#78716C] hover:text-[#1E1B18]'
                              }`}
                              title="Listen to AI Explanation"
                            >
                              {playingAudioId === q.id ? <VolumeX size={13} /> : <Volume2 size={13} />}
                            </button>
                          )}
                        </div>

                        {diagnosis ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="p-3 rounded-lg bg-white border border-[#FCD9CE] space-y-1">
                              <span className="text-[10px] uppercase font-bold text-[#E07A5F]">
                                1. Why Choice {userWrong} Was a Trap:
                              </span>
                              <p className="text-[#3D405B] leading-relaxed">
                                {diagnosis.trapReason}
                              </p>
                            </div>

                            <div className="p-3 rounded-lg bg-white border border-[#FCD9CE] space-y-1">
                              <span className="text-[10px] uppercase font-bold text-[#2A9D8F]">
                                2. Core Rule To Remember:
                              </span>
                              <p className="text-[#3D405B] leading-relaxed">
                                {diagnosis.coreRuleMissed}
                              </p>
                            </div>

                            <div className="sm:col-span-2 p-3 rounded-lg bg-[#FAF8F5] border border-[#EBE5DF] text-[#3D405B] space-y-1">
                              <span className="text-[10px] uppercase font-bold text-[#3D405B]">
                                ⚡ 10-Second Prevention Strategy:
                              </span>
                              <p className="leading-relaxed">
                                {diagnosis.preventionStrategy}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-[#78716C]">
                              Analyze the psychological distractor mechanism for choice {userWrong}.
                            </span>
                            <button
                              onClick={() => handleFetchAiTrapAnalysis(q)}
                              disabled={loadingAiTrapId === q.id}
                              className="px-3.5 py-1.5 rounded-lg bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {loadingAiTrapId === q.id ? (
                                <>
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  <span>Diagnosing...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles size={12} />
                                  <span>Reveal Trap Mechanism</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. ACTION CONTROLS FOOTER */}
      <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-md border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onReturnToDashboard}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] hover:text-[#1E1B18] transition-all cursor-pointer"
        >
          Return to Dashboard
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onOpenMistakeVault}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#FAF5F0] hover:bg-[#FFF0EB] text-[#E07A5F] border border-[#FCD9CE] text-xs font-bold transition-all cursor-pointer"
          >
            Review Mistake Vault (Stage 1)
          </button>

          <button
            onClick={onStartAnotherWorkout}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Practice Another Mode</span>
          </button>
        </div>
      </div>

      {/* 5. INSTANT AI CLONE PRACTICE MODAL */}
      {activeCloneQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-[#FFF4F0] text-[#E07A5F]">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-[#1E1B18]">AI Synthetic Clone Practice</h4>
                  <div className="text-[11px] text-[#78716C]">
                    Testing mastery on: {activeCloneQuestion.skill}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveCloneQuestion(null)}
                className="p-1 text-[#78716C] hover:text-[#1E1B18] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              {activeCloneQuestion.passage && (
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs font-serif text-[#1E1B18] leading-relaxed">
                  <FormattedMath text={activeCloneQuestion.passage} />
                </div>
              )}
              <div className="text-sm font-medium text-[#1E1B18] leading-relaxed">
                <FormattedMath text={activeCloneQuestion.questionText} />
              </div>
            </div>

            {/* Options */}
            {activeCloneQuestion.options && (
              <div className="space-y-2.5">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const optText = activeCloneQuestion.options?.[letter] || '';
                  const isSelected = cloneSelectedAnswer === letter;
                  const isCorrect = activeCloneQuestion.correctAnswer === letter;

                  let borderClass = 'border-[#E5E0D8] bg-white hover:bg-[#FAF8F5]';
                  if (cloneSubmitted) {
                    if (isCorrect) borderClass = 'border-[#2A9D8F] bg-[#EBF8F5] text-[#2A9D8F]';
                    else if (isSelected && !isCorrect) borderClass = 'border-[#E07A5F] bg-[#FFF4F0] text-[#E07A5F]';
                  } else if (isSelected) {
                    borderClass = 'border-[#E07A5F] bg-[#FAF5F0] ring-2 ring-[#E07A5F]/20';
                  }

                  return (
                    <button
                      key={letter}
                      disabled={cloneSubmitted}
                      onClick={() => setCloneSelectedAnswer(letter)}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-3 cursor-pointer ${borderClass}`}
                    >
                      <span className="font-bold font-mono">{letter}.</span>
                      <FormattedMath text={optText} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Clone Results & Explanation */}
            {cloneSubmitted && (
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  {cloneSelectedAnswer === activeCloneQuestion.correctAnswer ? (
                    <span className="text-[#2A9D8F] flex items-center gap-1">
                      <CheckCircle2 size={14} /> Mastered! +15 Bonus XP
                    </span>
                  ) : (
                    <span className="text-[#E07A5F] flex items-center gap-1">
                      <AlertCircle size={14} /> Review Needed
                    </span>
                  )}
                </div>
                <p className="text-[#3D405B] leading-relaxed">
                  <FormattedMath text={activeCloneQuestion.explanation} />
                </p>
              </div>
            )}

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#F0EBE4]">
              <button
                onClick={() => setActiveCloneQuestion(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] cursor-pointer"
              >
                Close
              </button>

              {!cloneSubmitted ? (
                <button
                  disabled={!cloneSelectedAnswer}
                  onClick={() => setCloneSubmitted(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-40"
                >
                  Verify Answer
                </button>
              ) : (
                <button
                  onClick={() => setActiveCloneQuestion(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#2A9D8F] hover:bg-[#238276] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
