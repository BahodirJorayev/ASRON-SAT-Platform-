import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  Brain,
  Layers,
  Bookmark,
  BookmarkCheck,
  Search,
  BookOpen,
  Award,
  ArrowRight,
  Check,
  X,
  Flame,
  Info
} from 'lucide-react';
import { VocabularyWord, UserVocabProgress, User } from '../types';
import { speakWord, playAudioFeedback } from '../utils/speechUtils';

interface Props {
  words: VocabularyWord[];
  user: User;
  userProgressMap: Record<string, UserVocabProgress>;
  onUpdateProgress: (wordId: string, srsStage: number, isCorrect: boolean) => void;
  onOpenPaywall?: () => void;
}

export const VocabFlashcards: React.FC<Props> = ({
  words,
  user,
  userProgressMap,
  onUpdateProgress,
  onOpenPaywall,
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<'ALL' | 'NEW' | 'LEARNING' | 'REVIEW' | 'MASTERED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDeckFinished, setIsDeckFinished] = useState(false);
  const [deckSessionCount, setDeckSessionCount] = useState(0);

  // Filter deck based on stage & search
  const filteredDeck = useMemo(() => {
    return words.filter((w) => {
      const progress = userProgressMap[w.id];
      const stage = progress?.srsStage ?? 0;

      if (selectedStageFilter === 'NEW' && stage !== 0) return false;
      if (selectedStageFilter === 'LEARNING' && stage !== 1) return false;
      if (selectedStageFilter === 'REVIEW' && stage !== 2) return false;
      if (selectedStageFilter === 'MASTERED' && stage !== 3) return false;

      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesWord = w.word.toLowerCase().includes(query);
        const matchesDef = w.definition.toLowerCase().includes(query);
        const matchesSyn = w.synonyms.some((s) => s.toLowerCase().includes(query));
        if (!matchesWord && !matchesDef && !matchesSyn) return false;
      }

      return true;
    });
  }, [words, userProgressMap, selectedStageFilter, searchTerm]);

  const currentCard = filteredDeck[currentIndex] || filteredDeck[0];

  // Handle deck index bounding
  useEffect(() => {
    if (currentIndex >= filteredDeck.length && filteredDeck.length > 0) {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [filteredDeck.length, currentIndex]);

  // Reset flip state on card change
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Audio speech trigger
  const handleSpeak = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!currentCard || isSpeaking) return;
    setIsSpeaking(true);
    await speakWord(currentCard.word, 0.85);
    setIsSpeaking(false);
  };

  // Flip card
  const handleFlipCard = () => {
    playAudioFeedback('flip');
    setIsFlipped((prev) => !prev);
  };

  // SRS Rating action handler
  const handleRateSRS = (stage: number, isCorrect: boolean) => {
    if (!currentCard) return;

    if (isCorrect) {
      playAudioFeedback('correct');
    } else {
      playAudioFeedback('wrong');
    }

    onUpdateProgress(currentCard.id, stage, isCorrect);
    setDeckSessionCount((prev) => prev + 1);

    // Advance to next card
    if (currentIndex + 1 < filteredDeck.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      setIsDeckFinished(true);
      playAudioFeedback('victory');
    }
  };

  // Shuffle deck
  const handleShuffleDeck = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsDeckFinished(false);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlipCard();
      } else if (e.key === '1') {
        e.preventDefault();
        handleRateSRS(1, false); // Again (Stage 1)
      } else if (e.key === '2') {
        e.preventDefault();
        handleRateSRS(2, true); // Good (Stage 2)
      } else if (e.key === '3') {
        e.preventDefault();
        handleRateSRS(3, true); // Mastered (Stage 3)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex + 1 < filteredDeck.length) {
          setCurrentIndex((p) => p + 1);
          setIsFlipped(false);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex((p) => p - 1);
          setIsFlipped(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredDeck.length, currentCard]);

  // SRS Count analytics
  const srsCounts = useMemo(() => {
    let newCount = 0;
    let learnCount = 0;
    let reviewCount = 0;
    let masteredCount = 0;

    words.forEach((w) => {
      const p = userProgressMap[w.id];
      const stage = p?.srsStage ?? 0;
      if (stage === 0) newCount++;
      else if (stage === 1) learnCount++;
      else if (stage === 2) reviewCount++;
      else if (stage === 3) masteredCount++;
    });

    return { newCount, learnCount, reviewCount, masteredCount };
  }, [words, userProgressMap]);

  return (
    <div className="space-y-6 text-[#1E1B18] font-sans">
      {/* 1. FILTER & SRS STATUS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-2xs">
        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Words', count: words.length },
            { id: 'NEW', label: 'New', count: srsCounts.newCount },
            { id: 'LEARNING', label: 'Learning (1d)', count: srsCounts.learnCount },
            { id: 'REVIEW', label: 'Review (3d)', count: srsCounts.reviewCount },
            { id: 'MASTERED', label: 'Mastered', count: srsCounts.masteredCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setSelectedStageFilter(tab.id as any);
                setCurrentIndex(0);
                setIsDeckFinished(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStageFilter === tab.id
                  ? 'bg-white text-[#1E1B18] shadow-2xs border border-[#E5E0D8]'
                  : 'text-[#64748B] hover:text-[#1E1B18]'
              }`}
            >
              {tab.label} <span className="text-[10px] opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
            placeholder="Search word or definition..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
          />
        </div>
      </div>

      {/* 2. FLASHCARD ARENA */}
      {filteredDeck.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-[#E5E0D8] shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#64748B] flex items-center justify-center mx-auto">
            <BookOpen size={20} />
          </div>
          <h3 className="text-base font-bold text-[#1E1B18]">No Flashcards in this Category</h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto">
            All words in this filter have been completed or no search results matched your query.
          </p>
          <button
            onClick={() => {
              setSelectedStageFilter('ALL');
              setSearchTerm('');
            }}
            className="mt-2 px-4 py-2 rounded-xl bg-[#1E1B18] text-white text-xs font-bold cursor-pointer"
          >
            Show All 400 Words
          </button>
        </div>
      ) : isDeckFinished ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-10 text-center rounded-3xl bg-white border border-[#E5E0D8] shadow-sm space-y-5 max-w-xl mx-auto"
        >
          <div className="w-16 h-16 rounded-3xl bg-[#EBF8F5] border border-[#BCE8DE] text-[#2A9D8F] flex items-center justify-center mx-auto shadow-2xs">
            <Award size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-[#1E1B18]">Session Completed!</h3>
            <p className="text-xs text-[#64748B]">
              You practiced <span className="font-bold text-[#1E1B18]">{deckSessionCount}</span> cards in this study run.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-around text-center">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Mastered Total</div>
              <div className="text-xl font-mono font-black text-[#2A9D8F]">{srsCounts.masteredCount} / 400</div>
            </div>
            <div className="w-[1px] h-8 bg-[#E5E0D8]" />
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Review Due</div>
              <div className="text-xl font-mono font-black text-[#E07A5F]">{srsCounts.reviewCount}</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleShuffleDeck}
              className="px-5 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-2xs"
            >
              <RotateCw size={14} />
              <span>Practice Again</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Deck Progress Info Header */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#1E1B18] font-bold">
                Card {currentIndex + 1} of {filteredDeck.length}
              </span>
              <span>•</span>
              <span>Word #{currentCard.wordNumber || currentIndex + 1}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShuffleDeck}
                className="flex items-center gap-1 hover:text-[#1E1B18] cursor-pointer text-[11px]"
                title="Shuffle Deck"
              >
                <Shuffle size={13} />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 rounded-full bg-[#E5E0D8] overflow-hidden">
            <div
              className="h-full bg-[#E07A5F] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / filteredDeck.length) * 100}%` }}
            />
          </div>

          {/* 3D Interactive Flipping Flashcard */}
          <div
            onClick={handleFlipCard}
            className="perspective-1000 min-h-[360px] cursor-pointer select-none"
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-full min-h-[360px] rounded-3xl preserve-3d shadow-sm"
            >
              {/* FRONT OF CARD */}
              <div
                className={`absolute inset-0 w-full h-full p-8 rounded-3xl bg-white border border-[#E5E0D8] flex flex-col justify-between backface-hidden transition-all ${
                  isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Front Header Badges */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B]">
                      {currentCard.partOfSpeech}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        currentCard.difficulty === 'EASY'
                          ? 'bg-[#EBF8F5] text-[#2A9D8F] border-[#BCE8DE]'
                          : currentCard.difficulty === 'MEDIUM'
                          ? 'bg-[#FFF9E6] text-[#B78103] border-[#FBE39D]'
                          : 'bg-[#FFF4F0] text-[#E07A5F] border-[#FCD9CE]'
                      }`}
                    >
                      {currentCard.difficulty}
                    </span>
                    {currentCard.tone && (
                      <span className="text-[10px] font-medium text-[#64748B] px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E5E0D8]">
                        Tone: {currentCard.tone}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSpeak}
                    disabled={isSpeaking}
                    className="p-2.5 rounded-2xl bg-[#FAF8F5] hover:bg-[#F5F0EB] text-[#1E1B18] border border-[#E5E0D8] transition-all cursor-pointer hover:scale-105 active:scale-95"
                    title="Pronounce Word (Web Speech TTS)"
                  >
                    <Volume2 size={18} className={isSpeaking ? 'text-[#E07A5F] animate-pulse' : ''} />
                  </button>
                </div>

                {/* Front Center: The Target Word */}
                <div className="text-center space-y-3 py-6">
                  <h2 className="text-4xl sm:text-5xl font-black text-[#1E1B18] tracking-tight font-serif lowercase capitalize">
                    {currentCard.word}
                  </h2>
                  <p className="text-xs text-[#64748B] font-mono">
                    From {currentCard.bookSource || "The College Panda's 400 SAT Words"}
                  </p>
                </div>

                {/* Front Footer Hint */}
                <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-4 border-t border-[#E5E0D8]/60">
                  <span className="flex items-center gap-1.5">
                    <RotateCw size={12} />
                    <span>Click or tap anywhere to flip card</span>
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E5E0D8]">
                    [Space]
                  </span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div
                className={`absolute inset-0 w-full h-full p-8 rounded-3xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col justify-between rotate-y-180 backface-hidden transition-all ${
                  !isFlipped ? 'pointer-events-none' : ''
                }`}
              >
                {/* Back Header */}
                <div className="flex items-center justify-between border-b border-[#E5E0D8]/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[#1E1B18] font-serif capitalize">
                      {currentCard.word}
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">({currentCard.partOfSpeech})</span>
                  </div>

                  <button
                    onClick={handleSpeak}
                    className="p-1.5 rounded-xl bg-white hover:bg-[#F5F0EB] text-[#1E1B18] border border-[#E5E0D8] cursor-pointer"
                  >
                    <Volume2 size={15} />
                  </button>
                </div>

                {/* Back Content */}
                <div className="space-y-4 py-2 overflow-y-auto">
                  {/* Definition */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F]">
                      Definition
                    </span>
                    <p className="text-sm font-semibold text-[#1E1B18] leading-relaxed">
                      {currentCard.definition}
                    </p>
                  </div>

                  {/* Synonyms */}
                  {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                        Direct Synonyms
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {currentCard.synonyms.map((syn) => (
                          <span
                            key={syn}
                            className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#3D405B]"
                          >
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Contextual Sentence */}
                  {currentCard.sampleSentence && (
                    <div className="space-y-1 pt-1 border-t border-[#E5E0D8]/60">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                        Digital SAT Context Example
                      </span>
                      <p className="text-xs text-[#1E1B18] italic leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#E5E0D8]/70">
                        "{currentCard.sampleSentence}"
                      </p>
                    </div>
                  )}

                  {/* Etymology / Mnemonic */}
                  {currentCard.etymology && (
                    <div className="text-[10px] text-[#64748B] flex items-center gap-1.5 pt-1">
                      <Sparkles size={11} className="text-[#E07A5F] shrink-0" />
                      <span>{currentCard.etymology}</span>
                    </div>
                  )}
                </div>

                {/* Back Footer */}
                <div className="flex items-center justify-between text-[10px] text-[#64748B] pt-2 border-t border-[#E5E0D8]/60">
                  <span>Rate your confidence below to schedule review</span>
                  <span className="font-mono text-[9px]">[Keys 1, 2, 3]</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 3. CONFIDENCE RATING BUTTONS (SRS ENGINE) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-2">
            {/* Again (1 Day) */}
            <button
              onClick={() => handleRateSRS(1, false)}
              className="p-3 sm:p-4 rounded-2xl bg-white hover:bg-rose-50 border border-[#E5E0D8] hover:border-rose-300 text-center transition-all cursor-pointer shadow-2xs group"
            >
              <div className="text-xs font-black text-rose-600 group-hover:scale-105 transition-transform">
                Again (1 Day)
              </div>
              <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">Reset to Stage 1 [1]</div>
            </button>

            {/* Good (3 Days) */}
            <button
              onClick={() => handleRateSRS(2, true)}
              className="p-3 sm:p-4 rounded-2xl bg-white hover:bg-amber-50 border border-[#E5E0D8] hover:border-amber-300 text-center transition-all cursor-pointer shadow-2xs group"
            >
              <div className="text-xs font-black text-amber-700 group-hover:scale-105 transition-transform">
                Good (3 Days)
              </div>
              <div className="text-[10px] text-[#64748B] mt-0.5 font-mono">Review Deck [2]</div>
            </button>

            {/* Mastered (7 Days) */}
            <button
              onClick={() => handleRateSRS(3, true)}
              className="p-3 sm:p-4 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-center transition-all cursor-pointer shadow-2xs group"
            >
              <div className="text-xs font-black text-[#2A9D8F] group-hover:scale-105 transition-transform flex items-center justify-center gap-1">
                <CheckCircle2 size={13} className="text-[#2A9D8F]" />
                <span>Mastered (7d)</span>
              </div>
              <div className="text-[10px] text-[#A8A29E] mt-0.5 font-mono">Move to Vault [3]</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
