export type Role = 'STUDENT' | 'ADMIN' | 'SUPER_ADMIN';
export type PlanTier = 'FREE' | 'STANDARD' | 'PRO' | 'VIP';
export type SectionType = 'READING_AND_WRITING' | 'MATH';
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'GRID_IN';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type ChatType = 'DIRECT' | 'SAVED_MESSAGES' | 'PUBLIC_CHANNEL' | 'PRIVATE_CHANNEL' | 'PUBLIC_GROUP' | 'PRIVATE_GROUP' | 'CHANNEL';

export interface User {
  id: string;
  telegramId?: string;
  email: string;
  username: string;
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
  customAvatar?: boolean;
  defaultAvatarIndex?: number;
  bio?: string;
  institution?: string;
  targetUniversity?: string;
  telegramHandle?: string;
  instagramHandle?: string;
  role: Role;
  planTier: PlanTier;
  planExpiresAt?: string;
  targetScore: number;
  highestScore?: number;
  baselineScore?: number;
  potentialScore?: number;
  predictedScore?: number;
  totalTimeSecs?: number;
  totalQuestionsDone?: number;
  isPublicProfile?: boolean;
  unlockedBadges?: string[];
  weakestSubSkills?: string[];
  targetExamDate?: string;
  streakDays: number;
  lastActiveDate?: string;
  streakFreezes: number;
  xpPoints: number;
  claimedMilestones?: number[]; // [7, 30, 100]
  isOnline?: boolean;
  testsCompletedCount?: number;
  unseenTierUpgrade?: boolean;
  scholarId?: string;
  isBanned?: boolean;
  tierExpiresAt?: string;
  permissions?: {
    desmosAccess?: boolean;
    whiteboardStreamHosting?: boolean;
    aiSocraticTutor?: boolean;
    fullQuestionBank?: boolean;
    unlimitedMocks?: boolean;
  };
  createdAt: string;
}

export type MathDomain = 'Algebra' | 'Advanced Math' | 'Problem-Solving and Data Analysis' | 'Geometry and Trigonometry';
export type ReadingWritingDomain = 'Information and Ideas' | 'Craft and Structure' | 'Expression of Ideas' | 'Standard English Conventions';

export interface PricingPlanConfig {
  id: string; // "plan_standard", "plan_pro", "plan_vip", "plan_free"
  tier: PlanTier;
  title: string;
  name?: string; // alias for title
  subtitle?: string;
  badgeText?: string;
  monthlyPriceUSD: number;
  priceMonthly?: number; // alias for monthlyPriceUSD
  threeMonthPriceUSD: number;
  yearlyPriceUSD: number;
  priceAnnual?: number; // alias for yearlyPriceUSD
  discountPercent: number;
  featuresList: string[];
  features?: string[]; // alias for featuresList
  isHighlighted: boolean;
  ctaText?: string;
  ctaTargetUrl?: string;
  updatedAt: string;
}

export interface DesmosSatHack {
  id: string;
  title: string; // e.g. "Instant Intersection Finder"
  category: 'Algebra' | 'Advanced Math' | 'Problem-Solving' | 'Geometry' | 'General';
  description: string;
  latexFormula: string; // e.g. "y_1 ~ ax_1^2 + bx_1 + c"
  exampleProblem?: string;
  shortcutTip?: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GlobalPlatformSettings {
  id?: string;
  platformName: string;
  platformSubtitle?: string;
  platformTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  desmosIconUrl?: string;
  desmosEnabled?: boolean;
  adminTelegram?: string;
  contactTelegram: string;
  supportEmail?: string;
  contactEmail: string;
  instagramPage?: string;
  contactInstagram: string;
  youtubeChannel?: string;
  landingHeadline?: string;
  landingHeroTitle?: string;
  landingSubheadline?: string;
  landingHeroSubtitle?: string;
  landingHeroCtaText?: string;
  announcementText?: string;
  announcementActive?: boolean;
  announcementEnabled?: boolean;
  announcementBgColor?: string;
  announcementLink?: string;
  freeDailyLimit?: number;
  isMaintenance: boolean;
  arenaEnabled: boolean;
  liveStreamEnabled: boolean;
  voiceNotesEnabled?: boolean;
  faqs?: { q: string; a: string; category?: string }[];
  testimonials?: {
    id: string;
    name: string;
    targetSchoolOrMajor: string;
    score: string;
    quote: string;
    stars: number;
    avatar: string;
    date: string;
    verifiedStudent?: boolean;
  }[];
  updatedAt: string;
}

export type { UserTestimonial } from './data/blogAndBrandingData';

export interface Question {
  id: string;
  sqbId?: string; // Official College Board ID e.g. #RW-2940 or #MATH-1402
  section: SectionType;
  domain: string;
  skill: string;
  difficulty: Difficulty;
  type: QuestionType;
  passage?: string;
  questionText: string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
  imageUrl?: string;
  globalAccuracy?: number;
  createdAt?: string;
}

export interface UserQuestionPractice {
  id: string;
  userId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpentSecs: number; // Elapsed time tracked by the count-up timer
  isBookmarked: boolean;
  lastAttemptedAt: string;
}

export interface MistakeVaultItem {
  id: string;
  userId: string;
  questionId?: string;
  question: Question;
  userWrongAnswer: string;
  stage: number; // Leitner SRS Stage 1-3 (1: Learning, 2: Review Due, 3: Mastered)
  nextReviewAt: string;
  isMastered: boolean;
  consecutiveCorrectCount?: number; // Number of times answered correctly in a row (3 = Mastered)
  clonedQuestion?: Question; // AI-generated cloned question variant
  source?: 'MOCK_TEST' | 'DAILY_WORKOUT' | 'QUESTION_BANK';
  aiTrapAnalysis?: {
    coreRuleMissed: string;
    trapReason: string;
    preventionStrategy: string;
    cognitiveBias?: string;
  };
  createdAt?: string;
}

export interface DailyWorkoutSubmission {
  id: string;
  userId: string;
  date: string;
  score: number; // e.g. 4 out of 5
  questionsAnswered: {
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
  }[];
}

export type MockTestCategory = 'ALL' | 'OFFICIAL_MOCK' | 'PAST_EXAM' | 'SECTIONAL_PRACTICE' | 'PREDICTION_TEST';
export type MockModuleType = 'RW_M1' | 'RW_M2_EASY' | 'RW_M2_HARD' | 'MATH_M1' | 'MATH_M2_EASY' | 'MATH_M2_HARD';

export interface MockTestQuestion {
  id: string;
  mockTestId: string;
  questionId: string;
  question: Question;
  moduleType?: MockModuleType;
  moduleNumber: 1 | 2; // 1 = Baseline module, 2 = Adaptive module
  section: SectionType;
  difficultyTier: Difficulty;
  orderIndex: number;
}

export interface MockTest {
  id: string;
  title: string;
  description?: string;
  category?: 'OFFICIAL_MOCK' | 'PAST_EXAM' | 'SECTIONAL_PRACTICE' | 'PREDICTION_TEST';
  isPublished: boolean;
  isProOnly: boolean;
  totalTimeMinutes: number;
  timeLimitSecs?: number; // e.g. 8040 (2h 14m)
  questions: MockTestQuestion[];
  attemptsCount?: number;
  averageScore?: number;
  highestScore?: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface TestAttempt {
  id: string;
  userId: string;
  mockTestId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  totalScore?: number; // 400 - 1600
  rwScore?: number;    // 200 - 800
  mathScore?: number;  // 200 - 800
  answers: Record<string, string>; // questionId -> answer
  questionTimes?: Record<string, number>; // questionId -> seconds
  currentModule?: MockModuleType | string;
  currentQIndex?: number;
  isCompleted?: boolean;
  completedAt?: string;
  createdAt?: string;
  timeSpentSeconds?: number;
  totalQuestionsCount?: number;
  answeredQuestionsCount?: number;
  isAdaptiveStage2Hard?: boolean;
  aiDiagnostic?: string;
  module2TierAssigned?: {
    rw: 'EASY' | 'HARD';
    math: 'EASY' | 'HARD';
  };
}

export interface PaymentReceipt {
  id: string;
  userId: string;
  username?: string;
  userName?: string;
  userEmail: string;
  planTier?: PlanTier;
  planRequested: PlanTier;
  amountPaid?: string;
  amount: number;
  receiptImageUrl: string;
  status: PaymentStatus;
  adminNote?: string;
  createdAt: string;
}

export interface TelegramNotification {
  id: string;
  userId: string;
  type: 'DAILY_WORKOUT_READY' | 'STREAK_DANGER' | 'RECEIPT_APPROVED';
  message: string;
  sentAt: string;
  read: boolean;
}

export interface LandingConfig {
  id: number;
  heroHeadline: string;
  heroSubtext: string;
  telegramChannel: string;
  instagramPage: string;
  pricingTiers: {
    free: { name: string; price: string; features: string[] };
    standard: { name: string; price: string; features: string[] };
    pro: { name: string; price: string; features: string[] };
  };
  updatedAt: string;
}

export interface ChatMember {
  id: string;
  chatId: string;
  userId: string;
  role?: 'OWNER' | 'ADMIN' | 'MEMBER';
  user?: User;
  joinedAt: string;
  isMuted?: boolean;
}

export interface InteractivePoll {
  id: string;
  questionText: string;
  options: { key: string; text: string; votes: number }[];
  correctKey: string;
  explanation: string;
  userVotedKey?: string;
}

export interface Message {
  id: string;
  chatId?: string;
  channelId?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderRole?: Role;
  content?: string;
  mediaUrl?: string;
  mediaName?: string;
  mediaType?: 'image' | 'pdf' | 'document' | 'video';
  voiceAudioUrl?: string;
  voiceDuration?: number; // seconds
  recordingVideoUrl?: string;
  recordingTitle?: string;
  recordingDuration?: number; // seconds
  attachedQuestionId?: string;
  attachedQuestion?: Question;
  isPinned?: boolean;
  reactions?: Record<string, number>;
  userReacted?: string[];
  poll?: InteractivePoll;
  createdAt: string;
}

// Aliases for chat
export type ChatMessage = Message;

export interface Chat {
  id: string;
  name: string;
  type: ChatType;
  description?: string;
  avatarUrl?: string;
  inviteCode?: string;
  unreadCount?: number;
  lastMessage?: Message;
  members: string[]; // user IDs
  memberRoles?: Record<string, 'OWNER' | 'ADMIN' | 'MEMBER'>;
  pinnedMessageId?: string;
  isArchived?: boolean;
  isLiveActive?: boolean;
  createdById?: string;
  createdAt: string;
}

export interface LiveStreamSession {
  id: string;
  chatId: string;
  hostId: string;
  hostName: string;
  hostAvatar?: string;
  title: string;
  description?: string;
  isActive: boolean;
  viewerCount: number;
  recordingUrl?: string;
  recordingDuration?: number;
  startedAt: string;
  endedAt?: string;
}

export interface WhiteboardElement {
  id: string;
  type: 'pen' | 'highlighter' | 'line' | 'rect' | 'circle' | 'axes' | 'grid' | 'text' | 'latex';
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color: string;
  strokeWidth: number;
  text?: string;
  latex?: string;
  opacity?: number;
}

export type ChatChannel = Chat;

export interface TutorMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
}

export interface TutorSession {
  id: string;
  userId: string;
  questionId?: string;
  context?: string;
  messages: TutorMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface DiagnosticResult {
  completed: boolean;
  baselineScore: number;
  potentialScore: number;
  rwScore: number;
  mathScore: number;
  weakestSubSkills: {
    skill: string;
    domain: string;
    lostPoints: number;
    description: string;
  }[];
  roadmap: {
    day: number;
    focus: string;
    action: string;
  }[];
}

export type WorkoutMode = 'ADAPTIVE_WEAKNESS' | 'SPEED_BLITZ' | 'MIXED_DAILY' | 'TARGET_PLAN';

export interface StudyPlanDay {
  day: number;
  title: string;
  section: SectionType | 'MIXED';
  domain: string;
  targetSkill: string;
  estimatedMinutes: number;
  questionCount: number;
  isCompleted?: boolean;
  score?: number;
}

export interface StudyPlan {
  id: string;
  title: string;
  subtitle: string;
  targetScore: string;
  durationDays: number;
  dailyCommitment: string;
  difficulty: 'ALL_LEVELS' | 'INTERMEDIATE' | 'ADVANCED';
  iconName: string;
  description: string;
  curriculum: StudyPlanDay[];
}

export interface WorkoutSessionSummary {
  mode: WorkoutMode;
  modeTitle: string;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  timeLimitSeconds: number;
  xpEarned: number;
  speedBonusXP: number;
  streakDays: number;
  estimatedScoreGain: number;
  missedQuestions: Question[];
  userAnswers: Record<string, string>;
  questionTimes: Record<string, number>;
  studyPlanDay?: number;
}

// SAT Vocabulary Types
export interface VocabularyWord {
  id: string;
  wordNumber?: number; // 1 to 400 for College Panda
  word: string;
  partOfSpeech: string; // e.g. 'adj.', 'verb', 'noun', 'adv.'
  definition: string;
  synonyms: string[];
  sampleSentence: string;
  difficulty: Difficulty;
  bookSource?: string; // e.g. "The College Panda 400"
  tone?: 'Positive' | 'Negative' | 'Neutral';
  etymology?: string; // Root word or mnemonic cue
  createdAt?: string;
}

export interface UserVocabProgress {
  id: string;
  userId: string;
  wordId: string;
  srsStage: number; // 0: New, 1: Learning (1 Day), 2: Review (3 Days), 3: Mastered (7 Days)
  nextReviewAt: string;
  correctCount: number;
  incorrectCount: number;
  lastReviewedAt?: string;
  isBookmarked?: boolean;
}

export interface VocabGameMatch {
  id: string;
  mode: 'SPEED_BLITZ' | 'PVP_DUEL' | 'CONTEXT_CLASH';
  player1Id: string;
  player1Name?: string;
  player1Avatar?: string;
  player2Id?: string;
  player2Name?: string;
  player2Avatar?: string;
  player1Score: number;
  player2Score?: number;
  winnerId?: string;
  accuracy?: number;
  wpm?: number;
  streakMax?: number;
  completedAt?: string;
  createdAt: string;
}

export interface VocabContextQuestion {
  id: string;
  passage: string; // Sentence with missing word blank _______
  correctWord: string;
  options: string[]; // 4 word choices
  explanation: string;
  domain?: string;
  difficulty: Difficulty;
}

// Multiplayer SAT Arena Types
export type ArenaMode = 'QUICK_DUEL' | 'GROUP_ROOM' | 'SURVIVAL';
export type MatchStatus = 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ArenaCategory = 'MIXED' | 'RW' | 'MATH_DESMOS' | 'VOCAB';
export type ArenaTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER';

export interface ArenaPlayerProfile {
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  rating: number;
  tier: ArenaTier;
  wins: number;
  losses: number;
  winStreak: number;
  highestRating: number;
  bestSurvivalScore: number;
  totalDuelsPlayed: number;
}

export interface ArenaQuestionAnswer {
  qIndex: number;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeMs: number;
  scoreAwarded: number;
}

export interface ArenaParticipant {
  id: string;
  matchId: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  rating: number;
  score: number;
  answers: ArenaQuestionAnswer[];
  isWinner: boolean;
  ratingDelta: number;
  isAnswerSubmittedForCurrentQ?: boolean;
  currentQIndex?: number;
  isReady?: boolean;
}

export interface ArenaMatch {
  id: string;
  roomCode?: string;
  mode: ArenaMode;
  category: ArenaCategory;
  status: MatchStatus;
  questionIds: string[];
  questions?: Question[];
  currentQuestionIndex: number;
  timePerQuestionSec: number;
  participants: ArenaParticipant[];
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

// 30-Day Personalized Roadmap & Habit Tracker Types
export type RoadmapTaskType = 'CONCEPT_READING' | 'PRACTICE_SET' | 'VOCAB' | 'FULL_MOCK' | 'CUSTOM';

export interface RoadmapTaskProgress {
  id: string;
  roadmapId: string;
  dayNumber: number; // 1 to 30
  taskType: RoadmapTaskType;
  title: string;
  description?: string;
  targetUrl?: string;
  targetDomain?: string;
  itemCount?: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface UserRoadmap {
  id: string;
  userId: string;
  planTier?: PlanTier;
  isAutoGenerated: boolean; // false for Standard, true for Pro/VIP
  assignedMentorId?: string;
  assignedMentorName?: string;
  startDate: string;
  targetExamDate: string;
  currentDay: number; // 1 to 30
  targetScore: number;
  baselineScore?: number;
  dailyQuestionTarget?: number;
  lowestDomains?: string[];
  missedDaysCount?: number;
  recalibratedAt?: string;
  isCustomPlanned?: boolean;
  completionRate: number; // 0.0 to 100.0%
  tasks: RoadmapTaskProgress[];
  completedDayNumbers: number[];
  streakDays: number;
  lastActiveDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MasterCurriculumDay {
  id: number;
  dayNumber: number; // 1 to 30
  weekNumber: number; // 1 to 4
  title: string;
  domainFocus: string;
  targetScoreGain: string;
  conceptTitle: string;
  conceptSummary: string;
  conceptMarkdown?: string;
  practiceTitle: string;
  practiceQuestionCount: number;
  practiceSetIds: string[];
  vocabTitle: string;
  vocabWordCount: number;
  vocabWordIds: string[];
  isMockDay: boolean;
  mockTestName?: string;
  mockTestId?: string;
}


