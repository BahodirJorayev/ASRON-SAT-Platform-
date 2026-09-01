import { User, Question, MockTest, MistakeVaultItem, Chat, Message, PaymentReceipt, LandingConfig, TelegramNotification } from '../types';
import { CREATIVE_AVATARS } from './creativeAvatars';
import { OFFICIAL_SQB_QUESTIONS } from './sqbQuestions';

export const INITIAL_USER: User = {
  id: 'usr-student-01',
  telegramId: '@student',
  email: 'student@asronsat.uz',
  username: 'student',
  fullName: 'Talaba',
  avatarUrl: CREATIVE_AVATARS[0].url,
  bio: 'ASRON SAT Platformasi orqali Digital SAT ga tayyorgarlik.',
  role: 'STUDENT',
  planTier: 'FREE',
  targetScore: 1500,
  baselineScore: 1200,
  potentialScore: 1550,
  predictedScore: 1350,
  weakestSubSkills: [],
  targetExamDate: '2026-10-03',
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  streakFreezes: 0,
  xpPoints: 0,
  isOnline: true,
  testsCompletedCount: 0,
  createdAt: new Date().toISOString(),
};

export const ADMIN_USER: User = {
  id: 'usr-admin-01',
  telegramId: '@asron_admin',
  email: 'admin@asronsat.uz',
  username: 'admin',
  fullName: 'Administrator',
  avatarUrl: CREATIVE_AVATARS[1].url,
  bio: 'ASRON SAT Lead Administrator & Platform Director.',
  role: 'SUPER_ADMIN',
  planTier: 'VIP',
  targetScore: 1600,
  baselineScore: 1600,
  potentialScore: 1600,
  predictedScore: 1600,
  streakDays: 0,
  streakFreezes: 10,
  xpPoints: 0,
  isOnline: true,
  testsCompletedCount: 0,
  createdAt: new Date().toISOString(),
};

export const INITIAL_QUESTIONS: Question[] = [
  ...OFFICIAL_SQB_QUESTIONS,
  // RW - Transitions
  {
    id: 'q-rw-trans-01',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    skill: 'Transitions',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Botanists long believed that desert succulents absorb moisture exclusively through extensive shallow root systems that rapidly take up sporadic rainfall. _______ recent isotopic analysis reveals that certain species of Chilean columnar cacti obtain up to 60% of their annual water volume by capturing coastal fog directly through specialized epidermal trichomes.',
    questionText: 'Which choice completes the text with the most logical transition?',
    options: {
      A: 'Consequently,',
      B: 'However,',
      C: 'In addition,',
      D: 'Specifically,'
    },
    correctAnswer: 'B',
    explanation: 'The first sentence states the traditional belief ("long believed... exclusively through... root systems"). The second sentence presents surprising new isotopic findings that contradict this exclusivity by showing fog capture through trichomes. "However," correctly establishes this contrast.'
  },
  {
    id: 'q-rw-trans-02',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    skill: 'Transitions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    passage: 'In the 1970s, cognitive psychologist Eleanor Rosch demonstrated that people categorize objects based on comparison to an idealized prototype rather than a strict checklist of necessary features. _______ when asked to evaluate whether an item is a bird, test subjects verify a robin significantly faster than a penguin because a robin shares more salient traits with the prototypical bird representation.',
    questionText: 'Which choice completes the text with the most logical transition?',
    options: {
      A: 'For instance,',
      B: 'Nevertheless,',
      C: 'Meanwhile,',
      D: 'Alternatively,'
    },
    correctAnswer: 'A',
    explanation: 'The second sentence provides a direct concrete experimental example of the prototype theory introduced in the first sentence. "For instance," signals an illustrative example.'
  },

  // RW - Boundaries (Standard English Conventions)
  {
    id: 'q-rw-bound-01',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    skill: 'Boundaries',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'To preserve antique oil paintings in high-humidity climates, conservators seal canvas stretchers in climate-controlled micro-barrier _______ prevent moisture infiltration and fungal degradation while maintaining stable internal atmospheric pressure.',
    questionText: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: {
      A: 'frames. These enclosures',
      B: 'frames, these enclosures',
      C: 'frames these enclosures',
      D: 'frames; which'
    },
    correctAnswer: 'A',
    explanation: 'The sentence consists of two independent clauses: the first ends with "frames", and the second begins with "These enclosures prevent...". A period correctly separates two grammatically complete independent clauses without creating a comma splice.'
  },
  {
    id: 'q-rw-bound-02',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    skill: 'Boundaries',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    passage: 'Marine biologist Dr. Teresa Sousa monitored the migratory acoustics of blue whales across the North Atlantic _______ her team deployed sixteen deep-water hydrophone arrays along the Mid-Atlantic Ridge.',
    questionText: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: {
      A: 'basin, to accomplish this,',
      B: 'basin; to accomplish this,',
      C: 'basin to accomplish this,',
      D: 'basin: to accomplish this'
    },
    correctAnswer: 'B',
    explanation: 'A semicolon followed by a transitional phrase and comma ("; to accomplish this,") correctly joins two closely related independent clauses.'
  },

  // RW - Words in Context
  {
    id: 'q-rw-vocab-01',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    skill: 'Words in Context',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Although the architectural committee found the proposal ambitious, several members voiced skepticism regarding its budgetary feasibility, asserting that the projected construction costs were entirely _______ and neglected the soaring expense of seismic-grade structural steel.',
    questionText: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: {
      A: 'fanciful',
      B: 'unimpeachable',
      C: 'rigorous',
      D: 'negligible'
    },
    correctAnswer: 'A',
    explanation: 'The context emphasizes skepticism and failure to account for real market costs ("skepticism regarding its budgetary feasibility... neglected the soaring expense"). "Fanciful" (unrealistic or imaginary) accurately describes an unrealistically optimistic budget estimate.'
  },

  // RW - Command of Evidence (Inferences)
  {
    id: 'q-rw-inf-01',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    skill: 'Inferences',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Ecologist Linda Vance examined the symbiotic interactions between acacia ants (Pseudomyrmex ferruginea) and swollen-thorn acacia trees. Trees colonized by ant colonies exhibited 85% less defoliation from herbivorous insects and grew twice as fast as uncolonized saplings. However, in an experiment where all competing vegetative overgrowth was manually trimmed away by researchers for two years, trees without ant colonies matched the growth rates of colonized trees.',
    questionText: 'Which finding, if true, would most logically explain Vance’s experimental observation?',
    options: {
      A: 'Swollen-thorn acacia trees do not produce nectar when uncolonized by ants.',
      B: 'Acacia ants protect the trees not only by deterring herbivores but also by aggressively pruning encroaching competitor plants that cast shade.',
      C: 'Herbivorous insects avoid acacia trees in environments where temperatures exceed 35°C.',
      D: 'The ant colonies migrate to neighboring tree species when sunlight is plentiful.'
    },
    correctAnswer: 'B',
    explanation: 'If ants prevent shading by clearing competitor vegetation, then when researchers manually trim that vegetation, uncolonized trees can grow just as fast because their light competition has been removed.'
  },

  // Math - Advanced Math (Nonlinear Equations & Parabolas)
  {
    id: 'q-math-nonlin-01',
    section: 'MATH',
    domain: 'Advanced Math',
    skill: 'Nonlinear Equations',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'The quadratic equation $2x^2 - 8x + c = 0$ has exactly one real solution. What is the value of $c$?',
    options: {
      A: '4',
      B: '8',
      C: '16',
      D: '32'
    },
    correctAnswer: 'B',
    explanation: 'For a quadratic $ax^2 + bx + c = 0$ to have exactly one real solution, its discriminant must equal zero: $b^2 - 4ac = 0$. Here $a = 2$ and $b = -8$, so $(-8)^2 - 4(2)(c) = 0 \\implies 64 - 8c = 0 \\implies 8c = 64 \\implies c = 8$.'
  },
  {
    id: 'q-math-nonlin-02',
    section: 'MATH',
    domain: 'Advanced Math',
    skill: 'Equivalent Expressions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'Which of the following expressions is equivalent to $\\frac{x^2 - 9}{2x^2 + 5x - 3}$ for all $x > 3$?',
    options: {
      A: '$\\frac{x-3}{2x-1}$',
      B: '$\\frac{x+3}{2x-1}$',
      C: '$\\frac{x-3}{2x+1}$',
      D: '$\\frac{1}{2x-1}$'
    },
    correctAnswer: 'A',
    explanation: 'Factor numerator: $x^2 - 9 = (x - 3)(x + 3)$. Factor denominator: $2x^2 + 5x - 3 = (2x - 1)(x + 3)$. Canceling the common $(x+3)$ term gives $\\frac{x - 3}{2x - 1}$.'
  },

  // Math - Algebra (Systems of Linear Equations)
  {
    id: 'q-math-alg-01',
    section: 'MATH',
    domain: 'Algebra',
    skill: 'Systems of Linear Equations',
    difficulty: 'HARD',
    type: 'GRID_IN',
    questionText: 'In the system of equations below, $k$ is a constant:\n$$\\begin{cases} 3x - 4y = 14 \\\\ kx - 12y = 42 \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $k$?',
    correctAnswer: '9',
    explanation: 'For a system of two linear equations to have infinitely many solutions, the two equations must be scalar multiples of each other. Multiplying the first equation $3x - 4y = 14$ by $3$ yields $9x - 12y = 42$. Comparing coefficients with $kx - 12y = 42$ reveals $k = 9$.'
  },
  {
    id: 'q-math-alg-02',
    section: 'MATH',
    domain: 'Algebra',
    skill: 'Linear Functions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'A high-speed rail train leaves Station A with 180 passengers and gains 24 passengers at each subsequent stop. If $f(n)$ represents the total number of passengers on board after $n$ stops without any passengers departing, which function models this situation?',
    options: {
      A: '$f(n) = 180n + 24$',
      B: '$f(n) = 24n + 180$',
      C: '$f(n) = 180(24)^n$',
      D: '$f(n) = 24(180)^n$'
    },
    correctAnswer: 'B',
    explanation: 'The initial passenger count (y-intercept) is 180, and the rate of increase per stop (slope) is 24. Thus, $f(n) = 24n + 180$.'
  },

  // Math - Geometry & Trigonometry
  {
    id: 'q-math-geom-01',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    skill: 'Right Triangles and Trigonometry',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'In a right triangle $ABC$, angle $C$ is $90^\\circ$. If $\\sin(A) = \\frac{5}{13}$, what is the value of $\\tan(B)$?',
    options: {
      A: '$\\frac{5}{12}$',
      B: '$\\frac{12}{5}$',
      C: '$\\frac{12}{13}$',
      D: '$\\frac{13}{12}$'
    },
    correctAnswer: 'B',
    explanation: 'Let opposite side to $A$ be $a = 5$ and hypotenuse $c = 13$. By the Pythagorean Theorem, adjacent side $b = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12$. For angle $B$, the opposite side is $b = 12$ and the adjacent side is $a = 5$. Therefore, $\\tan(B) = \\frac{\\text{opp}}{\\text{adj}} = \\frac{12}{5}$.'
  },
  {
    id: 'q-math-geom-02',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    skill: 'Circles',
    difficulty: 'HARD',
    type: 'GRID_IN',
    questionText: 'The equation of a circle in the xy-plane is given by $x^2 + y^2 - 10x + 6y = 47$. What is the radius of the circle?',
    correctAnswer: '9',
    explanation: 'Complete the square for $x$ and $y$:\n$(x^2 - 10x + 25) + (y^2 + 6y + 9) = 47 + 25 + 9$\n$(x - 5)^2 + (y + 3)^2 = 81$\nThe equation is $(x-h)^2 + (y-k)^2 = r^2$, so $r^2 = 81 \\implies r = 9$.'
  },

  // Math - Problem-Solving & Data Analysis
  {
    id: 'q-math-prob-01',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Percentages',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'The price of a graphic tablet was reduced by 20% during a holiday sale. If the discounted sale price was $\\$280$, what was the original price before the discount?',
    options: {
      A: '$\\$336$',
      B: '$\\$350$',
      C: '$\\$360$',
      D: '$\\$380$'
    },
    correctAnswer: 'B',
    explanation: 'Let $P$ be the original price. A 20% reduction means the sale price is $0.80P = 280 \\implies P = \\frac{280}{0.80} = 350$.'
  },
  {
    id: 'q-math-prob-02',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Two-variable Data',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'A scatterplot displays the relationship between study hours per week ($x$) and exam score ($y$). The line of best fit is given by $\\hat{y} = 14.5x + 580$. For a student who studied 12 hours and achieved a score of 780, what is the residual (actual score minus predicted score)?',
    options: {
      A: '$+26$',
      B: '$-26$',
      C: '$+34$',
      D: '$-14$'
    },
    correctAnswer: 'A',
    explanation: 'Predicted score: $\\hat{y} = 14.5(12) + 580 = 174 + 580 = 754$. Residual = Actual - Predicted = $780 - 754 = +26$.'
  }
];

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  // 8 Reading & Writing Diagnostic questions
  {
    id: 'diag-rw-01',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    skill: 'Transitions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    passage: 'Graphene exhibits extraordinary electrical conductivity and tensile strength, making it a promising candidate for flexible semiconductors. _______ commercial mass manufacturing has been constrained by the difficulty of synthesizing large, defect-free single-crystal sheets at scalable temperatures.',
    questionText: 'Which choice completes the text with the most logical transition?',
    options: {
      A: 'Furthermore,',
      B: 'Consequently,',
      C: 'Still,',
      D: 'In other words,'
    },
    correctAnswer: 'C',
    explanation: '"Still," correctly signals the concession/contrast between graphene\'s immense promise and the manufacturing hurdles currently limiting its adoption.'
  },
  {
    id: 'diag-rw-02',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    skill: 'Boundaries',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Astrophysicist Dr. Elena Rossi calibrated the space observatory’s cryogenic infrared detectors _______ she subsequently published spectroscopic evidence of methane ice clouds on exoplanet Kepler-186f.',
    questionText: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: {
      A: 'meticulously,',
      B: 'meticulously; and',
      C: 'meticulously; then',
      D: 'meticulously. She'
    },
    correctAnswer: 'D',
    explanation: 'Option D correctly uses a period and a capital letter to separate two independent clauses, preventing a run-on sentence.'
  },
  {
    id: 'diag-rw-03',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    skill: 'Words in Context',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    passage: 'Despite facing intense political opposition, the governor’s infrastructure initiative remained _______, bolstered by widespread public support for renewable transit upgrades.',
    questionText: 'Which choice completes the text with the most logical and precise word or phrase?',
    options: {
      A: 'resilient',
      B: 'precarious',
      C: 'ephemeral',
      D: 'redundant'
    },
    correctAnswer: 'A',
    explanation: '"Resilient" means capable of withstanding shock or opposition, fitting the context of enduring despite intense pushback.'
  },
  {
    id: 'diag-rw-04',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    skill: 'Rhetorical Synthesis',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    passage: 'While researching a topic, a student took the following notes:\n- The Svalbard Global Seed Vault is located inside a mountain on the Norwegian island of Spitsbergen.\n- It stores over 1.2 million duplicate seed samples from genebanks worldwide.\n- Its objective is to safeguard agricultural biodiversity against catastrophic climate shifts and conflicts.\n- Seeds are preserved at -18°C in airtight foil packets.',
    questionText: 'The student wants to emphasize the primary purpose of the Svalbard Global Seed Vault. Which choice most effectively uses relevant information from the notes to accomplish this goal?',
    options: {
      A: 'Located on Spitsbergen, the Svalbard Global Seed Vault stores seeds at -18°C in airtight packets.',
      B: 'The Svalbard Global Seed Vault was established to protect global crop biodiversity from disasters and warfare.',
      C: 'Over 1.2 million duplicate seed packets are preserved in a Norwegian mountain facility.',
      D: 'Genebanks worldwide send duplicate seed samples to an Arctic island.'
    },
    correctAnswer: 'B',
    explanation: 'Choice B directly addresses the student\'s specific goal to highlight the primary purpose/mission of the facility.'
  },
  {
    id: 'diag-rw-05',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    skill: 'Central Ideas and Details',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'In literary analysis, the concept of "unreliable narration" often hinges not on explicit falsehoods, but on the selective omission of pivotal context. By framing events solely through the narrator\'s idiosyncratic moral calculus, the author forces the reader to reconstruct the objective reality behind subjective distortions.',
    questionText: 'Which choice best states the main idea of the text?',
    options: {
      A: 'Unreliable narrators deliberately fabricate lies to manipulate readers into false conclusions.',
      B: 'Authors achieve unreliable narration primarily through strategic omissions and subjective framing rather than outright deception.',
      C: 'Readers universally dislike narrators who fail to report events chronologically.',
      D: 'Objective reality cannot be conveyed in first-person literary fiction.'
    },
    correctAnswer: 'B',
    explanation: 'The passage explicitly argues that unreliable narration hinges on selective omission and idiosyncratic framing rather than explicit falsehoods.'
  },
  {
    id: 'diag-rw-06',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    skill: 'Form, Structure, and Sense',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Neither the senior architect nor the structural engineers _______ anticipated the severe aerodynamic vibration created by vortex shedding around the skyscraper’s tapered crown.',
    questionText: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
    options: {
      A: 'had',
      B: 'was having',
      C: 'is having',
      D: 'having'
    },
    correctAnswer: 'A',
    explanation: '"Had anticipated" properly provides the finite past perfect verb required by the subject phrase.'
  },
  {
    id: 'diag-rw-07',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    skill: 'Command of Evidence',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Biochemist Dr. Kenji Sato hypothesized that deep-sea vent tubeworms produce heat-shock protein Hsp90 at constant high levels rather than inducing it only during sudden temperature surges. In lab assays of Riftia pachyptila specimens kept at a steady 4°C, cellular Hsp90 concentrations were 40-fold higher than in coastal marine annelids.',
    questionText: 'Which statement best describes how the assay data relate to Sato’s hypothesis?',
    options: {
      A: 'They directly refute Sato\'s hypothesis regarding thermal adaptation.',
      B: 'They provide strong supporting evidence for Sato\'s hypothesis of constitutive high expression.',
      C: 'They show that coastal annelids produce more Hsp90 than vent tubeworms.',
      D: 'They indicate that Hsp90 is only active above 50°C.'
    },
    correctAnswer: 'B',
    explanation: 'The assay found baseline elevated concentrations (40-fold higher) even at low 4°C steady temperature, supporting constitutive (constant) high expression.'
  },
  {
    id: 'diag-rw-08',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    skill: 'Cross-Text Connections',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    passage: 'Text 1: Historian Miller argues that the invention of moveable type in 15th-century Europe caused an immediate democratization of literacy, breaking the monopoly of monastic scriptoriums.\nText 2: Sociologist Klein cautions that literacy rates remained below 15% across rural Europe for more than a century after Gutenberg, as printed volumes were luxury status symbols consumed primarily by merchant and clerical elites.',
    questionText: 'Based on the texts, how would Klein (Text 2) most likely respond to Miller’s claim in Text 1?',
    options: {
      A: 'By asserting that moveable type was invented centuries earlier in East Asia.',
      B: 'By qualifying that the democratization of literacy was a delayed socioeconomic process rather than an instantaneous outcome.',
      C: 'By agreeing that monastic scriptoriums expanded their output after Gutenberg.',
      D: 'By rejecting the notion that books held any economic value in early modern Europe.'
    },
    correctAnswer: 'B',
    explanation: 'Klein emphasizes the century-long delay and limited elite consumption, directly qualifying Miller\'s "immediate democratization" claim.'
  },

  // 8 Math Diagnostic questions
  {
    id: 'diag-math-01',
    section: 'MATH',
    domain: 'Algebra',
    skill: 'Linear Equations in One Variable',
    difficulty: 'EASY',
    type: 'MULTIPLE_CHOICE',
    questionText: 'If $4(2x - 3) = 28$, what is the value of $x$?',
    options: {
      A: '3',
      B: '4',
      C: '5',
      D: '7'
    },
    correctAnswer: 'C',
    explanation: '$8x - 12 = 28 \\implies 8x = 40 \\implies x = 5$.'
  },
  {
    id: 'diag-math-02',
    section: 'MATH',
    domain: 'Advanced Math',
    skill: 'Nonlinear Equations',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'If $x^2 - 12x + k = 0$ has two distinct real solutions, which inequality must be true for $k$?',
    options: {
      A: '$k < 36$',
      B: '$k > 36$',
      C: '$k \\le 36$',
      D: '$k = 36$'
    },
    correctAnswer: 'A',
    explanation: 'For two distinct real solutions, discriminant $\\Delta = b^2 - 4ac > 0$. Here $(-12)^2 - 4(1)(k) > 0 \\implies 144 - 4k > 0 \\implies 4k < 144 \\implies k < 36$.'
  },
  {
    id: 'diag-math-03',
    section: 'MATH',
    domain: 'Algebra',
    skill: 'Systems of Two Linear Equations',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'Consider the system:\n$$\\begin{cases} 2x + 3y = 19 \\\\ 5x - y = 5 \\end{cases}$$\nWhat is the value of $x + y$?',
    options: {
      A: '5',
      B: '7',
      C: '9',
      D: '12'
    },
    correctAnswer: 'B',
    explanation: 'From equation 2, $y = 5x - 5$. Substitute into equation 1: $2x + 3(5x - 5) = 19 \\implies 2x + 15x - 15 = 19 \\implies 17x = 34 \\implies x = 2$. Then $y = 5(2) - 5 = 5$. Thus $x + y = 2 + 5 = 7$.'
  },
  {
    id: 'diag-math-04',
    section: 'MATH',
    domain: 'Advanced Math',
    skill: 'Equivalent Expressions',
    difficulty: 'HARD',
    type: 'GRID_IN',
    questionText: 'For $x > 0$, the expression $\\sqrt{x^5} \\cdot x^{\\frac{3}{2}}$ can be written as $x^p$. What is the value of $p$?',
    correctAnswer: '4',
    explanation: '$\\sqrt{x^5} = x^{\\frac{5}{2}}$. Thus $x^{\\frac{5}{2}} \\cdot x^{\\frac{3}{2}} = x^{\\frac{5+3}{2}} = x^{\\frac{8}{2}} = x^4$. So $p = 4$.'
  },
  {
    id: 'diag-math-05',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'Ratios, Rates, and Proportions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'A laboratory centrifuge spins at 4,800 revolutions per minute. How many revolutions does it complete in 15 seconds?',
    options: {
      A: '600',
      B: '800',
      C: '1,200',
      D: '1,600'
    },
    correctAnswer: 'C',
    explanation: '15 seconds is $\\frac{15}{60} = \\frac{1}{4}$ of a minute. $4800 \\times \\frac{1}{4} = 1200$ revolutions.'
  },
  {
    id: 'diag-math-06',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    skill: 'Circles',
    difficulty: 'HARD',
    type: 'MULTIPLE_CHOICE',
    questionText: 'In the xy-plane, the line $y = 3$ is tangent to a circle centered at $(4, -2)$. What is the area of this circle in terms of $\\pi$?',
    options: {
      A: '$16\\pi$',
      B: '$25\\pi$',
      C: '$36\\pi$',
      D: '$49\\pi$'
    },
    correctAnswer: 'B',
    explanation: 'The radius is the perpendicular distance from the center $(4, -2)$ to the horizontal tangent line $y = 3$: $r = |3 - (-2)| = 5$. Area = $\\pi r^2 = \\pi (5)^2 = 25\\pi$.'
  },
  {
    id: 'diag-math-07',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    skill: 'Right Triangles and Trigonometry',
    difficulty: 'HARD',
    type: 'GRID_IN',
    questionText: 'In $\\triangle XYZ$, $\\angle Y = 90^\\circ$, and $\\cos(X) = \\frac{7}{25}$. What is the value of $\\sin(Z)$ in decimal or fraction form?',
    correctAnswer: '7/25',
    explanation: 'In a right triangle where $\\angle Y = 90^\\circ$, angles $X$ and $Z$ are complementary ($X + Z = 90^\\circ$). By co-function identity, $\\sin(Z) = \\cos(X) = \\frac{7}{25}$ (or 0.28).'
  },
  {
    id: 'diag-math-08',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    skill: 'One-variable Data: Distributions',
    difficulty: 'MEDIUM',
    type: 'MULTIPLE_CHOICE',
    questionText: 'A dataset consists of 11 integer scores with a median of 84 and a range of 20. If each score in the dataset is multiplied by 3 and then increased by 5, what is the new median and new range?',
    options: {
      A: 'Median: 257, Range: 60',
      B: 'Median: 257, Range: 65',
      C: 'Median: 252, Range: 60',
      D: 'Median: 247, Range: 65'
    },
    correctAnswer: 'A',
    explanation: 'New median = $3(84) + 5 = 252 + 5 = 257$. Multiplying by 3 scales the range ($3 \\times 20 = 60$), while adding 5 does not change the spread/range. Thus new range is 60.'
  }
];

export const INITIAL_MISTAKES: MistakeVaultItem[] = [];

export const INITIAL_MOCK_TESTS: MockTest[] = [
  {
    id: 'mock-official-01',
    title: 'Bluebook Official Simulation Mock #1',
    description: 'Full-length 2-Stage Multistage Adaptive Test (MST) with official College Board difficulty routing.',
    isPublished: true,
    isProOnly: false,
    totalTimeMinutes: 134,
    questions: [
      // Reading & Writing Module 1 (Baseline)
      { id: 'mq-1', mockTestId: 'mock-official-01', questionId: 'q-rw-trans-01', question: INITIAL_QUESTIONS[0], moduleNumber: 1, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 1 },
      { id: 'mq-2', mockTestId: 'mock-official-01', questionId: 'q-rw-trans-02', question: INITIAL_QUESTIONS[1], moduleNumber: 1, section: 'READING_AND_WRITING', difficultyTier: 'MEDIUM', orderIndex: 2 },
      { id: 'mq-3', mockTestId: 'mock-official-01', questionId: 'q-rw-bound-01', question: INITIAL_QUESTIONS[2], moduleNumber: 1, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 3 },
      { id: 'mq-4', mockTestId: 'mock-official-01', questionId: 'q-rw-vocab-01', question: INITIAL_QUESTIONS[4] || INITIAL_QUESTIONS[0], moduleNumber: 1, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 4 },
      
      // Reading & Writing Module 2 (Adaptive Route)
      { id: 'mq-5', mockTestId: 'mock-official-01', questionId: 'diag-rw-01', question: DIAGNOSTIC_QUESTIONS[0], moduleNumber: 2, section: 'READING_AND_WRITING', difficultyTier: 'MEDIUM', orderIndex: 1 },
      { id: 'mq-6', mockTestId: 'mock-official-01', questionId: 'diag-rw-02', question: DIAGNOSTIC_QUESTIONS[1], moduleNumber: 2, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 2 },
      { id: 'mq-7', mockTestId: 'mock-official-01', questionId: 'diag-rw-05', question: DIAGNOSTIC_QUESTIONS[4], moduleNumber: 2, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 3 },
      { id: 'mq-8', mockTestId: 'mock-official-01', questionId: 'diag-rw-08', question: DIAGNOSTIC_QUESTIONS[7], moduleNumber: 2, section: 'READING_AND_WRITING', difficultyTier: 'HARD', orderIndex: 4 },

      // Math Module 1 (Baseline)
      { id: 'mq-9', mockTestId: 'mock-official-01', questionId: 'q-math-nonlin-01', question: INITIAL_QUESTIONS[5] || INITIAL_QUESTIONS[4], moduleNumber: 1, section: 'MATH', difficultyTier: 'HARD', orderIndex: 1 },
      { id: 'mq-10', mockTestId: 'mock-official-01', questionId: 'q-math-alg-01', question: INITIAL_QUESTIONS[7] || INITIAL_QUESTIONS[6], moduleNumber: 1, section: 'MATH', difficultyTier: 'HARD', orderIndex: 2 },
      { id: 'mq-11', mockTestId: 'mock-official-01', questionId: 'diag-math-01', question: DIAGNOSTIC_QUESTIONS[8] || DIAGNOSTIC_QUESTIONS[0], moduleNumber: 1, section: 'MATH', difficultyTier: 'EASY', orderIndex: 3 },
      { id: 'mq-12', mockTestId: 'mock-official-01', questionId: 'diag-math-03', question: DIAGNOSTIC_QUESTIONS[10] || DIAGNOSTIC_QUESTIONS[2], moduleNumber: 1, section: 'MATH', difficultyTier: 'MEDIUM', orderIndex: 4 },

      // Math Module 2 (Adaptive Route)
      { id: 'mq-13', mockTestId: 'mock-official-01', questionId: 'q-math-geom-01', question: INITIAL_QUESTIONS[8], moduleNumber: 2, section: 'MATH', difficultyTier: 'HARD', orderIndex: 1 },
      { id: 'mq-14', mockTestId: 'mock-official-01', questionId: 'q-math-geom-02', question: INITIAL_QUESTIONS[9], moduleNumber: 2, section: 'MATH', difficultyTier: 'HARD', orderIndex: 2 },
      { id: 'mq-15', mockTestId: 'mock-official-01', questionId: 'diag-math-06', question: DIAGNOSTIC_QUESTIONS[13] || DIAGNOSTIC_QUESTIONS[5], moduleNumber: 2, section: 'MATH', difficultyTier: 'HARD', orderIndex: 3 },
      { id: 'mq-16', mockTestId: 'mock-official-01', questionId: 'diag-math-07', question: DIAGNOSTIC_QUESTIONS[14] || DIAGNOSTIC_QUESTIONS[6], moduleNumber: 2, section: 'MATH', difficultyTier: 'HARD', orderIndex: 4 },
    ],
    createdAt: '2026-08-15T00:00:00Z',
  },
  {
    id: 'mock-official-02',
    title: 'Bluebook Official Simulation Mock #2 (Hard Adaptive Stage)',
    description: 'High-rigor MST test calibrated for 1450-1600 target scorers. Includes advanced nonlinear models.',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    questions: [],
    createdAt: '2026-08-20T00:00:00Z',
  },
  {
    id: 'mock-official-03',
    title: 'Bluebook Official Simulation Mock #3 (Ivy League Diagnostic)',
    description: 'Official test pattern focusing on high-frequency trap answers and complex multi-variable algebra.',
    isPublished: true,
    isProOnly: true,
    totalTimeMinutes: 134,
    questions: [],
    createdAt: '2026-08-25T00:00:00Z',
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat-general',
    name: 'ASRON SAT 1500+ Official Cohort',
    type: 'PUBLIC_GROUP',
    description: 'Rasmiy Digital SAT tayyorgarlik guruhi va strategiyalar.',
    avatarUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    members: ['usr-student-01', 'usr-admin-01'],
    createdAt: '2026-08-01T00:00:00Z',
    isLiveActive: false,
  },
  {
    id: 'chat-math-800',
    name: 'Math 800 Desmos Hub',
    type: 'PUBLIC_GROUP',
    description: 'Desmos regressiyalar va nonlinear tenglamalar muhokamasi.',
    avatarUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    members: ['usr-student-01', 'usr-admin-01'],
    createdAt: '2026-08-05T00:00:00Z',
  },
  {
    id: 'chat-rw-squad',
    name: 'Reading & Writing Mastery',
    type: 'PUBLIC_GROUP',
    description: 'Transitions, Punctuation va Rhetorical Synthesis mashg\'ulotlari.',
    avatarUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    members: ['usr-student-01', 'usr-admin-01'],
    createdAt: '2026-08-10T00:00:00Z',
  },
  {
    id: 'chat-saved-messages',
    name: 'Saqlangan Xabarlar (Saved Cloud)',
    type: 'SAVED_MESSAGES',
    description: 'Shaxsiy formulalar, dars qaydlari va test eslatmalari.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    unreadCount: 0,
    members: ['usr-student-01'],
    createdAt: '2026-08-01T00:00:00Z',
  }
];

export const INITIAL_MESSAGES: Message[] = [];

export const INITIAL_RECEIPTS: PaymentReceipt[] = [];

export const INITIAL_USERS: User[] = [
  INITIAL_USER,
  ADMIN_USER,
];

export const INITIAL_CHANNELS: Chat[] = INITIAL_CHATS;

export const INITIAL_TELEGRAM_NOTIFICATIONS: TelegramNotification[] = [];

export const INITIAL_LANDING_CONFIG: LandingConfig = {
  id: 1,
  heroHeadline: 'Master the Digital SAT with Adaptive Mastery & Socratic AI',
  heroSubtext: 'The only prep engine engineered with 10-minute habit loops, instant score diagnostics, Leitner mistake vaults, and 100% faithful Bluebook simulation.',
  telegramChannel: 'https://t.me/AsronSatBot',
  instagramPage: 'https://instagram.com/asronsat',
  pricingTiers: {
    free: {
      name: 'Free Tier',
      price: '$0',
      features: [
        'Rapid 7-Minute Diagnostic Test',
        'Basic Score Forecast',
        '3-Day Trial of Daily Workouts',
        'Up to 15 items in Mistake Vault',
        'Starter Mock Test (Standard)'
      ]
    },
    standard: {
      name: 'Standard Tier',
      price: '$29/mo',
      features: [
        'Unlimited Daily 10-Min Workouts',
        'Full Mistake Vault (Unlimited items)',
        'All Bluebook Practice Tests',
        'Full 3,000+ Question Bank (SQB)',
        'Telegram Daily & Weekly Sync'
      ]
    },
    pro: {
      name: 'Pro Tier (AI Mastery)',
      price: '$49/mo',
      features: [
        'Everything in Standard Tier',
        '24/7 AI Socratic Voice & Text Tutor',
        'AI Cloned Question Generation for Mistakes',
        'Personalized 30-Day Score Roadmap',
        '2-Stage Adaptive MST Engine with Curves',
        'Live Community Streams & Whiteboard Stages',
        'Streak Protection & Priority Receipt Approval'
      ]
    }
  },
  updatedAt: '2026-08-29T10:00:00Z',
};
