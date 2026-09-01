import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Eye,
  EyeOff,
  Calculator,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Grid,
  CheckCircle2,
  FileText,
  Sparkles,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { MockTest, Question, MockTestQuestion, TestAttempt, User } from '../types';
import { FloatingDesmosModal } from './FloatingDesmosModal';
import { FormulaReferenceSheet } from './FormulaReferenceSheet';

interface Props {
  test: MockTest;
  user: User;
  onExit: () => void;
  onCompleteTest: (attempt: TestAttempt, missedQuestions: Question[]) => void;
}

export const BluebookTestEngine: React.FC<Props> = ({
  test,
  user,
  onExit,
  onCompleteTest,
}) => {
  // Test State
  const [currentSection, setCurrentSection] = useState<'READING_AND_WRITING' | 'MATH'>('READING_AND_WRITING');
  const [currentModule, setCurrentModule] = useState<1 | 2>(1);
  const [module2Tier, setModule2Tier] = useState<'EASY' | 'HARD'>('HARD');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // User responses & flags
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [strikethroughs, setStrikethroughs] = useState<Record<string, string[]>>({}); // questionId -> ['A', 'C']
  const [isStrikethroughMode, setIsStrikethroughMode] = useState(false);

  // Timer & UI Toggles
  const [secondsRemaining, setSecondsRemaining] = useState(1920); // 32 minutes per module
  const [isTimerHidden, setIsTimerHidden] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [showQuestionGrid, setShowQuestionGrid] = useState(false);
  const [showDesmos, setShowDesmos] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);

  // Final Test Report State
  const [isTestFinished, setIsTestFinished] = useState(false);
  const [finalScoreReport, setFinalScoreReport] = useState<{
    totalScore: number;
    rwScore: number;
    mathScore: number;
    module2RWTier: 'EASY' | 'HARD';
    module2MathTier: 'EASY' | 'HARD';
    missedCount: number;
    missedQuestions: Question[];
  } | null>(null);

  // Filter questions for current active Section and Module
  const currentModuleQuestions: MockTestQuestion[] = test.questions.filter((q) => {
    return q.section === currentSection && q.moduleNumber === currentModule;
  });

  const activeQuestion = currentModuleQuestions[currentQuestionIndex]?.question;
  const totalQuestionsInModule = currentModuleQuestions.length;

  // Timer Countdown
  useEffect(() => {
    if (isTestFinished) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          handleNextModuleOrFinish();
          return 1920;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentSection, currentModule, isTestFinished, answers]);

  // Handle Strikethrough
  const toggleStrikethrough = (qId: string, optionKey: string) => {
    setStrikethroughs((prev) => {
      const current = prev[qId] || [];
      if (current.includes(optionKey)) {
        return { ...prev, [qId]: current.filter((k) => k !== optionKey) };
      } else {
        return { ...prev, [qId]: [...current, optionKey] };
      }
    });
  };

  // 2-Stage Multistage Adaptive Testing (MST) Engine
  const handleNextModuleOrFinish = () => {
    if (currentSection === 'READING_AND_WRITING' && currentModule === 1) {
      // Evaluate Module 1 performance for RW adaptive routing
      const m1Questions = test.questions.filter((q) => q.section === 'READING_AND_WRITING' && q.moduleNumber === 1);
      let correct = 0;
      m1Questions.forEach((q) => {
        if (answers[q.questionId]?.trim().toUpperCase() === q.question.correctAnswer.trim().toUpperCase()) {
          correct++;
        }
      });
      const ratio = correct / (m1Questions.length || 1);
      const nextTier = ratio >= 0.6 ? 'HARD' : 'EASY';
      setModule2Tier(nextTier);
      setCurrentModule(2);
      setCurrentQuestionIndex(0);
      setSecondsRemaining(1920);
      setShowDirections(false);
    } else if (currentSection === 'READING_AND_WRITING' && currentModule === 2) {
      // Switch to Math Section Module 1
      setCurrentSection('MATH');
      setCurrentModule(1);
      setCurrentQuestionIndex(0);
      setSecondsRemaining(2100); // 35 minutes for Math
      setShowDirections(false);
    } else if (currentSection === 'MATH' && currentModule === 1) {
      // Evaluate Math Module 1
      const m1Math = test.questions.filter((q) => q.section === 'MATH' && q.moduleNumber === 1);
      let correct = 0;
      m1Math.forEach((q) => {
        if (answers[q.questionId]?.trim().toUpperCase() === q.question.correctAnswer.trim().toUpperCase()) {
          correct++;
        }
      });
      const nextTier = (correct / (m1Math.length || 1)) >= 0.6 ? 'HARD' : 'EASY';
      setModule2Tier(nextTier);
      setCurrentModule(2);
      setCurrentQuestionIndex(0);
      setSecondsRemaining(2100);
      setShowDirections(false);
    } else {
      // Finalize test and calculate scaled 200-800 scores
      calculateOfficialScore();
    }
  };

  const calculateOfficialScore = () => {
    const rwQuestions = test.questions.filter((q) => q.section === 'READING_AND_WRITING');
    const mathQuestions = test.questions.filter((q) => q.section === 'MATH');

    let rwCorrect = 0;
    let mathCorrect = 0;
    const missedList: Question[] = [];

    test.questions.forEach((q) => {
      const userAns = answers[q.questionId];
      const isCorrect = userAns && userAns.trim().toUpperCase() === q.question.correctAnswer.trim().toUpperCase();
      if (isCorrect) {
        if (q.section === 'READING_AND_WRITING') rwCorrect++;
        else mathCorrect++;
      } else {
        missedList.push(q.question);
      }
    });

    // College Board scaled scoring curve with adaptive module weighting
    const rawRwPercent = rwCorrect / (rwQuestions.length || 1);
    const rawMathPercent = mathCorrect / (mathQuestions.length || 1);

    const scaledRW = Math.min(800, Math.max(200, Math.round(200 + rawRwPercent * 600)));
    const scaledMath = Math.min(800, Math.max(200, Math.round(200 + rawMathPercent * 600)));
    const totalScaled = scaledRW + scaledMath;

    const report = {
      totalScore: totalScaled,
      rwScore: scaledRW,
      mathScore: scaledMath,
      module2RWTier: module2Tier,
      module2MathTier: module2Tier,
      missedCount: missedList.length,
      missedQuestions: missedList,
    };

    setFinalScoreReport(report);
    setIsTestFinished(true);

    const attempt: TestAttempt = {
      id: `attempt-${Date.now()}`,
      userId: user.id,
      mockTestId: test.id,
      status: 'COMPLETED',
      totalScore: totalScaled,
      rwScore: scaledRW,
      mathScore: scaledMath,
      answers,
      isCompleted: true,
      completedAt: new Date().toISOString(),
      module2TierAssigned: {
        rw: module2Tier,
        math: module2Tier,
      },
    };

    onCompleteTest(attempt, missedList);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (isTestFinished && finalScoreReport) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F3F4F6] overflow-y-auto p-4 sm:p-8 flex items-center justify-center font-sans">
        <div className="w-full max-w-4xl bg-[#111111] border border-[#1F2937] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#1F2937] pb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Official Bluebook MST Test Completed
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{test.title}</h2>
              <p className="text-[#9CA3AF] text-xs sm:text-sm mt-1">
                Scored using official College Board 2-Stage Multistage Adaptive Scaling.
              </p>
            </div>

            {/* Total Scaled Score */}
            <div className="p-6 bg-[#0A0A0A] rounded-2xl border border-[#1F2937] text-center min-w-[200px]">
              <div className="text-xs text-[#9CA3AF] uppercase font-bold tracking-wider font-mono">Total Score</div>
              <div className="text-4xl sm:text-5xl font-bold font-mono text-white mt-1">
                {finalScoreReport.totalScore}
              </div>
              <div className="text-[11px] text-[#6B7280] mt-1 font-mono">Scale: 400 - 1600</div>
            </div>
          </div>

          {/* Section Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1F2937] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Reading & Writing</span>
                <span className="text-2xl font-bold font-mono text-blue-400">{finalScoreReport.rwScore}</span>
              </div>
              <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(finalScoreReport.rwScore / 800) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#9CA3AF]">
                <span>Adaptive Route: <strong className="text-white font-bold">{finalScoreReport.module2RWTier} Stage</strong></span>
                <span className="font-mono">Max: 800</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#1F2937] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">Math</span>
                <span className="text-2xl font-bold font-mono text-blue-400">{finalScoreReport.mathScore}</span>
              </div>
              <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full"
                  style={{ width: `${(finalScoreReport.mathScore / 800) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-[#9CA3AF]">
                <span>Adaptive Route: <strong className="text-white font-bold">{finalScoreReport.module2MathTier} Stage</strong></span>
                <span className="font-mono">Max: 800</span>
              </div>
            </div>
          </div>

          {/* Mistake Vault notice */}
          <div className="p-4 rounded-xl bg-[#111111] border border-blue-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {finalScoreReport.missedCount} Missed Questions Deposited to Mistake Vault
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  Scheduled for Leitner Spaced Repetition (Day 3 re-test) and AI Clone generation.
                </div>
              </div>
            </div>
          </div>

          {/* Bottom actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2937]">
            <button
              onClick={onExit}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors cursor-pointer"
            >
              Return to Bluebook Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A] text-[#F3F4F6] flex flex-col select-none overflow-hidden font-sans">
      {/* Official Bluebook Top Bar */}
      <header className="h-14 bg-[#111111] border-b border-[#1F2937] px-4 sm:px-6 flex items-center justify-between shrink-0">
        {/* Left: Section Label & Directions */}
        <div className="flex items-center gap-4">
          <div>
            <div className="text-xs font-bold tracking-wide text-white uppercase">
              {currentSection === 'READING_AND_WRITING' ? 'Section 1: Reading and Writing' : 'Section 2: Math'}
            </div>
            <div className="text-[10px] text-blue-400 font-mono font-bold">
              Module {currentModule} ({currentModule === 2 ? `${module2Tier} Adaptive Stage` : 'Standard Baseline'})
            </div>
          </div>

          <button
            onClick={() => setShowDirections(!showDirections)}
            className="hidden sm:flex items-center gap-1 text-xs text-[#9CA3AF] hover:text-white underline decoration-dotted ml-2 cursor-pointer"
          >
            Directions
          </button>
        </div>

        {/* Center: Timer with Hide/Show Toggle */}
        <div className="flex items-center gap-2">
          {!isTimerHidden ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0A0A0A] border border-[#1F2937] text-white font-mono text-xs font-bold">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          ) : (
            <div className="px-3 py-1 rounded-lg bg-[#0A0A0A] border border-[#1F2937] text-[#6B7280] text-xs">
              Timer Hidden
            </div>
          )}
          <button
            onClick={() => setIsTimerHidden(!isTimerHidden)}
            className="p-1 rounded text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] text-[11px] cursor-pointer"
            title={isTimerHidden ? 'Show Timer' : 'Hide Timer'}
          >
            {isTimerHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Bluebook Testing Tools */}
        <div className="flex items-center gap-2">
          {/* Desmos Graphing Calculator */}
          <button
            onClick={() => setShowDesmos(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-[#D1D5DB] text-xs font-semibold border border-[#1F2937] transition-colors cursor-pointer"
            title="Open Desmos Calculator"
          >
            <Calculator className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* Reference Sheet */}
          <button
            onClick={() => setShowFormulas(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-[#D1D5DB] text-xs font-semibold border border-[#1F2937] transition-colors cursor-pointer"
            title="Open Reference Sheet"
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden md:inline">Reference</span>
          </button>

          {/* ABC Option Strikethrough Toggle */}
          <button
            onClick={() => setIsStrikethroughMode(!isStrikethroughMode)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
              isStrikethroughMode
                ? 'bg-blue-600 text-white'
                : 'bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#1F2937]'
            }`}
            title="ABC Strikethrough elimination mode"
          >
            <span className="line-through">ABC</span>
          </button>

          {/* Mark for Review Checkbox */}
          {activeQuestion && (
            <button
              onClick={() =>
                setMarkedForReview((prev) => ({
                  ...prev,
                  [activeQuestion.id]: !prev[activeQuestion.id],
                }))
              }
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                markedForReview[activeQuestion.id]
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                  : 'bg-[#1A1A1A] text-[#9CA3AF] hover:text-white border border-[#1F2937]'
              }`}
            >
              {markedForReview[activeQuestion.id] ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
              ) : (
                <Bookmark className="w-3.5 h-3.5" />
              )}
              <span className="hidden lg:inline">Mark for Review</span>
            </button>
          )}

          {/* Exit test */}
          <button
            onClick={onExit}
            className="p-1.5 rounded text-[#9CA3AF] hover:text-red-400 hover:bg-[#1A1A1A] ml-2 cursor-pointer"
            title="Exit Test Simulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Directions Dropdown Banner */}
      {showDirections && (
        <div className="bg-[#111111] border-b border-[#1F2937] p-4 text-xs text-[#D1D5DB] leading-relaxed max-h-40 overflow-y-auto">
          <div className="font-bold text-white mb-1">
            Official Bluebook Testing Instructions:
          </div>
          <p>
            The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s). All questions have four answer choices with one correct answer.
          </p>
        </div>
      )}

      {/* Main Two-Column Bluebook Question Area */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#0A0A0A]">
        {activeQuestion ? (
          <>
            {/* Left Pane: Passage or Math Problem Stem */}
            <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-[#1F2937] overflow-y-auto bg-[#0A0A0A]">
              <div className="max-w-xl mx-auto space-y-4">
                <div className="text-[11px] font-mono text-[#9CA3AF] uppercase tracking-wider font-bold">
                  Question {currentQuestionIndex + 1}
                </div>
                {activeQuestion.passage ? (
                  <div className="text-sm sm:text-base text-[#F3F4F6] leading-relaxed font-sans p-5 bg-[#111111] rounded-xl border border-[#1F2937]">
                    {activeQuestion.passage}
                  </div>
                ) : (
                  <div className="p-4 bg-[#111111] rounded-xl border border-[#1F2937] text-[#9CA3AF] text-xs">
                    Graph / Scratchpad reference available via calculator dock.
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Question Prompt & Options (A, B, C, D) or Grid-In */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#0A0A0A]">
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-sm sm:text-base font-bold text-white whitespace-pre-line leading-relaxed">
                  {activeQuestion.questionText}
                </div>

                {activeQuestion.options ? (
                  <div className="space-y-3 pt-2">
                    {Object.entries(activeQuestion.options).map(([optKey, optText]) => {
                      const isSelected = answers[activeQuestion.id] === optKey;
                      const isStruck = (strikethroughs[activeQuestion.id] || []).includes(optKey);

                      return (
                        <div key={optKey} className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (isStrikethroughMode) {
                                toggleStrikethrough(activeQuestion.id, optKey);
                              } else {
                                setAnswers((prev) => ({ ...prev, [activeQuestion.id]: optKey }));
                              }
                            }}
                            className={`flex-1 text-left p-3.5 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/15 border-blue-500 text-white shadow-md ring-1 ring-blue-500/50'
                                : 'bg-[#111111] border-[#1F2937] text-[#D1D5DB] hover:border-[#374151] hover:bg-[#161616]'
                            } ${isStruck ? 'opacity-40 line-through' : ''}`}
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-mono transition-colors ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-[#1F2937] text-[#9CA3AF]'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span className="text-sm font-sans flex-1 pt-0.5">{optText}</span>
                          </button>

                          {/* Quick strikethrough icon button */}
                          <button
                            onClick={() => toggleStrikethrough(activeQuestion.id, optKey)}
                            className={`p-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                              isStruck
                                ? 'text-blue-400 bg-[#1F2937]'
                                : 'text-[#6B7280] hover:text-[#D1D5DB]'
                            }`}
                            title="Strike through option"
                          >
                            <span className="line-through font-bold">{optKey}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Grid-in Input Box */
                  <div className="space-y-3 pt-2">
                    <label className="text-xs text-[#9CA3AF] font-bold">Answer:</label>
                    <input
                      type="text"
                      value={answers[activeQuestion.id] || ''}
                      onChange={(e) =>
                        setAnswers((prev) => ({ ...prev, [activeQuestion.id]: e.target.value }))
                      }
                      placeholder="Enter exact numerical answer"
                      className="w-full max-w-xs px-4 py-3 rounded-xl bg-[#111111] border border-[#1F2937] font-mono text-white text-base focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#9CA3AF]">
            No questions available in this module.
          </div>
        )}
      </main>

      {/* Official Bluebook Bottom Navigation Bar */}
      <footer className="h-16 bg-[#111111] border-t border-[#1F2937] px-4 sm:px-6 flex items-center justify-between shrink-0">
        {/* Left: User & Section details */}
        <div className="text-xs text-[#9CA3AF] hidden sm:block">
          <span className="text-white font-bold">{user.fullName}</span> • Digital SAT Official Simulation
        </div>

        {/* Center: Question Matrix Grid Drawer Button */}
        <button
          onClick={() => setShowQuestionGrid(!showQuestionGrid)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] text-white text-xs font-bold transition-colors border border-[#1F2937] cursor-pointer"
        >
          <Grid className="w-3.5 h-3.5 text-blue-400" />
          <span>Question {currentQuestionIndex + 1} of {totalQuestionsInModule}</span>
          <span className="text-[10px] text-[#9CA3AF]">▾</span>
        </button>

        {/* Right: Back and Next / Submit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#222222] disabled:opacity-40 text-[#D1D5DB] text-xs font-bold transition-colors border border-[#1F2937] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          {currentQuestionIndex < totalQuestionsInModule - 1 ? (
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestionsInModule - 1, prev + 1))}
              className="flex items-center gap-1 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextModuleOrFinish}
              className="flex items-center gap-1 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-md shadow-blue-600/30 cursor-pointer"
            >
              {currentSection === 'MATH' && currentModule === 2
                ? 'Finish Test Simulation'
                : 'Complete & Proceed to Next Module →'}
            </button>
          )}
        </div>
      </footer>

      {/* Question Matrix Review Drawer Modal */}
      {showQuestionGrid && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F2937] rounded-2xl p-6 w-full max-w-xl space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
              <h3 className="font-bold text-sm text-white">
                {currentSection === 'READING_AND_WRITING' ? 'Reading & Writing' : 'Math'} - Module {currentModule} Review Grid
              </h3>
              <button
                onClick={() => setShowQuestionGrid(false)}
                className="p-1 rounded text-[#9CA3AF] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of question numbers */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5">
              {currentModuleQuestions.map((q, idx) => {
                const hasAnswer = !!answers[q.questionId];
                const isMarked = !!markedForReview[q.questionId];
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setShowQuestionGrid(false);
                    }}
                    className={`relative h-11 rounded-lg border text-xs font-bold font-mono transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'border-blue-500 ring-2 ring-blue-500/50 bg-blue-600/20 text-white'
                        : hasAnswer
                        ? 'bg-[#1A1A1A] border-[#374151] text-white'
                        : 'bg-[#0A0A0A] border-[#1F2937] text-[#6B7280]'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isMarked && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 absolute top-1 right-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-[#9CA3AF] pt-2 border-t border-[#1F2937]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#1A1A1A] border border-[#374151] inline-block" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-[#0A0A0A] border border-[#1F2937] inline-block" /> Unanswered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" /> Marked for Review
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Desmos Graphing Suite and Formulas */}
      <FloatingDesmosModal
        isOpen={showDesmos}
        onClose={() => setShowDesmos(false)}
        isDarkMode={true}
      />
      <FormulaReferenceSheet isOpen={showFormulas} onClose={() => setShowFormulas(false)} />
    </div>
  );
};
