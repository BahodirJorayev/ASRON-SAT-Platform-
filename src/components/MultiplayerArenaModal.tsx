import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swords, Zap, Trophy, Flame, User, Check, X, Clock, Award, ShieldAlert } from 'lucide-react';
import { User as UserType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserType;
  onRewardXP?: (xp: number) => void;
}

interface PVPQuestion {
  id: string;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
  timeLimitSec: number;
}

const PVP_QUESTIONS: PVPQuestion[] = [
  {
    id: 'pvp-1',
    section: 'Math (Rapid Algebra)',
    question: 'If $3x - 5 = 16$, what is the value of $6x + 3$?',
    options: ['35', '45', '42', '48'],
    correctIndex: 1, // 3x = 21 -> x = 7 -> 6(7)+3 = 45
    timeLimitSec: 20,
  },
  {
    id: 'pvp-2',
    section: 'Reading & Writing (Transitions)',
    question: 'The experimental alloy exhibited unprecedented tensile strength. _______, its manufacturing costs remained prohibitively steep for commercial aircraft production.',
    options: ['Furthermore', 'Conversely', 'Similarly', 'Specifically'],
    correctIndex: 1, // Conversely
    timeLimitSec: 20,
  },
  {
    id: 'pvp-3',
    section: 'Math (Desmos Vertex Trick)',
    question: 'What is the minimum value of $f(x) = (x - 4)^2 + 9$?',
    options: ['4', '-4', '9', '16'],
    correctIndex: 2, // 9
    timeLimitSec: 20,
  },
];

export const MultiplayerArenaModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentUser,
  onRewardXP,
}) => {
  const [gameState, setGameState] = useState<'MATCHMAKING' | 'PLAYING' | 'RESULT'>('MATCHMAKING');
  const [matchmakingTime, setMatchmakingTime] = useState(3);
  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);

  const opponent = {
    name: 'Dilnoza R. (Tashkent)',
    rating: 1510,
    avatar: '👩‍🎓',
  };

  const currentQ = PVP_QUESTIONS[qIndex] || PVP_QUESTIONS[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(idx);
    setIsAnswerChecked(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      setUserScore((prev) => prev + 100 + timeLeft * 5);
    }

    // Opponent random realistic response
    setTimeout(() => {
      const oppCorrect = Math.random() > 0.3;
      if (oppCorrect) {
        setOpponentScore((prev) => prev + 100 + Math.floor(Math.random() * 60));
      }
    }, 600);

    // Next question or result
    setTimeout(() => {
      if (qIndex + 1 < PVP_QUESTIONS.length) {
        setQIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswerChecked(false);
        setTimeLeft(20);
      } else {
        setGameState('RESULT');
      }
    }, 1500);
  };

  const handleRestart = () => {
    setGameState('MATCHMAKING');
    setMatchmakingTime(3);
    setQIndex(0);
    setTimeLeft(20);
    setUserScore(0);
    setOpponentScore(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
  };

  // Matchmaking countdown effect
  useEffect(() => {
    if (!isOpen) return;
    if (gameState === 'MATCHMAKING') {
      const timer = setInterval(() => {
        setMatchmakingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameState('PLAYING');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, gameState]);

  // Question Timer effect
  useEffect(() => {
    if (!isOpen || gameState !== 'PLAYING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSelectOption(-1); // timed out
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, gameState, qIndex, isAnswerChecked]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl bg-[#FAF8F5] border border-[#E5E0D8] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Header */}
        <div className="p-5 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#1E1B18]">1v1 Speed Duel Arena</h3>
              <p className="text-[10px] font-mono text-[#3D405B]">Live Digital SAT Speed Challenge</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#E5E0D8] flex items-center justify-center text-[#3D405B] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Game State Body */}
        <div className="p-6 sm:p-8">
          {gameState === 'MATCHMAKING' && (
            <div className="text-center py-10 space-y-6">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-rose-200 border-t-rose-600 animate-spin" />
                <Swords className="w-8 h-8 text-rose-600" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-[#1E1B18]">Finding Opponent...</h4>
                <p className="text-xs text-[#3D405B]/80 mt-1">Matching with comparable SAT rating ({currentUser.predictedScore || 1470} ELO)</p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E0D8] text-xs font-mono text-[#3D405B]">
                <span>Starting in {matchmakingTime}s</span>
              </div>
            </div>
          )}

          {gameState === 'PLAYING' && (
            <div className="space-y-6">
              {/* Versus Scoreboard Header */}
              <div className="grid grid-cols-3 items-center p-3.5 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs">
                {/* Player 1 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center font-bold text-xs">
                    You
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1E1B18] truncate">{currentUser.fullName || 'Student'}</div>
                    <div className="text-[11px] font-mono font-bold text-[#E07A5F]">{userScore} pts</div>
                  </div>
                </div>

                {/* Center Timer */}
                <div className="text-center">
                  <span className={`inline-flex items-center gap-1 font-mono font-extrabold text-sm px-2.5 py-0.5 rounded-full ${
                    timeLeft <= 5 ? 'bg-rose-100 text-rose-700 animate-ping' : 'bg-[#FAF8F5] text-[#3D405B] border border-[#E5E0D8]'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    {timeLeft}s
                  </span>
                  <div className="text-[10px] font-mono text-[#3D405B]/60 mt-0.5">Round {qIndex + 1}/3</div>
                </div>

                {/* Player 2 */}
                <div className="flex items-center justify-end gap-2.5 text-right">
                  <div>
                    <div className="text-xs font-bold text-[#1E1B18] truncate">{opponent.name}</div>
                    <div className="text-[11px] font-mono font-bold text-[#3D405B]">{opponentScore} pts</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs">
                    {opponent.avatar}
                  </div>
                </div>
              </div>

              {/* Question Box */}
              <div className="p-5 rounded-3xl bg-white border border-[#E5E0D8] space-y-3 shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#E07A5F]">
                  {currentQ.section}
                </span>
                <p className="text-sm sm:text-base font-semibold text-[#1E1B18]">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  let btnStyle = 'bg-white border-[#E5E0D8] text-[#1E1B18] hover:border-[#E07A5F]';
                  if (isAnswerChecked) {
                    if (idx === currentQ.correctIndex) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(idx)}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-medium transition-all shadow-2xs cursor-pointer flex items-center justify-between ${btnStyle}`}
                    >
                      <span><strong>{String.fromCharCode(65 + idx)}.</strong> {opt}</span>
                      {isAnswerChecked && idx === currentQ.correctIndex && (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {gameState === 'RESULT' && (
            <div className="text-center py-6 space-y-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-inner ${
                userScore >= opponentScore ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
              }`}>
                {userScore >= opponentScore ? <Trophy className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-[#1E1B18]">
                  {userScore >= opponentScore ? 'Victory! 🏆' : 'Defeat — Good Battle!'}
                </h4>
                <p className="text-xs text-[#3D405B] mt-1 font-mono">
                  Final Score: You ({userScore} pts) vs {opponent.name} ({opponentScore} pts)
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs font-mono">
                <Award className="w-4 h-4 text-amber-600" />
                <span>+{userScore >= opponentScore ? '45' : '15'} Arena Rating XP Earned</span>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-xs font-bold text-[#3D405B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  Play Another Match
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#d66e53] transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
