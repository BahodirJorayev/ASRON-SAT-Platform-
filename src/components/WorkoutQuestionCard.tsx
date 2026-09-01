import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import katex from 'katex';
import { BookOpen, Calculator, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';
import { Question } from '../types';

interface WorkoutQuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer?: string;
  onSelectAnswer: (ans: string) => void;
  onOpenDesmos?: () => void;
  onOpenFormulas?: () => void;
  isReadOnly?: boolean;
}

// Robust LaTeX and Math rendering component
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';

    // If text has no math markers ($ or \), return safe text with linebreaks
    if (!text.includes('$') && !text.includes('\\')) {
      return text;
    }

    try {
      // Parse block math $$...$$ first, then inline math $...$
      let formatted = text;

      // Replace block math $$formula$$
      formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-2 py-1 overflow-x-auto text-center">${katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Replace inline math $formula$
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

  // If contains HTML tags from katex
  if (renderedContent.includes('<span class="katex') || renderedContent.includes('<div class="my-2')) {
    return (
      <span
        className={`inline-block leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    );
  }

  return <span className={`whitespace-pre-line leading-relaxed ${className}`}>{text}</span>;
};

export const WorkoutQuestionCard: React.FC<WorkoutQuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer = '',
  onSelectAnswer,
  onOpenDesmos,
  onOpenFormulas,
  isReadOnly = false,
}) => {
  const isMath = question.section === 'MATH';
  const hasPassage = Boolean(question.passage && question.passage.trim().length > 0);

  const choices: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'HARD':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-white rounded-3xl border border-[#EBE5DF] shadow-xs overflow-hidden text-[#1E1B18]">
      {/* Question Header Pill Ribbon */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5] border-b border-[#EBE5DF] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-[#1E1B18] text-white text-xs font-mono font-bold">
            Savol {questionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-[#EBE5DF] text-[#57534E]">
            {question.domain}
          </span>
          <span className="text-xs font-mono text-[#78716C] px-2 py-0.5 rounded-md bg-[#F2ECE4] border border-[#E5DFD7]">
            {question.skill}
          </span>
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getDifficultyBadge(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>

        {/* Math Tools Trigger */}
        {isMath && (
          <div className="flex items-center gap-2">
            {onOpenFormulas && (
              <button
                type="button"
                onClick={onOpenFormulas}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#F2ECE4] border border-[#EBE5DF] text-xs font-medium text-[#57534E] hover:text-[#1E1B18] transition-colors flex items-center gap-1 cursor-pointer"
                title="SAT Formula Ma'lumotnomasi"
              >
                <BookOpen size={13} className="text-[#3D405B]" />
                <span className="hidden sm:inline">Formulalar</span>
              </button>
            )}
            {onOpenDesmos && (
              <button
                type="button"
                onClick={onOpenDesmos}
                className="px-2.5 py-1 rounded-lg bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/30 text-xs font-bold text-[#2563EB] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                title="Desmos Grafikli Kalkulyator"
              >
                <Calculator size={13} />
                <span>Desmos</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Split-Pane Main Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EBE5DF] overflow-y-auto">
        {/* Left Pane: Passage or Context */}
        <div className={`p-5 sm:p-7 overflow-y-auto ${hasPassage ? 'lg:col-span-6 bg-[#FAF8F5]/50' : isMath ? 'lg:col-span-5 bg-[#FAF8F5]/40' : 'lg:col-span-5 bg-[#FAF8F5]/40'}`}>
          {hasPassage ? (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#A8A29E]">
                <BookOpen size={14} className="text-[#E07A5F]" />
                <span>Matn / Kontekst</span>
              </div>
              <div className="text-sm sm:text-base leading-relaxed text-[#2B2723] bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE5DF] shadow-2xs font-serif">
                <FormattedMathText text={question.passage || ''} />
              </div>
            </div>
          ) : (
            <div className="space-y-4 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#A8A29E] mb-2">
                  <Sparkles size={14} className="text-[#E07A5F]" />
                  <span>Mashq Yo'nalishi & Strategiya</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#EBE5DF] space-y-2 text-xs text-[#57534E]">
                  <p className="font-semibold text-[#1E1B18]">
                    🎯 Mavzu: <span className="text-[#E07A5F]">{question.skill}</span>
                  </p>
                  <p className="leading-relaxed">
                    {isMath
                      ? "Bu turdagi savollarda diskriminant, tenglamalar tizimi yoki Desmos regression grafiklaridan foydalanib eng tezkor yechimni toping."
                      : "Matndagi mantiqiy bog'lanish va punktuatsiya qoidalarini tekshiring. Ortiqcha so'z birikmalarini chiqarib tashlang."}
                  </p>
                </div>
              </div>

              {/* Pro Tip Box */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] flex items-start gap-2.5 text-xs text-[#78716C]">
                <HelpCircle size={15} className="text-[#3D405B] shrink-0 mt-0.5" />
                <span>
                  Vaqtni tejang: 10 daqiqa ichida 5 ta savolni to'liq yakunlash uchun har bir savolga o'rtacha 2 daqiqa sarflang.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Pane: Question Prompt & Options */}
        <div className={`p-5 sm:p-7 flex flex-col justify-between space-y-6 ${hasPassage ? 'lg:col-span-6' : isMath ? 'lg:col-span-7' : 'lg:col-span-7'}`}>
          {/* Question Text */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              Savol Sharti
            </div>
            <div className="text-base sm:text-lg font-semibold text-[#1E1B18] leading-relaxed">
              <FormattedMathText text={question.questionText} />
            </div>
          </div>

          {/* Options / Grid-in renderer */}
          {question.options ? (
            <div className="space-y-2.5">
              <div className="text-[11px] font-mono text-[#A8A29E] uppercase tracking-wider">
                Variantni tanlang:
              </div>
              {choices.map((letter) => {
                const optionText = question.options?.[letter] || '';
                if (!optionText) return null;
                const isSelected = selectedAnswer.trim().toUpperCase() === letter;

                return (
                  <motion.button
                    key={letter}
                    type="button"
                    whileHover={!isReadOnly ? { scale: 1.01 } : {}}
                    whileTap={!isReadOnly ? { scale: 0.99 } : {}}
                    onClick={() => !isReadOnly && onSelectAnswer(letter)}
                    disabled={isReadOnly}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E1B18] text-white border-[#1E1B18] shadow-sm font-semibold'
                        : 'bg-white hover:bg-[#FAF8F5] text-[#2B2723] border-[#EBE5DF] hover:border-[#D6CEBE]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-white text-[#1E1B18]'
                            : 'bg-[#FAF8F5] text-[#57534E] border border-[#EBE5DF]'
                        }`}
                      >
                        {letter}
                      </div>
                      <div className="text-sm sm:text-base leading-snug">
                        <FormattedMathText text={optionText} />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#E07A5F] shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          ) : (
            /* Numeric Grid-in Input for Math */
            <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF]">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#57534E]">
                Raqamli Javobni Kiriting (Grid-in / Student-Produced Response):
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedAnswer}
                  onChange={(e) => !isReadOnly && onSelectAnswer(e.target.value)}
                  disabled={isReadOnly}
                  placeholder="Masalan: 18 yoki 3/4 yoki 0.75"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#D6CEBE] text-base font-mono font-bold text-[#1E1B18] placeholder:text-[#A8A29E] focus:outline-none focus:ring-2 focus:ring-[#1E1B18] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-[#78716C]">
                Oddiy kasr (3/4), o'nlik kasr (0.75) yoki butun son ko'rinishida yozishingiz mumkin.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
