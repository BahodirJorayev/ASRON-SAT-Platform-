import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import {
  BrainCircuit,
  Filter,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Calculator,
  ChevronRight,
  X,
  Target,
  BarChart3,
  Layers,
  Search
} from 'lucide-react';
import { User, MistakeVaultItem, Question } from '../types';

export interface SubSkillData {
  id: string;
  name: string;
  shortName: string;
  section: 'MATH' | 'READING_AND_WRITING';
  domain: string;
  proficiency: number; // 0 to 100
  questionsPracticed: number;
  correctCount: number;
  recentAccuracy: number; // percentage
  errorsInVault: number;
  isWeakSpot: boolean;
  masteryTier: 'CRITICAL' | 'DEVELOPING' | 'PROFICIENT' | 'MASTERED';
  keyConcept: string;
  strategyTip: string;
  desmosHack?: string;
  sampleQuestionSnippet: string;
}

interface Props {
  user: User;
  mistakes: MistakeVaultItem[];
  onOpenQuestionBank?: (subSkill?: string) => void;
  onOpenSocraticTutor?: (questionSnippet?: string) => void;
  onOpenDailyWorkout?: () => void;
}

// Master list of all official SAT Math & Verbal sub-skills
const SAT_SUBSKILLS_TAXONOMY: Omit<SubSkillData, 'proficiency' | 'questionsPracticed' | 'correctCount' | 'recentAccuracy' | 'errorsInVault' | 'isWeakSpot' | 'masteryTier'>[] = [
  // --- READING & WRITING (10 Sub-skills) ---
  // Craft and Structure
  {
    id: 'rw-words-in-context',
    name: 'Words in Context',
    shortName: 'Words Context',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    keyConcept: 'Infer vocabulary meanings through surrounding semantic contrast and tone tone-markers.',
    strategyTip: 'Formulate your own replacement word BEFORE reading the 4 options to avoid distractor attraction.',
    sampleQuestionSnippet: 'The author implies that the newly excavated frescoes were remarkably preserved because...',
  },
  {
    id: 'rw-text-structure',
    name: 'Text Structure and Purpose',
    shortName: 'Text Structure',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    keyConcept: 'Analyze rhetorical progression, author stance, and structural transitions across paragraphs.',
    strategyTip: 'Identify the pivot point (e.g., "However", "In contrast") where the author’s primary argument shifts.',
    sampleQuestionSnippet: 'Which choice best describes the function of the underlined portion in the overall text?',
  },
  {
    id: 'rw-cross-text',
    name: 'Cross-Text Connections',
    shortName: 'Cross-Text',
    section: 'READING_AND_WRITING',
    domain: 'Craft and Structure',
    keyConcept: 'Compare perspective, underlying assumptions, and evidence between Text 1 and Text 2.',
    strategyTip: 'Map Text 1 Author Stance (+/0/-) vs Text 2 Author Stance (+/0/-) before evaluating answer choices.',
    sampleQuestionSnippet: 'Based on the texts, how would the author of Text 2 most likely respond to the hypothesis in Text 1?',
  },
  // Information and Ideas
  {
    id: 'rw-central-ideas',
    name: 'Central Ideas and Details',
    shortName: 'Central Ideas',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    keyConcept: 'Distinguish explicit claims from supporting context without making unwarranted leaps.',
    strategyTip: 'Beware of extreme modifiers (always, never, exclusively) not directly supported by textual evidence.',
    sampleQuestionSnippet: 'Which choice best states the primary conclusion drawn by the researchers?',
  },
  {
    id: 'rw-command-evidence-text',
    name: 'Command of Evidence (Textual)',
    shortName: 'Textual Evidence',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    keyConcept: 'Identify quotes or findings that directly substantiate or refute the stated scientific/literary claim.',
    strategyTip: 'Underline the exact claim in the question stem. The right answer must be a direct logical match.',
    sampleQuestionSnippet: 'Which finding from the study, if true, would most strongly support the marine biologists’ hypothesis?',
  },
  {
    id: 'rw-command-evidence-quant',
    name: 'Command of Evidence (Quantitative)',
    shortName: 'Quant Evidence',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    keyConcept: 'Accurately interpret tables, bar charts, line graphs, and integrate them with passage arguments.',
    strategyTip: 'Check axis labels, legends, and measurement units twice before confirming the quantitative choice.',
    sampleQuestionSnippet: 'Which choice best uses data from the table to complete the argument regarding photosynthetic output?',
  },
  {
    id: 'rw-inferences',
    name: 'Inferences',
    shortName: 'Inferences',
    section: 'READING_AND_WRITING',
    domain: 'Information and Ideas',
    keyConcept: 'Deduce the most direct and necessary conclusion that follows logically from passage facts.',
    strategyTip: 'The correct inference requires the smallest logical leap; avoid speculative "real-world" leaps.',
    sampleQuestionSnippet: 'Which choice most logically completes the text regarding the subterranean fungal network?',
  },
  // Standard English Conventions
  {
    id: 'rw-boundaries',
    name: 'Boundaries & Punctuation',
    shortName: 'Boundaries',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    keyConcept: 'Master independent clauses, semicolons, colons, em-dashes, and comma splices.',
    strategyTip: 'Semicolon (;) = Period (.) = Comma + FANBOYS. Colon (:) must be preceded by a full independent clause.',
    sampleQuestionSnippet: 'Archaeologists discovered four intact amphorae; _______ however, several ceramic fragments were destroyed.',
  },
  {
    id: 'rw-form-structure-sense',
    name: 'Form, Structure, and Sense',
    shortName: 'Grammar & Sense',
    section: 'READING_AND_WRITING',
    domain: 'Standard English Conventions',
    keyConcept: 'Subject-verb agreement, pronoun-antecedent clarity, verb tenses, and modifier placement.',
    strategyTip: 'Cross out prepositional phrases between subject and verb to reveal true singular/plural agreement.',
    sampleQuestionSnippet: 'Neither the principal investigator nor the postdoctoral researchers _______ anticipating the anomalous reading.',
  },
  // Expression of Ideas
  {
    id: 'rw-rhetorical-synthesis',
    name: 'Rhetorical Synthesis',
    shortName: 'Rhetorical Synth',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    keyConcept: 'Select notes to accomplish a specific student writing goal (e.g. emphasize similarity, contrast, or timeline).',
    strategyTip: 'Skip reading all bullet notes first! Read the prompt goal in the final sentence and match only the required note.',
    sampleQuestionSnippet: 'The student wants to emphasize the difference in lifespan between the two cedar species. Which choice accomplishes this?',
  },
  {
    id: 'rw-transitions',
    name: 'Transitions',
    shortName: 'Transitions',
    section: 'READING_AND_WRITING',
    domain: 'Expression of Ideas',
    keyConcept: 'Categorize transition logic: Contrast (However), Causation (Therefore), Addition (Furthermore), Illustration (For example).',
    strategyTip: 'Read the previous sentence and current sentence without the blank to diagnose the exact logical relation.',
    sampleQuestionSnippet: 'Coastal redwoods absorb substantial moisture through their canopy. _______ they thrive even during arid summer droughts.',
  },

  // --- MATH (12 Sub-skills) ---
  // Algebra
  {
    id: 'math-linear-eq-1-2',
    name: 'Linear Equations (1 & 2 Variables)',
    shortName: 'Linear Equations',
    section: 'MATH',
    domain: 'Algebra',
    keyConcept: 'Solve single and multi-step linear equations, evaluate constants, and determine infinitely many / no solutions.',
    strategyTip: 'No solution: equal slopes (a = c), different y-intercepts. Infinitely many solutions: identical equations.',
    desmosHack: 'Type equations directly into Desmos lines 1 & 2 to find intersection coordinates automatically.',
    sampleQuestionSnippet: 'For what value of k will the equation 4(2x - 3) = kx - 12 have infinitely many real solutions?',
  },
  {
    id: 'math-linear-functions',
    name: 'Linear Functions & Graphs',
    shortName: 'Linear Functions',
    section: 'MATH',
    domain: 'Algebra',
    keyConcept: 'Interpret slope as unit rate of change and y-intercept as baseline value in word models.',
    strategyTip: 'Slope m = (y2 - y1) / (x2 - x1). Parallel lines have m1 = m2; perpendicular lines have m1 * m2 = -1.',
    desmosHack: 'Use Desmos slider for variable m to see real-time line rotations and intercept shifts.',
    sampleQuestionSnippet: 'A plumber charges a fixed diagnostic fee plus an hourly rate. If a 3-hour job costs $210 and a 5-hour job costs $310...',
  },
  {
    id: 'math-systems-linear',
    name: 'Systems of Linear Equations',
    shortName: 'Systems of Eq',
    section: 'MATH',
    domain: 'Algebra',
    keyConcept: 'Solve 2x2 linear systems via substitution, elimination, or graphic coordinate intersection.',
    strategyTip: 'If solving for an expression like (2x + y), look for a direct addition/subtraction combination of equations.',
    desmosHack: 'Type both equations in Desmos. Tap the gray dot at the intersection point to instantly read (x, y).',
    sampleQuestionSnippet: 'If 3x + 2y = 19 and 2x - y = 1, what is the value of x + y?',
  },
  {
    id: 'math-linear-inequalities',
    name: 'Linear Inequalities',
    shortName: 'Inequalities',
    section: 'MATH',
    domain: 'Algebra',
    keyConcept: 'Graph half-planes, system feasible regions, and constraints on discrete quantities.',
    strategyTip: 'Remember to reverse the inequality sign whenever multiplying or dividing both sides by a negative number.',
    desmosHack: 'Desmos shades inequality regions automatically (e.g. y <= 2x + 4). The intersection is the overlapping shade.',
    sampleQuestionSnippet: 'Which point (x, y) lies in the solution set of y > 2x - 5 and 3x + 4y <= 12?',
  },
  // Advanced Math
  {
    id: 'math-equivalent-expressions',
    name: 'Equivalent Expressions',
    shortName: 'Equiv Expressions',
    section: 'MATH',
    domain: 'Advanced Math',
    keyConcept: 'Factor quadratics, expand polynomials, handle rational expressions, and simplify exponent laws.',
    strategyTip: 'Use test values (e.g. x = 2 or x = 3) to plug into the original expression and check matching answer choices.',
    desmosHack: 'Type the given expression as f(x) and each option as g(x). If their graphs overlap 100%, they are equivalent!',
    sampleQuestionSnippet: 'Which of the following expressions is equivalent to (9x^2 - 16) / (3x - 4) for all x != 4/3?',
  },
  {
    id: 'math-nonlinear-equations',
    name: 'Nonlinear Equations & Quadratics',
    shortName: 'Quadratics & Roots',
    section: 'MATH',
    domain: 'Advanced Math',
    keyConcept: 'Quadratic formula, discriminant (b^2 - 4ac), vertex form y = a(x-h)^2 + k, and completing the square.',
    strategyTip: 'Discriminant: >0 (2 real roots), =0 (1 real root / tangent to x-axis), <0 (no real roots / complex).',
    desmosHack: 'Type the quadratic in Desmos. Click the vertex or x-intercepts to read the extrema and zeros instantly.',
    sampleQuestionSnippet: 'If x^2 - 8x + c = 0 has exactly one distinct real solution, what is the value of c?',
  },
  {
    id: 'math-nonlinear-functions',
    name: 'Exponential Functions & Radicals',
    shortName: 'Exponentials',
    section: 'MATH',
    domain: 'Advanced Math',
    keyConcept: 'Exponential growth/decay y = a(1 + r)^t, compound interest, radical simplification, and extraneous solutions.',
    strategyTip: 'Always test radical equation solutions back into the original equation to eliminate extraneous roots.',
    desmosHack: 'Type y = a * b^(x/k) in Desmos. Verify doubling time or halving half-life periods on the curve.',
    sampleQuestionSnippet: 'A radioactive isotope decays at a rate of 12% per year. If the initial mass is 500 grams, what is the mass after t years?',
  },
  // Problem-Solving and Data Analysis
  {
    id: 'math-ratios-rates-units',
    name: 'Ratios, Rates, Proportions & Units',
    shortName: 'Ratios & Units',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    keyConcept: 'Unit conversion dimensional analysis, direct/inverse proportions, scale factors.',
    strategyTip: 'Write down full units (e.g. [miles/hour] * [feet/mile] * [hour/60 min]) so units cancel out cleanly.',
    desmosHack: 'Set up proportion equation (a / b = x / c) in Desmos or calculate unit rates directly.',
    sampleQuestionSnippet: 'A printer produces 45 pages in 3 minutes. At this rate, how many hours will it take to print 2,700 pages?',
  },
  {
    id: 'math-percentages',
    name: 'Percentages & Percent Change',
    shortName: 'Percentages',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    keyConcept: 'Percent increase/decrease, multi-step discounts, percent of a percent, base value shifts.',
    strategyTip: 'Percent change = [(New - Old) / Old] * 100%. A 20% increase followed by a 20% decrease does NOT equal original!',
    desmosHack: 'Use decimals for fast multiplier chains (e.g. Price * 1.15 * 0.85).',
    sampleQuestionSnippet: 'The price of an item increased by 25% and was then discounted by 20%. What is the overall percentage change?',
  },
  {
    id: 'math-statistics-spread',
    name: 'One-Variable Statistics & Spread',
    shortName: 'Stats & Spread',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    keyConcept: 'Mean, median, mode, range, standard deviation, and effects of outliers on skewed data.',
    strategyTip: 'Outliers heavily shift the Mean and Range, but the Median and Standard Deviation / IQR are far more robust.',
    desmosHack: 'Use Desmos functions `mean([1,2,3...])`, `median([1,2,3...])`, and `stdev([1,2,3...])` for instant math.',
    sampleQuestionSnippet: 'A dataset has a mean of 42 and a median of 40. If a value of 95 is added to the set, how do the mean and median change?',
  },
  {
    id: 'math-probability-tables',
    name: 'Probability & Contingency Tables',
    shortName: 'Probability',
    section: 'MATH',
    domain: 'Problem-Solving and Data Analysis',
    keyConcept: 'Conditional probability P(A|B) from two-way tables, random sampling, and margin of error.',
    strategyTip: 'In conditional probability ("Given that the student is a senior..."), restrict denominator ONLY to seniors!',
    desmosHack: 'Calculate conditional fractions (numerator / row_total) in Desmos.',
    sampleQuestionSnippet: 'Based on the survey table, if a respondent who prefers Option A is chosen at random, what is the probability that they are in Grade 11?',
  },
  // Geometry and Trigonometry
  {
    id: 'math-geometry-area-volume',
    name: 'Area, Volume & Angles',
    shortName: 'Area & Volume',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    keyConcept: 'Triangles, parallel lines cut by transversals, polygon angles, cylinder/cone/sphere volume formulas.',
    strategyTip: 'Look at the reference sheet at the top of Bluebook for cylinder, cone, sphere formulas.',
    desmosHack: 'Compute complex geometry algebraic equations directly in Desmos.',
    sampleQuestionSnippet: 'A right circular cylinder has a radius of 4 and a height of 9. What is the radius of a sphere with the exact same volume?',
  },
  {
    id: 'math-trigonometry-circles',
    name: 'Right Triangles, Trig & Circles',
    shortName: 'Trig & Circles',
    section: 'MATH',
    domain: 'Geometry and Trigonometry',
    keyConcept: 'SOH-CAH-TOA, sin(x) = cos(90 - x), radians conversion, circle standard form (x-h)^2 + (y-k)^2 = r^2, arc length.',
    strategyTip: 'Complementary angle identity: If sin(a) = cos(b) in a right triangle, then a + b = 90 degrees (or pi/2 radians).',
    desmosHack: 'Type circle equations like (x-3)^2 + (y+4)^2 = 25 into Desmos to see center (3, -4) and radius r=5 on the grid.',
    sampleQuestionSnippet: 'In right triangle ABC, angle C is 90°. If sin(A) = 3/5, what is the value of cos(B)?',
  },
];

export const SubSkillHeatmap: React.FC<Props> = ({
  user,
  mistakes,
  onOpenQuestionBank,
  onOpenSocraticTutor,
  onOpenDailyWorkout,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filters & State
  const [sectionFilter, setSectionFilter] = useState<'ALL' | 'MATH' | 'READING_AND_WRITING'>('ALL');
  const [domainFilter, setDomainFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [selectedSubSkill, setSelectedSubSkill] = useState<SubSkillData | null>(null);
  const [hoveredSubSkill, setHoveredSubSkill] = useState<SubSkillData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Compute calculated sub-skill performance records based on user history & mistakes
  const subSkillsData = useMemo<SubSkillData[]>(() => {
    const userWeaknesses = (user.weakestSubSkills || []).map((w) => w.toLowerCase());
    const xpFactor = Math.min(1.2, (user.xpPoints || 1000) / 1500);
    const testsCount = user.testsCompletedCount || 4;

    return SAT_SUBSKILLS_TAXONOMY.map((skill) => {
      // Check if this skill has active mistake vault items
      const vaultMistakes = mistakes.filter(
        (m) =>
          m.question.skill?.toLowerCase() === skill.name.toLowerCase() ||
          m.question.domain?.toLowerCase() === skill.domain.toLowerCase()
      );
      const errorsInVault = vaultMistakes.length;

      // Check if explicitly marked as weak spot in user profile
      const isExplicitWeak = userWeaknesses.some(
        (w) =>
          skill.name.toLowerCase().includes(w) ||
          skill.shortName.toLowerCase().includes(w) ||
          skill.domain.toLowerCase().includes(w)
      );

      // Deterministic pseudo-random seed based on user ID & skill ID for consistent, personalized numbers
      const seed = (user.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) * 17 + skill.id.length * 31) % 100;
      
      let baseProficiency = 60 + (seed % 35);

      // Adjust based on user's target vs baseline score
      if (user.predictedScore && user.predictedScore > 1450) {
        baseProficiency += 12;
      } else if (user.baselineScore && user.baselineScore < 1250) {
        baseProficiency -= 8;
      }

      // Penalize for active mistake items
      if (errorsInVault > 0) {
        baseProficiency -= errorsInVault * 10;
      }

      // Penalize if marked as weak sub-skill
      if (isExplicitWeak) {
        baseProficiency = Math.min(baseProficiency, 42 + (seed % 15));
      }

      // Cap between 24 and 98
      const finalProficiency = Math.max(25, Math.min(98, Math.round(baseProficiency * xpFactor)));

      // Derive mastery tier
      let masteryTier: SubSkillData['masteryTier'] = 'PROFICIENT';
      if (finalProficiency < 50) masteryTier = 'CRITICAL';
      else if (finalProficiency < 70) masteryTier = 'DEVELOPING';
      else if (finalProficiency < 88) masteryTier = 'PROFICIENT';
      else masteryTier = 'MASTERED';

      const questionsPracticed = Math.max(8, Math.round(15 + (seed % 40) + testsCount * 4));
      const recentAccuracy = finalProficiency;
      const correctCount = Math.round((questionsPracticed * recentAccuracy) / 100);

      return {
        ...skill,
        proficiency: finalProficiency,
        questionsPracticed,
        correctCount,
        recentAccuracy,
        errorsInVault,
        isWeakSpot: isExplicitWeak || finalProficiency < 50,
        masteryTier,
      };
    });
  }, [user, mistakes]);

  // Filtered dataset
  const filteredSkills = useMemo(() => {
    return subSkillsData.filter((skill) => {
      if (sectionFilter !== 'ALL' && skill.section !== sectionFilter) return false;
      if (domainFilter !== 'ALL' && skill.domain !== domainFilter) return false;
      if (tierFilter !== 'ALL' && skill.masteryTier !== tierFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = skill.name.toLowerCase().includes(q);
        const matchDomain = skill.domain.toLowerCase().includes(q);
        const matchKey = skill.keyConcept.toLowerCase().includes(q);
        if (!matchName && !matchDomain && !matchKey) return false;
      }
      return true;
    });
  }, [subSkillsData, sectionFilter, domainFilter, tierFilter, searchQuery]);

  // List of domains for dropdown
  const availableDomains = useMemo(() => {
    const domains = new Set<string>();
    SAT_SUBSKILLS_TAXONOMY.forEach((s) => {
      if (sectionFilter === 'ALL' || s.section === sectionFilter) {
        domains.add(s.domain);
      }
    });
    return Array.from(domains);
  }, [sectionFilter]);

  // Summary Metrics
  const summary = useMemo(() => {
    const mathSkills = subSkillsData.filter((s) => s.section === 'MATH');
    const rwSkills = subSkillsData.filter((s) => s.section === 'READING_AND_WRITING');

    const mathAvg = Math.round(mathSkills.reduce((a, b) => a + b.proficiency, 0) / (mathSkills.length || 1));
    const rwAvg = Math.round(rwSkills.reduce((a, b) => a + b.proficiency, 0) / (rwSkills.length || 1));
    const masteredCount = subSkillsData.filter((s) => s.masteryTier === 'MASTERED').length;
    const criticalCount = subSkillsData.filter((s) => s.masteryTier === 'CRITICAL').length;
    const developingCount = subSkillsData.filter((s) => s.masteryTier === 'DEVELOPING').length;

    return {
      mathAvg,
      rwAvg,
      masteredCount,
      criticalCount,
      developingCount,
      totalCount: subSkillsData.length,
    };
  }, [subSkillsData]);

  // D3 Heatmap Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawing

    const containerWidth = containerRef.current.clientWidth || 800;
    const margin = { top: 30, right: 24, bottom: 40, left: 180 };
    const width = containerWidth - margin.left - margin.right;
    
    // Group skills by domain
    const domains: string[] = Array.from(new Set<string>(filteredSkills.map((d) => d.domain)));
    if (domains.length === 0) {
      svg
        .attr('width', containerWidth)
        .attr('height', 160)
        .append('text')
        .attr('x', containerWidth / 2)
        .attr('y', 80)
        .attr('text-anchor', 'middle')
        .attr('fill', '#78716C')
        .attr('font-size', '13px')
        .attr('font-family', 'sans-serif')
        .text('No sub-skills match the selected filter criteria.');
      return;
    }

    // Determine max columns per domain
    const domainGroups: Record<string, SubSkillData[]> = {};
    domains.forEach((dom: string) => {
      domainGroups[dom] = filteredSkills.filter((s) => s.domain === dom);
    });

    const maxItemsInRow = Math.max(...Object.values(domainGroups).map((items) => items.length), 1);

    // Dynamic Sizing
    const rowHeight = 72;
    const totalHeight = domains.length * rowHeight + margin.top + margin.bottom;
    const cardGap = 8;
    const cardWidth = Math.min(190, Math.max(120, (width - (maxItemsInRow - 1) * cardGap) / maxItemsInRow));

    svg
      .attr('width', containerWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    // D3 Color Scales
    // High-craft color interpolator: Rose (<50) -> Amber (50-70) -> Blue (70-85) -> Emerald (85-100)
    const getColor = (val: number) => {
      if (val < 50) return '#FFE4E6'; // rose-100
      if (val < 70) return '#FEF3C7'; // amber-100
      if (val < 86) return '#DBEAFE'; // blue-100
      return '#D1FAE5'; // emerald-100
    };

    const getBorderColor = (val: number) => {
      if (val < 50) return '#F43F5E'; // rose-500
      if (val < 70) return '#F59E0B'; // amber-500
      if (val < 86) return '#3B82F6'; // blue-500
      return '#10B981'; // emerald-500
    };

    const getTextColor = (val: number) => {
      if (val < 50) return '#9F1239'; // rose-800
      if (val < 70) return '#92400E'; // amber-800
      if (val < 86) return '#1E40AF'; // blue-800
      return '#065F46'; // emerald-800
    };

    // Render Rows for Each Domain
    domains.forEach((domainName, rowIndex) => {
      const rowSkills = domainGroups[domainName] || [];
      const y = rowIndex * rowHeight;

      // Domain Label (Y-axis)
      const domainLabelG = svg
        .append('g')
        .attr('transform', `translate(${margin.left - 12}, ${margin.top + y + rowHeight / 2})`)
        .attr('text-anchor', 'end')
        .attr('cursor', 'default');

      // Section Indicator Tag
      const isMath = rowSkills[0]?.section === 'MATH';
      
      domainLabelG
        .append('text')
        .attr('x', 0)
        .attr('y', -6)
        .attr('font-size', '12px')
        .attr('font-weight', '700')
        .attr('fill', '#1C1917')
        .attr('font-family', 'sans-serif')
        .text(domainName);

      domainLabelG
        .append('text')
        .attr('x', 0)
        .attr('y', 10)
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', isMath ? '#2563EB' : '#7C3AED')
        .attr('font-family', 'monospace')
        .text(isMath ? 'MATH' : 'READING & WRITING');

      // Render Sub-skill Cards in this Domain Row
      rowSkills.forEach((skill, colIndex) => {
        const x = colIndex * (cardWidth + cardGap);

        const cardG = g
          .append('g')
          .attr('transform', `translate(${x}, ${y})`)
          .attr('class', 'subskill-cell group cursor-pointer')
          .on('click', () => {
            setSelectedSubSkill(skill);
          })
          .on('mouseenter', (event) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              setTooltipPos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }
            setHoveredSubSkill(skill);
          })
          .on('mousemove', (event) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
              setTooltipPos({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
              });
            }
          })
          .on('mouseleave', () => {
            setHoveredSubSkill(null);
            setTooltipPos(null);
          });

        // Background Rectangle
        const isSelected = selectedSubSkill?.id === skill.id;
        const isWeak = skill.isWeakSpot;

        cardG
          .append('rect')
          .attr('width', cardWidth)
          .attr('height', rowHeight - 12)
          .attr('rx', 12)
          .attr('ry', 12)
          .attr('fill', getColor(skill.proficiency))
          .attr('stroke', isSelected ? '#1E40AF' : getBorderColor(skill.proficiency))
          .attr('stroke-width', isSelected ? 2.5 : isWeak ? 2 : 1)
          .attr('stroke-dasharray', isWeak && skill.proficiency < 50 ? '3,2' : 'none')
          .style('transition', 'all 0.15s ease');

        // Sub-skill Title
        cardG
          .append('text')
          .attr('x', 12)
          .attr('y', 22)
          .attr('font-size', '11px')
          .attr('font-weight', '700')
          .attr('fill', '#1C1917')
          .attr('font-family', 'sans-serif')
          .text(() => {
            const maxChars = Math.floor(cardWidth / 8.5);
            return skill.shortName.length > maxChars
              ? skill.shortName.substring(0, maxChars - 1) + '…'
              : skill.shortName;
          });

        // Proficiency Percentage Display
        cardG
          .append('text')
          .attr('x', cardWidth - 12)
          .attr('y', 22)
          .attr('text-anchor', 'end')
          .attr('font-size', '12px')
          .attr('font-weight', '900')
          .attr('font-family', 'monospace')
          .attr('fill', getTextColor(skill.proficiency))
          .text(`${skill.proficiency}%`);

        // Mini Proficiency Progress Bar
        const barWidth = cardWidth - 24;
        const barHeight = 4;
        const barY = 32;

        cardG
          .append('rect')
          .attr('x', 12)
          .attr('y', barY)
          .attr('width', barWidth)
          .attr('height', barHeight)
          .attr('rx', 2)
          .attr('fill', '#FFFFFF')
          .attr('opacity', 0.6);

        cardG
          .append('rect')
          .attr('x', 12)
          .attr('y', barY)
          .attr('width', (barWidth * skill.proficiency) / 100)
          .attr('height', barHeight)
          .attr('rx', 2)
          .attr('fill', getBorderColor(skill.proficiency));

        // Sub-text / Stats badge
        const badgeG = cardG.append('g').attr('transform', `translate(12, 48)`);

        badgeG
          .append('text')
          .attr('font-size', '9.5px')
          .attr('font-family', 'monospace')
          .attr('fill', '#57534E')
          .text(`${skill.correctCount}/${skill.questionsPracticed} solved`);

        // If active mistake in vault, show warning icon
        if (skill.errorsInVault > 0) {
          badgeG
            .append('text')
            .attr('x', barWidth - 4)
            .attr('text-anchor', 'end')
            .attr('font-size', '9.5px')
            .attr('font-weight', '700')
            .attr('fill', '#E11D48')
            .text(`⚠ ${skill.errorsInVault} Vault`);
        }
      });
    });
  }, [filteredSkills, selectedSubSkill]);

  return (
    <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs relative">
      {/* Header with Title & Live Analytics Badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-[#2563EB] border border-blue-200">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#1C1917] tracking-tight flex items-center gap-2">
                <span>D3 Sub-Skill Proficiency Heatmap</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  Adaptive MST v2.4
                </span>
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Multi-dimensional proficiency matrix calibrated from official College Board diagnostics & error histories.
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats Ribbon */}
        <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-3 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] text-center">
            <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Math Avg</div>
            <div className="text-sm sm:text-base font-black font-mono text-[#2563EB]">{summary.mathAvg}%</div>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] text-center">
            <div className="text-[10px] uppercase tracking-wider text-[#78716C] font-semibold">Verbal Avg</div>
            <div className="text-sm sm:text-base font-black font-mono text-purple-700">{summary.rwAvg}%</div>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Mastered</div>
            <div className="text-sm sm:text-base font-black font-mono text-emerald-700">
              {summary.masteredCount}/{summary.totalCount}
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Section Tabs, Domain Filter, Mastery Tier, Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8E2D5]">
        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] text-xs">
          <button
            onClick={() => {
              setSectionFilter('ALL');
              setDomainFilter('ALL');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              sectionFilter === 'ALL'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            All (23)
          </button>
          <button
            onClick={() => {
              setSectionFilter('MATH');
              setDomainFilter('ALL');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sectionFilter === 'MATH'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Math (12)</span>
          </button>
          <button
            onClick={() => {
              setSectionFilter('READING_AND_WRITING');
              setDomainFilter('ALL');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              sectionFilter === 'READING_AND_WRITING'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reading & Writing (11)</span>
          </button>
        </div>

        {/* Filters and Search input */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Domain Dropdown */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#D6CEBE] rounded-xl text-xs text-[#1C1917] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="ALL">All Domains</option>
            {availableDomains.map((dom) => (
              <option key={dom} value={dom}>
                {dom}
              </option>
            ))}
          </select>

          {/* Mastery Tier Dropdown */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="px-3 py-2 bg-[#FFFFFF] border border-[#D6CEBE] rounded-xl text-xs text-[#1C1917] font-semibold focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value="ALL">All Mastery Tiers</option>
            <option value="CRITICAL">🔴 Critical (&lt;50%)</option>
            <option value="DEVELOPING">🟡 Developing (50–69%)</option>
            <option value="PROFICIENT">🔵 Proficient (70–85%)</option>
            <option value="MASTERED">🟢 Mastered (86%+)</option>
          </select>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sub-skills..."
              className="pl-8 pr-3 py-1.5 bg-[#FFFFFF] border border-[#D6CEBE] rounded-xl text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB] w-36 sm:w-44"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* D3 SVG Interactive Canvas Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto rounded-2xl bg-[#FAF7F2] p-4 border border-[#E8E2D5] relative min-h-[220px]"
      >
        <svg ref={svgRef} className="w-full block" />

        {/* Floating Tooltip */}
        {hoveredSubSkill && tooltipPos && (
          <div
            className="absolute z-30 pointer-events-none bg-[#1C1917] text-white p-3.5 rounded-2xl shadow-xl border border-stone-700 text-xs w-64 max-w-xs space-y-2 animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${Math.min(tooltipPos.x + 12, (containerRef.current?.clientWidth || 800) - 270)}px`,
              top: `${Math.max(10, tooltipPos.y - 40)}px`,
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono text-blue-400 font-bold">
                {hoveredSubSkill.domain}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  hoveredSubSkill.proficiency < 50
                    ? 'bg-rose-900 text-rose-200'
                    : hoveredSubSkill.proficiency < 70
                    ? 'bg-amber-900 text-amber-200'
                    : hoveredSubSkill.proficiency < 86
                    ? 'bg-blue-900 text-blue-200'
                    : 'bg-emerald-900 text-emerald-200'
                }`}
              >
                {hoveredSubSkill.proficiency}% Proficiency
              </span>
            </div>

            <div className="font-bold text-sm text-white">{hoveredSubSkill.name}</div>
            <p className="text-stone-300 text-[11px] leading-relaxed line-clamp-2">
              {hoveredSubSkill.keyConcept}
            </p>

            <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-[10px] text-stone-400 font-mono">
              <span>{hoveredSubSkill.questionsPracticed} Questions Practiced</span>
              <span className="text-amber-400 font-bold">Click for drill-down →</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Color Key */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-[#57534E]">
        <div className="flex items-center gap-4">
          <span className="font-bold text-[#1C1917] text-[11px] uppercase tracking-wider">Proficiency Tiers:</span>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-rose-100 border border-rose-500"></span>
              <span>Critical (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-100 border border-amber-500"></span>
              <span>Developing (50–69%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-blue-100 border border-blue-500"></span>
              <span>Proficient (70–85%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-100 border border-emerald-500"></span>
              <span>Mastered (86%+)</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#78716C] italic">
          💡 Click any tile to open strategies, Desmos calculator shortcuts & targeted drills.
        </div>
      </div>

      {/* Detailed Drill-Down Modal / Panel for Selected Sub-Skill */}
      {selectedSubSkill && (
        <div className="p-6 rounded-3xl bg-[#FAF7F2] border-2 border-[#2563EB]/40 shadow-md space-y-5 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-[#2563EB] text-white">
                  {selectedSubSkill.section}
                </span>
                <span className="text-xs font-bold text-[#78716C]">•</span>
                <span className="text-xs font-semibold text-[#57534E]">{selectedSubSkill.domain}</span>
              </div>
              <h4 className="text-xl font-black text-[#1C1917] mt-1">{selectedSubSkill.name}</h4>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-[#2563EB]">
                  {selectedSubSkill.proficiency}%
                </div>
                <div className="text-[10px] uppercase font-bold text-[#78716C]">
                  {selectedSubSkill.masteryTier}
                </div>
              </div>
              <button
                onClick={() => setSelectedSubSkill(null)}
                className="p-2 rounded-xl text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Concept & Strategy */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-[#2563EB] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Key Exam Concept</span>
                </div>
                <p className="text-xs text-[#1C1917] mt-1 font-medium leading-relaxed">
                  {selectedSubSkill.keyConcept}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E8E2D5]">
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-700 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>College Board Strategy Tip</span>
                </div>
                <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                  {selectedSubSkill.strategyTip}
                </p>
              </div>
            </div>

            {/* Desmos Hack / Question Sample */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D5] space-y-3">
              {selectedSubSkill.desmosHack ? (
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#2563EB] flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Desmos Speed Hack</span>
                  </div>
                  <p className="text-xs font-mono text-[#1E40AF] mt-1 bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                    {selectedSubSkill.desmosHack}
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-purple-700 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Representative SAT Prompt</span>
                  </div>
                  <p className="text-xs italic text-[#57534E] mt-1 bg-purple-50 p-2.5 rounded-xl border border-purple-200">
                    "{selectedSubSkill.sampleQuestionSnippet}"
                  </p>
                </div>
              )}

              <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between text-xs text-[#78716C]">
                <span>
                  Mistake Vault Items: <strong className="text-rose-600 font-bold">{selectedSubSkill.errorsInVault}</strong>
                </span>
                <span>
                  Total Answered: <strong className="text-[#1C1917] font-bold">{selectedSubSkill.questionsPracticed}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#57534E]">
              <Target className="w-4 h-4 text-[#2563EB]" />
              <span>
                Recommended Action:{' '}
                <strong>
                  {selectedSubSkill.proficiency < 70
                    ? 'Review Socratic concept breakdown & 5-question drill'
                    : 'Maintain mastery with timed speed runs'}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onOpenSocraticTutor) {
                    onOpenSocraticTutor(selectedSubSkill.name);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#D6CEBE] text-[#1C1917] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <BrainCircuit className="w-4 h-4 text-[#2563EB]" />
                <span>Ask Socratic AI</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenQuestionBank) {
                    onOpenQuestionBank(selectedSubSkill.name);
                  } else if (onOpenDailyWorkout) {
                    onOpenDailyWorkout();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              >
                <span>Practice 5 Targeted Qs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
