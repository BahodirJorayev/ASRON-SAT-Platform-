import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked, Sparkles, Check, X, RotateCw, Volume2, ArrowRight, Award, Trophy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number) => void;
}

interface VocabCard {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  satExample: string;
  synonyms: string[];
  tone: 'Positive' | 'Negative' | 'Neutral';
  frequencyTier: 'High-Yield (Top 1%)' | 'Essential SAT' | 'Advanced Nuance';
}

const SAT_VOCAB_LIST: VocabCard[] = [
  {
    id: '1',
    word: 'Ambivalent',
    partOfSpeech: 'adj.',
    definition: 'Having mixed feelings or contradictory ideas about something or someone.',
    satExample: 'The committee remained ambivalent about the experimental solar policy, citing both its innovative potential and steep upfront installation costs.',
    synonyms: ['Equivocal', 'Conflicted', 'Uncertain'],
    tone: 'Neutral',
    frequencyTier: 'High-Yield (Top 1%)',
  },
  {
    id: '2',
    word: 'Corroborate',
    partOfSpeech: 'verb',
    definition: 'To confirm or give support to a statement, theory, or finding with empirical evidence.',
    satExample: 'Recent carbon-dating results corroborate the archaeologist’s hypothesis that the ancient settlement was inhabited centuries earlier than previously assumed.',
    synonyms: ['Substantiate', 'Validate', 'Authenticate'],
    tone: 'Positive',
    frequencyTier: 'High-Yield (Top 1%)',
  },
  {
    id: '3',
    word: 'Pragmatic',
    partOfSpeech: 'adj.',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    satExample: 'Rather than pursuing an idealistic restructuring of the transit grid, the urban planners opted for a pragmatic set of incremental subway renovations.',
    synonyms: ['Utilitarian', 'Sensible', 'Expedient'],
    tone: 'Positive',
    frequencyTier: 'Essential SAT',
  },
  {
    id: '4',
    word: 'Ephemeral',
    partOfSpeech: 'adj.',
    definition: 'Lasting for a very short time; transitory and fleeting.',
    satExample: 'The desert bloom was famously ephemeral, bursting into vibrant lavender petals following the rare thunderstorm before withering within seventy-two hours.',
    synonyms: ['Transient', 'Fleeting', 'Evanescent'],
    tone: 'Neutral',
    frequencyTier: 'High-Yield (Top 1%)',
  },
  {
    id: '5',
    word: 'Disparage',
    partOfSpeech: 'verb',
    definition: 'To regard or represent as being of little worth; to belittle.',
    satExample: 'Critics were quick to disparage the novelist’s shift toward speculative fiction, arguing it lacked the psychological depth of her earlier historical works.',
    synonyms: ['Deprecate', 'Belittle', 'Denigrate'],
    tone: 'Negative',
    frequencyTier: 'Essential SAT',
  },
  {
    id: '6',
    word: 'Anachronistic',
    partOfSpeech: 'adj.',
    definition: 'Belonging or appropriate to an earlier period, often conspicuously out of date.',
    satExample: 'The inclusion of a 19th-century mechanical pocket watch in the depiction of the Renaissance court was deemed anachronistic by contemporary art historians.',
    synonyms: ['Archaic', 'Outmoded', 'Obsolete'],
    tone: 'Negative',
    frequencyTier: 'Advanced Nuance',
  },
];

export const VocabTrainerModal: React.FC<Props> = ({ isOpen, onClose, onRewardXP }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentCard = SAT_VOCAB_LIST[currentIndex];
  const isFinished = currentIndex >= SAT_VOCAB_LIST.length;

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      setMasteredIds((prev) => [...prev, currentCard.id]);
    } else {
      setReviewIds((prev) => [...prev, currentCard.id]);
    }
    setIsFlipped(false);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds([]);
    setReviewIds([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl bg-[#FAF8F5] border border-[#E5E0D8] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E0D8] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E07A5F]/15 flex items-center justify-center text-[#E07A5F]">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-[#1E1B18]">SAT High-Yield Vocab Trainer</h3>
              <p className="text-[11px] font-mono text-[#3D405B]">Spaced-Repetition Leitner Flashcards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#E5E0D8] flex items-center justify-center text-[#3D405B] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {!isFinished ? (
            <>
              {/* Progress & Tier pill */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#3D405B] font-bold">
                  Card {currentIndex + 1} of {SAT_VOCAB_LIST.length}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E07A5F]/10 text-[#E07A5F] font-bold border border-[#E07A5F]/30">
                  {currentCard.frequencyTier}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-[#E5E0D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E07A5F] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / SAT_VOCAB_LIST.length) * 100}%` }}
                />
              </div>

              {/* Interactive Flashcard with 3D Flip */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="cursor-pointer min-h-[260px] p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E0D8] shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group select-none"
              >
                {!isFlipped ? (
                  <div className="space-y-4 my-auto text-center">
                    <span className="text-xs font-mono uppercase tracking-widest text-[#3D405B]/60">
                      {currentCard.partOfSpeech}
                    </span>
                    <h2 className="text-4xl font-extrabold text-[#1E1B18] tracking-tight">
                      {currentCard.word}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#3D405B]">
                      <span>Tone: <strong>{currentCard.tone}</strong></span>
                    </div>
                    <p className="text-xs text-[#3D405B]/60 pt-4">Click anywhere to flip and see definition & SAT context ↷</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-left animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider font-mono">
                        Definition & SAT Context
                      </span>
                      <span className="text-[11px] font-mono text-[#3D405B]/60">Flip back ↶</span>
                    </div>

                    <p className="text-base sm:text-lg font-semibold text-[#1E1B18] leading-snug">
                      {currentCard.definition}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#3D405B] space-y-1">
                      <div className="font-bold text-[#1E1B18] text-[11px] font-mono uppercase">Official SAT Style Context:</div>
                      <p className="italic leading-relaxed">"{currentCard.satExample}"</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-bold text-[#3D405B]">Synonyms:</span>
                      {currentCard.synonyms.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-[#3D405B]/10 text-[#3D405B] text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleNext(false)}
                  className="py-3 px-4 rounded-2xl bg-white border border-[#E5E0D8] hover:bg-rose-50 hover:border-rose-300 text-[#3D405B] hover:text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  <span>Review Again Later</span>
                </button>

                <button
                  onClick={() => handleNext(true)}
                  className="py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#d66e53] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Mastered (+5 XP)</span>
                </button>
              </div>
            </>
          ) : (
            /* Finished State */
            <div className="text-center py-8 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-[#1E1B18]">Vocab Drill Completed!</h3>
                <p className="text-xs text-[#3D405B] mt-1">
                  You reviewed {SAT_VOCAB_LIST.length} high-frequency words. {masteredIds.length} marked as mastered.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs font-mono">
                <Award className="w-4 h-4 text-amber-600" />
                <span>+30 XP Added to Your Account</span>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-white border border-[#E5E0D8] text-xs font-bold text-[#3D405B] hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Practice Again</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#E07A5F] text-white text-xs font-bold shadow-xs hover:bg-[#d66e53] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
