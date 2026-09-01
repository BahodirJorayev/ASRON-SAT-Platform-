import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Zap,
  Trophy,
  Flame,
  Clock,
  Award,
  RotateCcw,
  Play,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  User,
  Users,
  Target,
  BarChart2,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { VocabularyWord, VocabContextQuestion, User as UserType, VocabGameMatch } from '../types';
import { VOCAB_CONTEXT_QUESTIONS } from '../data/collegePandaVocab';
import { speakWord, playAudioFeedback } from '../utils/speechUtils';

interface Props {
  words: VocabularyWord[];
  user: UserType;
  onRewardXP?: (xp: number) => void;
  onOpenPaywall?: () => void;
}

type ArenaMode = 'LOBBY' | 'SPEED_BLITZ' | 'PVP_DUEL' | 'CONTEXT_CLASH' | 'LEADERBOARD';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  wpm: number;
  accuracy: number;
  streak: number;
  badge: string;
}

const GLOBAL_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', name: 'Zarnigor M.', avatar: '👩‍🔬', location: 'Tashkent, UZ', rating: 1680, wpm: 42, accuracy: 98, streak: 18, badge: 'Grandmaster' },
  { id: 'lb-2', name: 'Alexander C.', avatar: '👨‍🎓', location: 'Boston, USA', rating: 1640, wpm: 39, accuracy: 96, streak: 14, badge: 'Master' },
  { id: 'lb-3', name: 'Min-Jun P.', avatar: '🧑‍💻', location: 'Seoul, KR', rating: 1610, wpm: 37, accuracy: 94, streak: 11, badge: 'Diamond' },
  { id: 'lb-4', name: 'Camilla D.', avatar: '👩‍🏫', location: 'London, UK', rating: 1580, wpm: 35, accuracy: 92, streak: 9, badge: 'Diamond' },
  { id: 'lb-5', name: 'Shokhrukh K.', avatar: '👨‍🚀', location: 'Samarkand, UZ', rating: 1550, wpm: 34, accuracy: 91, streak: 8, badge: 'Platinum' },
];

export const VocabArenaGames: React.FC<Props> = ({
  words,
  user,
  onRewardXP,
  onOpenPaywall,
}) => {
  const [currentMode, setCurrentMode] = useState<ArenaMode>('LOBBY');

  // Personal Best Record in localStorage
  const [personalBest, setPersonalBest] = useState(() => {
    try {
      const saved = localStorage.getItem(`aurasat_vocab_pb_${user.id}`);
      if (saved) return JSON.parse(saved);
      return { highScore: 480, bestWpm: 28, maxStreak: 8, rating: 1520 };
    } catch {
      return { highScore: 480, bestWpm: 28, maxStreak: 8, rating: 1520 };
    }
  });

  // ==========================================
  // 1. SPEED BLITZ STATE (60-SEC SOLO RACE)
  // ==========================================
  const [blitzTimeLeft, setBlitzTimeLeft] = useState(60);
  const [blitzScore, setBlitzScore] = useState(0);
  const [blitzComboStreak, setBlitzComboStreak] = useState(0);
  const [blitzMaxStreak, setBlitzMaxStreak] = useState(0);
  const [blitzCorrectCount, setBlitzCorrectCount] = useState(0);
  const [blitzAttemptedCount, setBlitzAttemptedCount] = useState(0);
  const [blitzCurrentWordIndex, setBlitzCurrentWordIndex] = useState(0);
  const [blitzOptions, setBlitzOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);
  const [blitzFeedback, setBlitzFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);
  const [isBlitzActive, setIsBlitzActive] = useState(false);
  const blitzTimerRef = useRef<any>(null);

  // Generate 4 multiple-choice definition options for Blitz
  const generateBlitzQuestion = (wordIdx: number) => {
    if (words.length === 0) return;
    const targetWord = words[wordIdx % words.length];

    // Pick 3 random distractor words
    const distractors: VocabularyWord[] = [];
    const available = words.filter((w) => w.id !== targetWord.id);
    while (distractors.length < 3 && available.length > 0) {
      const rand = available[Math.floor(Math.random() * available.length)];
      if (!distractors.some((d) => d.id === rand.id)) {
        distractors.push(rand);
      }
    }

    const allOpts = [
      { text: targetWord.definition, isCorrect: true },
      ...distractors.map((d) => ({ text: d.definition, isCorrect: false })),
    ];

    // Shuffle options
    setBlitzOptions(allOpts.sort(() => Math.random() - 0.5));
    setBlitzFeedback(null);
  };

  // Start Speed Blitz
  const handleStartBlitz = () => {
    setBlitzTimeLeft(60);
    setBlitzScore(0);
    setBlitzComboStreak(0);
    setBlitzMaxStreak(0);
    setBlitzCorrectCount(0);
    setBlitzAttemptedCount(0);
    setBlitzCurrentWordIndex(0);
    setIsBlitzActive(true);
    setCurrentMode('SPEED_BLITZ');
    generateBlitzQuestion(0);
  };

  // Blitz countdown timer
  useEffect(() => {
    if (currentMode === 'SPEED_BLITZ' && isBlitzActive) {
      blitzTimerRef.current = setInterval(() => {
        setBlitzTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(blitzTimerRef.current);
            setIsBlitzActive(false);
            playAudioFeedback('victory');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(blitzTimerRef.current);
  }, [currentMode, isBlitzActive]);

  // Handle Blitz Option Click
  const handleBlitzAnswer = (isCorrect: boolean) => {
    if (!isBlitzActive) return;

    setBlitzAttemptedCount((prev) => prev + 1);

    if (isCorrect) {
      const multiplier = blitzComboStreak >= 5 ? 3 : blitzComboStreak >= 3 ? 2 : 1;
      const points = 50 * multiplier;
      setBlitzScore((prev) => prev + points);
      const nextStreak = blitzComboStreak + 1;
      setBlitzComboStreak(nextStreak);
      setBlitzMaxStreak((prev) => Math.max(prev, nextStreak));
      setBlitzCorrectCount((prev) => prev + 1);
      setBlitzFeedback('CORRECT');

      if (nextStreak % 3 === 0) {
        playAudioFeedback('combo');
      } else {
        playAudioFeedback('correct');
      }
    } else {
      setBlitzComboStreak(0);
      setBlitzFeedback('WRONG');
      playAudioFeedback('wrong');
    }

    // Advance to next word
    setTimeout(() => {
      const nextIdx = blitzCurrentWordIndex + 1;
      setBlitzCurrentWordIndex(nextIdx);
      generateBlitzQuestion(nextIdx);
    }, 200);
  };

  // Save personal record upon Blitz completion
  useEffect(() => {
    if (currentMode === 'SPEED_BLITZ' && blitzTimeLeft === 0 && !isBlitzActive) {
      const wpm = blitzAttemptedCount;
      const acc = blitzAttemptedCount > 0 ? Math.round((blitzCorrectCount / blitzAttemptedCount) * 100) : 0;

      if (blitzScore > personalBest.highScore) {
        const nextPb = {
          highScore: blitzScore,
          bestWpm: Math.max(personalBest.bestWpm, wpm),
          maxStreak: Math.max(personalBest.maxStreak, blitzMaxStreak),
          rating: personalBest.rating + 20,
        };
        setPersonalBest(nextPb);
        localStorage.setItem(`aurasat_vocab_pb_${user.id}`, JSON.stringify(nextPb));
      }

      onRewardXP?.(Math.round(blitzScore / 5));
    }
  }, [blitzTimeLeft, isBlitzActive, currentMode]);

  // ==========================================
  // 2. 1V1 SYNCHRONIZED LIVE DUEL (PVP) STATE
  // ==========================================
  const [pvpState, setPvpState] = useState<'MATCHMAKING' | 'DUELING' | 'RESULT'>('MATCHMAKING');
  const [pvpRound, setPvpRound] = useState(1);
  const [pvpTimeLeft, setPvpTimeLeft] = useState(15);
  const [pvpUserScore, setPvpUserScore] = useState(0);
  const [pvpOppScore, setPvpOppScore] = useState(0);
  const [pvpUserStreak, setPvpUserStreak] = useState(0);
  const [pvpOppStreak, setPvpOppStreak] = useState(0);
  const [pvpSelectedOption, setPvpSelectedOption] = useState<number | null>(null);
  const [pvpIsAnswered, setPvpIsAnswered] = useState(false);
  const [pvpOpponent, setPvpOpponent] = useState({
    name: 'Jasur K.',
    avatar: '👨‍🎓',
    location: 'Tashkent, UZ',
    rating: 1540,
  });

  const pvpTimerRef = useRef<any>(null);

  // PVP Questions list (5 rounds)
  const pvpQuestionsList = useMemo(() => {
    return words.slice(0, 5).map((w, idx) => {
      const distractors = words.filter((x) => x.id !== w.id).slice(0, 3);
      const choices = [
        { text: w.definition, isCorrect: true },
        ...distractors.map((d) => ({ text: d.definition, isCorrect: false })),
      ].sort(() => 0.5 - Math.random());

      return {
        word: w.word,
        partOfSpeech: w.partOfSpeech,
        choices,
      };
    });
  }, [words]);

  const currentPvpQ = pvpQuestionsList[pvpRound - 1] || pvpQuestionsList[0];

  // Start 1v1 PvP Duel
  const handleStartPvP = () => {
    setCurrentMode('PVP_DUEL');
    setPvpState('MATCHMAKING');
    setPvpRound(1);
    setPvpUserScore(0);
    setPvpOppScore(0);
    setPvpUserStreak(0);
    setPvpOppStreak(0);
    setPvpSelectedOption(null);
    setPvpIsAnswered(false);

    // Realistic matchmaker simulation (2.5 seconds)
    setTimeout(() => {
      setPvpState('DUELING');
      setPvpTimeLeft(15);
    }, 2500);
  };

  // PvP Round Timer
  useEffect(() => {
    if (currentMode === 'PVP_DUEL' && pvpState === 'DUELING') {
      pvpTimerRef.current = setInterval(() => {
        setPvpTimeLeft((prev) => {
          if (prev <= 1) {
            handlePvPTimeout();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(pvpTimerRef.current);
  }, [currentMode, pvpState, pvpRound]);

  // PvP Answer Selection
  const handlePvPAnswer = (idx: number, isCorrect: boolean) => {
    if (pvpIsAnswered) return;
    setPvpSelectedOption(idx);
    setPvpIsAnswered(true);

    if (isCorrect) {
      const speedBonus = pvpTimeLeft * 4; // Up to +60 speed bonus
      setPvpUserScore((prev) => prev + 100 + speedBonus);
      setPvpUserStreak((prev) => prev + 1);
      playAudioFeedback('correct');
    } else {
      setPvpUserStreak(0);
      playAudioFeedback('wrong');
    }

    // Opponent realistic answer timing
    setTimeout(() => {
      const oppCorrect = Math.random() > 0.25;
      if (oppCorrect) {
        setPvpOppScore((prev) => prev + 100 + Math.floor(Math.random() * 40));
        setPvpOppStreak((prev) => prev + 1);
      } else {
        setPvpOppStreak(0);
      }
    }, 600);

    // Proceed to next round or end duel
    setTimeout(() => {
      if (pvpRound < 5) {
        setPvpRound((prev) => prev + 1);
        setPvpSelectedOption(null);
        setPvpIsAnswered(false);
        setPvpTimeLeft(15);
      } else {
        setPvpState('RESULT');
        playAudioFeedback('victory');
        onRewardXP?.(150);
      }
    }, 1500);
  };

  const handlePvPTimeout = () => {
    if (pvpRound < 5) {
      setPvpRound((prev) => prev + 1);
      setPvpSelectedOption(null);
      setPvpIsAnswered(false);
    } else {
      setPvpState('RESULT');
    }
  };

  // ====================================================
  // 3. CONTEXTUAL FILL-IN-THE-BLANK CLASH STATE
  // ====================================================
  const [contextIndex, setContextIndex] = useState(0);
  const [contextScore, setContextScore] = useState(0);
  const [contextSelectedChoice, setContextSelectedChoice] = useState<string | null>(null);
  const [contextIsAnswered, setContextIsAnswered] = useState(false);
  const [contextCompleted, setContextCompleted] = useState(false);

  const currentContextQ = VOCAB_CONTEXT_QUESTIONS[contextIndex] || VOCAB_CONTEXT_QUESTIONS[0];

  const handleContextAnswer = (choice: string) => {
    if (contextIsAnswered) return;
    setContextSelectedChoice(choice);
    setContextIsAnswered(true);

    if (choice === currentContextQ.correctWord) {
      setContextScore((prev) => prev + 100);
      playAudioFeedback('correct');
    } else {
      playAudioFeedback('wrong');
    }
  };

  const handleNextContextQ = () => {
    if (contextIndex + 1 < VOCAB_CONTEXT_QUESTIONS.length) {
      setContextIndex((prev) => prev + 1);
      setContextSelectedChoice(null);
      setContextIsAnswered(false);
    } else {
      setContextCompleted(true);
      playAudioFeedback('victory');
      onRewardXP?.(200);
    }
  };

  return (
    <div className="space-y-8 text-[#1E1B18] font-sans">
      {/* ARENA HEADER NAVIGATION TABS */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F]">
            <Swords size={18} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#1E1B18]">Gamified Vocabulary Arena</h2>
            <p className="text-[11px] text-[#64748B]">Real-time drills, PvP synchronization, and SAT context challenges</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8]">
          <button
            onClick={() => setCurrentMode('LOBBY')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'LOBBY'
                ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            Game Modes
          </button>
          <button
            onClick={handleStartBlitz}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'SPEED_BLITZ'
                ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            Speed Blitz (60s)
          </button>
          <button
            onClick={handleStartPvP}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'PVP_DUEL'
                ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            1v1 Live Duel
          </button>
          <button
            onClick={() => {
              setCurrentMode('CONTEXT_CLASH');
              setContextIndex(0);
              setContextSelectedChoice(null);
              setContextIsAnswered(false);
              setContextCompleted(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'CONTEXT_CLASH'
                ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            Context Clash
          </button>
          <button
            onClick={() => setCurrentMode('LEADERBOARD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'LEADERBOARD'
                ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                : 'text-[#64748B] hover:text-[#1E1B18]'
            }`}
          >
            Global Ranks
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. LOBBY VIEW - 3 EXQUISITE ONEPREP GAME MODE CARDS */}
      {/* ==================================================== */}
      {currentMode === 'LOBBY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Card 1: Speed Blitz */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6 hover:border-[#E07A5F]/60 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Zap size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                    60-Sec Sprint
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#1E1B18]">Speed Blitz</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Race against a 60-second countdown. Chain 3+ streaks to trigger a <span className="font-bold text-[#E07A5F]">2x Multiplier Boost</span>.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Personal Record:</span>
                    <span className="font-mono font-bold text-[#1E1B18]">{personalBest.highScore} pts</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Best WPM:</span>
                    <span className="font-mono font-bold text-[#2A9D8F]">{personalBest.bestWpm} WPM</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartBlitz}
                className="w-full py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs group-hover:shadow-md"
              >
                <Play size={14} className="fill-white" />
                <span>Launch Speed Blitz</span>
              </button>
            </div>

            {/* Card 2: 1v1 Synchronized Live Duel */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6 hover:border-[#3D405B]/60 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2F6] border border-[#D5E0EA] text-[#3D405B] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Swords size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#EBF8F5] border border-[#BCE8DE] text-[#2A9D8F]">
                    Live PvP
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#1E1B18]">1v1 Synchronized Duel</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Live synchronized battle against students in Tashkent, Seoul, and Boston. Speed earns up to <span className="font-bold text-[#2A9D8F]">+50 pts bonus</span>.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Arena ELO Rating:</span>
                    <span className="font-mono font-bold text-[#1E1B18]">{personalBest.rating}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Current Win Streak:</span>
                    <span className="font-mono font-bold text-[#E07A5F]">{personalBest.maxStreak} Wins 🔥</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartPvP}
                className="w-full py-3 rounded-2xl bg-[#3D405B] hover:bg-[#1E1B18] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs group-hover:shadow-md"
              >
                <Users size={14} />
                <span>Find Live Opponent</span>
              </button>
            </div>

            {/* Card 3: Contextual Fill-in-the-Blank Clash */}
            <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs flex flex-col justify-between space-y-6 hover:border-[#2A9D8F]/60 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#EBF8F5] border border-[#BCE8DE] text-[#2A9D8F] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target size={22} />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                    SAT RW Focus
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#1E1B18]">Contextual Blank Clash</h3>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    Real Digital SAT Reading passages with missing words. Master nuanced tone, rhetorical purpose, and contrast traps.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Questions Available:</span>
                    <span className="font-mono font-bold text-[#1E1B18]">{VOCAB_CONTEXT_QUESTIONS.length} Cases</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#64748B]">
                    <span>Focus Domain:</span>
                    <span className="text-[11px] font-semibold text-[#2A9D8F]">Words in Context</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentMode('CONTEXT_CLASH');
                  setContextIndex(0);
                  setContextSelectedChoice(null);
                  setContextIsAnswered(false);
                  setContextCompleted(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#2A9D8F] hover:bg-[#21867a] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs group-hover:shadow-md"
              >
                <Target size={14} />
                <span>Practice Words in Context</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. SPEED BLITZ RUNNER (60 SECONDS) */}
      {/* ==================================================== */}
      {currentMode === 'SPEED_BLITZ' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Blitz HUD */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Time Left</div>
              <div className={`text-2xl font-black font-mono ${blitzTimeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-[#1E1B18]'}`}>
                {blitzTimeLeft}s
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Score</div>
              <div className="text-2xl font-black font-mono text-[#E07A5F]">{blitzScore}</div>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Combo Streak</div>
              <div className="text-2xl font-black font-mono text-[#2A9D8F] flex items-center justify-center gap-1">
                {blitzComboStreak >= 3 && <Flame size={18} className="text-[#E07A5F] fill-[#E07A5F]" />}
                <span>{blitzComboStreak}x</span>
              </div>
            </div>
          </div>

          {/* Active Question Box or Results */}
          {isBlitzActive ? (
            <div className="space-y-4">
              {/* Target Word Card */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm text-center space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                  {words[blitzCurrentWordIndex % words.length]?.partOfSpeech || 'word'}
                </span>
                <h2 className="text-4xl font-black text-[#1E1B18] font-serif tracking-tight capitalize">
                  {words[blitzCurrentWordIndex % words.length]?.word}
                </h2>
                <p className="text-xs text-[#64748B]">Select the most accurate definition below:</p>
              </div>

              {/* 4 Definition Choice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blitzOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleBlitzAnswer(opt.isCorrect)}
                    className="p-4 rounded-2xl bg-white hover:bg-[#FAF8F5] border border-[#E5E0D8] hover:border-[#1E1B18] text-left transition-all cursor-pointer shadow-2xs text-xs font-semibold text-[#1E1B18] leading-relaxed group hover:scale-[1.01]"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-mono font-bold text-[#3D405B] flex items-center justify-center shrink-0 group-hover:bg-[#1E1B18] group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] flex items-center justify-center mx-auto shadow-2xs">
                <Trophy size={32} />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#1E1B18]">Blitz Trial Finished!</h3>
                <p className="text-xs text-[#64748B]">Great hustle! Here is your final performance telemetry:</p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8]">
                <div>
                  <div className="text-[10px] font-bold text-[#64748B]">Final Score</div>
                  <div className="text-xl font-mono font-black text-[#E07A5F]">{blitzScore}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#64748B]">Max Combo</div>
                  <div className="text-xl font-mono font-black text-[#2A9D8F]">{blitzMaxStreak}x 🔥</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#64748B]">Accuracy</div>
                  <div className="text-xl font-mono font-black text-[#1E1B18]">
                    {blitzAttemptedCount > 0 ? Math.round((blitzCorrectCount / blitzAttemptedCount) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleStartBlitz}
                  className="px-6 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <RotateCcw size={14} />
                  <span>Play Again</span>
                </button>
                <button
                  onClick={() => setCurrentMode('LOBBY')}
                  className="px-6 py-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] text-[#1E1B18] text-xs font-bold cursor-pointer"
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. 1V1 SYNCHRONIZED LIVE DUEL (PVP) */}
      {/* ==================================================== */}
      {currentMode === 'PVP_DUEL' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {pvpState === 'MATCHMAKING' ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-[#E5E0D8] shadow-sm space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#EEF2F6] border border-[#D5E0EA] text-[#3D405B] flex items-center justify-center mx-auto animate-bounce">
                <Swords size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#1E1B18]">Matching Opponent...</h3>
                <p className="text-xs text-[#64748B]">Connecting to Supabase Live Arena Channels...</p>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-mono text-[#3D405B]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Searching Tier: 1500 - 1650 ELO</span>
              </div>
            </div>
          ) : pvpState === 'DUELING' ? (
            <div className="space-y-4">
              {/* Dual Live Progress Header */}
              <div className="p-4 rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-4">
                {/* Round and Timer info */}
                <div className="flex items-center justify-between text-xs font-bold border-b border-[#E5E0D8]/60 pb-3">
                  <span className="font-mono text-[#3D405B]">Round {pvpRound} of 5</span>
                  <span className="px-3 py-1 rounded-full bg-[#FFF4F0] border border-[#FCD9CE] text-[#E07A5F] font-mono">
                    ⏳ {pvpTimeLeft}s
                  </span>
                </div>

                {/* Dual Score Bars */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Player 1 (You) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#1E1B18] flex items-center gap-1.5">
                        <span>{user.avatar || '👨‍🎓'}</span>
                        <span>You</span>
                      </span>
                      <span className="font-mono font-black text-[#2A9D8F]">{pvpUserScore} pts</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5E0D8] overflow-hidden">
                      <div
                        className="h-full bg-[#2A9D8F] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((pvpUserScore / 800) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Player 2 (Opponent) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-[#1E1B18] flex items-center gap-1.5">
                        <span>{pvpOpponent.avatar}</span>
                        <span>{pvpOpponent.name}</span>
                      </span>
                      <span className="font-mono font-black text-[#3D405B]">{pvpOppScore} pts</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E5E0D8] overflow-hidden">
                      <div
                        className="h-full bg-[#3D405B] rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((pvpOppScore / 800) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Word */}
              <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm text-center space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                  {currentPvpQ.partOfSpeech}
                </span>
                <h2 className="text-4xl font-black text-[#1E1B18] font-serif capitalize">
                  {currentPvpQ.word}
                </h2>
                <p className="text-xs text-[#64748B]">Answer faster to win up to +50 speed bonus points!</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentPvpQ.choices.map((choice, i) => {
                  const isSelected = pvpSelectedOption === i;
                  return (
                    <button
                      key={i}
                      onClick={() => handlePvPAnswer(i, choice.isCorrect)}
                      disabled={pvpIsAnswered}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer text-xs font-semibold leading-relaxed ${
                        pvpIsAnswered
                          ? choice.isCorrect
                            ? 'bg-[#EBF8F5] border-[#2A9D8F] text-[#1E1B18]'
                            : isSelected
                            ? 'bg-rose-50 border-rose-300 text-[#1E1B18]'
                            : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#64748B] opacity-60'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#1E1B18] text-[#1E1B18]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-[10px] font-mono font-bold text-[#3D405B] flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{choice.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* PVP Victory / Defeat Result */
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-[#EBF8F5] border border-[#BCE8DE] text-[#2A9D8F] flex items-center justify-center mx-auto shadow-2xs">
                <Trophy size={32} />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#1E1B18]">
                  {pvpUserScore >= pvpOppScore ? 'Victory! 🎉' : 'Defeat! 💔'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  {pvpUserScore >= pvpOppScore
                    ? `You outpaced ${pvpOpponent.name} by ${pvpUserScore - pvpOppScore} points!`
                    : `${pvpOpponent.name} claimed the match. Rematch to reclaim your rank!`}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-around text-center">
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#64748B]">Your Score</div>
                  <div className="text-2xl font-black font-mono text-[#2A9D8F]">{pvpUserScore}</div>
                </div>
                <div className="text-xs font-mono font-bold text-[#64748B]">VS</div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-[#64748B]">{pvpOpponent.name}</div>
                  <div className="text-2xl font-black font-mono text-[#3D405B]">{pvpOppScore}</div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleStartPvP}
                  className="px-6 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Swords size={14} />
                  <span>Play Rematch</span>
                </button>
                <button
                  onClick={() => setCurrentMode('LOBBY')}
                  className="px-6 py-3 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] text-[#1E1B18] text-xs font-bold cursor-pointer"
                >
                  Return to Lobby
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. CONTEXTUAL FILL-IN-THE-BLANK CLASH */}
      {/* ==================================================== */}
      {currentMode === 'CONTEXT_CLASH' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!contextCompleted ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm space-y-6">
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-[#E5E0D8]/60 pb-3">
                <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
                  Case {contextIndex + 1} of {VOCAB_CONTEXT_QUESTIONS.length}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8] text-[#64748B]">
                  {currentContextQ.domain}
                </span>
              </div>

              {/* SAT Passage */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-sm text-[#1E1B18] font-serif leading-relaxed italic">
                "{currentContextQ.passage}"
              </div>

              {/* 4 Option Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentContextQ.options.map((opt) => {
                  const isSelected = contextSelectedChoice === opt;
                  const isCorrect = opt === currentContextQ.correctWord;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleContextAnswer(opt)}
                      disabled={contextIsAnswered}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer font-bold text-xs capitalize ${
                        contextIsAnswered
                          ? isCorrect
                            ? 'bg-[#EBF8F5] border-[#2A9D8F] text-[#2A9D8F]'
                            : isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-600'
                            : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#64748B] opacity-60'
                          : 'bg-white hover:bg-[#FAF8F5] border-[#E5E0D8] hover:border-[#1E1B18] text-[#1E1B18]'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {contextIsAnswered && (
                <div className="p-4 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] space-y-2 text-xs">
                  <div className="font-extrabold text-[#E07A5F]">Rhetorical Context Breakdown:</div>
                  <p className="text-[#1E1B18] leading-relaxed">{currentContextQ.explanation}</p>

                  <button
                    onClick={handleNextContextQ}
                    className="mt-3 px-5 py-2 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <span>Next Case</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-[#EBF8F5] border border-[#BCE8DE] text-[#2A9D8F] flex items-center justify-center mx-auto">
                <Target size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#1E1B18]">Context Series Completed!</h3>
              <p className="text-xs text-[#64748B]">You mastered all {VOCAB_CONTEXT_QUESTIONS.length} rhetorical context scenarios.</p>

              <button
                onClick={() => setCurrentMode('LOBBY')}
                className="px-6 py-3 rounded-2xl bg-[#1E1B18] text-white text-xs font-bold cursor-pointer"
              >
                Return to Arena Lobby
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. GLOBAL LEADERBOARD */}
      {/* ==================================================== */}
      {currentMode === 'LEADERBOARD' && (
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="overflow-hidden rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between text-xs font-bold text-[#64748B] uppercase tracking-wider">
              <span>Student / Location</span>
              <span>WPM / Rating</span>
            </div>

            <div className="divide-y divide-[#E5E0D8]">
              {GLOBAL_LEADERBOARD.map((p, idx) => (
                <div key={p.id} className="p-4 flex items-center justify-between hover:bg-[#FAF8F5] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs text-[#64748B] w-5">#{idx + 1}</span>
                    <div className="text-2xl">{p.avatar}</div>
                    <div>
                      <div className="text-xs font-extrabold text-[#1E1B18]">{p.name}</div>
                      <div className="text-[10px] text-[#64748B]">{p.location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-black text-[#1E1B18]">{p.rating} ELO</div>
                    <div className="text-[10px] font-mono text-[#2A9D8F]">{p.wpm} WPM • {p.accuracy}% Acc</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
