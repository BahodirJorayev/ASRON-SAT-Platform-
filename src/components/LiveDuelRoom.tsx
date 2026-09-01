import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Timer,
  CheckCircle2,
  XCircle,
  Trophy,
  BrainCircuit,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  User as UserIcon
} from 'lucide-react';
import { User, Question, ArenaMode, ArenaCategory, ArenaMatch, ArenaParticipant, ArenaQuestionAnswer } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';
import { supabase } from '../lib/supabase';
import { ARENA_QUESTIONS, SAMPLE_OPPONENTS } from '../data/arenaQuestions';

interface Props {
  currentUser: User;
  mode: ArenaMode;
  category: ArenaCategory;
  roomCode?: string;
  opponentUsername?: string;
  onExit: () => void;
  onDepositMistake?: (question: Question, wrongAnswer: string) => void;
  onOpenSocraticTutor?: (question: Question) => void;
}

const QUESTION_TIME_LIMIT_SEC = 45;

export const LiveDuelRoom: React.FC<Props> = ({
  currentUser,
  mode,
  category,
  roomCode,
  opponentUsername,
  onExit,
  onDepositMistake,
  onOpenSocraticTutor,
}) => {
  // Select question set
  const questions: Question[] = React.useMemo(() => {
    const pool = ARENA_QUESTIONS[category] || ARENA_QUESTIONS.MIXED;
    // Shuffle or slice 5 questions for standard duel, or full pool for survival
    if (mode === 'SURVIVAL') {
      const allQ = Object.values(ARENA_QUESTIONS).flat();
      return [...allQ].sort(() => Math.random() - 0.5);
    }
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 5);
  }, [category, mode]);

  // Select or find opponent
  const opponent = React.useMemo(() => {
    if (opponentUsername) {
      const found = SAMPLE_OPPONENTS.find((o) => o.username === opponentUsername);
      if (found) return found;
    }
    return SAMPLE_OPPONENTS[Math.floor(Math.random() * SAMPLE_OPPONENTS.length)];
  }, [opponentUsername]);

  // Match state
  const [matchState, setMatchState] = useState<'COUNTDOWN' | 'PLAYING' | 'QUESTION_REVIEW' | 'VERDICT'>('COUNTDOWN');
  const [countdownNum, setCountdownNum] = useState(3);
  const [currentQIndex, setCurrentQIndex] = useState(0);

  // Timer per question (in seconds with 1 decimal precision)
  const [timeLeft, setTimeLeft] = useState<number>(QUESTION_TIME_LIMIT_SEC);
  const startTimeRef = useRef<number>(Date.now());

  // Player state
  const [playerScore, setPlayerScore] = useState(0);
  const [playerSelectedOption, setPlayerSelectedOption] = useState<string | null>(null);
  const [playerLockedIn, setPlayerLockedIn] = useState(false);
  const [playerAnswers, setPlayerAnswers] = useState<ArenaQuestionAnswer[]>([]);

  // Opponent state
  const [opponentScore, setOpponentScore] = useState(0);
  const [opponentLockedIn, setOpponentLockedIn] = useState(false);
  const [opponentTimeSec, setOpponentTimeSec] = useState<number | null>(null);
  const [opponentAnswers, setOpponentAnswers] = useState<ArenaQuestionAnswer[]>([]);

  // Survival state
  const [survivalStreak, setSurvivalStreak] = useState(0);
  const [isSurvivalGameOver, setIsSurvivalGameOver] = useState(false);

  // Mistake sync tracker
  const [syncedMistakeIds, setSyncedMistakeIds] = useState<Set<string>>(new Set());

  // Current active question
  const currentQuestion = questions[currentQIndex] || questions[0];

  // Pre-match 3..2..1.. Fight countdown
  useEffect(() => {
    if (matchState !== 'COUNTDOWN') return;
    const interval = setInterval(() => {
      setCountdownNum((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMatchState('PLAYING');
          startTimeRef.current = Date.now();
          return 0;
        }
        return prev - 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [matchState]);

  // Main Question Timer Loop
  useEffect(() => {
    if (matchState !== 'PLAYING') return;

    const timer = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, QUESTION_TIME_LIMIT_SEC - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        handleTimeExpired();
      }
    }, 100);

    return () => clearInterval(timer);
  }, [matchState, currentQIndex]);

  // Real-time opponent action simulation / Supabase channel integration
  useEffect(() => {
    if (matchState !== 'PLAYING' || mode === 'SURVIVAL') return;

    setOpponentLockedIn(false);
    setOpponentTimeSec(null);

    // Calculate opponent answer timing based on opponent speedFactor
    const oppDurationSec = 6 + Math.random() * 14 * (opponent.speedFactor || 0.8);

    const timeout = setTimeout(() => {
      setOpponentLockedIn(true);
      setOpponentTimeSec(parseFloat(oppDurationSec.toFixed(1)));

      const isCorrect = Math.random() < (opponent.accuracyProb || 0.82);
      const oppAnswer = isCorrect
        ? currentQuestion.correctAnswer
        : ['A', 'B', 'C', 'D'].filter((c) => c !== currentQuestion.correctAnswer)[0];

      const elapsedSec = oppDurationSec;
      const scoreGain = isCorrect ? Math.max(10, Math.round(100 - elapsedSec * 2)) : 0;

      setOpponentScore((prev) => prev + scoreGain);
      setOpponentAnswers((prev) => [
        ...prev,
        {
          qIndex: currentQIndex,
          questionId: currentQuestion.id,
          answer: oppAnswer,
          isCorrect,
          timeMs: Math.round(oppDurationSec * 1000),
          scoreAwarded: scoreGain,
        },
      ]);
    }, oppDurationSec * 1000);

    return () => clearTimeout(timeout);
  }, [matchState, currentQIndex, mode]);

  // Handle Player Option Selection
  const handleSelectOption = (optionKey: string) => {
    if (playerLockedIn || matchState !== 'PLAYING') return;

    const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
    setPlayerSelectedOption(optionKey);
    setPlayerLockedIn(true);

    const isCorrect = optionKey === currentQuestion.correctAnswer;
    const scoreGain = isCorrect ? Math.max(10, Math.round(100 - elapsedSec * 2)) : 0;

    if (isCorrect) {
      setPlayerScore((prev) => prev + scoreGain);
      if (mode === 'SURVIVAL') {
        setSurvivalStreak((prev) => prev + 1);
      }
    } else if (mode === 'SURVIVAL') {
      setIsSurvivalGameOver(true);
    }

    const answerRecord: ArenaQuestionAnswer = {
      qIndex: currentQIndex,
      questionId: currentQuestion.id,
      answer: optionKey,
      isCorrect,
      timeMs: Math.round(elapsedSec * 1000),
      scoreAwarded: scoreGain,
    };

    setPlayerAnswers((prev) => [...prev, answerRecord]);

    // Advance to Question Review or Next Round after brief pause
    setTimeout(() => {
      advanceToNextOrVerdict(isCorrect);
    }, 1200);
  };

  // Handle Time Expired
  const handleTimeExpired = () => {
    if (playerLockedIn) return;
    setPlayerLockedIn(true);
    setPlayerSelectedOption('NO_ANSWER');

    if (mode === 'SURVIVAL') {
      setIsSurvivalGameOver(true);
    }

    const answerRecord: ArenaQuestionAnswer = {
      qIndex: currentQIndex,
      questionId: currentQuestion.id,
      answer: 'NO_ANSWER',
      isCorrect: false,
      timeMs: QUESTION_TIME_LIMIT_SEC * 1000,
      scoreAwarded: 0,
    };
    setPlayerAnswers((prev) => [...prev, answerRecord]);

    setTimeout(() => {
      advanceToNextOrVerdict(false);
    }, 1200);
  };

  // Progress logic
  const advanceToNextOrVerdict = (lastWasCorrect: boolean) => {
    if (mode === 'SURVIVAL' && !lastWasCorrect) {
      setMatchState('VERDICT');
      return;
    }

    if (currentQIndex + 1 < questions.length && !(mode === 'SURVIVAL' && !lastWasCorrect)) {
      setCurrentQIndex((prev) => prev + 1);
      setPlayerSelectedOption(null);
      setPlayerLockedIn(false);
      setOpponentLockedIn(false);
      setOpponentTimeSec(null);
      setTimeLeft(QUESTION_TIME_LIMIT_SEC);
      startTimeRef.current = Date.now();
    } else {
      setMatchState('VERDICT');
    }
  };

  // Deposit single mistake to Mistake Vault
  const handleSyncToMistakeVault = (q: Question, wrongAns: string) => {
    if (syncedMistakeIds.has(q.id)) return;
    onDepositMistake?.(q, wrongAns);
    setSyncedMistakeIds((prev) => new Set(prev).add(q.id));
  };

  // Elo rating computation
  const isWinner = playerScore > opponentScore;
  const isDraw = playerScore === opponentScore;
  const ratingDelta = mode === 'SURVIVAL'
    ? survivalStreak * 4
    : isWinner
    ? 24
    : isDraw
    ? 0
    : -16;

  const newRating = Math.max(800, (currentUser.baselineScore ? currentUser.targetScore - 100 : 1420) + ratingDelta);

  // 1. COUNTDOWN SCREEN
  if (matchState === 'COUNTDOWN') {
    return (
      <div className="min-h-[580px] bg-white rounded-3xl border border-[#E5E0D8] p-8 flex flex-col items-center justify-center text-center shadow-2xs relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#E5E0D8_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

        <div className="relative z-10 max-w-md w-full space-y-6">
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={currentUser.fullName}
                className="w-16 h-16 rounded-2xl mx-auto border-2 border-[#1E1B18] shadow-xs object-cover"
              />
              <div className="font-bold text-sm text-[#1E1B18] mt-2">{currentUser.fullName}</div>
              <div className="text-xs font-mono text-[#64748B]">@{currentUser.username}</div>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-[#1E1B18] text-white flex items-center justify-center font-bold text-xs">
                VS
              </div>
            </div>

            <div className="text-center">
              <img
                src={mode === 'SURVIVAL' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120' : opponent.avatarUrl}
                alt="Opponent"
                className="w-16 h-16 rounded-2xl mx-auto border-2 border-[#E5E0D8] shadow-xs object-cover"
              />
              <div className="font-bold text-sm text-[#1E1B18] mt-2">
                {mode === 'SURVIVAL' ? 'Survival Gauntlet' : opponent.fullName}
              </div>
              <div className="text-xs font-mono text-[#64748B]">
                {mode === 'SURVIVAL' ? 'Endless Ladder' : `@${opponent.username}`}
              </div>
            </div>
          </div>

          <div className="py-4">
            <div className="text-6xl font-black font-mono text-[#E07A5F] tracking-tighter animate-pulse">
              {countdownNum}
            </div>
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-widest mt-2">
              Synchronizing Arena Channel...
            </p>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-4 text-xs text-[#64748B]">
            <div className="font-bold text-[#1E1B18] mb-1">
              {mode === 'SURVIVAL' ? 'Survival Rule' : 'Speed Formula active'}
            </div>
            {mode === 'SURVIVAL' ? (
              <span>Answer correctly to continue climbing. First mistake terminates the run!</span>
            ) : (
              <span>
                <KaTeXRenderer text="$\text{Score} = 100 - (\text{Elapsed Seconds} \times 2)$" inline />. Faster answers earn maximum points.
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. VERDICT / POST-MATCH SCREEN
  if (matchState === 'VERDICT') {
    const missedQuestions = questions.filter((q, idx) => {
      const ans = playerAnswers.find((a) => a.qIndex === idx);
      return ans && !ans.isCorrect;
    });

    return (
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Match Result Banner */}
        <div className="text-center space-y-2 pb-6 border-b border-[#E5E0D8]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#64748B]">
            {mode === 'SURVIVAL' ? 'SURVIVAL GAUNTLET SUMMARY' : 'RANKED 1V1 DUEL COMPLETED'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B18] tracking-tight">
            {mode === 'SURVIVAL' ? (
              <span>Gauntlet Run: <span className="text-[#E07A5F]">{survivalStreak} Questions Cleared</span></span>
            ) : isWinner ? (
              <span className="text-[#2A9D8F]">Victory</span>
            ) : isDraw ? (
              <span className="text-[#3D405B]">Draw Match</span>
            ) : (
              <span className="text-[#E76F51]">Defeat</span>
            )}
          </h2>

          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            {mode === 'SURVIVAL'
              ? `You answered ${survivalStreak} questions correctly before your first mistake.`
              : `Final Score: ${playerScore} pts vs ${opponentScore} pts.`}
          </p>
        </div>

        {/* Head to Head Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Player Card */}
          <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E5E0D8] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                  alt={currentUser.fullName}
                  className="w-11 h-11 rounded-xl object-cover border border-[#1E1B18]"
                />
                <div>
                  <div className="font-bold text-sm text-[#1E1B18]">{currentUser.fullName} (You)</div>
                  <div className="text-xs font-mono text-[#64748B]">@{currentUser.username}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black font-mono text-[#1E1B18]">{playerScore} pts</div>
                <div className="text-[11px] font-mono text-[#2A9D8F] font-bold">
                  {playerAnswers.filter((a) => a.isCorrect).length} / {playerAnswers.length} Correct
                </div>
              </div>
            </div>

            {/* Rating Delta */}
            <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Elo Rating Update:</span>
              <div className="font-mono font-bold flex items-center gap-1.5">
                <span className="text-[#1E1B18]">1,420</span>
                <ArrowRight size={12} className="text-[#64748B]" />
                <span className={ratingDelta >= 0 ? 'text-[#2A9D8F]' : 'text-[#E76F51]'}>
                  {newRating} ({ratingDelta >= 0 ? `+${ratingDelta}` : ratingDelta})
                </span>
              </div>
            </div>
          </div>

          {/* Opponent Card (if not survival) */}
          {mode !== 'SURVIVAL' ? (
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E5E0D8] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={opponent.avatarUrl}
                    alt={opponent.fullName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#E5E0D8]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#1E1B18]">{opponent.fullName}</div>
                    <div className="text-xs font-mono text-[#64748B]">@{opponent.username}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black font-mono text-[#1E1B18]">{opponentScore} pts</div>
                  <div className="text-[11px] font-mono text-[#64748B]">
                    {opponentAnswers.filter((a) => a.isCorrect).length} / {questions.length} Correct
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Opponent Rating:</span>
                <span className="font-mono font-bold text-[#1E1B18]">{opponent.rating} pts</span>
              </div>
            </div>
          ) : (
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E5E0D8] flex flex-col justify-center space-y-2">
              <div className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Survival Record</div>
              <div className="text-2xl font-black font-mono text-[#E07A5F]">{survivalStreak} Consecutive</div>
              <p className="text-xs text-[#64748B]">
                Your score has been registered to the weekly Survival Gauntlet leaderboard.
              </p>
            </div>
          )}
        </div>

        {/* Mistake Auto-Sync Section */}
        {missedQuestions.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit size={18} className="text-[#E07A5F]" />
                <h4 className="font-bold text-sm text-[#1E1B18]">
                  Missed Questions ({missedQuestions.length})
                </h4>
              </div>
              <span className="text-xs text-[#64748B]">Auto-sync with Leitner SRS Mistake Vault</span>
            </div>

            <div className="space-y-2.5">
              {missedQuestions.map((q, idx) => {
                const isSynced = syncedMistakeIds.has(q.id);
                const userAns = playerAnswers.find((a) => a.questionId === q.id)?.answer || 'None';

                return (
                  <div
                    key={q.id}
                    className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-white border border-[#E5E0D8]">
                          {q.sqbId || `#Q-${idx + 1}`}
                        </span>
                        <span className="font-bold text-[#1E1B18]">{q.domain}</span>
                        <span className="text-[#64748B]">({q.skill})</span>
                      </div>
                      <div className="line-clamp-1 text-[#64748B]">
                        {q.questionText}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleSyncToMistakeVault(q, userAns)}
                        disabled={isSynced}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          isSynced
                            ? 'bg-[#E5E0D8] text-[#64748B] cursor-default'
                            : 'bg-[#E07A5F] hover:bg-[#D0694E] text-white shadow-2xs'
                        }`}
                      >
                        {isSynced ? 'Saved to Vault' : 'Add to Mistake Vault'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
          <button
            onClick={onExit}
            className="px-5 py-2.5 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#1E1B18] transition-all cursor-pointer"
          >
            Return to Arena Lobby
          </button>

          <button
            onClick={() => {
              setMatchState('COUNTDOWN');
              setCountdownNum(3);
              setCurrentQIndex(0);
              setPlayerScore(0);
              setOpponentScore(0);
              setPlayerAnswers([]);
              setOpponentAnswers([]);
              setPlayerSelectedOption(null);
              setPlayerLockedIn(false);
              setSurvivalStreak(0);
              setIsSurvivalGameOver(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Rematch Duel
          </button>
        </div>
      </div>
    );
  }

  // 3. ACTIVE LIVE DUEL PLAYING SCREEN
  const progressPercent = ((currentQIndex + 1) / questions.length) * 100;
  const timerPercent = (timeLeft / QUESTION_TIME_LIMIT_SEC) * 100;

  return (
    <div className="space-y-4">
      {/* Head-to-Head Live Status Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-4">
          {/* Player 1 (User) */}
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
              alt={currentUser.fullName}
              className="w-10 h-10 rounded-xl object-cover border border-[#1E1B18]"
            />
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1E1B18] flex items-center gap-1.5">
                <span>{currentUser.fullName}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[9px] font-mono">
                  YOU
                </span>
              </div>
              <div className="text-xs font-mono font-black text-[#E07A5F]">{playerScore} pts</div>
            </div>
          </div>

          {/* Center Timer & Round Segment */}
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono font-bold text-[#1E1B18]">
              <Timer size={13} className={timeLeft <= 10 ? 'text-[#E76F51] animate-pulse' : 'text-[#64748B]'} />
              <span>{timeLeft.toFixed(1)}s</span>
            </div>
            <div className="text-[11px] font-mono text-[#64748B] mt-1">
              {mode === 'SURVIVAL'
                ? `Question ${currentQIndex + 1} (Streak: ${survivalStreak})`
                : `Question ${currentQIndex + 1} of ${questions.length}`}
            </div>
          </div>

          {/* Player 2 (Opponent) */}
          <div className="flex items-center gap-3 text-right">
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#1E1B18]">
                {mode === 'SURVIVAL' ? 'Survival Gauntlet' : opponent.fullName}
              </div>
              <div className="text-xs font-mono font-black text-[#3D405B]">
                {mode === 'SURVIVAL' ? `${survivalStreak} Streak` : `${opponentScore} pts`}
              </div>
            </div>
            <img
              src={mode === 'SURVIVAL' ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120' : opponent.avatarUrl}
              alt="Opponent"
              className="w-10 h-10 rounded-xl object-cover border border-[#E5E0D8]"
            />
          </div>
        </div>

        {/* 45-Second Countdown Shrinking Progress Bar */}
        <div className="w-full h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E0D8]">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              timeLeft <= 10 ? 'bg-[#E76F51]' : 'bg-[#E07A5F]'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Linear Segmented Question Progress Tracker */}
        {mode !== 'SURVIVAL' && (
          <div className="flex items-center gap-1.5 pt-1">
            {questions.map((_, idx) => {
              const isPast = idx < currentQIndex;
              const isCurrent = idx === currentQIndex;
              const playerAns = playerAnswers[idx];

              return (
                <div
                  key={idx}
                  className={`h-2 flex-1 rounded-full transition-all ${
                    isCurrent
                      ? 'bg-[#1E1B18]'
                      : isPast
                      ? playerAns?.isCorrect
                        ? 'bg-[#2A9D8F]'
                        : 'bg-[#E76F51]'
                      : 'bg-[#E5E0D8]'
                  }`}
                />
              );
            })}
          </div>
        )}

        {/* Opponent Status Indicator Pill */}
        {mode !== 'SURVIVAL' && (
          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-1">
            <span className="font-mono">
              {playerLockedIn ? 'Your answer submitted' : 'Choose your answer below'}
            </span>
            <span className="font-mono flex items-center gap-1.5">
              {opponentLockedIn ? (
                <span className="text-[#2A9D8F] font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  Opponent locked in answer ({opponentTimeSec}s)
                </span>
              ) : (
                <span className="text-[#64748B] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E07A5F] animate-ping" />
                  Opponent thinking...
                </span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Dynamic Question Split-Pane Display */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-2xs space-y-6">
        {/* Question Header Domain Tag */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] font-mono text-[11px] font-bold text-[#1E1B18]">
              {currentQuestion.sqbId || `#SAT-${currentQIndex + 1}`}
            </span>
            <span className="text-xs font-bold text-[#64748B]">
              {currentQuestion.section === 'MATH' ? 'Math Section' : 'Reading & Writing'} • {currentQuestion.domain}
            </span>
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FAF8F5] border border-[#E5E0D8] text-[#64748B]">
            {currentQuestion.skill}
          </span>
        </div>

        {/* Split-Pane Layout (Passage on Left if available, Question on Right) */}
        <div className={`grid gap-6 ${currentQuestion.passage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Optional Passage Box */}
          {currentQuestion.passage && (
            <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E5E0D8] text-sm text-[#1E1B18] leading-relaxed space-y-3 max-h-[380px] overflow-y-auto">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Official Passage Text
              </div>
              <div className="whitespace-pre-line">
                <KaTeXRenderer text={currentQuestion.passage} />
              </div>
            </div>
          )}

          {/* Question Prompt and Multiple-Choice Options */}
          <div className="space-y-6">
            <div className="text-base sm:text-lg font-medium text-[#1E1B18] leading-snug">
              <KaTeXRenderer text={currentQuestion.questionText} />
            </div>

            {/* Multiple Choice Cards (A, B, C, D) */}
            <div className="space-y-3">
              {currentQuestion.options &&
                Object.entries(currentQuestion.options).map(([key, value]) => {
                  const isSelected = playerSelectedOption === key;
                  const isCorrect = key === currentQuestion.correctAnswer;
                  const showFeedback = playerLockedIn;

                  let cardStyle = 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8] text-[#1E1B18]';
                  if (showFeedback) {
                    if (isSelected && isCorrect) {
                      cardStyle = 'bg-[#2A9D8F]/10 border-[#2A9D8F] text-[#1E1B18]';
                    } else if (isSelected && !isCorrect) {
                      cardStyle = 'bg-[#E76F51]/10 border-[#E76F51] text-[#1E1B18]';
                    } else if (isCorrect) {
                      cardStyle = 'bg-[#2A9D8F]/5 border-[#2A9D8F]/50 text-[#1E1B18]';
                    }
                  } else if (isSelected) {
                    cardStyle = 'bg-[#1E1B18] text-white border-[#1E1B18]';
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectOption(key)}
                      disabled={playerLockedIn}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-4 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-7 h-7 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? showFeedback && !isCorrect
                                ? 'bg-[#E76F51] text-white border-[#E76F51]'
                                : 'bg-[#1E1B18] text-white border-[#1E1B18]'
                              : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#64748B]'
                          }`}
                        >
                          {key}
                        </div>
                        <div className="text-sm font-medium">
                          <KaTeXRenderer text={value} inline />
                        </div>
                      </div>

                      {showFeedback && isSelected && (
                        <div>
                          {isCorrect ? (
                            <CheckCircle2 size={18} className="text-[#2A9D8F]" />
                          ) : (
                            <XCircle size={18} className="text-[#E76F51]" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
