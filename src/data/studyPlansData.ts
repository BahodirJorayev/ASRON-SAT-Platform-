import { StudyPlan } from '../types';

export const SAT_STUDY_PLANS: StudyPlan[] = [
  {
    id: 'plan-30-day-booster',
    title: '30-Day Score Booster (1450+)',
    subtitle: 'Daily 10-Minute High-Yield Foundation',
    targetScore: '1450 - 1520',
    durationDays: 30,
    dailyCommitment: '10 mins / day',
    difficulty: 'ALL_LEVELS',
    iconName: 'Zap',
    description: 'Systematic daily SAT workouts targeting high-frequency grammar boundaries, standard transitions, and core quadratic functions with Desmos shortcuts.',
    curriculum: [
      { day: 1, title: 'Logical Transitions & Clause Connectors', section: 'READING_AND_WRITING', domain: 'Expression of Ideas', targetSkill: 'Transitions', estimatedMinutes: 10, questionCount: 5, isCompleted: true, score: 5 },
      { day: 2, title: 'Punctuation Boundaries & Appositives', section: 'READING_AND_WRITING', domain: 'Standard English Conventions', targetSkill: 'Boundaries', estimatedMinutes: 10, questionCount: 5, isCompleted: true, score: 4 },
      { day: 3, title: 'Quadratic Discriminants & Parabola Vertices', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Nonlinear Equations', estimatedMinutes: 10, questionCount: 5, isCompleted: true, score: 5 },
      { day: 4, title: 'Systems of Equations with Infinite/No Solutions', section: 'MATH', domain: 'Algebra', targetSkill: 'Systems of Linear Equations', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 5, title: 'Words in Context: High-Register Vocabulary', section: 'READING_AND_WRITING', domain: 'Craft and Structure', targetSkill: 'Words in Context', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 6, title: 'Circles in the xy-Plane & Completing the Square', section: 'MATH', domain: 'Geometry and Trigonometry', targetSkill: 'Circles', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 7, title: 'Weekly Review: Mistake Vault Deconstruction', section: 'MIXED', domain: 'Full Section Review', targetSkill: 'Multi-Skill Diagnostics', estimatedMinutes: 12, questionCount: 5, isCompleted: false },
      { day: 8, title: 'Right Triangle Trigonometry & SOH CAH TOA', section: 'MATH', domain: 'Geometry and Trigonometry', targetSkill: 'Right Triangles and Trigonometry', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 9, title: 'Inferences & Command of Evidence', section: 'READING_AND_WRITING', domain: 'Information and Ideas', targetSkill: 'Inferences', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 10, title: 'Linear Function Modeling & Rate of Change', section: 'MATH', domain: 'Algebra', targetSkill: 'Linear Functions', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 11, title: 'Cross-Text Connections & Author Perspective', section: 'READING_AND_WRITING', domain: 'Craft and Structure', targetSkill: 'Cross-Text Connections', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 12, title: 'Percentages, Ratios & Units Conversion', section: 'MATH', domain: 'Problem-Solving and Data Analysis', targetSkill: 'Percentages', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 13, title: 'Rhetorical Synthesis: Bullet-Point Prompts', section: 'READING_AND_WRITING', domain: 'Expression of Ideas', targetSkill: 'Rhetorical Synthesis', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 14, title: 'Mid-Plan Benchmark: Speed Blitz Challenge', section: 'MIXED', domain: 'Adaptive Speed Pacing', targetSkill: 'Rapid Elimination', estimatedMinutes: 8, questionCount: 5, isCompleted: false },
    ]
  },
  {
    id: 'plan-60-day-ivy',
    title: '60-Day Ivy League Mastery (1550+)',
    subtitle: 'Hard Module 2 Adaptive Trap Elimination',
    targetScore: '1550 - 1600',
    durationDays: 60,
    dailyCommitment: '15 mins / day',
    difficulty: 'ADVANCED',
    iconName: 'Trophy',
    description: 'Elite curriculum engineered for top 1% test takers focusing on 800-tier Hard Module 2 math traps, advanced Desmos regressions, and subtle reading traps.',
    curriculum: [
      { day: 1, title: 'High-Order Polynomials & Remainder Theorem', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Nonlinear Equations', estimatedMinutes: 12, questionCount: 5, isCompleted: true, score: 5 },
      { day: 2, title: 'Subtle Parallelism & Modifier Placement', section: 'READING_AND_WRITING', domain: 'Standard English Conventions', targetSkill: 'Boundaries', estimatedMinutes: 10, questionCount: 5, isCompleted: true, score: 5 },
      { day: 3, title: 'Scientific Data Graphs & Dual Hypothesis Verification', section: 'READING_AND_WRITING', domain: 'Information and Ideas', targetSkill: 'Inferences', estimatedMinutes: 12, questionCount: 5, isCompleted: false },
      { day: 4, title: 'Exponential Growth & Constant Decay Models', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Exponential Functions', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 5, title: 'Radical & Rational Equations with Extraneous Roots', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Equivalent Expressions', estimatedMinutes: 12, questionCount: 5, isCompleted: false },
      { day: 6, title: 'Desmos Regression Modeling on Hard Quadratics', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Nonlinear Equations', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 7, title: 'Spaced Repetition: Hard Trap Vault Audit', section: 'MIXED', domain: 'Multi-Domain Review', targetSkill: 'Cognitive Bias Defense', estimatedMinutes: 15, questionCount: 5, isCompleted: false },
    ]
  },
  {
    id: 'plan-14-day-sprint',
    title: '14-Day Rapid Revision Sprint',
    subtitle: 'High-Impact Last-Minute Tune-Up',
    targetScore: '+80 to +120 Pts',
    durationDays: 14,
    dailyCommitment: '12 mins / day',
    difficulty: 'INTERMEDIATE',
    iconName: 'Flame',
    description: 'Fast-paced targeted drill program designed for students testing within 2 weeks to lock down guaranteed points on standard grammar and Desmos tricks.',
    curriculum: [
      { day: 1, title: 'The Top 10 SAT Transition Rules', section: 'READING_AND_WRITING', domain: 'Expression of Ideas', targetSkill: 'Transitions', estimatedMinutes: 10, questionCount: 5, isCompleted: true, score: 4 },
      { day: 2, title: 'Comma Splices, Colons & Semicolons Mastery', section: 'READING_AND_WRITING', domain: 'Standard English Conventions', targetSkill: 'Boundaries', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 3, title: 'Instant Parabola Vertex & Zero Formula Hacks', section: 'MATH', domain: 'Advanced Math', targetSkill: 'Nonlinear Equations', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 4, title: 'Desmos Systems & Linear Intersection Shortcuts', section: 'MATH', domain: 'Algebra', targetSkill: 'Systems of Linear Equations', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
      { day: 5, title: 'Vocabulary Elimination: Connotation & Register', section: 'READING_AND_WRITING', domain: 'Craft and Structure', targetSkill: 'Words in Context', estimatedMinutes: 10, questionCount: 5, isCompleted: false },
    ]
  }
];
