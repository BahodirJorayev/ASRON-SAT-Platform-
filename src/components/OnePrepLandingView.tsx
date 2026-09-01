import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Crown,
  CheckCircle2,
  BrainCircuit,
  BookMarked,
  ArrowRight,
  ShieldCheck,
  Star,
  FileCheck2,
  Layers,
  Send,
  Instagram,
  Youtube,
  BookOpen,
  Calculator,
  Compass,
  ArrowUpRight,
  Target,
  Trophy,
  Activity,
  PlusCircle,
  HelpCircle,
  Clock,
  Flame,
  Check,
  X as XIcon,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Calendar,
  GraduationCap,
  Lightbulb,
  CheckCheck,
  Timer,
  Play,
  RotateCcw
} from 'lucide-react';
import { User } from '../types';
import {
  SiteBrandingConfig,
  BlogArticle,
  UserTestimonial,
  INITIAL_TESTIMONIALS,
  INITIAL_SITE_CONFIG
} from '../data/blogAndBrandingData';
import { ReviewSubmissionModal } from './ReviewSubmissionModal';
import { AsronLogo } from './AsronLogo';

interface Props {
  user: User;
  siteBranding: SiteBrandingConfig;
  blogArticles: BlogArticle[];
  testimonials?: UserTestimonial[];
  onOpenAuthModal: (mode?: 'signin' | 'signup') => void;
  onOpenDiagnostic: () => void;
  onOpenDailyWorkout: () => void;
  onOpenPaywall: () => void;
  onNavigateToBlog: () => void;
  onOpenAdminLogin?: () => void;
}

// 4 High-Yield Interactive Mini-Diagnostic Questions
interface InteractiveQuestion {
  id: number;
  domain: string;
  category: 'Math' | 'Reading & Writing';
  difficulty: 'Medium' | 'Hard';
  timeEstimate: string;
  text: string;
  passage?: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  desmosOrGrammarTip: string;
  trapAnalysis: string;
}

const INTERACTIVE_QUESTIONS: InteractiveQuestion[] = [
  {
    id: 1,
    category: 'Math',
    domain: 'Advanced Math • Nonlinear Systems',
    difficulty: 'Hard',
    timeEstimate: '25 sec',
    text: 'A system of two equations is given by y = 2x² - 8x + k and y = 4x - 10. For what value of constant k does the system have exactly ONE real solution (x, y)?',
    options: [
      { id: 'A', text: 'k = 8' },
      { id: 'B', text: 'k = 10' },
      { id: 'C', text: 'k = 18' },
      { id: 'D', text: 'k = -2' },
    ],
    correctAnswer: 'A',
    explanation: 'Set 2x² - 8x + k = 4x - 10 → 2x² - 12x + (k + 10) = 0. For exactly 1 real solution, discriminant Δ = b² - 4ac = 0. (-12)² - 4(2)(k + 10) = 0 → 144 = 8(k + 10) → 18 = k + 10 → k = 8.',
    desmosOrGrammarTip: 'Desmos 10-Second Shortcut: Type y = 2x² - 8x + k and y = 4x - 10 in Desmos. Add a slider for k and adjust until the line becomes tangent to the parabola at exactly one point!',
    trapAnalysis: 'Common Trap: Option C (k=18) occurs if you forget that 18 = k + 10 and mistakenly report 18 instead of solving for k.',
  },
  {
    id: 2,
    category: 'Reading & Writing',
    domain: 'Craft & Structure • Words in Context',
    difficulty: 'Hard',
    timeEstimate: '20 sec',
    passage: 'Although the computational linguist acknowledged that contemporary neural machine translation systems perform admirably with standardized prose, she cautioned that their capacity to translate colloquial idioms remains distinctly ________, frequently rendering metaphorical expressions with clumsy literalism.',
    text: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: [
      { id: 'A', text: 'circumscribed' },
      { id: 'B', text: 'ubiquitous' },
      { id: 'C', text: 'infallible' },
      { id: 'D', text: 'unprecedented' },
    ],
    correctAnswer: 'A',
    explanation: 'The sentence sets up a contrast with "Although... admirably" and states the systems render expressions with "clumsy literalism". Therefore, their capacity is limited or restricted. "Circumscribed" means restricted within narrow limits.',
    desmosOrGrammarTip: 'Vocabulary Strategy: Look for pivot words ("Although", "clumsy literalism"). The target word must have a negative/limited connotation matching "clumsy literalism".',
    trapAnalysis: 'Common Trap: Option B (ubiquitous) means everywhere, and C (infallible) means flawless—both contradict the negative clue "clumsy literalism".',
  },
  {
    id: 3,
    category: 'Reading & Writing',
    domain: 'Expression of Ideas • Transitions',
    difficulty: 'Medium',
    timeEstimate: '15 sec',
    passage: 'Historically, astronomers classified Pluto as the ninth planet due to its elliptical orbit around the Sun. In 2006, however, the International Astronomical Union established three specific criteria for planetary status, one being that a body must clear its orbital neighborhood of debris. ________ Pluto shares its zone with hundreds of Kuiper Belt objects, it was promptly reclassified as a dwarf planet.',
    text: 'Which choice completes the text with the most logical transition?',
    options: [
      { id: 'A', text: 'Because' },
      { id: 'B', text: 'Conversely' },
      { id: 'C', text: 'Nevertheless' },
      { id: 'D', text: 'Furthermore' },
    ],
    correctAnswer: 'A',
    explanation: 'The third sentence provides the direct cause-and-effect reason why Pluto failed the criteria mentioned in sentence two. Pluto sharing its zone is the cause ("Because..."), leading to its reclassification.',
    desmosOrGrammarTip: 'Transition Rule: Identify the logical relation between Clause A (shares zone with debris) and Clause B (reclassified as dwarf planet). It is pure Cause → Effect.',
    trapAnalysis: 'Common Trap: Option B & C imply contrast, but sentence 3 continues and applies the 2006 criteria rule rather than contradicting it.',
  },
  {
    id: 4,
    category: 'Math',
    domain: 'Geometry & Trig • Circle Equations',
    difficulty: 'Hard',
    timeEstimate: '30 sec',
    text: 'The equation of a circle in the xy-plane is given by x² + y² - 12x + 16y = 125. What is the radius of the circle?',
    options: [
      { id: 'A', text: '15' },
      { id: 'B', text: '225' },
      { id: 'C', text: '10' },
      { id: 'D', text: '5√5' },
    ],
    correctAnswer: 'A',
    explanation: 'Complete the square: (x² - 12x + 36) + (y² + 16y + 64) = 125 + 36 + 64 → (x - 6)² + (y + 8)² = 225. Radius r = √225 = 15.',
    desmosOrGrammarTip: 'Desmos 5-Second Hack: Type x² + y² - 12x + 16y = 125 directly into Desmos. Click the center (6, -8) and rightmost point (21, -8). The distance 21 - 6 = 15 is your radius!',
    trapAnalysis: 'Common Trap: Option B (225) is r², which students often forget to square root before submitting.',
  },
];

export const OnePrepLandingView: React.FC<Props> = ({
  user,
  siteBranding,
  blogArticles,
  testimonials: externalTestimonials,
  onOpenAuthModal,
  onOpenDiagnostic,
  onOpenDailyWorkout,
  onOpenPaywall,
  onNavigateToBlog,
  onOpenAdminLogin,
}) => {
  const branding = siteBranding || INITIAL_SITE_CONFIG;
  // Score growth slider state
  const [currentScore, setCurrentScore] = useState<number>(1280);
  const projectedScore = Math.min(1600, currentScore + 230);

  // User reviews state with localStorage persistence
  const [internalTestimonials, setInternalTestimonials] = useState<UserTestimonial[]>(() => {
    const saved = localStorage.getItem('aurasat_testimonials') || localStorage.getItem('aurasat_user_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_TESTIMONIALS;
  });

  const testimonials = externalTestimonials || internalTestimonials;
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleAddReview = (newReview: UserTestimonial) => {
    setInternalTestimonials((prev) => {
      const next = [newReview, ...prev];
      localStorage.setItem('aurasat_user_reviews', JSON.stringify(next));
      localStorage.setItem('aurasat_testimonials', JSON.stringify(next));
      return next;
    });
  };

  // Interactive Mini SAT Test Simulator State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<Record<number, string>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<number, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeQuestion = INTERACTIVE_QUESTIONS[activeQuestionIndex];

  // Timer effect for interactive widget
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const handleAnswerSelect = (optionId: string) => {
    setUserSelectedAnswers((prev) => ({ ...prev, [activeQuestion.id]: optionId }));
    setRevealedExplanations((prev) => ({ ...prev, [activeQuestion.id]: true }));
    setIsTimerRunning(false);
  };

  const handleResetQuestion = () => {
    setUserSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setRevealedExplanations((prev) => {
      const copy = { ...prev };
      delete copy[activeQuestion.id];
      return copy;
    });
    setTimerSeconds(30);
    setIsTimerRunning(false);
  };

  // Calculate live score prediction from interactive questions
  const answeredCount = Object.keys(userSelectedAnswers).length;
  const correctCount = INTERACTIVE_QUESTIONS.filter(
    (q) => userSelectedAnswers[q.id] === q.correctAnswer
  ).length;

  const predictedRange = answeredCount === 0
    ? '1350 – 1560'
    : correctCount === 4
    ? '1540 – 1600 (Top 1% bracket)'
    : correctCount === 3
    ? '1460 – 1520'
    : correctCount === 2
    ? '1380 – 1440'
    : '1280 – 1360';

  // Interactive MST Routing Simulator state
  const [mstModule1Score, setMstModule1Score] = useState<'HIGH' | 'LOW'>('HIGH');

  // Interactive 4-Week Blueprint Tab
  const [activeWeekTab, setActiveWeekTab] = useState<1 | 2 | 3 | 4>(1);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // University Matching based on slider score
  const getUniversityMatches = (score: number) => {
    if (score >= 1500) {
      return {
        tier: 'Ivy League & Top Global Tier',
        colleges: ['Harvard University', 'MIT', 'Stanford University', 'Columbia', 'Yale', 'NYU Abu Dhabi (Full Ride)', 'KAIST'],
        scholarship: '100% Full Ride ($60,000 – $85,000/yr)',
        percentile: 'Top 1% Globally (99th Percentile)',
      };
    } else if (score >= 1400) {
      return {
        tier: 'Top 30 US & Global Prestigious Tier',
        colleges: ['New York University (NYU)', 'Georgia Tech', 'UC Berkeley', 'University of Toronto', 'New Uzbekistan University', 'KAIST'],
        scholarship: '50% – 90% Merit Scholarships',
        percentile: 'Top 5% Globally (95th Percentile)',
      };
    } else if (score >= 1300) {
      return {
        tier: 'High-Competitive Tier',
        colleges: ['WIUT (Westminster Tashkent)', 'Penn State University', 'Boston University', 'Inha University in Tashkent', 'Webster'],
        scholarship: 'Partial Tuition Waiver ($10,000 – $25,000)',
        percentile: 'Top 15% Globally (88th Percentile)',
      };
    } else {
      return {
        tier: 'Foundation & Baseline Tier',
        colleges: ['MDIST', 'Amity University Tashkent', 'State Flagship Programs', 'Foundation Year Direct Admission'],
        scholarship: 'Standard Financial Aid Eligibility',
        percentile: 'Top 30% Globally (75th Percentile)',
      };
    }
  };

  const uniMatch = getUniversityMatches(projectedScore);

  return (
    <div className="space-y-20 py-6 px-4 sm:px-8 max-w-7xl mx-auto font-sans text-[#1C1917] animate-in fade-in duration-300">
      {/* SECTION 1: HERO ADAPTIVE SHOWCASE */}
      <section className="relative p-8 sm:p-14 rounded-3xl bg-[#FAF8F5] dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs text-center overflow-hidden">
        {/* Decorative Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-[#0B1B3D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-[#FAF8F5] text-xs font-bold shadow-2xs mb-6">
          <AsronLogo size={20} variant="mark-only" />
          <span>{branding.brandName} • Digital SAT Intelligence Platform (2026 Edition)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {branding.heroHeadline}
        </h1>

        <p className="text-sm sm:text-base text-[#57534E] dark:text-[#94A3B8] max-w-2xl mx-auto mt-4 leading-relaxed">
          {branding.heroSubtext}
        </p>

        {/* Primary Action Buttons - Clean & Authoritative */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0B1B3D] hover:bg-[#122756] text-white font-bold text-sm shadow-lg shadow-black/10 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-[#0B1B3D]/30"
          >
            <Sparkles className="w-4 h-4 text-[#FAF8F5]" />
            <span>Sign Up for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenDiagnostic}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FFFFFF] dark:bg-[#0A0F1D] hover:bg-[#F5F0EB] dark:hover:bg-[#18233C] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-[#EAEBED] font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#E07A5F]" />
            <span>Take Free 7-Min Diagnostic Test</span>
          </button>
        </div>

        {/* Real-time stats numbers */}
        <div className="mt-12 pt-8 border-t border-[#E5E0D8] dark:border-[#1E293B] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">45,000+</div>
            <div className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">Faol SAT Talabalari</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#E07A5F] font-mono">+210 ball</div>
            <div className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">O'rtacha Ball O'sishi</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] font-mono">100%</div>
            <div className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">Bluebook 2-Stage MST Format</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">10 Daqiqa</div>
            <div className="text-xs text-[#78716C] dark:text-[#94A3B8] mt-0.5">Kunlik Samarali Trenirovka</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: INTERACTIVE MINI SAT CHALLENGE & LIVE DIAGNOSTIC SIMULATOR (UPGRADED) */}
      <section className="p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Jonli SAT Test Simulator (Live Interactive)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917]">
              O'z Kuchingizni Sinab Ko'ring: 4 Ta Asosiy SAT Mavzulari
            </h2>
            <p className="text-xs text-[#78716C] mt-1">
              Savollarga javob bering va darhol Socratic AI tahlili hamda Desmos yechimini oling.
            </p>
          </div>

          {/* Question Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8E2D5] shrink-0">
            {INTERACTIVE_QUESTIONS.map((q, idx) => {
              const isAnswered = userSelectedAnswers[q.id] !== undefined;
              const isCorrect = userSelectedAnswers[q.id] === q.correctAnswer;
              const isActive = activeQuestionIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setActiveQuestionIndex(idx);
                    setTimerSeconds(30);
                    setIsTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-white text-[#57534E] hover:bg-[#F3EFE6] border border-[#E8E2D5]'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && (
                    <span className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-5">
          {/* Question Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] font-mono font-bold border border-blue-200">
                {activeQuestion.category}
              </span>
              <span className="font-semibold text-[#57534E]">{activeQuestion.domain}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                activeQuestion.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {activeQuestion.difficulty} Level
              </span>

              {/* Interactive 30s Speed Timer */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E8E2D5] font-mono font-bold text-xs">
                <Timer className="w-3.5 h-3.5 text-[#2563EB]" />
                <span className={timerSeconds <= 5 ? 'text-rose-600 animate-pulse' : 'text-[#1C1917]'}>
                  00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
                </span>
                {!isTimerRunning && timerSeconds === 30 && !revealedExplanations[activeQuestion.id] && (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="ml-1 text-[10px] text-[#2563EB] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" /> Boshlash
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Passage if Reading */}
          {activeQuestion.passage && (
            <div className="p-4 rounded-xl bg-[#FFFFFF] border-l-4 border-[#2563EB] border-t border-r border-b border-[#E8E2D5] text-xs sm:text-sm text-[#1C1917] leading-relaxed italic">
              "{activeQuestion.passage}"
            </div>
          )}

          {/* Question Text */}
          <p className="text-sm sm:text-base font-semibold text-[#1C1917] leading-relaxed">
            {activeQuestion.text}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {activeQuestion.options.map((opt) => {
              const isSelected = userSelectedAnswers[activeQuestion.id] === opt.id;
              const isCorrect = opt.id === activeQuestion.correctAnswer;
              const isRevealed = revealedExplanations[activeQuestion.id];

              let btnClass = 'bg-[#FFFFFF] border-[#E8E2D5] text-[#1C1917] hover:border-[#2563EB] hover:bg-blue-50/50';

              if (isRevealed) {
                if (isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                }
              } else if (isSelected) {
                btnClass = 'bg-blue-50 border-[#2563EB] text-[#2563EB] font-bold';
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswerSelect(opt.id)}
                  className={`p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <span>
                    <strong className="font-mono mr-2">{opt.id}.</strong> {opt.text}
                  </span>
                  {isRevealed && isCorrect && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {isRevealed && isSelected && !isCorrect && <XIcon className="w-4 h-4 text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation & Socratic Feedback */}
          {revealedExplanations[activeQuestion.id] && (
            <div className="p-5 rounded-2xl bg-[#FFFFFF] border border-blue-200 text-xs space-y-3.5 animate-in fade-in shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-2.5">
                <div className="font-bold text-[#2563EB] flex items-center gap-1.5 text-sm">
                  <BrainCircuit className="w-4 h-4" />
                  <span>Socratic AI Bosqichma-bosqich Yechimi:</span>
                </div>
                <button
                  onClick={handleResetQuestion}
                  className="text-[11px] text-[#78716C] hover:text-[#1C1917] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Qayta urinish
                </button>
              </div>

              <p className="text-[#1E3A8A] leading-relaxed font-medium">
                {activeQuestion.explanation}
              </p>

              {/* Desmos / Grammar Speedrun Tip */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-semibold text-emerald-900 flex items-start gap-2">
                <Calculator className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{activeQuestion.desmosOrGrammarTip}</span>
              </div>

              {/* Trap Analysis */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span className="leading-snug">{activeQuestion.trapAnalysis}</span>
              </div>
            </div>
          )}

          {/* Bottom Live Score Predictor Bar */}
          <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center font-bold">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-[#1C1917]">Taxminiy SAT Balingiz: <span className="text-[#2563EB] font-mono text-sm">{predictedRange}</span></div>
                <div className="text-[11px] text-[#78716C]">
                  {answeredCount}/4 savol yechildi • To'g'ri: {correctCount}/{answeredCount}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onOpenDiagnostic}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>To'liq 7-Daqiqalik Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DIGITAL SAT 4-DOMAIN WEIGHT MATRIX & BREAKDOWN (NEW & INFORMATIVE) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Digital SAT Imtihon Tuzilishi (2026)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Imtihon Ballari Qayerdan Keladi? (Domain Weight Matrix)
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            College Board rasmiy spetsifikatsiyasi bo'yicha har bir bo'limning aniq vazni va savollar soni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Math Section Breakdown */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#2563EB]" />
                  <span>Math Section (800 Ball)</span>
                </h3>
                <span className="text-xs text-[#78716C]">44 Savol • 70 Daqiqa • Desmos Ruxsat Etilgan</span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-blue-100 text-[#2563EB] rounded-lg">
                50% Imtihon
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">1. Algebra (Chiziqli Tenglamalar)</div>
                  <div className="text-[11px] text-[#78716C]">13–15 Savol • Chiziqli sistemalar, tengsizliklar, abs qiymat</div>
                </div>
                <span className="font-mono font-bold text-[#2563EB] text-sm">~35%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">2. Advanced Math (Kvadratik & Funksiyalar)</div>
                  <div className="text-[11px] text-[#78716C]">13–15 Savol • Parabola, diskriminant, ko'phadlar, eksponensial</div>
                </div>
                <span className="font-mono font-bold text-[#2563EB] text-sm">~35%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">3. Problem-Solving & Data Analysis</div>
                  <div className="text-[11px] text-[#78716C]">5–7 Savol • Foizlar, proporsiyalar, ehtimollik, jadvallar</div>
                </div>
                <span className="font-mono font-bold text-amber-600 text-sm">~15%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">4. Geometry & Trigonometry</div>
                  <div className="text-[11px] text-[#78716C]">5–7 Savol • Aylana tenglamasi, to'g'ri burchakli uchburchak, hajm</div>
                </div>
                <span className="font-mono font-bold text-amber-600 text-sm">~15%</span>
              </div>
            </div>
          </div>

          {/* Reading & Writing Section Breakdown */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Reading & Writing Section (800 Ball)</span>
                </h3>
                <span className="text-xs text-[#78716C]">54 Savol • 64 Daqiqa • Qisqa Matnlar</span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg">
                50% Imtihon
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">1. Craft & Structure (Lug'at & Matn Tuzilishi)</div>
                  <div className="text-[11px] text-[#78716C]">13–15 Savol • Words in Context, Text Structure, Cross-Text</div>
                </div>
                <span className="font-mono font-bold text-emerald-700 text-sm">~28%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">2. Information & Ideas (Asosiy G'oya & Dalillar)</div>
                  <div className="text-[11px] text-[#78716C]">12–14 Savol • Central Idea, Command of Evidence, Inferences</div>
                </div>
                <span className="font-mono font-bold text-emerald-700 text-sm">~26%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">3. Standard English Conventions (Grammatika)</div>
                  <div className="text-[11px] text-[#78716C]">11–15 Savol • Boundaries (vergullar, nuqtali vergul), fe'l zamonlari</div>
                </div>
                <span className="font-mono font-bold text-emerald-700 text-sm">~26%</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#1C1917]">4. Expression of Ideas (Transitions & Notes)</div>
                  <div className="text-[11px] text-[#78716C]">8–12 Savol • Rhetorical synthesis (talaba qaydlari), o'tish so'zlari</div>
                </div>
                <span className="font-mono font-bold text-amber-600 text-sm">~20%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BLUEBOOK MULTI-STAGE ADAPTIVE ROUTING (MST) VISUALIZER */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Compass className="w-3.5 h-3.5" />
            <span>MST Algoritmi Tushuntirishi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Digital SAT Multi-Stage Routing Qanday Ishlaydi?
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Qog'ozdagi eski SAT dan farqli ravishda, Digital SAT da sizning balingiz Module 2 dagi qiyinlik darajasiga bog'liq.
          </p>
        </div>

        {/* Interactive MST Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Stage 1 */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] text-center space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#78716C] bg-white px-2.5 py-1 rounded-full border border-[#E8E2D5]">
              1-Bosqich: Routing
            </span>
            <h3 className="font-bold text-base text-[#1C1917]">Module 1 (Routing)</h3>
            <p className="text-xs text-[#57534E]">
              Oson, o'rta va qiyin savollar aralashmasi. Talabaning dastlabki darajasi aniqlanadi.
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setMstModule1Score('HIGH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mstModule1Score === 'HIGH'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D5] text-[#57534E]'
                }`}
              >
                &ge; 70% To'g'ri (Yuqori)
              </button>
              <button
                onClick={() => setMstModule1Score('LOW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mstModule1Score === 'LOW'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white border border-[#E8E2D5] text-[#57534E]'
                }`}
              >
                &lt; 70% To'g'ri (Past)
              </button>
            </div>
          </div>

          {/* Stage 2 Adaptive Path */}
          <div className="p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#2563EB] text-center space-y-3 shadow-md shadow-blue-500/10 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold uppercase">
              Adaptiv Yo'naltiruvchi Algoritm
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#2563EB]">
              2-Bosqich: Qiyinlik Pivoti
            </span>
            <h3 className="font-bold text-base text-[#1C1917]">
              {mstModule1Score === 'HIGH' ? 'Hard Module 2 Ochildi 🚀' : 'Easy Module 2 ⚠️ (Score Capped)'}
            </h3>
            <p className="text-xs text-[#57534E]">
              {mstModule1Score === 'HIGH'
                ? 'Qiyin modul orqali siz 800 gacha (Top 1% natija) maksimal ballga ega bo\'lish imkoniyatiga ega bo\'lasiz.'
                : 'Oson modulga tushganingizda, maksimal ballingiz 590-620 ball bilan cheklanib qoladi (1500 olish imkonsiz).'}
            </p>
          </div>

          {/* Stage 3 Scaled Score Outcome */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] text-center space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Yakuniy Natija
            </span>
            <h3 className="font-bold text-base text-[#1C1917]">Kutilayotgan Umumiy Ball</h3>
            <div className="text-3xl font-extrabold font-mono text-[#2563EB]">
              {mstModule1Score === 'HIGH' ? '1520 – 1600' : '1080 – 1220'}
            </div>
            <p className="text-[11px] text-[#78716C]">
              {mstModule1Score === 'HIGH'
                ? 'Top 20 AQSh universitetlari va 100% grantlar doirasi'
                : 'ASRON SAT orqali Module 1 dagi xatolarni yo\'qotish kerak'}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: DESMOS SPEED BENCHMARK (Hand Algebra vs Desmos Hack) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Calculator className="w-3.5 h-3.5" />
              <span>Desmos Tezlik Sinovi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Nega Qo'lda Hisoblash Imtihon Vaqtingizning 60% ini Yo'qotadi?
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Digital SAT Math savollarining 80% dan ortig'i Desmos regressiya va grafik funktsiyalari orqali 20 soniyada yechiladi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Traditional Method */}
          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-rose-700">Qadimgi Qo'lda Yechish Usuli</span>
              <span className="text-xs font-mono font-bold text-rose-600">O'rtacha Vaqt: 3 daq 40 sek</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#57534E]">
              <li className="flex items-center gap-2 text-rose-900">
                <XIcon className="w-4 h-4 text-rose-500 shrink-0" />
                Yuqori darajali ko'phadlar va kvadrat tenglamalarni qo'lda faktoring qilish
              </li>
              <li className="flex items-center gap-2 text-rose-900">
                <XIcon className="w-4 h-4 text-rose-500 shrink-0" />
                Manfiy ishoralar va kasrlar bilan hisoblashdagi tasodifiy arifmetik xatolar
              </li>
              <li className="flex items-center gap-2 text-rose-900">
                <XIcon className="w-4 h-4 text-rose-500 shrink-0" />
                Module 2 ning oxirgi 5 ta qiyin savoliga vaqt yetmay qolishi
              </li>
            </ul>
          </div>

          {/* ASRON SAT Desmos Method */}
          <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-300 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">ASRON SAT Desmos Shortcut Usuli</span>
              <span className="text-xs font-mono font-bold text-emerald-700">O'rtacha Vaqt: 18 soniya</span>
            </div>
            <ul className="space-y-2.5 text-xs text-[#1C1917]">
              <li className="flex items-center gap-2 text-emerald-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Regressiya formuli (y1 ~ ax1² + bx1 + c) barcha noma'lumlarni 1 qadamda topadi
              </li>
              <li className="flex items-center gap-2 text-emerald-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Kesishtirish funksiyasi orqali ildizlar koordinatasi sichqoncha bilan bir bosishda ko'rinadi
              </li>
              <li className="flex items-center gap-2 text-emerald-900 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                Imtihon oxirida barcha javoblarni tekshirib chiqish uchun 12+ daqiqa zaxira vaqt qoladi
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: 4-WEEK RAPID 1500+ SAT BOOSTER BLUEPRINT (NEW & WOW FACTOR) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <Calendar className="w-3.5 h-3.5" />
            <span>30-Kunlik Aniq O'quv Rejasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            4 Hafta Ichida 1500+ Ballga Yetish Blueprint'i
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Tasodifiy mashqlar emas, har kuni 15-20 daqiqalik yuqori samarali maqsadli harakatlar.
          </p>
        </div>

        {/* Week Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { week: 1, title: '1-Hafta: Baza & Desmos', target: '+70 ball' },
            { week: 2, title: '2-Hafta: R&W Grammatika', target: '+130 ball' },
            { week: 3, title: '3-Hafta: Hard Module 2', target: '+180 ball' },
            { week: 4, title: '4-Hafta: 1600 Mocklar', target: '+220 ball' },
          ].map((item) => (
            <button
              key={item.week}
              onClick={() => setActiveWeekTab(item.week as 1 | 2 | 3 | 4)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                activeWeekTab === item.week
                  ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md shadow-blue-500/20'
                  : 'bg-[#FAF7F2] text-[#1C1917] border-[#E8E2D5] hover:border-[#D6CEBE]'
              }`}
            >
              <div className="text-[10px] uppercase font-mono font-bold opacity-80">{item.title}</div>
              <div className="font-bold text-sm mt-1">{item.target}</div>
            </button>
          ))}
        </div>

        {/* Active Week Content Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-4">
          {activeWeekTab === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1C1917]">1-Hafta: Diagnostika & Desmos Asoslari</h3>
                <span className="text-xs font-mono font-bold text-[#2563EB]">Kuniga 15 daqiqa</span>
              </div>
              <p className="text-xs text-[#57534E]">
                7-daqiqalik diagnostika orqali zaif mavzularingizni (Nonlinear Systems, Transitions) aniqlab, Desmosning barcha maxfiy formulalarini o'zlashtirasiz.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Dushanba - Seshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Diagnostik test & 3 ta asosiy zaif nuqtani belgilash</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Chorshanba - Payshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Desmos Regressiya & Slider trenirovkalari</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Juma - Yakshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Algebra 30 ta savol & Mistake Vault tahlili</div>
                </div>
              </div>
            </div>
          )}

          {activeWeekTab === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1C1917]">2-Hafta: R&W Grammatika & O'tish So'zlari</h3>
                <span className="text-xs font-mono font-bold text-[#2563EB]">Kuniga 20 daqiqa</span>
              </div>
              <p className="text-xs text-[#57534E]">
                Sentence Boundaries (vergul qoidalari, bog'lovchilar) va Words in Context larni 100% aniqlik bilan yechish texnikasi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Dushanba - Seshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Transitions (Contrast, Cause-Effect) formulalari</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Chorshanba - Payshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Student Notes (Rhetorical Synthesis) 10-soniya usuli</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Juma - Yakshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">R&W Module 1 qisqa mock & xatolarni takrorlash</div>
                </div>
              </div>
            </div>
          )}

          {activeWeekTab === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1C1917]">3-Hafta: Multi-Stage Module 2 Hard Savollari</h3>
                <span className="text-xs font-mono font-bold text-[#2563EB]">Kuniga 25 daqiqa</span>
              </div>
              <p className="text-xs text-[#57534E]">
                Faqat 750-800 ballik qiyin savollar (Circle Theorems, High-Degree Polynomials, Cross-Text Inferences) bilan ishlash.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Dushanba - Seshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Qiyin Kvadratik va Aylana tenglamalari</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Chorshanba - Payshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Murakkab matnlar (Cross-text comparisons)</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Juma - Yakshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Mistake Vault dagi barcha xatolarni yopish</div>
                </div>
              </div>
            </div>
          )}

          {activeWeekTab === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1C1917]">4-Hafta: To'liq Bluebook Mock Simulyatsiyasi</h3>
                <span className="text-xs font-mono font-bold text-[#2563EB]">To'liq Test</span>
              </div>
              <p className="text-xs text-[#57534E]">
                Haqiqiy imtihon muhitida to'liq 2 soat 14 daqiqalik sinov, vaqtni boshqarish va 1550+ ballni mustahkamlash.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Seshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">To'liq Bluebook Adaptive Mock Test #1</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Payshanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Socratic AI bilan har bir xatoning tub sababini tahlil qilish</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-[#E8E2D5]">
                  <div className="font-bold text-[#1C1917]">Shanba</div>
                  <div className="text-[11px] text-[#78716C] mt-1">Final 1600 Mock Test & Imtihonga to'liq tayyorgarlik</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 7: SCORE CALCULATOR & GLOBAL UNIVERSITY MATCHER (ENRICHED) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Ball & Universitet / Grant Kalkulyatori</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Sizning SAT Balingiz Qaysi Universitetlarga Yo'l Ochadi?
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Slayderni o'zgartiring va 30 kunlik o'sish potentsialingiz hamda kirishingiz mumkin bo'lgan universitetlar ro'yxatini ko'ring.
          </p>

          {/* Slider */}
          <div className="pt-6 space-y-4 max-w-lg mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-[#57534E]">
              <span>Hozirgi Balingiz: <strong className="text-[#1C1917] text-base font-mono">{currentScore}</strong></span>
              <span>Maqsad: 1600</span>
            </div>
            <input
              type="range"
              min="900"
              max="1500"
              step="10"
              value={currentScore}
              onChange={(e) => setCurrentScore(Number(e.target.value))}
              className="w-full h-2.5 bg-[#E8E2D5] rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
            />
          </div>

          {/* Result Stats Grid */}
          <div className="mt-8 p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="text-center sm:text-left">
              <div className="text-[11px] uppercase tracking-wider text-[#78716C] font-semibold">Boshlang'ich Daraja</div>
              <div className="text-3xl font-extrabold font-mono text-[#1C1917]">{currentScore}</div>
            </div>

            <div className="text-center py-2 px-4 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/30">
              <div className="text-xs font-bold text-[#2563EB]">30-Kunlik O'sish</div>
              <div className="text-2xl font-extrabold text-[#2563EB] font-mono">+{projectedScore - currentScore} ball</div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-[11px] uppercase tracking-wider text-[#2563EB] font-bold">Kutilayotgan Potensial</div>
              <div className="text-3xl font-extrabold font-mono text-[#2563EB]">{projectedScore}+</div>
            </div>
          </div>

          {/* Matched Universities & Scholarships Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 to-emerald-50/70 border border-blue-200 text-left space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-xs text-[#2563EB] uppercase tracking-wider flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-[#2563EB]" />
                {uniMatch.tier}
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                {uniMatch.scholarship}
              </span>
            </div>

            <div className="text-xs text-[#57534E]">
              <strong>Mos keladigan universitetlar:</strong> {uniMatch.colleges.join(' • ')}
            </div>

            <div className="text-[11px] font-mono text-[#78716C]">
              Daraja: {uniMatch.percentile}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: ASRON SAT VS ALTERNATIVES COMPARISON MATRIX (POWERFUL TRUST BUILDER) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0B1B3D] dark:text-blue-300 text-xs font-bold border border-[#0B1B3D]/15 dark:border-blue-800">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Bozor Taqqoslash Tahlili</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0B1B3D] dark:text-[#EAEBED]">
            Nega ASRON SAT Boshqa Hamma Usullardan 3x Samaraliroq?
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#94A3B8]">
            Eski qo'llanmalar, umumiy kurslar va ASRON SAT ning adaptiv texnologiyasi o'rtasidagi farq.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E8E2D5] dark:border-[#1E293B] text-[#78716C] dark:text-[#94A3B8] uppercase font-mono text-[10px]">
                <th className="py-3 px-4 font-semibold">Funksionallik & Xususiyat</th>
                <th className="py-3 px-4 font-bold text-[#0B1B3D] dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/20 rounded-t-xl">ASRON SAT</th>
                <th className="py-3 px-4 font-semibold">Khan Academy</th>
                <th className="py-3 px-4 font-semibold">UWorld / Prep Books</th>
                <th className="py-3 px-4 font-semibold">Oflayn Repetitor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D5]">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">Bluebook 2-Stage Adaptiv MST Simulyatsiyasi</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50 flex items-center gap-1">
                  <Check className="w-4 h-4" /> 100% Aniq Algoritm
                </td>
                <td className="py-3.5 px-4 text-[#78716C]">Faqat Statik Testlar</td>
                <td className="py-3.5 px-4 text-[#78716C]">Qisman</td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500" /> Yo'q</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">24/7 Socratic Gemini AI Repetitori</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                  <Check className="w-4 h-4 inline mr-1" /> Cheksiz & Jonli
                </td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Yo'q</td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Faqat Matn</td>
                <td className="py-3.5 px-4 text-[#78716C]">Haftada 2-3 soat</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">Desmos Speedrun Regressiya Formula Yechimlari</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                  <Check className="w-4 h-4 inline mr-1" /> Har bir savolda
                </td>
                <td className="py-3.5 px-4 text-[#78716C]">Faqat oddiy kalkulyator</td>
                <td className="py-3.5 px-4 text-[#78716C]">Qo'lda hisoblash</td>
                <td className="py-3.5 px-4 text-[#78716C]">Kamdan-kam</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">Leitner Spaced Repetition Xatolar Sandig'i</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                  <Check className="w-4 h-4 inline mr-1" /> Avtomatik 5-Box
                </td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Yo'q</td>
                <td className="py-3.5 px-4 text-[#78716C]">Qo'lda daftar tutish</td>
                <td className="py-3.5 px-4 text-[#78716C]">Daftarga yozish</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">AI Cloned Similar Question Generator</td>
                <td className="py-3.5 px-4 font-bold text-emerald-600 bg-blue-50/50">
                  <Check className="w-4 h-4 inline mr-1" /> 1-Click Xato Kloni
                </td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Yo'q</td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Yo'q</td>
                <td className="py-3.5 px-4 text-[#78716C]"><XIcon className="w-4 h-4 text-rose-500 inline mr-1" /> Yo'q</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-[#1C1917]">Oylik Xarajat</td>
                <td className="py-3.5 px-4 font-bold text-[#2563EB] bg-blue-50/50">
                  $0 – $19/oy
                </td>
                <td className="py-3.5 px-4 text-[#78716C]">Bepul (Cheklangan)</td>
                <td className="py-3.5 px-4 text-[#78716C]">$80 – $150</td>
                <td className="py-3.5 px-4 text-[#78716C]">$150 – $400/oy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 9: VERIFIED STUDENT TESTIMONIALS & REVIEWS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>Tasdiqlangan 1500+ Natijalar</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Talabalar Sharhlari & Natijalari ({testimonials.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              O'quvchilarimiz o'z natijalari va erishgan muvaffaqiyatlari haqida fikr bildirishmoqda.
            </p>
          </div>

          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Fikr Bildirish / Sharh Qoldirish</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-4 flex flex-col justify-between hover:border-[#2563EB]/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.stars || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#A8A29E]">{t.date || 'Yaqinda'}</span>
                </div>
                <p className="text-xs text-[#57534E] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D5] flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#E8E2D5]"
                />
                <div>
                  <div className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                    <span>{t.name}</span>
                    {t.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Tasdiqlangan natija" />
                    )}
                  </div>
                  <div className="text-[10px] text-[#2563EB] font-semibold">{t.targetSchoolOrMajor}</div>
                  <div className="text-[10px] text-[#78716C] font-mono">{t.score}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: SAT FAQ ACCORDION (ANSWERS TO CRITICAL QUESTIONS) */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ko'p Beriladigan Savollar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Tez-tez So'raladigan Savollar (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Digital SAT va {branding.brandName} platformasi bo'yicha eng muhim savollarga javoblar.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {[
            {
              q: "Digital SAT imtihonida haqiqatan ham Desmos kalkulyatoridan foydalanish mumkinmi?",
              a: "Ha, mutlaqo! College Board rasmiy Digital SAT Math bo'limida Desmos Graphing Calculator to'liq integratsiya qilingan va barcha savollarda foydalanishga ruxsat berilgan. ASRON SAT sizga har bir savolni Desmos orqali 20 soniyada yechish formulalarini o'rgatadi."
            },
            {
              q: "Multi-Stage Adaptive (MST) nima va u ballga qanday ta'sir qiladi?",
              a: "Digital SAT 2 ta moduldan iborat. Agar siz 1-modulda 70% dan ko'p savolga to'g'ri javob bersangiz, tizim sizni 'Hard Module 2' ga o'tkazadi va 800 ballgacha olishingizga ruxsat beradi. Agar 1-modulda xatolar ko'p bo'lsa, 'Easy Module 2' ochiladi va balingiz maksimal 600 ball bilan cheklanadi."
            },
            {
              q: "Kuniga qancha vaqt ajratishim kerak?",
              a: "ASRON SAT ning 'Micro-Drill' metodikasi bo'yicha kuniga bor-yo'g'i 15-20 daqiqa ajratish kifoya. Bu 1 ta Daily Workout (5 savol) va Mistake Vault dagi 3 ta xatoni takrorlashni o'z ichiga oladi."
            },
            {
              q: "Bepul Starter tarifida nimalar mavjud?",
              a: "Bepul versiyada kunlik 5 talik mashqlar, 7-daqiqalik diagnostik test, to'liq Desmos kalkulyatori, jamiyat chatlari va asosiy blog qo'llanmalari mutlaqo bepul va doimiy ochiq."
            },
            {
              q: "Socratic AI Tutor va Oddiy Chatbot o'rtasidagi farq nima?",
              a: "Oddiy botlar to'g'ridan-to'g'ri tayyor javobni aytib qo'yadi, bu esa o'quvchining fikrlashiga yordam bermaydi. Bizning Socratic AI esa sizga yo'naltiruvchi savollar berib, xatongizni o'zingiz tushunib yetishingizni va imtihonda qayta xato qilmasligingizni ta'minlaydi."
            },
            {
              q: "Telefon yoki planshetdan ham foydalanish mumkinmi?",
              a: "Ha! ASRON SAT barcha mobil qurilmalar, planshetlar va kompyuterlar uchun 100% moslashtirilgan. Shuningdek, Telegram botimiz orqali kunlik trenirovkalarni telefoningizda ham yechishingiz mumkin."
            }
          ].map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#1C1917] cursor-pointer"
              >
                <span>{faq.q}</span>
                {openFaqIndex === idx ? (
                  <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#78716C] shrink-0" />
                )}
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-[#57534E] leading-relaxed border-t border-[#E8E2D5]/60 pt-3 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: BLOG & SOCIAL MEDIA HUB */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-200">
              <BookOpen className="w-3.5 h-3.5" />
              <span>SAT Blog & Strategiya Qo'llanmalari</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
              Ekspert Maqolalari & Ijtimoiy Tarmoqlar
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C]">
              Eng so'nggi strategiyalar, Desmos sirlari va talabalar jamoasi bilan tanishing.
            </p>
          </div>

          <button
            onClick={onNavigateToBlog}
            className="self-start md:self-auto px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#2563EB] font-bold text-xs border border-[#E8E2D5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Barcha Maqolalarni O'qish</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Social Media Link Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Telegram */}
          <a
            href={branding.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-blue-50 hover:border-blue-300 border border-[#E8E2D5] flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Send className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-[#1C1917] group-hover:text-[#2563EB] flex items-center gap-1">
                <span>Telegram</span>
                <ArrowUpRight className="w-3 h-3 text-[#78716C] group-hover:text-[#2563EB]" />
              </div>
              <div className="text-[10px] text-[#78716C] truncate">{branding.telegramChannelName}</div>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={branding.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-pink-50 hover:border-pink-300 border border-[#E8E2D5] flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Instagram className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-[#1C1917] group-hover:text-rose-600 flex items-center gap-1">
                <span>Instagram</span>
                <ArrowUpRight className="w-3 h-3 text-[#78716C] group-hover:text-rose-600" />
              </div>
              <div className="text-[10px] text-[#78716C] truncate">{branding.instagramHandle}</div>
            </div>
          </a>

          {/* YouTube */}
          <a
            href={branding.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-red-50 hover:border-red-300 border border-[#E8E2D5] flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-[#1C1917] group-hover:text-red-600 flex items-center gap-1">
                <span>YouTube</span>
                <ArrowUpRight className="w-3 h-3 text-[#78716C] group-hover:text-red-600" />
              </div>
              <div className="text-[10px] text-[#78716C] truncate">{branding.youtubeChannelName}</div>
            </div>
          </a>

          {/* TikTok */}
          <a
            href={branding.tiktokUrl}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-slate-100 hover:border-slate-400 border border-[#E8E2D5] flex items-center gap-3 transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-extrabold text-sm">Tik</span>
            </div>
            <div className="overflow-hidden">
              <div className="font-bold text-xs text-[#1C1917] group-hover:text-black flex items-center gap-1">
                <span>TikTok</span>
                <ArrowUpRight className="w-3 h-3 text-[#78716C] group-hover:text-black" />
              </div>
              <div className="text-[10px] text-[#78716C] truncate">{branding.tiktokHandle}</div>
            </div>
          </a>
        </div>

        {/* Featured Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {blogArticles.slice(0, 3).map((article) => (
            <div
              key={article.id}
              onClick={onNavigateToBlog}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-3 flex flex-col justify-between hover:border-[#2563EB]/50 hover:bg-[#FFFFFF] transition-all cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="h-36 rounded-xl overflow-hidden border border-[#E8E2D5] relative">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#2563EB] border border-[#E8E2D5]">
                    {article.category}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#1C1917] group-hover:text-[#2563EB] transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-[11px]">
                <span className="text-[#78716C]">{article.readTime}</span>
                <span className="font-bold text-[#2563EB] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Maqolani O'qish</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 12: TRANSPARENT PRICING CARDS */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917]">
            Oddiy & Shaffof Narxlar
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C]">
            Bepul boshlang va istalgan vaqtda 24/7 Socratic AI repetitoriga ulaning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Starter */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs uppercase font-mono font-bold text-[#78716C]">Free Starter</div>
              <div className="text-3xl font-extrabold font-mono text-[#1C1917]">$0 <span className="text-xs font-normal text-[#78716C]">/ doimiy</span></div>
              <ul className="space-y-2 text-xs text-[#57534E] pt-3 border-t border-[#E8E2D5]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Kunlik 5-Savollik Workout</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 7-Daqiqalik Diagnostik Test</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> To'liq Desmos Grafik Paketi</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Talabalar Muhokama Xonasi</li>
              </ul>
            </div>
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="w-full py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#D6CEBE] text-[#1C1917] font-bold text-xs transition-colors cursor-pointer"
            >
              Get Started Free →
            </button>
          </div>

          {/* Standard Pass */}
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs uppercase font-mono font-bold text-[#2563EB]">Standard Pass</div>
              <div className="text-3xl font-extrabold font-mono text-[#1C1917]">${branding.priceStandard} <span className="text-xs font-normal text-[#78716C]">/ oy</span></div>
              <ul className="space-y-2 text-xs text-[#57534E] pt-3 border-t border-[#E8E2D5]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> To'liq 3,000+ Savollar Banki</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Rasmiy Bluebook MST Mocklar</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Mistake Vault Leitner Tizimi</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Telegram Kunlik Eslatmalar</li>
              </ul>
            </div>
            <button
              onClick={onOpenPaywall}
              className="w-full py-3 rounded-xl bg-[#FAF7F2] hover:bg-[#EFEAE0] border border-[#D6CEBE] text-[#2563EB] font-bold text-xs transition-colors cursor-pointer"
            >
              Select Standard Pass
            </button>
          </div>

          {/* PRO Adaptive Accelerator */}
          <div className="relative p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#2563EB] shadow-lg shadow-blue-500/10 space-y-4 flex flex-col justify-between">
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wider">
              ENG SAMARALI
            </div>
            <div className="space-y-3">
              <div className="text-xs uppercase font-mono font-bold text-[#2563EB] flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" /> PRO Adaptive Accelerator
              </div>
              <div className="text-3xl font-extrabold font-mono text-[#1C1917]">${branding.pricePro} <span className="text-xs font-normal text-[#78716C]">/ oy</span></div>
              <ul className="space-y-2 text-xs text-[#1C1917] font-medium pt-3 border-t border-[#E8E2D5]">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> <strong>Cheksiz 24/7 Socratic Gemini Repetitor</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> <strong>AI Mistake Cloned Question Generator</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Shaxsiy 30-Kunlik O'sish Xaritasi</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> VIP Telegram Voice Study Cohort</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" /> Kafolatlangan +200 Ball Natija</li>
              </ul>
            </div>
            <button
              onClick={onOpenPaywall}
              className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all hover:scale-105 cursor-pointer"
            >
              Unlock Full Pro Pass →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 13: FINAL CALL TO ACTION (CLEAN & PERSUASIVE) */}
      <section className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#1E3A8A] text-white text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bugunoq Boshlang</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
          1500+ SAT Balingizni Bugun Kafolatlang!
        </h2>
        <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
          Ro'yxatdan o'tish mutlaqo bepul. 1 daqiqada hisob oching va adaptiv testlarni darhol boshlang.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onOpenAuthModal('signup')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-blue-50 text-[#2563EB] font-bold text-sm shadow-md transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Sign Up for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href={branding.telegramUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-sm border border-blue-400/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Telegram Kanalga Qo'shilish</span>
          </a>
        </div>
      </section>

      {/* Footer bar with Admin Desk link */}
      <footer className="pt-8 pb-4 border-t border-[#E5E0D8] dark:border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C] dark:text-[#94A3B8]">
        <div className="flex items-center gap-2.5">
          <AsronLogo size={24} variant="mark-only" />
          <span className="font-bold text-[#0B1B3D] dark:text-[#EAEBED]">{branding.brandName}</span>
          <span>• Digital SAT Intelligence Platform 2026</span>
        </div>

        <div className="flex items-center gap-4">
          {onOpenAdminLogin && (
            <button
              onClick={onOpenAdminLogin}
              className="text-[11px] font-bold text-[#78716C] dark:text-[#94A3B8] hover:text-[#0B1B3D] dark:hover:text-[#FAF8F5] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#E07A5F]" />
              <span>Admin Panel (Staff)</span>
            </button>
          )}
          <button
            onClick={() => onOpenAuthModal('signin')}
            className="text-[11px] font-semibold text-[#78716C] dark:text-[#94A3B8] hover:text-[#0B1B3D] dark:hover:text-[#FAF8F5] transition-colors cursor-pointer"
          >
            Student Login
          </button>
        </div>
      </footer>

      {/* Modal for User Review Submission */}
      <ReviewSubmissionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitReview={handleAddReview}
      />
    </div>
  );
};
