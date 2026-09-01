import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  BrainCircuit,
  ArrowRight,
  RotateCcw,
  Bot,
  Layers,
  Share2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Question, User } from '../types';
import { FormattedMathText } from './WorkoutQuestionCard';

interface WorkoutSummaryCardProps {
  user: User;
  score: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  missedQuestions: Question[];
  userAnswers: Record<string, string>;
  onReturnToDashboard: () => void;
  onOpenMistakeVault: () => void;
  onRetakeWorkout?: () => void;
  onOpenSocraticTutor?: (question: Question) => void;
  onOpenPaywall?: () => void;
}

export const WorkoutSummaryCard: React.FC<WorkoutSummaryCardProps> = ({
  user,
  score,
  totalQuestions,
  timeSpentSeconds,
  missedQuestions,
  userAnswers,
  onReturnToDashboard,
  onOpenMistakeVault,
  onRetakeWorkout,
  onOpenSocraticTutor,
  onOpenPaywall,
}) => {
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    missedQuestions.length > 0 ? missedQuestions[0].id : null
  );
  const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});
  const [loadingAiId, setLoadingAiId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const accuracy = Math.round((score / totalQuestions) * 100);
  const isPassed = accuracy >= 80;
  const earnedXp = isPassed ? 35 : 25;
  const updatedStreak = user.streakDays; // Already incremented in parent

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fetch AI Socratic Trap Breakdown for a missed question
  const handleFetchAiExplanation = async (q: Question) => {
    if (aiExplanations[q.id]) {
      return; // Already cached
    }

    if (user.planTier === 'FREE' && onOpenPaywall) {
      onOpenPaywall();
      return;
    }

    setLoadingAiId(q.id);
    try {
      const wrongAns = userAnswers[q.id] || 'No answer';
      const promptText = `Analyze this SAT mistake Socratically:
Question: ${q.questionText}
${q.passage ? `Passage: ${q.passage}` : ''}
Student's Wrong Choice: ${wrongAns}
Correct Answer: ${q.correctAnswer}
Skill: ${q.skill} (${q.domain})

Provide a 3-part micro breakdown:
1. **The Trap**: Why was "${wrongAns}" mathematically or rhetorically tempting?
2. **The Flaw**: What specific constraint was overlooked?
3. **The 10-Second Mental Model**: What trigger rule prevents this in the future?`;

      const res = await fetch('/api/gemini/socratic-hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          userQuestion: promptText,
          chatHistory: [],
        }),
      });

      const data = await res.json();
      setAiExplanations((prev) => ({
        ...prev,
        [q.id]: data.reply || data.explanation || 'Qoidani tekshirish: Bu savolda to\'g\'ri javobni topish uchun asosiy shartni qayta o\'rganing.',
      }));
    } catch {
      setAiExplanations((prev) => ({
        ...prev,
        [q.id]: `**Tuzoq tahlili:** Bu savolda ${q.skill} qoidasiga ko'ra ${userAnswers[q.id]} varianti chalg'ituvchi hisoblanadi. To'g'ri javob: **${q.correctAnswer}**. Asosiy formulani Xatolar Omborida takrorlang.`,
      }));
    } finally {
      setLoadingAiId(null);
    }
  };

  const handleShareResult = () => {
    const text = `🔥 Digital SAT Daily Workout Completed!\nScore: ${score}/${totalQuestions} (${accuracy}%)\nStreak: ${updatedStreak} Days\nMastered with ASRON SAT 🚀`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-[#1E1B18] animate-in fade-in zoom-in-95 duration-300">
      
      {/* 1. Hero Streak & Score Banner */}
      <div className="rounded-3xl bg-white border border-[#EBE5DF] p-6 sm:p-8 shadow-xs overflow-hidden relative">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E07A5F]/5 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/20 text-xs font-mono font-bold">
              <Flame size={15} className="fill-[#E07A5F]" />
              <span>Mashg'ulot Muvaffaqiyatli Yakunlandi!</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
              {isPassed ? "Ajoyib natija! Natselenlik saqlandi." : "Yaxshi urinish! Xatolarni tahlil qilamiz."}
            </h1>

            <p className="text-sm text-[#78716C] max-w-xl">
              Siz bugungi 10-daqiqalik mashqni muvaffaqiyatli topshirdingiz. Ketma-ketlik yangilandi va xatolar Leitner tizimiga kiritildi.
            </p>
          </div>

          {/* Big Streak Progression Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] shrink-0"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#E07A5F] text-white flex flex-col items-center justify-center shadow-md">
              <Flame size={24} className="fill-white" />
              <span className="text-[11px] font-mono font-extrabold">{updatedStreak}d</span>
            </div>
            <div>
              <div className="text-xs font-mono text-[#78716C] uppercase font-bold">Faol Ketma-ketlik</div>
              <div className="text-lg font-extrabold text-[#1E1B18]">{updatedStreak} Kunlik Streak 🔥</div>
              <div className="text-[11px] text-[#2A9D8F] font-semibold flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>Muzlatish himoyasi faol</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#F2ECE4]">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#1E1B18] font-mono font-bold text-sm">
              {score}/{totalQuestions}
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#78716C] uppercase font-bold">Aniqlik (Accuracy)</div>
              <div className="text-base font-extrabold text-[#1E1B18]">{accuracy}%</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#2A9D8F] font-mono font-bold text-sm">
              +{earnedXp}
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#78716C] uppercase font-bold">Tajriba Bali (XP)</div>
              <div className="text-base font-extrabold text-[#2A9D8F]">+{earnedXp} Ball Qo'shildi</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE5DF] flex items-center justify-center text-[#3D405B] font-mono font-bold text-sm">
              ⏱
            </div>
            <div>
              <div className="text-[11px] font-mono text-[#78716C] uppercase font-bold">Ketgan Vaqt</div>
              <div className="text-base font-extrabold text-[#1E1B18]">{formatTime(timeSpentSeconds)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mistake Vault Sync & Error Breakdown */}
      <div className="rounded-3xl bg-white border border-[#EBE5DF] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F2ECE4]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3D405B]/10 text-[#3D405B] flex items-center justify-center font-bold">
              <BrainCircuit size={19} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1E1B18] flex items-center gap-2">
                <span>Xatolar Tahlili va SRS Ombori</span>
                {missedQuestions.length === 0 ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono font-bold border border-emerald-200">
                    100% Mukammal
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-mono font-bold border border-rose-200">
                    {missedQuestions.length} ta xato qayd etildi
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#78716C]">
                {missedQuestions.length > 0
                  ? "Xato javoblar avtomatik tarzda Xatolar Omboriga (Stage 1 SRS) qo'shildi."
                  : "Bugun barcha savollarga to'g'ri javob berdingiz!"}
              </p>
            </div>
          </div>

          {missedQuestions.length > 0 && (
            <button
              onClick={onOpenMistakeVault}
              className="px-3.5 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F2ECE4] border border-[#EBE5DF] text-xs font-bold text-[#1E1B18] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
            >
              <Layers size={14} className="text-[#E07A5F]" />
              <span>Omborga o'tish</span>
              <ArrowRight size={13} />
            </button>
          )}
        </div>

        {/* If no mistakes */}
        {missedQuestions.length === 0 ? (
          <div className="py-8 text-center space-y-2 bg-[#FAF8F5] rounded-2xl border border-[#EBE5DF]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-[#1E1B18]">Xatolar topilmadi!</h3>
            <p className="text-xs text-[#78716C] max-w-sm mx-auto">
              Bugungi tanlangan zaif domen bo'yicha barcha savollar to'g'ri yechildi.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {missedQuestions.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id;
              const wrongAns = userAnswers[q.id] || "Bo'sh";
              const explanationText = aiExplanations[q.id];
              const isLoadingThisAi = loadingAiId === q.id;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-[#EBE5DF] bg-white overflow-hidden transition-all shadow-2xs"
                >
                  {/* Collapsible Row Header */}
                  <div
                    onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                    className="p-4 bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <div className="overflow-hidden leading-snug">
                        <div className="text-xs font-bold text-[#1E1B18] truncate flex items-center gap-2">
                          <span>{q.skill}</span>
                          <span className="text-[10px] font-mono text-[#78716C] font-normal">({q.domain})</span>
                        </div>
                        <div className="text-[11px] text-[#78716C] flex items-center gap-2 mt-0.5">
                          <span className="text-rose-600 font-semibold">Siz: {wrongAns}</span>
                          <span>•</span>
                          <span className="text-[#2A9D8F] font-semibold">To'g'ri: {q.correctAnswer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        SRS Stage 1
                      </span>
                      {isExpanded ? <ChevronUp size={16} className="text-[#78716C]" /> : <ChevronDown size={16} className="text-[#78716C]" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-5 border-t border-[#EBE5DF] space-y-4 bg-white"
                      >
                        {/* Question Text */}
                        <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs sm:text-sm text-[#1E1B18] font-medium leading-relaxed">
                          <FormattedMathText text={q.questionText} />
                        </div>

                        {/* Standard Explanation */}
                        {q.explanation && (
                          <div className="space-y-1 text-xs">
                            <div className="font-mono font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-1">
                              <Lightbulb size={13} className="text-[#E07A5F]" />
                              <span>Rasmiy Tushuntirish</span>
                            </div>
                            <p className="text-[#57534E] leading-relaxed pl-1 whitespace-pre-line">
                              {q.explanation}
                            </p>
                          </div>
                        )}

                        {/* AI Socratic Deep Dive Box */}
                        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#1E1B18]">
                              <Bot size={15} className="text-[#E07A5F]" />
                              <span>Gemini AI: Tuzoq Tahlili & Xatoni Oldini Olish</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                              PRO AI
                            </span>
                          </div>

                          {explanationText ? (
                            <div className="text-xs text-[#2B2723] leading-relaxed whitespace-pre-line bg-white p-3 rounded-xl border border-[#EBE5DF] shadow-2xs font-sans">
                              {explanationText}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between gap-3 pt-1">
                              <p className="text-xs text-[#78716C]">
                                Nega aynan {wrongAns} varianti tanlanganini va qanday qilib bu tuzoqdan qochishni AI orqali bilib oling.
                              </p>
                              <button
                                type="button"
                                onClick={() => handleFetchAiExplanation(q)}
                                disabled={isLoadingThisAi}
                                className="px-3 py-1.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
                              >
                                {isLoadingThisAi ? (
                                  <>
                                    <Sparkles size={13} className="animate-spin text-[#E07A5F]" />
                                    <span>Tahlil qilinmoqda...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={13} className="text-[#E07A5F]" />
                                    <span>Tuzoqni Tahlil Qilish</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {/* Socratic Chat Drawer Trigger */}
                          {onOpenSocraticTutor && (
                            <div className="pt-1">
                              <button
                                onClick={() => onOpenSocraticTutor(q)}
                                className="text-xs font-semibold text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>AI Repititor bilan muloqotda tahlil qilish</span>
                                <ArrowRight size={12} />
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
        )}
      </div>

      {/* 3. Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onRetakeWorkout && (
            <button
              onClick={onRetakeWorkout}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EBE5DF] text-xs font-bold text-[#57534E] hover:text-[#1E1B18] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <RotateCcw size={14} />
              <span>Qaytadan Sinash</span>
            </button>
          )}
          <button
            onClick={handleShareResult}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#EBE5DF] text-xs font-bold text-[#57534E] hover:text-[#1E1B18] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            {copiedLink ? (
              <>
                <Check size={14} className="text-[#2A9D8F]" />
                <span className="text-[#2A9D8F]">Nusxalandi!</span>
              </>
            ) : (
              <>
                <Share2 size={14} />
                <span>Natijani Ulashish</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenMistakeVault}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#3D405B] hover:bg-[#2B2D42] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <BrainCircuit size={15} />
            <span>Xatolar Ombori</span>
          </button>
          <button
            onClick={onReturnToDashboard}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-2xl bg-[#1E1B18] hover:bg-[#2E2A27] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <span>Bosh Sahifaga Qaytish</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
