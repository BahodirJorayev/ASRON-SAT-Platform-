import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import {
  Clock,
  Bookmark,
  Sparkles,
  Calculator,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  Highlighter,
  RotateCcw,
  Check,
  ChevronRight,
  BrainCircuit,
  X,
  Flame,
  Zap,
  Info,
  Trophy
} from 'lucide-react';
import { Question, User, WorkoutMode } from '../types';
import { DesmosCalculator } from './DesmosCalculator';
import { FormulaReferenceSheet } from './FormulaReferenceSheet';

// Robust KaTeX Math Renderer
export const FormattedMath: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text) return '';
    if (!text.includes('$') && !text.includes('\\')) return text;

    try {
      let formatted = text;
      // Block math $$...$$
      formatted = formatted.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
        try {
          return `<div class="my-2.5 py-1 text-center overflow-x-auto">${katex.renderToString(math.trim(), {
            displayMode: true,
            throwOnError: false,
          })}</div>`;
        } catch {
          return `$$${math}$$`;
        }
      });

      // Inline math $...$
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

  if (renderedContent.includes('<span class="katex') || renderedContent.includes('<div class="my-2.5')) {
    return (
      <span
        className={`leading-relaxed ${className}`}
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    );
  }

  return <span className={`whitespace-pre-line leading-relaxed ${className}`}>{text}</span>;
};

interface WorkoutActiveSessionProps {
  user: User;
  questions: Question[];
  mode: WorkoutMode;
  modeTitle: string;
  timeLimitSeconds: number;
  onFinishSession: (answers: Record<string, string>, timeSpentSeconds: number, questionTimes: Record<string, number>) => void;
  onQuitSession: () => void;
}

export const WorkoutActiveSession: React.FC<WorkoutActiveSessionProps> = ({
  user,
  questions,
  mode,
  modeTitle,
  timeLimitSeconds,
  onFinishSession,
  onQuitSession,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(timeLimitSeconds);
  const [questionTimes, setQuestionTimes] = useState<Record<string, number>>({});
  
  // Modals & Floating Tools
  const [showDesmos, setShowDesmos] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmQuit, setShowConfirmQuit] = useState(false);

  // In-Question AI Coach (Socratic Hint)
  const [showSocraticDrawer, setShowSocraticDrawer] = useState(false);
  const [isGeneratingHint, setIsGeneratingHint] = useState(false);
  const [socraticHint, setSocraticHint] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Text Highlighting in Passage
  const [isHighlighterActive, setIsHighlighterActive] = useState(false);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const passageRef = useRef<HTMLDivElement>(null);

  const currentQ = questions[currentIndex] || questions[0];
  const totalQuestions = questions.length;

  // Track per-question time
  useEffect(() => {
    const qId = currentQ?.id;
    if (!qId) return;
    const interval = setInterval(() => {
      setQuestionTimes((prev) => ({
        ...prev,
        [qId]: (prev[qId] || 0) + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentIndex, currentQ?.id]);

  // Global Countdown Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeSpentSeconds = Math.max(0, timeLimitSeconds - secondsRemaining);

  // Format Time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSelectAnswer = (ans: string) => {
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: ans }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSocraticHint(null);
      setShowSocraticDrawer(false);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSocraticHint(null);
      setShowSocraticDrawer(false);
    }
  };

  const handleFinalSubmit = () => {
    setShowConfirmSubmit(false);
    onFinishSession(userAnswers, timeSpentSeconds, questionTimes);
  };

  // Trigger Socratic Hint via Gemini
  const handleRequestSocraticHint = async () => {
    setShowSocraticDrawer(true);
    if (socraticHint) return;

    setIsGeneratingHint(true);
    try {
      const res = await fetch('/api/gemini/socratic-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ,
          userMessage: 'Give me a brief Socratic hint for this question without giving away the final answer.',
          studentScoreTier: `${user.targetScore || 1550}+`,
        }),
      });
      const data = await res.json();
      setSocraticHint(data.reply || 'Let us review the core constraint in the question prompt.');
    } catch (err) {
      setSocraticHint(
        currentQ.section === 'MATH'
          ? 'Desmos Strategy: Look for the invariant coefficient or substitute given roots to test constraints.'
          : 'Sentence Boundary Rule: Check whether both clauses express complete thoughts or if one is a dependent modifier.'
      );
    } finally {
      setIsGeneratingHint(false);
    }
  };

  // Browser Text-To-Speech for Socratic Hint
  const handleToggleAudio = () => {
    if (!socraticHint) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(socraticHint.replace(/\$|[*#]/g, ''));
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Text selection handler for passage highlighter
  const handlePassageMouseUp = () => {
    if (!isHighlighterActive) return;
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      setHighlightedText(selection.toString().trim());
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const isTimeWarning = secondsRemaining < (mode === 'SPEED_BLITZ' ? 30 : 120);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col min-h-[82vh] bg-white/95 backdrop-blur-md rounded-3xl border border-[#E5E0D8] shadow-lg overflow-hidden font-sans text-[#1E1B18]">
      {/* 1. TOP CONTROL BAR (100% Bluebook Authentic Aesthetic) */}
      <header className="px-5 py-3.5 bg-white border-b border-[#E5E0D8] flex items-center justify-between shrink-0 sticky top-0 z-30">
        {/* Left: Mode Title & Discrete Segmented Progress Pills */}
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E07A5F]">
              {modeTitle}
            </span>
            <div className="text-xs font-bold text-[#1E1B18]">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
          </div>

          {/* 5 Segmented Progress Pills */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = Boolean(userAnswers[q.id]);
              const isFlagged = Boolean(flaggedQuestions[q.id]);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-7 h-2.5 rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1E1B18] ring-2 ring-[#1E1B18]/20 scale-105'
                      : isFlagged
                      ? 'bg-[#E07A5F]'
                      : isAnswered
                      ? 'bg-[#2A9D8F]'
                      : 'bg-[#EBE5DF] hover:bg-[#D6D0C7]'
                  }`}
                  title={`Jump to Q${idx + 1} (${isAnswered ? 'Answered' : 'Unanswered'})`}
                />
              );
            })}
          </div>
        </div>

        {/* Center: Live Timer with Pulse at < 2:00 */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
            isTimeWarning
              ? 'bg-[#FFF4F0] text-[#E07A5F] border-[#E07A5F] animate-pulse shadow-xs'
              : 'bg-[#FAF8F5] text-[#1E1B18] border-[#EBE5DF]'
          }`}
        >
          <Clock size={14} className={isTimeWarning ? 'text-[#E07A5F]' : 'text-[#78716C]'} />
          <span>{formatTime(secondsRemaining)}</span>
        </div>

        {/* Right: Bluebook Testing Tools (Desmos, Formulas, Flag, Socratic AI) */}
        <div className="flex items-center gap-2">
          {currentQ.section === 'MATH' && (
            <>
              <button
                onClick={() => setShowDesmos((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showDesmos
                    ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                    : 'bg-[#FAF8F5] text-[#3D405B] border-[#EBE5DF] hover:bg-white'
                }`}
                title="Desmos Graphing Calculator"
              >
                <Calculator size={14} />
                <span className="hidden md:inline">Desmos</span>
              </button>

              <button
                onClick={() => setShowFormulas((prev) => !prev)}
                className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                  showFormulas
                    ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                    : 'bg-[#FAF8F5] text-[#3D405B] border-[#EBE5DF] hover:bg-white'
                }`}
                title="SAT Reference Formula Sheet"
              >
                <BookOpen size={14} />
                <span className="hidden md:inline">Formulas</span>
              </button>
            </>
          )}

          {/* Socratic AI Coach Clue Trigger */}
          <button
            onClick={handleRequestSocraticHint}
            className="px-2.5 py-1.5 rounded-xl bg-[#FAF5F0] hover:bg-[#FFF0EB] text-[#E07A5F] border border-[#FCD9CE] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Get a guiding Socratic Hint"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI Hint</span>
          </button>

          {/* Flag For Review */}
          <button
            onClick={toggleFlag}
            className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              flaggedQuestions[currentQ.id]
                ? 'bg-[#FFF4F0] text-[#E07A5F] border-[#E07A5F]'
                : 'bg-[#FAF8F5] text-[#78716C] border-[#EBE5DF] hover:text-[#1E1B18]'
            }`}
            title="Flag for review"
          >
            <Bookmark size={14} className={flaggedQuestions[currentQ.id] ? 'fill-[#E07A5F]' : ''} />
          </button>

          {/* Quit Button */}
          <button
            onClick={() => setShowConfirmQuit(true)}
            className="p-2 rounded-xl text-xs text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5] border border-[#EBE5DF] transition-all cursor-pointer"
            title="Exit Workout"
          >
            <X size={14} />
          </button>
        </div>
      </header>

      {/* 2. SPLIT-PANE TESTING ENGINE (100% Bluebook Style) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E5E0D8] overflow-y-auto">
        {/* LEFT PANE: Reading Passage or Math Context & Highlighting */}
        <div className="md:col-span-6 p-6 sm:p-8 bg-[#FAF8F5]/60 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#3D405B]">
                  {currentQ.section === 'READING_AND_WRITING' ? 'READING & WRITING' : 'MATH'}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF5F0] text-[#E07A5F] border border-[#EBE3D9]">
                  {currentQ.domain}
                </span>
              </div>

              {currentQ.passage && (
                <button
                  onClick={() => setIsHighlighterActive((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isHighlighterActive
                      ? 'bg-[#FEF08A] text-[#854D0E] border-[#FACC15]'
                      : 'bg-white text-[#78716C] border-[#E5E0D8] hover:text-[#1E1B18]'
                  }`}
                >
                  <Highlighter size={12} />
                  <span>{isHighlighterActive ? 'Highlighter ON' : 'Highlight'}</span>
                </button>
              )}
            </div>

            {/* Passage Text Container */}
            {currentQ.passage ? (
              <div
                ref={passageRef}
                onMouseUp={handlePassageMouseUp}
                className="p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs text-sm leading-relaxed text-[#1E1B18] font-serif space-y-3 select-text"
              >
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#78716C] border-b border-[#F0EBE4] pb-2">
                  Passage / Context
                </div>
                <div className="whitespace-pre-line text-[#292524] text-[15px] leading-7">
                  <FormattedMath text={currentQ.passage} />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs space-y-3">
                <div className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#78716C] border-b border-[#F0EBE4] pb-2">
                  Math Problem Constraints
                </div>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  Analyze the algebraic condition or geometric model. You may utilize the built-in Desmos graphing tool or standard SAT formula reference sheet located in the top toolbar.
                </p>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF] text-xs text-[#3D405B]">
                  💡 <strong>Pro Tip:</strong> For quadratic systems, look for discriminant $b^2 - 4ac$ or graph intersections directly in Desmos.
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-xs text-[#78716C]">
            <span>Skill Focus: <strong>{currentQ.skill}</strong></span>
            <span>Difficulty: <strong className="text-[#E07A5F]">{currentQ.difficulty}</strong></span>
          </div>
        </div>

        {/* RIGHT PANE: Question Prompt, Math Formulas, and Options/Grid-In */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-white">
          <div className="space-y-6">
            {/* Question Text */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-[#78716C] uppercase tracking-wider">
                Question {currentIndex + 1}
              </div>
              <div className="text-base sm:text-lg font-medium text-[#1E1B18] leading-relaxed">
                <FormattedMath text={currentQ.questionText} />
              </div>
            </div>

            {/* Multiple Choice Cards or Numeric Grid-in Input */}
            {currentQ.type === 'GRID_IN' || !currentQ.options ? (
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                  Student-Produced Response (Grid-In)
                </label>
                <input
                  type="text"
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  placeholder="Enter number (e.g. 9 or 3/4)..."
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#E5E0D8] text-base font-mono font-bold text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F] focus:border-transparent"
                />
                <p className="text-[11px] text-[#78716C]">
                  Accepts standard fractions ($3/4$), integers, and decimals ($0.75$).
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                  const optionText = currentQ.options?.[letter] || '';
                  const isSelected = userAnswers[currentQ.id] === letter;
                  return (
                    <button
                      key={letter}
                      onClick={() => handleSelectAnswer(letter)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FAF5F0] border-[#E07A5F] ring-2 ring-[#E07A5F]/20 shadow-xs'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8]'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#E07A5F] text-white'
                            : 'bg-[#FAF8F5] border border-[#E5E0D8] text-[#78716C]'
                        }`}
                      >
                        {letter}
                      </div>
                      <div className="text-sm font-medium text-[#1E1B18] pt-0.5 leading-relaxed">
                        <FormattedMath text={optionText} />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="mt-8 pt-4 border-t border-[#E5E0D8] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Previous</span>
            </button>

            <div className="text-xs text-[#78716C] font-medium">
              {answeredCount} of {totalQuestions} answered
            </div>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>{currentIndex === totalQuestions - 1 ? 'Review & Submit' : 'Next'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SOCRATIC AI COACH HINT DRAWER / MODAL */}
      <AnimatePresence>
        {showSocraticDrawer && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-40 max-w-md w-full p-5 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xl space-y-3"
          >
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-[#FFF4F0] text-[#E07A5F]">
                  <BrainCircuit size={16} />
                </span>
                <span className="text-xs font-bold text-[#1E1B18]">AURA Socratic SAT Coach</span>
              </div>

              <div className="flex items-center gap-1">
                {socraticHint && (
                  <button
                    onClick={handleToggleAudio}
                    className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isPlayingAudio ? 'bg-[#E07A5F] text-white border-[#E07A5F]' : 'border-[#E5E0D8] text-[#78716C] hover:text-[#1E1B18]'
                    }`}
                    title="Audio Read-Aloud"
                  >
                    {isPlayingAudio ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  </button>
                )}
                <button
                  onClick={() => setShowSocraticDrawer(false)}
                  className="p-1 rounded-lg text-[#78716C] hover:text-[#1E1B18] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="text-xs leading-relaxed text-[#3D405B]">
              {isGeneratingHint ? (
                <div className="flex items-center gap-2 py-4 justify-center text-[#78716C]">
                  <div className="w-4 h-4 border-2 border-[#E07A5F]/30 border-t-[#E07A5F] rounded-full animate-spin" />
                  <span>Synthesizing Socratic clue...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F]">
                    Strategic Guiding Clue:
                  </div>
                  <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5DF]">
                    <FormattedMath text={socraticHint || ''} />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FLOATING DESMOS CALCULATOR OVERLAY */}
      {showDesmos && (
        <div className="fixed bottom-6 left-6 z-50 w-full max-w-md shadow-2xl rounded-3xl overflow-hidden border border-[#E5E0D8]">
          <div className="bg-[#1E1B18] text-white px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-2">
              <Calculator size={14} /> Official Desmos Graphing Calculator
            </span>
            <button onClick={() => setShowDesmos(false)} className="text-white/70 hover:text-white cursor-pointer">
              <X size={14} />
            </button>
          </div>
          <div className="h-80 bg-white">
            <DesmosCalculator isExpanded={true} />
          </div>
        </div>
      )}

      {/* 5. FORMULA REFERENCE SHEET MODAL */}
      {showFormulas && (
        <FormulaReferenceSheet isOpen={showFormulas} onClose={() => setShowFormulas(false)} />
      )}

      {/* 6. CONFIRM SUBMIT MODAL */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4F0] text-[#E07A5F] flex items-center justify-center mx-auto">
              <Trophy size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1E1B18]">Submit Daily Workout?</h3>
              <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                You have answered <strong>{answeredCount} of {totalQuestions}</strong> questions.
                {answeredCount < totalQuestions && (
                  <span className="block text-[#E07A5F] font-bold mt-1">
                    ⚠️ You have {totalQuestions - answeredCount} unanswered question(s).
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] cursor-pointer"
              >
                Back to Test
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm &amp; Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CONFIRM QUIT MODAL */}
      {showConfirmQuit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF5F0] text-[#78716C] flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E1B18]">Exit Current Workout?</h3>
              <p className="text-xs text-[#78716C] mt-1">
                Your progress for today’s workout will not be saved towards streak preservation until completed.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowConfirmQuit(false)}
                className="px-4 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] cursor-pointer"
              >
                Continue
              </button>
              <button
                onClick={onQuitSession}
                className="px-4 py-2.5 rounded-xl bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Exit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
