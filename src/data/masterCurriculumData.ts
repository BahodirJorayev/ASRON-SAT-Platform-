import { MasterCurriculumDay, UserRoadmap, RoadmapTaskProgress, User } from '../types';

export const DEFAULT_MASTER_CURRICULUM: MasterCurriculumDay[] = [
  // WEEK 1: FUNDAMENTALS & POINT BLEED ERADICATION (Days 1 - 7)
  {
    id: 1,
    dayNumber: 1,
    weekNumber: 1,
    title: 'Diagnostic Baseline & Sub-Skill Triage',
    domainFocus: 'Diagnostics & Foundations',
    targetScoreGain: '+40 pts',
    conceptTitle: 'Adaptive Digital SAT Structure & MST Mechanics',
    conceptSummary: 'Understand how Module 1 routing determines Module 2 difficulty. Hitting 18+ correct on Module 1 unlocks the high-scoring adaptive band (700-800 ceiling).',
    conceptMarkdown: `### Module 1 Routing Principles
- **Digital SAT MST Logic**: Module 1 has a 50/50 mix of easy, medium, and hard questions.
- **The Routing Threshold**: Getting 18+ correct out of 27 in RW or 15+ out of 22 in Math locks you into the Hard Module 2.
- **Scoring Ceiling**: If routed to Easy Module 2, the maximum achievable section score is capped around 590-620.
- **Rule of Zero Unforced Errors**: Never rush easy questions in Module 1. Treat questions 1–15 with rigorous verification.`,
    practiceTitle: '10-Question Baseline Diagnostic Triage',
    practiceQuestionCount: 10,
    practiceSetIds: ['sqb-diag-01', 'sqb-diag-02', 'sqb-diag-03'],
    vocabTitle: 'Tier 1 SAT Context Vocabulary (15 Core Words)',
    vocabWordCount: 15,
    vocabWordIds: ['v-01', 'v-02', 'v-03'],
    isMockDay: false,
  },
  {
    id: 2,
    dayNumber: 2,
    weekNumber: 1,
    title: 'Transitions Mastery: Nuance vs Contrast',
    domainFocus: 'Expression of Ideas (RW)',
    targetScoreGain: '+30 pts',
    conceptTitle: '4 Logical Transition Categories (Addition, Contrast, Cause, Exemplification)',
    conceptSummary: 'Never look at answer choices first. Read Sentence 1, predict the logical connector (Consequently, However, In fact, Furthermore), then match.',
    conceptMarkdown: `### The 4 Transition Categories
1. **Contrast / Concession**: *However, Nevertheless, Conversely, Despite this, In contrast, On the other hand.*
2. **Cause & Effect / Result**: *Therefore, Thus, Consequently, Accordingly, Hence, As a result.*
3. **Addition / Continuation**: *Furthermore, Moreover, Additionally, In addition, In fact (intensifier).*
4. **Exemplification / Clarification**: *For example, Specifically, That is to say, Namely, In particular.*

**Golden Strategy**: Cover the choices. Paraphrase Sentence 1 and Sentence 2 into plain language. Determine if Idea B agrees with, flips, or explains Idea A.`,
    practiceTitle: '8 Transitions Hard Drill (SQB Practice)',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-trans-01', 'sqb-trans-02'],
    vocabTitle: '15 High-Frequency Academic Connectors & Verbs',
    vocabWordCount: 15,
    vocabWordIds: ['v-04', 'v-05', 'v-06'],
    isMockDay: false,
  },
  {
    id: 3,
    dayNumber: 3,
    weekNumber: 1,
    title: 'Boundaries & Semicolon Precision Drill',
    domainFocus: 'Standard English Conventions (RW)',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Independent Clauses, FANBOYS & Run-on Eradication',
    conceptSummary: 'Master the 4 ways to join two independent clauses: Period [.], Semicolon [;], Comma + FANBOYS [, and], or Em-Dash [—]. Never use a lone comma.',
    conceptMarkdown: `### Clause Boundary Matrix
- **Rule 1**: $[\text{Independent Clause}] + \mathbf{;} + [\text{Independent Clause}]$
- **Rule 2**: $[\text{Independent Clause}] + \mathbf{, \text{ FANBOYS}} + [\text{Independent Clause}]$
- **Rule 3**: $[\text{Dependent Clause}] + \mathbf{,} + [\text{Independent Clause}]$ (No semicolon!)
- **Semicolons vs Periods**: On the SAT, semicolons and periods are grammatically identical. If choice A has a semicolon and choice B has a period with the same words, both are wrong!`,
    practiceTitle: '10 Boundaries & Punctuation Traps (SQB Drill)',
    practiceQuestionCount: 10,
    practiceSetIds: ['sqb-bound-01', 'sqb-bound-02'],
    vocabTitle: '15 Tone & Rhetorical Precision Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-07', 'v-08', 'v-09'],
    isMockDay: false,
  },
  {
    id: 4,
    dayNumber: 4,
    weekNumber: 1,
    title: 'Nonlinear Equations: Discriminant Shortcuts',
    domainFocus: 'Advanced Math',
    targetScoreGain: '+40 pts',
    conceptTitle: 'Quadratic Discriminant $\\Delta = b^2 - 4ac$ & Vertex Form',
    conceptSummary: 'Instant determination of 0, 1, or 2 real solutions without solving the quadratic equation. Convert standard to vertex form $y = a(x - h)^2 + k$.',
    conceptMarkdown: `### The Discriminant Rules
For $ax^2 + bx + c = 0$:
- $\\Delta = b^2 - 4ac > 0 \\implies$ **2 distinct real solutions** (intersects x-axis twice)
- $\\Delta = b^2 - 4ac = 0 \\implies$ **1 real repeated solution** (tangent to x-axis, vertex on x-axis)
- $\\Delta = b^2 - 4ac < 0 \\implies$ **0 real solutions** (no x-intercepts)

**Sum & Product of Roots**:
- Sum of roots $= -\\frac{b}{a}$
- Product of roots $= \\frac{c}{a}$
- Vertex x-coordinate $h = -\\frac{b}{2a}$, minimum/maximum value $k = f(h)$.`,
    practiceTitle: '8 Advanced Quadratics & Vertex Problems',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-quad-01', 'sqb-quad-02'],
    vocabTitle: '15 High-Yield Descriptive Adjectives',
    vocabWordCount: 15,
    vocabWordIds: ['v-10', 'v-11', 'v-12'],
    isMockDay: false,
  },
  {
    id: 5,
    dayNumber: 5,
    weekNumber: 1,
    title: 'Mistake Vault SRS Stage 1 Clearance',
    domainFocus: 'Metacognition & Leitner SRS',
    targetScoreGain: '+25 pts',
    conceptTitle: 'The 3 Flaw Types: Conceptual, Trap/Pacing, or Calculation',
    conceptSummary: 'Classify every mistake in your vault. Re-solve missed questions without peeking at answers to move them from Box 1 to Box 2.',
    conceptMarkdown: `### The Leitner 3-Box System
- **Box 1 (Daily Review)**: Questions missed within the last 48 hours. Requires 2 consecutive correct solutions to advance.
- **Box 2 (Weekly Check)**: Questions cleared once. Reviewed every 7 days.
- **Box 3 (Permanent Mastery)**: Flawless recall under timed pressure (under 45 seconds).

**Root Cause Tagging**:
1. *Trap Recognition*: Fell for extreme wording or tempting decoy.
2. *Algebraic Arithmetic*: Calculation or sign error (+/-).
3. *Domain Knowledge*: Formula or grammar rule not memorized.`,
    practiceTitle: 'Clear All Active Mistake Vault SRS Items',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-srs-01'],
    vocabTitle: '15 Contrasting Vocabulary Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-13', 'v-14', 'v-15'],
    isMockDay: false,
  },
  {
    id: 6,
    dayNumber: 6,
    weekNumber: 1,
    title: 'Desmos Regression & Vertex Calculations',
    domainFocus: 'Math Tools & Speed',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Desmos Regression Operator `~` and Sliders',
    conceptSummary: 'Use `y1 ~ mx1 + b` or `y1 ~ a(x1 - h)^2 + k` to instantly find unknown constants without manual algebraic expansion.',
    conceptMarkdown: `### Essential Desmos Syntax for SAT
1. **Linear Regression**: Enter table $(x_1, y_1)$, then type $y_1 \\sim m x_1 + b$. Desmos calculates $m$ and $b$ instantly.
2. **System of Equations**: Type both equations directly into separate lines. Click the intersection point to reveal $(x, y)$.
3. **Finding Number of Solutions**: Graph $y = \\text{Left Side}$ and $y = \\text{Right Side}$. Count the intersection points on screen!
4. **Percentage / Word Problems**: Define functions $f(x) = 1.05x$ and evaluate $f(400)$.`,
    practiceTitle: '8 Hard Desmos-Accelerated Math Questions',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-desmos-01', 'sqb-desmos-02'],
    vocabTitle: '15 Scientific & Academic Research Terms',
    vocabWordCount: 15,
    vocabWordIds: ['v-16', 'v-17', 'v-18'],
    isMockDay: false,
  },
  {
    id: 7,
    dayNumber: 7,
    weekNumber: 1,
    title: 'Weekly Milestone Check: 10-Item Timed Sprint',
    domainFocus: 'Weekly Assessment Checkpoint',
    targetScoreGain: '+50 pts',
    conceptTitle: 'Week 1 Synthesis: Pacing & Execution Protocol',
    conceptSummary: 'Benchmark your first week of gains under strict 75-second-per-question countdown constraints.',
    conceptMarkdown: `### Week 1 Checkpoint Objectives
- Confirm 0 errors on Transitions & Semicolon boundaries.
- Confirm 100% accuracy on standard quadratic vertex questions using Desmos.
- Log all edge-case slips directly into the Mistake Vault with Socratic breakdown.`,
    practiceTitle: 'Week 1 Timed Sprint Assessment (10 Questions)',
    practiceQuestionCount: 10,
    practiceSetIds: ['sqb-sprint-w1'],
    vocabTitle: 'Week 1 Vocab Review (Cumulative 90 Words)',
    vocabWordCount: 15,
    vocabWordIds: ['v-w1-all'],
    isMockDay: true,
    mockTestName: 'Week 1 Milestone Assessment (Module 1 Sprint)',
    mockTestId: 'mock-w1-sprint',
  },

  // WEEK 2: ADVANCED CONCEPTS & DESMOS POWER-HACKS (Days 8 - 14)
  {
    id: 8,
    dayNumber: 8,
    weekNumber: 2,
    title: 'Circle Equation Intersections & Arc Geometry',
    domainFocus: 'Geometry & Trigonometry',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Standard Circle Form $(x - h)^2 + (y - k)^2 = r^2$ and Completing the Square',
    conceptSummary: 'Find center $(h, k)$ and radius $r$. For $x^2 + y^2 + Ax + By + C = 0$, complete square or use Desmos to click center/radius directly.',
    conceptMarkdown: `### Circle Equation Mastery
- Standard Equation: $(x - h)^2 + (y - k)^2 = r^2$
- **Center**: $(h, k)$, **Radius**: $r = \\sqrt{r^2}$
- **Arc Length**: $s = r\\theta$ (where $\\theta$ is in radians) or $s = \\frac{\\theta}{360} \\times 2\\pi r$
- **Sector Area**: $A = \\frac{1}{2}r^2\\theta$ (radians) or $A = \\frac{\\theta}{360} \\times \\pi r^2$
- **Desmos Tip**: Type the non-standard circle equation directly into Desmos. Look at the bounding box to read center and radius instantly!`,
    practiceTitle: '8 Circle & Arc Length Hard Questions',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-circ-01', 'sqb-circ-02'],
    vocabTitle: '15 Vocabulary Words for Scientific Literature',
    vocabWordCount: 15,
    vocabWordIds: ['v-19', 'v-20'],
    isMockDay: false,
  },
  {
    id: 9,
    dayNumber: 9,
    weekNumber: 2,
    title: 'Rhetorical Synthesis Note Extraction',
    domainFocus: 'Craft & Structure (RW)',
    targetScoreGain: '+25 pts',
    conceptTitle: 'Targeted Scanning for Bullet Point Prompts',
    conceptSummary: 'Read the prompt question first (the last sentence). Never read all bullet points from top to bottom before knowing the exact goal.',
    conceptMarkdown: `### The 3-Step Rhetorical Synthesis Hack
1. **Step 1: Read ONLY the Prompt Question** (e.g., *"The student wants to emphasize a difference between the two species."*).
2. **Step 2: Identify Key Constraint Words** (e.g., *difference, similarity, generalize findings, introduce to new audience*).
3. **Step 3: Eliminate Choices that violate the prompt**:
   - If prompt wants a *contrast*, eliminate choices with no contrast words.
   - If prompt wants to *introduce*, eliminate choices assuming prior knowledge.`,
    practiceTitle: '8 Bulleted Synthesis Questions (SQB Drill)',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-synth-01'],
    vocabTitle: '15 High-Register SAT Synonyms',
    vocabWordCount: 15,
    vocabWordIds: ['v-21', 'v-22'],
    isMockDay: false,
  },
  {
    id: 10,
    dayNumber: 10,
    weekNumber: 2,
    title: 'Trigonometry & Unit Circle SOH-CAH-TOA',
    domainFocus: 'Geometry & Trigonometry',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Complementary Angle Theorem: $\\sin(x) = \\cos(90^\\circ - x)$',
    conceptSummary: 'Whenever $\\sin(A) = \\cos(B)$ in a right triangle, $A + B = 90^\\circ$ (or $\\frac{\\pi}{2}$ radians). Memorize special right triangles $30-60-90$ and $45-45-90$.',
    conceptMarkdown: `### Key Trigonometric Identities
- $\\sin(\\theta) = \\frac{\\text{Opposite}}{\\text{Hypotenuse}}, \\quad \\cos(\\theta) = \\frac{\\text{Adjacent}}{\\text{Hypotenuse}}, \\quad \\tan(\\theta) = \\frac{\\text{Opposite}}{\\text{Adjacent}}$
- **Complementary Angles Rule**: $\\sin(x) = \\cos(90^\\circ - x)$ and $\\cos(x) = \\sin(90^\\circ - x)$
- Radians to Degrees: $\\text{Degrees} = \\text{Radians} \\times \\frac{180}{\\pi}$
- Pythagorean Identity: $\\sin^2(\\theta) + \\cos^2(\\theta) = 1$`,
    practiceTitle: '8 Right Triangle & Trig Hard Problems',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-trig-01'],
    vocabTitle: '15 Nuanced Evaluative Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-23', 'v-24'],
    isMockDay: false,
  },
  {
    id: 11,
    dayNumber: 11,
    weekNumber: 2,
    title: 'Hard Reading: Dual-Text Paired Inference',
    domainFocus: 'Information & Ideas (RW)',
    targetScoreGain: '+35 pts',
    conceptTitle: 'Text 1 vs Text 2 Argument Mapping',
    conceptSummary: 'Map the stance of Author 1 and Author 2 in 4 words: (e.g., "T1: Pro-solar tech" vs "T2: High cost limitation"). Identify exact point of contention.',
    conceptMarkdown: `### Paired Text Strategy
- **Step 1**: Read Text 1 only. Summarize main claim in 1 phrase.
- **Step 2**: Read Text 2. Ask: Does Author 2 *agree, qualify, extend,* or *refute* Author 1?
- **Step 3**: Answer Question: "How would the author of Text 2 respond to Text 1?"
- **Trap Warning**: Beware choices that accurately describe Text 1 but do not represent Text 2's specific critique.`,
    practiceTitle: '6 Paired Text Cross-Inference Passages',
    practiceQuestionCount: 6,
    practiceSetIds: ['sqb-paired-01'],
    vocabTitle: '15 High-Frequency Literary & Philosophical Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-25', 'v-26'],
    isMockDay: false,
  },
  {
    id: 12,
    dayNumber: 12,
    weekNumber: 2,
    title: 'Mistake Vault SRS Stage 2 Review (Day 7 Clearance)',
    domainFocus: 'Metacognition & Error Eradication',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Second-Pass Error Elimination',
    conceptSummary: 'Review all questions missed during Week 1 practice and sprint. Re-solve under 40-second speed constraints.',
    conceptMarkdown: `### Error Clearance Checklist
- Verify no repeat errors on Complementary Trig identities.
- Check that all Circle equations in your vault have been solved using both algebraic and Desmos methods.
- Promote successfully solved questions to Box 3 (Mastered).`,
    practiceTitle: 'Mistake Vault Box 2 Flash Clearance Drill',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-srs-02'],
    vocabTitle: '15 Words with Secondary/Uncommon Meanings',
    vocabWordCount: 15,
    vocabWordIds: ['v-27', 'v-28'],
    isMockDay: false,
  },
  {
    id: 13,
    dayNumber: 13,
    weekNumber: 2,
    title: 'Probability & Contingency Table Statistics',
    domainFocus: 'Problem Solving & Data Analysis',
    targetScoreGain: '+25 pts',
    conceptTitle: 'Conditional Probability & "Given that" Denominators',
    conceptSummary: 'Whenever a problem says "Given that the person is in Group X", the denominator is restricted ONLY to the total of Group X, not the grand total.',
    conceptMarkdown: `### Statistical Formulations
- **Conditional Probability**: $P(A \\mid B) = \\frac{\\text{Count}(A \\text{ and } B)}{\\text{Total in Group } B}$
- **Mean vs Median with Outliers**: Extreme high outliers pull the *Mean* upward, but leave the *Median* relatively unchanged.
- **Margin of Error**: Larger sample size $n \\implies$ Smaller margin of error. Random sampling is required to generalize results to the population.`,
    practiceTitle: '8 Two-Way Tables & Data Analysis Questions',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-stat-01'],
    vocabTitle: '15 Analytical & Quantitative Vocabulary Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-29', 'v-30'],
    isMockDay: false,
  },
  {
    id: 14,
    dayNumber: 14,
    weekNumber: 2,
    title: 'Full Bluebook Practice Test #1 (2-Stage MST)',
    domainFocus: 'Bluebook Adaptive Simulation',
    targetScoreGain: '+60 pts',
    conceptTitle: 'Full 2-Stage Multi-Stage Adaptive Simulation (RW + Math)',
    conceptSummary: 'Complete an official adaptive mock exam. Simulate real test conditions: 64 min RW + 70 min Math with 10-minute break.',
    conceptMarkdown: `### Bluebook Test #1 Execution Protocol
1. **Module 1 Time Allocation**:
   - RW Module 1: 27 questions in 32 minutes (average 1.1 min/question).
   - Math Module 1: 22 questions in 35 minutes (average 1.5 min/question).
2. **Break Time**: Use the full 10-minute break for hydration and mental reset.
3. **Hard Module Verification**: Check diagnostic results to confirm Hard Module 2 routing for both sections.`,
    practiceTitle: 'Complete Full Bluebook Adaptive Mock Test #1',
    practiceQuestionCount: 54,
    practiceSetIds: ['mock-bluebook-01'],
    vocabTitle: 'Mid-Point Vocabulary Review (180 Words Mastered)',
    vocabWordCount: 20,
    vocabWordIds: ['v-mid-all'],
    isMockDay: true,
    mockTestName: 'Full Adaptive Bluebook Practice Test #1',
    mockTestId: 'bluebook-test-1',
  },

  // WEEK 3: SPEED, STRATEGY & ADAPTIVE ROUTING (Days 15 - 21)
  {
    id: 15,
    dayNumber: 15,
    weekNumber: 3,
    title: 'Cross-Text Connections & Vocabulary Nuances',
    domainFocus: 'Craft & Structure (RW)',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Context Clues & Secondary Meanings in Advanced Passages',
    conceptSummary: 'How to decode high-register vocabulary in historical and academic texts using contrast markers and appositive definitions.',
    conceptMarkdown: `### Context Clue Taxonomy
- **Definition in Apposition**: The text defines the word between commas or dashes.
- **Antonym Contrast**: A contrast word reveals the target word must mean the opposite of a known word.
- **Degree of Intensity**: Distinguish subtle shades of meaning (e.g., *skeptical* vs *cynical*, *innovative* vs *revolutionary*).`,
    practiceTitle: '8 Advanced Words-in-Context Passages',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-vocab-adv-01'],
    vocabTitle: '15 High-Level Historical Vocabulary Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-31', 'v-32'],
    isMockDay: false,
  },
  {
    id: 16,
    dayNumber: 16,
    weekNumber: 3,
    title: 'Exponential Growth vs Linear Decay Modeling',
    domainFocus: 'Advanced Math',
    targetScoreGain: '+25 pts',
    conceptTitle: 'Exponential Form $f(x) = a(1 \\pm r)^{\\frac{x}{k}}$ and Half-Life Models',
    conceptSummary: 'Identify initial value $a$, percentage rate $r$, and time exponent interval $k$. Differentiate constant addition (linear) from constant ratio (exponential).',
    conceptMarkdown: `### Exponential Functions Reference
- **Standard Formula**: $y = a(b)^x = a(1 + r)^x$ (growth) or $a(1 - r)^x$ (decay)
- **Time Scaling**: If growth occurs every $k$ hours, exponent is $\\frac{t}{k}$.
  $$y = a(1 + r)^{\\frac{t}{k}}$$
- **Half-Life Equation**: $N(t) = N_0 \\left(\\frac{1}{2}\\right)^{\\frac{t}{t_{1/2}}}$
- **Desmos Tip**: Graph the model and the given $(x, y)$ coordinate points to confirm the curve passes directly through them.`,
    practiceTitle: '8 Exponential Word Problems & Percent Models',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-exp-01'],
    vocabTitle: '15 Quantitative Reasoning Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-33', 'v-34'],
    isMockDay: false,
  },
  {
    id: 17,
    dayNumber: 17,
    weekNumber: 3,
    title: 'Grammar Modifiers & Dangling Participles',
    domainFocus: 'Standard English Conventions (RW)',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Introductory Participial Phrases & Subject Matching',
    conceptSummary: 'When a sentence begins with a modifying phrase (e.g., "Walking into the room,"), the noun immediately following the comma MUST be the person/thing doing that action.',
    conceptMarkdown: `### Modifier Placement Rules
- **Rule**: $[\text{Modifying Phrase}] , \\mathbf{[\text{Immediate Subject Doing Action}]} + [\\text{Rest of Sentence}]$
- **Wrong**: *Having won the championship, the trophy was awarded to Sarah.* (The trophy did not win the championship!)
- **Correct**: *Having won the championship, Sarah was awarded the trophy.*
- **Relative Clauses**: Keep "which", "who", and "that" as close as possible to the noun they modify.`,
    practiceTitle: '8 Dangling Modifiers & Parallel Structure Drills',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-mod-01'],
    vocabTitle: '15 High-Yield Stylistic Terms',
    vocabWordCount: 15,
    vocabWordIds: ['v-35', 'v-36'],
    isMockDay: false,
  },
  {
    id: 18,
    dayNumber: 18,
    weekNumber: 3,
    title: 'System of Inequalities & Shaded Regions',
    domainFocus: 'Algebra',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Feasible Region Optimization & Boundary Line Analysis',
    conceptSummary: 'Graphing multi-variable constraints on Desmos. Identifying vertices of overlapping shaded polygons and maximum/minimum profit points.',
    conceptMarkdown: `### Inequality Shortcuts
- Solid line vs Dashed line: $\\le, \\ge$ is solid, $<, >$ is dashed.
- In Desmos, type systems like $y > 2x - 3$ and $x + 3y \\le 12$. Look at the darkest overlapping region.
- Point Testing: Substitute test point $(0,0)$ to verify shading direction.`,
    practiceTitle: '8 Systems of Inequalities & Word Scenarios',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-ineq-01'],
    vocabTitle: '15 Complex Logical Connectors',
    vocabWordCount: 15,
    vocabWordIds: ['v-37', 'v-38'],
    isMockDay: false,
  },
  {
    id: 19,
    dayNumber: 19,
    weekNumber: 3,
    title: 'AI Cloned Variant Mastery Session',
    domainFocus: 'AI-Generated Adaptive Variants',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Solving High-Difficulty Variant Clones of Your Historical Errors',
    conceptSummary: 'Generate parallel algorithmic clones of questions previously missed in Bluebook Test #1 to test true conceptual transfer.',
    conceptMarkdown: `### Deep Transfer Protocol
- Re-solving the exact same question tests memory; solving an AI variant tests transfer.
- Change numbers, context, and variable names while retaining identical underlying structural logic.
- Target: Solve 5 variants with 100% accuracy within 5 minutes.`,
    practiceTitle: '5 AI-Cloned Variant Challenge Questions',
    practiceQuestionCount: 5,
    practiceSetIds: ['sqb-ai-variants-01'],
    vocabTitle: '15 Advanced Rhetorical Vocabulary Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-39', 'v-40'],
    isMockDay: false,
  },
  {
    id: 20,
    dayNumber: 20,
    weekNumber: 3,
    title: 'Time Pressure Speed Drills (45 sec / item)',
    domainFocus: 'Pacing & Endurance',
    targetScoreGain: '+20 pts',
    conceptTitle: 'The 45-Second Quick-Decision Framework',
    conceptSummary: 'Train rapid elimination of 2 obvious decoy choices within 10 seconds. Flag and move on if stalled past 60 seconds.',
    conceptMarkdown: `### Pacing Guardrails
- **Easy Questions (1-10)**: 35-45 seconds max. Bank time for hard questions.
- **Medium Questions (11-18)**: 55-65 seconds.
- **Hard Questions (19-27/22)**: 90-120 seconds.
- **Stall Rule**: If no clear solution path after 40 seconds, pick best guess, flag, and return at the end.`,
    practiceTitle: '12-Question Rapid Fire Pacing Drill',
    practiceQuestionCount: 12,
    practiceSetIds: ['sqb-speed-01'],
    vocabTitle: '15 Fast-Recall Flashcard Drills',
    vocabWordCount: 15,
    vocabWordIds: ['v-41', 'v-42'],
    isMockDay: false,
  },
  {
    id: 21,
    dayNumber: 21,
    weekNumber: 3,
    title: 'Full Bluebook Practice Test #2 (2-Stage MST)',
    domainFocus: 'Bluebook Adaptive Simulation',
    targetScoreGain: '+50 pts',
    conceptTitle: 'Adaptive Hard Route Consistency Check',
    conceptSummary: 'Take official Practice Test #2. Aim for 720+ section benchmarks with zero timing panics.',
    conceptMarkdown: `### Goals for Mock Test #2
- Verify Module 2 Hard lock for both sections.
- Target score: 1450 - 1520 band.
- Zero arithmetic sign errors in Math grid-ins.`,
    practiceTitle: 'Complete Full Bluebook Adaptive Mock Test #2',
    practiceQuestionCount: 54,
    practiceSetIds: ['mock-bluebook-02'],
    vocabTitle: 'Week 3 Vocabulary Consolidation (270 Words)',
    vocabWordCount: 15,
    vocabWordIds: ['v-w3-all'],
    isMockDay: true,
    mockTestName: 'Full Adaptive Bluebook Practice Test #2',
    mockTestId: 'bluebook-test-2',
  },

  // WEEK 4: FINAL MOCK SPRINT & 1500+ SCORE LOCK (Days 22 - 30)
  {
    id: 22,
    dayNumber: 22,
    weekNumber: 4,
    title: 'Mistake Vault SRS Stage 3 Final Clearance',
    domainFocus: 'Mistake Vault & Zero-Error Lock',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Leitner Box 3 Zero-Out Sprint',
    conceptSummary: 'Clear out all remaining items from Box 1 and Box 2 in your Mistake Vault. Every past error must have an articulate written reflection.',
    conceptMarkdown: `### Permanent Retention Drill
- Every question in the vault must be re-solved cleanly without scratchpaper stumbles.
- Verify exact trap mechanism for every distractor choice.`,
    practiceTitle: 'Final Mistake Vault Sweep (All Pending Items)',
    practiceQuestionCount: 10,
    practiceSetIds: ['sqb-srs-final'],
    vocabTitle: '15 High-Difficulty Contextual Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-43', 'v-44'],
    isMockDay: false,
  },
  {
    id: 23,
    dayNumber: 23,
    weekNumber: 4,
    title: 'Hardest Grid-In Student-Produced Response Pitfalls',
    domainFocus: 'Math Precision',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Grid-In Rules: Fractions vs Decimals and Negative Numbers',
    conceptSummary: 'Digital SAT allows negative numbers in student-produced responses. Format fractions cleanly (e.g., 7/9 instead of rounded decimal .7777).',
    conceptMarkdown: `### Student-Produced Response Rules
- Can enter up to 5 characters (including negative sign and decimal/slash).
- If entering decimal for $\\frac{2}{3}$, must fill all spaces: $.6667$ or $0.667$. Best practice: just type $2/3$!
- Do NOT enter mixed numbers: write $3.5$ or $7/2$, NOT $3\\ 1/2$ (which is read as $31/2$).`,
    practiceTitle: '8 Hard Grid-In Math Challenge Problems',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-gridin-01'],
    vocabTitle: '15 SAT Top Tier Vocabulary Finalists',
    vocabWordCount: 15,
    vocabWordIds: ['v-45', 'v-46'],
    isMockDay: false,
  },
  {
    id: 24,
    dayNumber: 24,
    weekNumber: 4,
    title: 'Extreme Reading Poetry & Scientific Tables',
    domainFocus: 'Information & Ideas (RW)',
    targetScoreGain: '+20 pts',
    conceptTitle: '19th Century Poetry Interpretation & Scientific Table Reading',
    conceptSummary: 'Deconstruct archaic poetic syntax (inverted word order). For scientific tables, locate independent vs dependent variables on axes.',
    conceptMarkdown: `### Archaic Poetry Decryption
1. **Un-invert the sentence**: Put subject, verb, and object back in standard order.
2. **Translate metaphors**: Identify what physical object symbolizes what abstract emotional state.
3. **Table Data**: Look for general trends, anomalies, and exact matching row/column intersection.`,
    practiceTitle: '6 Difficult Poetry & Data Interpretation Passages',
    practiceQuestionCount: 6,
    practiceSetIds: ['sqb-poetry-01'],
    vocabTitle: '15 Poetic & Philosophical Vocabulary Words',
    vocabWordCount: 15,
    vocabWordIds: ['v-47', 'v-48'],
    isMockDay: false,
  },
  {
    id: 25,
    dayNumber: 25,
    weekNumber: 4,
    title: 'Official Desmos Shortcuts Final Review',
    domainFocus: 'Desmos Power Tools',
    targetScoreGain: '+20 pts',
    conceptTitle: 'Complete Speed Cheat Sheet: Sliders, Functions & Tables',
    conceptSummary: 'Final review of all 12 Desmos shortcuts that turn 3-minute algebra questions into 15-second visual clicks.',
    conceptMarkdown: `### The 12 Essential Desmos Hacks
1. Intersecting curves for solution count.
2. Direct system solver without substitution.
3. Finding minimum/maximum of quadratic $y = ax^2 + bx + c$ by clicking vertex.
4. $y_1 \\sim mx_1 + b$ regression for linear equations.
5. Evaluating complex nested functions $f(g(x))$.`,
    practiceTitle: '8 Desmos Final Polish Questions',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-desmos-final'],
    vocabTitle: '15 SAT High-Impact Flashcard Terms',
    vocabWordCount: 15,
    vocabWordIds: ['v-49', 'v-50'],
    isMockDay: false,
  },
  {
    id: 26,
    dayNumber: 26,
    weekNumber: 4,
    title: 'Full Final Bluebook Simulation (Test #3)',
    domainFocus: 'Bluebook Adaptive Simulation',
    targetScoreGain: '+40 pts',
    conceptTitle: 'Final Full-Length Adaptive Exam Simulation',
    conceptSummary: 'Execute official Mock Test #3 in a quiet environment matching your actual exam morning conditions.',
    conceptMarkdown: `### Test Day Simulation Protocol
- Start at 8:00 AM sharp.
- Use only the allowed calculator / on-screen Desmos.
- Target: 1530+ composite score.`,
    practiceTitle: 'Complete Full Bluebook Adaptive Mock Test #3',
    practiceQuestionCount: 54,
    practiceSetIds: ['mock-bluebook-03'],
    vocabTitle: 'Full 350-Word Master Deck Speed Review',
    vocabWordCount: 25,
    vocabWordIds: ['v-master-all'],
    isMockDay: true,
    mockTestName: 'Full Adaptive Bluebook Practice Test #3',
    mockTestId: 'bluebook-test-3',
  },
  {
    id: 27,
    dayNumber: 27,
    weekNumber: 4,
    title: 'Error Vault Zero-Out Sprint',
    domainFocus: 'Error Vault Mastery',
    targetScoreGain: '+30 pts',
    conceptTitle: 'Total Vault Clearance & Flawless Execution',
    conceptSummary: 'Review every single question ever answered incorrectly on this platform. Ensure 100% mastery.',
    conceptMarkdown: `### The Clean Slate Principle
- Box 1: 0 items.
- Box 2: 0 items.
- Box 3: 100% of historical misses mastered and archived.`,
    practiceTitle: 'Targeted Review of 8 Most Challenging Historical Questions',
    practiceQuestionCount: 8,
    practiceSetIds: ['sqb-srs-zero'],
    vocabTitle: '15 High-Frequency Final Vocabulary Polish',
    vocabWordCount: 15,
    vocabWordIds: ['v-final-1'],
    isMockDay: false,
  },
  {
    id: 28,
    dayNumber: 28,
    weekNumber: 4,
    title: 'Pre-Test Psychological Warmup & Strategy',
    domainFocus: 'Strategy & Test Readiness',
    targetScoreGain: 'Target: 1530+',
    conceptTitle: 'Exam Day Mindset, Timing Protocols & Adrenaline Control',
    conceptSummary: 'Mental conditioning, sleep scheduling, breakfast nutrition, and test room pacing strategy.',
    conceptMarkdown: `### Exam Eve & Morning Protocols
1. **Sleep**: 8+ hours of sleep for 3 consecutive nights prior.
2. **Breakfast**: Low-glycemic index protein and complex carbs (avoid sugar crashes).
3. **Warm-up**: Do 3 easy Math and 2 easy RW questions on exam morning just to get brain firing before Section 1.
4. **Adrenaline Reframing**: Treat racing heart as excitement and readiness, not anxiety.`,
    practiceTitle: 'Light 5-Question Confidence Booster Drill',
    practiceQuestionCount: 5,
    practiceSetIds: ['sqb-confidence-01'],
    vocabTitle: 'Confidence Vocab Quick Fire (15 Words)',
    vocabWordCount: 15,
    vocabWordIds: ['v-final-2'],
    isMockDay: false,
  },
  {
    id: 29,
    dayNumber: 29,
    weekNumber: 4,
    title: 'Formula Sheet & Rule Digest Final Sweep',
    domainFocus: 'Formula Reference & Strategy',
    targetScoreGain: 'Formula Lock',
    conceptTitle: 'Geometric Formulas, Circle Rules & Grammar Laws Checklist',
    conceptSummary: 'Final active recall test on all 24 core SAT math formulas and 10 grammar laws.',
    conceptMarkdown: `### Master Formula Checklist
- Area of equilateral triangle: $A = \\frac{\\sqrt{3}}{4}s^2$
- Vertex formula: $h = -\\frac{b}{2a}$
- Semicolons vs Colons vs Em-dashes
- Subject-Verb Agreement with prepositional phrases`,
    practiceTitle: 'Formula & Grammar Quick Verification Checklist',
    practiceQuestionCount: 5,
    practiceSetIds: ['sqb-formulas-01'],
    vocabTitle: 'Key SAT Words Final Sweep',
    vocabWordCount: 15,
    vocabWordIds: ['v-final-3'],
    isMockDay: false,
  },
  {
    id: 30,
    dayNumber: 30,
    weekNumber: 4,
    title: 'Test Day Readiness & Peak Performance Lock',
    domainFocus: 'Final Mastery Benchmark',
    targetScoreGain: '1500+ Ready',
    conceptTitle: 'You Are Ready: The 30-Day Transformation Complete',
    conceptSummary: 'Celebrate 30 days of consistent deliberate practice, hundreds of mastered questions, and 3 completed adaptive mocks.',
    conceptMarkdown: `### Final Words of Confidence
You have completed the full 30-Day OnePrep Roadmap. You have eliminated point bleeds, mastered Desmos, conquered difficult dual-texts, and disciplined your pacing. Trust your preparation and execute!`,
    practiceTitle: 'Review Personalized Flashcards & Strategy Notes',
    practiceQuestionCount: 0,
    practiceSetIds: [],
    vocabTitle: 'Final Vocabulary Badge Unlocked',
    vocabWordCount: 15,
    vocabWordIds: ['v-final-all'],
    isMockDay: true,
    mockTestName: 'Final Official SAT Exam Benchmark',
    mockTestId: 'sat-official-day',
  },
];

const STORAGE_CURRICULUM_KEY = 'oneprep_master_curriculum_days_v1';
const STORAGE_ROADMAP_KEY = 'oneprep_user_roadmap_state_v1';

export function getMasterCurriculum(): MasterCurriculumDay[] {
  try {
    const saved = localStorage.getItem(STORAGE_CURRICULUM_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading master curriculum from localStorage:', err);
  }
  return DEFAULT_MASTER_CURRICULUM;
}

export function saveMasterCurriculum(curriculum: MasterCurriculumDay[]): void {
  try {
    localStorage.setItem(STORAGE_CURRICULUM_KEY, JSON.stringify(curriculum));
  } catch (err) {
    console.error('Error saving master curriculum:', err);
  }
}

export function resetMasterCurriculum(): MasterCurriculumDay[] {
  try {
    localStorage.removeItem(STORAGE_CURRICULUM_KEY);
  } catch (err) {
    console.error('Error resetting master curriculum:', err);
  }
  return DEFAULT_MASTER_CURRICULUM;
}

export function initializeUserRoadmap(user: User, customExamDate?: string): UserRoadmap {
  const curriculum = getMasterCurriculum();
  
  // Calculate target exam date 42 days in future or custom
  const targetDate = customExamDate || new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString();
  
  const tasks: RoadmapTaskProgress[] = [];
  
  curriculum.forEach((day) => {
    // Task 1: Concept
    tasks.push({
      id: `task-${day.dayNumber}-concept`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: 'CONCEPT_READING',
      title: `Concept: ${day.conceptTitle}`,
      description: day.conceptSummary,
      targetDomain: day.domainFocus,
      isCompleted: day.dayNumber <= 4, // Default seed first few days
      completedAt: day.dayNumber <= 4 ? new Date().toISOString() : undefined,
    });
    
    // Task 2: Targeted Practice
    tasks.push({
      id: `task-${day.dayNumber}-practice`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: day.isMockDay ? 'FULL_MOCK' : 'PRACTICE_SET',
      title: day.isMockDay ? `Adaptive Mock: ${day.mockTestName || day.practiceTitle}` : `Practice: ${day.practiceTitle}`,
      description: day.isMockDay ? 'Simulate 2-Stage Multi-Stage Adaptive Module' : `Solve ${day.practiceQuestionCount} questions`,
      targetDomain: day.domainFocus,
      itemCount: day.practiceQuestionCount,
      isCompleted: day.dayNumber <= 4,
      completedAt: day.dayNumber <= 4 ? new Date().toISOString() : undefined,
    });
    
    // Task 3: Vocab
    tasks.push({
      id: `task-${day.dayNumber}-vocab`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: 'VOCAB',
      title: `Vocab: ${day.vocabTitle}`,
      description: `Review ${day.vocabWordCount} SAT words`,
      itemCount: day.vocabWordCount,
      isCompleted: day.dayNumber <= 3,
      completedAt: day.dayNumber <= 3 ? new Date().toISOString() : undefined,
    });
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const completedDayNumbers: number[] = [];
  for (let d = 1; d <= 30; d++) {
    const dayTasks = tasks.filter((t) => t.dayNumber === d);
    if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
      completedDayNumbers.push(d);
    }
  }

  const initialRoadmap: UserRoadmap = {
    id: `roadmap-${user.id}`,
    userId: user.id,
    planTier: user.planTier || 'STANDARD',
    isAutoGenerated: user.planTier === 'PRO' || user.planTier === 'VIP',
    startDate: new Date().toISOString(),
    targetExamDate: targetDate,
    currentDay: 5,
    targetScore: user.targetScore || 1500,
    dailyQuestionTarget: 8,
    completionRate,
    tasks,
    completedDayNumbers,
    streakDays: user.streakDays || 5,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return initialRoadmap;
}

export function getUserRoadmap(user: User): UserRoadmap {
  try {
    const key = `${STORAGE_ROADMAP_KEY}_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed: UserRoadmap = JSON.parse(saved);
      return parsed;
    }
  } catch (err) {
    console.error('Error loading user roadmap:', err);
  }
  
  const fresh = initializeUserRoadmap(user);
  saveUserRoadmap(fresh);
  return fresh;
}

export function saveUserRoadmap(roadmap: UserRoadmap): void {
  try {
    const key = `${STORAGE_ROADMAP_KEY}_${roadmap.userId}`;
    localStorage.setItem(key, JSON.stringify(roadmap));
  } catch (err) {
    console.error('Error saving user roadmap:', err);
  }
}
