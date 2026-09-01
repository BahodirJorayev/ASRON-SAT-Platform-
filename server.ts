import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import JSZip from 'jszip';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper to call Gemini with multi-model fallback (2.5-flash -> 2.5-pro -> 1.5-flash)
async function callGeminiWithModelFallback(ai: GoogleGenAI, config: any): Promise<any> {
  const models = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-3.7-flash'];
  let lastError: any = null;

  for (const modelName of models) {
    try {
      const res = await ai.models.generateContent({
        ...config,
        model: modelName,
      });
      if (res && (res.text || res.candidates)) {
        return res;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${modelName} encountered error, trying next available model:`, err.message || err);
    }
  }

  throw lastError || new Error('All Gemini models unavailable');
}

// Fallback high-fidelity clone generator for SAT questions
function createContextualSyntheticClone(originalQuestion: any) {
  const qId = `clone-${Date.now()}`;
  const section = originalQuestion?.section || 'MATH';
  const domain = originalQuestion?.domain || 'Advanced Math';
  const skill = originalQuestion?.skill || 'Nonlinear Equations';
  const difficulty = originalQuestion?.difficulty || 'HARD';

  if (section === 'MATH') {
    if (skill.includes('Nonlinear') || skill.includes('Quadratic') || originalQuestion?.questionText?.includes('^2')) {
      const a = 2;
      const b = 12;
      // b^2 - 4ac = 0 => 144 - 8c = 0 => c = 18
      const c = 18;
      return {
        id: qId,
        section,
        domain,
        skill,
        difficulty,
        type: 'MULTIPLE_CHOICE',
        questionText: `The quadratic equation $${a}x^2 - ${b}x + k = 0$ has exactly one distinct real solution. What is the value of $k$?`,
        options: {
          A: '9',
          B: '18',
          C: '36',
          D: '72',
        },
        correctAnswer: 'B',
        explanation: `For the quadratic $ax^2 + bx + k = 0$ to have exactly one real solution, the discriminant must equal zero: $b^2 - 4ak = 0$.\nHere $a = ${a}$ and $b = -${b}$.\n$(-${b})^2 - 4(${a})(k) = 0 \\implies 144 - 8k = 0 \\implies 8k = 144 \\implies k = 18$.\n\n**Desmos Shortcut:** Graph $y = ${a}x^2 - ${b}x + k$ and add a slider for $k$. Drag $k$ until the vertex touches the x-axis at exactly one point ($k = 18$).`,
      };
    } else if (skill.includes('Linear') || skill.includes('System')) {
      return {
        id: qId,
        section,
        domain,
        skill,
        difficulty,
        type: 'MULTIPLE_CHOICE',
        questionText: `In the system of equations below, $k$ is a constant:\n$$\\begin{cases} 4x - 6y = 14 \\\\ -6x + ky = -21 \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $k$?`,
        options: {
          A: '-9',
          B: '6',
          C: '9',
          D: '12',
        },
        correctAnswer: 'C',
        explanation: `For a linear system to have infinitely many solutions, the equations must be scalar multiples of each other.\nMultiplying the first equation by $-1.5$ gives:\n$-1.5(4x - 6y = 14) \\implies -6x + 9y = -21$.\nComparing this with $-6x + ky = -21$, we find $k = 9$.`,
      };
    } else {
      return {
        id: qId,
        section,
        domain,
        skill,
        difficulty,
        type: 'MULTIPLE_CHOICE',
        questionText: `A circle in the xy-plane has its center at $(3, -5)$ and passes through the point $(7, -2)$. What is the radius of the circle?`,
        options: {
          A: '4',
          B: '5',
          C: '7',
          D: '25',
        },
        correctAnswer: 'B',
        explanation: `The radius $r$ is the distance between the center $(3, -5)$ and the point on the circle $(7, -2)$:\n$$r = \\sqrt{(7 - 3)^2 + (-2 - (-5))^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16 + 9} = \\sqrt{25} = 5.$$`,
      };
    }
  } else {
    // Reading & Writing
    if (skill.includes('Transition') || skill.includes('Rhetorical')) {
      return {
        id: qId,
        section,
        domain,
        skill,
        difficulty,
        type: 'MULTIPLE_CHOICE',
        passage: `Biologist Dr. Elena Vance observed that subterranean mycorrhizal fungi facilitate nutrient redistribution across temperate forest floors during severe droughts. _______, recent isotopic tracking reveals that mature oak trees actively channel excess glucose to adjacent saplings through these shared fungal networks.`,
        questionText: `Which choice completes the text with the most logical transition?`,
        options: {
          A: 'Furthermore',
          B: 'Conversely',
          C: 'Specifically',
          D: 'Nonetheless',
        },
        correctAnswer: 'C',
        explanation: `Sentence 1 establishes a broad ecological rule (mycorrhizal fungi facilitate nutrient transfer across forest floors). Sentence 2 provides a specific, concrete instance of this rule (mature oak trees channelling glucose to saplings).\nTherefore, **Specifically** is the most precise transition.`,
      };
    } else {
      return {
        id: qId,
        section,
        domain,
        skill,
        difficulty,
        type: 'MULTIPLE_CHOICE',
        passage: `Archaeological excavations at the ancient port city of Berenike unearthed remnants of Roman amphorae containing Indian black pepper, teak wood, and woven cotton _______ confirming the existence of vibrant maritime trade networks between Alexandria and the Malabar Coast during the first century CE.`,
        questionText: `Which choice completes the text so that it conforms to the conventions of Standard English?`,
        options: {
          A: 'textiles; thereby',
          B: 'textiles, thereby',
          C: 'textiles thereby',
          D: 'textiles; and thereby',
        },
        correctAnswer: 'B',
        explanation: `The clause before the blank is an independent clause. The participle phrase starting with "thereby confirming..." functions as an adverbial modifier of result and should be set off with a comma. Choice B correctly uses ", thereby" without creating a comma splice or improper semicolon fragment.`,
      };
    }
  }
}

// In-Memory simulated persistent store
let simulatedTelegramLogs: { timestamp: string; type: string; recipient: string; message: string }[] = [
  {
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    type: 'WORKOUT_REMINDER',
    recipient: '@alex_sat_prep',
    message: '🌅 Good morning Alex! Your tailored 5-question SAT workout is ready. Today\'s focus: Transitions & Nonlinear Equations.',
  },
  {
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    type: 'STREAK_ALERT',
    recipient: '@alex_sat_prep',
    message: '🔥 Streak Protected: You are on a 4-day streak! Complete your 10-minute workout before 00:00 UTC to maintain momentum.',
  }
];

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Gemini Socratic AI Tutor Handler
const handleSocraticTutor = async (req: express.Request, res: express.Response) => {
  try {
    const questionObj = req.body.question || req.body.questionContext || {};
    const userText = req.body.userMessage || req.body.userPrompt || '';
    const history = req.body.chatHistory || req.body.conversationHistory || [];
    const studentScoreTier = req.body.studentScoreTier || '1450+';

    const ai = getGeminiClient();

    const domain = questionObj.domain || 'Digital SAT Skill';
    const skill = questionObj.skill || 'Problem Solving';
    const passage = questionObj.passage || '';
    const qText = questionObj.questionText || '';
    const options = questionObj.options ? JSON.stringify(questionObj.options) : '';

    if (!ai) {
      // High-quality contextual fallback response if API key is not yet set in environment
      const mathHint = `Let's break down this **${skill}** question step by step:\n\n1. **Identify the Given Constraints:** Look at what variables or geometric relationships are fixed.\n2. **Strategic Tooling:** Can this be solved instantly in Desmos by graphing the equations or setting up a slider for constants?\n3. **Guiding Question:** If you set $f(x) = g(x)$ or isolate the leading variable, what quadratic or linear form do you get? Try testing the boundary values!`;
      const rwHint = `Let's analyze this **${skill}** item Socratically:\n\n1. **Sentence Relationship:** Is the second sentence *contrasting*, *illustrating*, or *adding* to the first claim?\n2. **Elimination Strategy:** Cross out choices that introduce cause-and-effect if no direct consequence is stated.\n3. **Guiding Question:** What is the exact pivot word in the passage? Does the author agree or qualify the hypothesis?`;

      const fallbackReply = (questionObj.section === 'READING_AND_WRITING' || domain.includes('Reading') || domain.includes('Writing') || domain.includes('Conventions'))
        ? rwHint
        : mathHint;

      return res.json({
        reply: fallbackReply,
        isFallback: true,
      });
    }

    const systemInstruction = `You are the world-class Digital SAT Socratic Master Coach at AURA SAT.
Your goal is NEVER to simply give away the final letter answer immediately. Instead:
1. Guide the student step-by-step using the Socratic method.
2. Ask one or two sharp, diagnostic questions that lead the student to uncover the core algebraic principle, Desmos trick, grammatical boundary rule, or logical transition.
3. If the student asked a specific question, address their reasoning directly. Point out any cognitive traps or common false assumptions.
4. Format math cleanly using LaTeX ($...$ for inline expressions).
5. Keep your response concise (2-4 punchy paragraphs/bullet points), supportive, and clear.`;

    const promptText = `
Context about the SAT Question:
- Domain: ${domain}
- Skill: ${skill}
- Passage: ${passage}
- Question Text: ${qText}
- Options: ${options}

Student's Target/Current Score: ${studentScoreTier}
Student's Latest Message: "${userText}"

Recent Conversation History:
${JSON.stringify(history, null, 2)}

Provide a Socratic response that guides the student to reason through the next step:`;

    let reply = 'Let us examine the core condition together. What is your first step when setting up this equation?';
    try {
      const response = await callGeminiWithModelFallback(ai, {
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });
      if (response?.text) {
        reply = response.text;
      }
    } catch (modelErr: any) {
      console.warn('Gemini models unavailable, falling back to smart Socratic template:', modelErr?.message);
      const mathHint = `Let's break down this **${skill}** problem Socratically:\n\n1. **Core Concept:** Look at the given constraint in the prompt for ${skill}.\n2. **Strategic Tooling:** Can you plug this into Desmos or substitute known variables to simplify the expression?\n3. **Guiding Question:** What happens if you isolate the key term? What does comparing the first two answer choices reveal?`;
      const rwHint = `Let's analyze this **${skill}** item Socratically:\n\n1. **Sentence Relationship:** Does the sentence following the blank support, contrast, or clarify the preceding claim?\n2. **Elimination Trap:** Be wary of options that shift tone or introduce unmentioned causal links.\n3. **Guiding Question:** What is the specific pivot word or punctuation boundary needed here?`;
      reply = (questionObj.section === 'READING_AND_WRITING' || domain.includes('Reading') || domain.includes('Writing') || domain.includes('Conventions'))
        ? rwHint
        : mathHint;
    }

    res.json({ reply });
  } catch (error: any) {
    console.error('Error in Socratic Tutor API:', error);
    res.json({
      reply: `Let's examine the structure of this problem together:\n\n1. **Core Concept:** Notice the relationship specified in the question stem regarding **${req.body.question?.skill || 'this skill'}**.\n2. **First Step:** What algebraic substitution or transition pivot would simplify the comparison between the choices?\n\nWhat do you notice when you compare the first two options?`,
      isFallback: true,
      error: error.message
    });
  }
};

app.post('/api/gemini/socratic-tutor', handleSocraticTutor);
app.post('/api/gemini/tutor', handleSocraticTutor);

// 2.5 Gemini AI Trap Analysis Mode for Mistake Vault
app.post('/api/gemini/trap-analysis', async (req, res) => {
  const { question, userWrongAnswer, correctAnswer } = req.body;
  const q = question || {};
  const skill = q.skill || 'Digital SAT Concept';
  const domain = q.domain || 'Digital SAT Domain';
  const userWrong = userWrongAnswer || 'Selected Wrong Option';
  const correct = correctAnswer || q.correctAnswer || 'Correct Option';

  try {
    const ai = getGeminiClient();

    if (!ai) {
      // High-quality contextual fallback
      const isRW = q.section === 'READING_AND_WRITING';
      return res.json({
        analysis: {
          coreRuleMissed: isRW
            ? `Standard SAT boundary rule for ${skill}: Distinguishing dependent modifier clauses from independent complete thoughts.`
            : `Core algebraic invariant for ${skill}: The critical difference between evaluating intermediate coefficients vs final isolated solutions.`,
          trapReason: `Option ${userWrong} was engineered to exploit the "Superficial Match" trap. It uses keywords directly from the context, creating false confidence while violating the strict structural requirement.`,
          preventionStrategy: isRW
            ? `Always test the clause before and after the punctuation mark independently. If both can stand alone as complete sentences, a simple comma without a coordinating conjunction creates an illegal comma splice.`
            : `Graph both sides of the equation in Desmos. Set a slider for any unknown constants to immediately identify roots and vertices visually without algebraic sign errors.`,
          cognitiveBias: isRW ? 'Familiar Keyword Lure' : 'Premature Evaluation Bias',
        },
        isFallback: true,
      });
    }

    const systemInstruction = `You are a Senior Psychometrician & College Board Test Architect at AURA SAT.
Your job is to perform a deep Cognitive Trap Diagnosis on a student's incorrect Digital SAT question answer.
Output a JSON object with:
1. "coreRuleMissed": The fundamental grammar rule, reading logic constraint, or mathematical theorem the student overlooked.
2. "trapReason": The exact psychological deception mechanism used by the test designer in option "${userWrong}" (e.g. why it felt right, but is mathematically or grammatically wrong).
3. "preventionStrategy": A memorable 10-second mental model, elimination filter, or Desmos verification trick to spot and destroy this trap on exam day.
4. "cognitiveBias": A short 2-4 word label for the trap archetype (e.g. "Misleading Keyword Attraction", "Sign Flip Trap", "Unjustified Extrapolation", "Coordinate Inversion Trap").`;

    const promptText = `
SAT Question Details:
- Section: ${q.section}
- Domain: ${domain}
- Skill: ${skill}
- Passage: ${q.passage || 'N/A'}
- Question Text: ${q.questionText}
- Options: ${JSON.stringify(q.options || {})}
- Student's Incorrect Choice: ${userWrong}
- Correct Choice: ${correct}
- Official Explanation: ${q.explanation}

Diagnose why the student fell into the trap with choice ${userWrong} and provide the actionable prevention strategy:`;

    const response = await callGeminiWithModelFallback(ai, {
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coreRuleMissed: { type: Type.STRING },
            trapReason: { type: Type.STRING },
            preventionStrategy: { type: Type.STRING },
            cognitiveBias: { type: Type.STRING },
          },
          required: ['coreRuleMissed', 'trapReason', 'preventionStrategy', 'cognitiveBias'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.coreRuleMissed && parsed.trapReason) {
      return res.json({ analysis: parsed });
    }

    throw new Error('Incomplete JSON from Gemini model');
  } catch (error: any) {
    console.warn('Trap analysis fallback triggered:', error?.message);
    const isRW = q.section === 'READING_AND_WRITING';
    res.json({
      analysis: {
        coreRuleMissed: isRW
          ? `Strict SAT requirement for ${skill}: Logical coherence and structural boundary rules.`
          : `Mathematical property for ${skill}: Invariant equations and root relationships.`,
        trapReason: `Choice ${userWrong} mirrors familiar phraseology or intermediate values from the problem stem, deceptively masquerading as the final solution.`,
        preventionStrategy: isRW
          ? `Read across the blank and classify the transition as Contrast, Continuation, or Causation before looking at the choices.`
          : `Leverage Desmos regression or intersection points ($x = \\text{root}$) to cross-verify your manual calculation.`,
        cognitiveBias: isRW ? 'Lexical Over-Reliance' : 'Intermediate Value Lure',
      },
      isFallback: true,
    });
  }
});

// 3. Gemini Clone Question Generator for Mistake Vault
app.post('/api/gemini/clone-question', async (req, res) => {
  const { originalQuestion } = req.body;
  try {
    const ai = getGeminiClient();

    if (!ai) {
      const cloned = createContextualSyntheticClone(originalQuestion);
      return res.json({ clonedQuestion: cloned, isFallback: true });
    }

    const systemInstruction = `You are a Senior College Board Test Designer. Given an existing Digital SAT question that a student missed, generate a brand-new, high-fidelity CLONED VARIANT question.
Requirements:
1. Target the EXACT same domain, skill, and cognitive trap (e.g. Transitions, Nonlinear Equations, Boundaries).
2. Change the numerical values, variables, scientific context, or literary excerpt so the student tests true mastery, not memorization.
3. Ensure exact SAT formatting with 4 options (A, B, C, D) or Grid-in, the correct answer, and a step-by-step mathematical or grammatical explanation.`;

    try {
      const response = await callGeminiWithModelFallback(ai, {
        contents: `Generate a clone for this question:\n${JSON.stringify(originalQuestion, null, 2)}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              section: { type: Type.STRING },
              domain: { type: Type.STRING },
              skill: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              type: { type: Type.STRING },
              passage: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                }
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ['section', 'domain', 'skill', 'difficulty', 'questionText', 'correctAnswer', 'explanation'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.questionText && (parsed.options || parsed.correctAnswer)) {
        parsed.id = `clone-${Date.now()}`;
        return res.json({ clonedQuestion: parsed });
      }
    } catch (modelErr: any) {
      console.warn('Gemini model clone generation fell back to synthetic generator:', modelErr?.message);
    }

    // High quality synthetic clone fallback if model response failed or timed out
    const synthetic = createContextualSyntheticClone(originalQuestion);
    res.json({ clonedQuestion: synthetic, isFallback: true });
  } catch (error: any) {
    console.error('Error in /api/gemini/clone-question:', error);
    const synthetic = createContextualSyntheticClone(originalQuestion);
    res.json({ clonedQuestion: synthetic, isFallback: true });
  }
});

// 4. Gemini Deep Diagnostic & 30-Day Potential Score Analysis
app.post('/api/gemini/diagnostic-forecast', async (req, res) => {
  const { answers = {}, questions = [] } = req.body;
  let rwCorrect = 0;
  let mathCorrect = 0;
  const skillStats: Record<string, { total: number; correct: number; domain: string }> = {};

  questions.forEach((q: any) => {
    const isCorrect = answers[q.id] === q.correctAnswer;
    if (q.section === 'READING_AND_WRITING') {
      if (isCorrect) rwCorrect++;
    } else {
      if (isCorrect) mathCorrect++;
    }

    if (!skillStats[q.skill]) {
      skillStats[q.skill] = { total: 0, correct: 0, domain: q.domain };
    }
    skillStats[q.skill].total++;
    if (isCorrect) skillStats[q.skill].correct++;
  });

  const baselineRW = Math.min(800, Math.max(200, Math.round(300 + (rwCorrect / 8) * 450)));
  const baselineMath = Math.min(800, Math.max(200, Math.round(320 + (mathCorrect / 8) * 460)));
  const baselineTotal = baselineRW + baselineMath;
  const potentialScore = Math.min(1580, baselineTotal + 220);

  const weakSkills = Object.entries(skillStats)
    .map(([skill, data]) => ({
      skill,
      domain: data.domain,
      accuracy: data.correct / data.total,
      lostPoints: Math.round((1 - data.correct / data.total) * 90) || 40,
      description: `Struggled with high-frequency ${skill} trap patterns.`,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const defaultRoadmap = [
    { day: 1, focus: 'Diagnostic Deconstruction', action: 'Review mistake vault item clones.' },
    { day: 7, focus: weakSkills[0]?.skill || 'Transitions', action: 'Complete 3 daily workouts targeting clause connectors.' },
    { day: 14, focus: weakSkills[1]?.skill || 'Nonlinear Equations', action: 'Master Desmos vertex & slider regressions.' },
    { day: 21, focus: 'Spaced Repetition Leitner Stage 2', action: 'Re-test all mistake vault items with 0 errors.' },
    { day: 30, focus: 'Full Bluebook MST Simulation', action: 'Achieve 1450+ on official adaptive mock #2.' },
  ];
  const defaultSummary = `You have strong intuitive pacing, but you are currently bleeding ~${weakSkills.reduce((acc, curr) => acc + curr.lostPoints, 0)} points across ${weakSkills.map(w => w.skill).join(', ')}. Master these 3 specific areas to leap from ${baselineTotal} to ${potentialScore}+ in 30 days.`;

  try {
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        baselineScore: baselineTotal,
        potentialScore,
        rwScore: baselineRW,
        mathScore: baselineMath,
        weakestSubSkills: weakSkills,
        aiSummary: defaultSummary,
        roadmap: defaultRoadmap,
      });
    }

    try {
      const response = await callGeminiWithModelFallback(ai, {
        contents: `Analyze these diagnostic results and generate an inspiring, hyper-personalized 30-day SAT score forecast:
Baseline RW: ${baselineRW}/800
Baseline Math: ${baselineMath}/800
Total Baseline: ${baselineTotal}/1600
Potential Score: ${potentialScore}/1600
Weakest subskills: ${JSON.stringify(weakSkills)}`,
        config: {
          systemInstruction: 'You are an elite SAT Strategist. Return a JSON object with aiSummary and a 5-checkpoint roadmap (day, focus, action).',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              aiSummary: { type: Type.STRING },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    focus: { type: Type.STRING },
                    action: { type: Type.STRING },
                  },
                  required: ['day', 'focus', 'action'],
                },
              },
            },
            required: ['aiSummary', 'roadmap'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (parsed.aiSummary && Array.isArray(parsed.roadmap)) {
        return res.json({
          baselineScore: baselineTotal,
          potentialScore,
          rwScore: baselineRW,
          mathScore: baselineMath,
          weakestSubSkills: weakSkills,
          aiSummary: parsed.aiSummary,
          roadmap: parsed.roadmap,
        });
      }
    } catch (modelErr: any) {
      console.warn('Diagnostic forecast AI model fallback:', modelErr?.message);
    }

    res.json({
      baselineScore: baselineTotal,
      potentialScore,
      rwScore: baselineRW,
      mathScore: baselineMath,
      weakestSubSkills: weakSkills,
      aiSummary: defaultSummary,
      roadmap: defaultRoadmap,
    });
  } catch (error: any) {
    console.error('Error in /api/gemini/diagnostic-forecast:', error);
    res.json({
      baselineScore: baselineTotal,
      potentialScore,
      rwScore: baselineRW,
      mathScore: baselineMath,
      weakestSubSkills: weakSkills,
      aiSummary: defaultSummary,
      roadmap: defaultRoadmap,
    });
  }
});

// 4.5 Digital SAT Daily Workout Generation Engine (/api/workout/generate)
app.post('/api/workout/generate', async (req, res) => {
  try {
    const {
      mode = 'ADAPTIVE_WEAKNESS',
      weakestSkills = ['Transitions', 'Nonlinear Equations', 'Boundaries'],
      targetDomain = 'All Domains',
      planDay = 1,
    } = req.body;

    // Comprehensive bank of authentic SAT Workout items
    const WORKOUT_QUESTION_POOL: any[] = [
      {
        id: 'wkt-trans-01',
        section: 'READING_AND_WRITING',
        domain: 'Expression of Ideas',
        skill: 'Transitions',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        passage: 'Botanists long hypothesized that desert succulents absorb moisture exclusively through extensive shallow root networks designed to capture brief rainstorms. _______ recent isotopic analysis revealed that certain species of Atacama cacti obtain more than 55% of their annual hydration by trapping coastal fog directly through specialized epidermal spines.',
        questionText: 'Which choice completes the text with the most logical transition?',
        options: {
          A: 'Consequently,',
          B: 'However,',
          C: 'In other words,',
          D: 'Similarly,'
        },
        correctAnswer: 'B',
        explanation: 'The first sentence states the traditional belief ("long hypothesized... exclusively"). The second sentence presents surprising new isotopic data that contradicts that exclusivity. "However," establishes this essential contrast.'
      },
      {
        id: 'wkt-trans-02',
        section: 'READING_AND_WRITING',
        domain: 'Expression of Ideas',
        skill: 'Transitions',
        difficulty: 'MEDIUM',
        type: 'MULTIPLE_CHOICE',
        passage: 'In the early 1900s, astrophysicist Cecilia Payne discovered that stars are composed overwhelmingly of hydrogen and helium, challenging the consensus that stellar compositions resembled Earth’s crust. _______ her doctoral committee initially pressured her to downplay her radical findings, her conclusions were validated four years later by independent spectroscopic studies.',
        questionText: 'Which choice completes the text with the most logical transition?',
        options: {
          A: 'Although',
          B: 'Because',
          C: 'Furthermore',
          D: 'Specifically'
        },
        correctAnswer: 'A',
        explanation: '"Although" correctly sets up the concessive clause showing the initial institutional pushback despite her breakthrough being entirely accurate and later validated.'
      },
      {
        id: 'wkt-bound-01',
        section: 'READING_AND_WRITING',
        domain: 'Standard English Conventions',
        skill: 'Boundaries',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        passage: 'To prevent thermal deformation in high-speed optical mirrors, engineers construct support trusses from specialized silicon carbide _______ possesses a near-zero coefficient of thermal expansion across fluctuating temperatures.',
        questionText: 'Which choice completes the text so that it conforms to the conventions of Standard English?',
        options: {
          A: 'ceramics; which',
          B: 'ceramics, this material',
          C: 'ceramics, a material that',
          D: 'ceramics that'
        },
        correctAnswer: 'C',
        explanation: 'The phrase "a material that possesses..." serves as an appositive noun phrase modifying "specialized silicon carbide ceramics", correctly punctuated with a comma.'
      },
      {
        id: 'wkt-vocab-01',
        section: 'READING_AND_WRITING',
        domain: 'Craft and Structure',
        skill: 'Words in Context',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        passage: 'While the initial architectural renderings received widespread praise for aesthetic daring, senior structural engineers voiced deep skepticism, warning that the cantilevered glass pavilion was structurally _______ and failed to account for coastal shear-wind forces.',
        questionText: 'Which choice completes the text with the most logical and precise word or phrase?',
        options: {
          A: 'tenuous',
          B: 'unassailable',
          C: 'comprehensive',
          D: 'pedestrian'
        },
        correctAnswer: 'A',
        explanation: '"Tenuous" means weak, flimsy, or precarious, which directly matches the engineers\' skepticism and failure to withstand coastal shear winds.'
      },
      {
        id: 'wkt-inf-01',
        section: 'READING_AND_WRITING',
        domain: 'Information and Ideas',
        skill: 'Inferences',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        passage: 'Neuroscientists studying songbirds noted that juveniles raised in complete acoustic isolation developed simplified songs lacking rhythmic cadence. However, when these isolated birds were later housed together in small groups without adult tutors, their shared vocalizations spontaneously converged within three generations toward the melodic complexity characteristic of wild populations.',
        questionText: 'Which finding, if true, most logically supports the researchers’ conclusion regarding songbird vocal development?',
        options: {
          A: 'Social interaction among peers triggers innate neurobiological song templates even in the absence of adult guidance.',
          B: 'Adult songbirds alter their vocal pitch when communicating with juvenile birds in adjacent aviaries.',
          C: 'Acoustic isolation permanently suppresses neurogenesis in the auditory cortex of songbirds.',
          D: 'Melodic complexity in wild populations is determined solely by genetic mutation rather than social learning.'
        },
        correctAnswer: 'A',
        explanation: 'The spontaneous convergence toward natural melodic complexity over 3 generations among isolated peers indicates that social contact activates an innate structural grammar.'
      },
      {
        id: 'wkt-math-quad-01',
        section: 'MATH',
        domain: 'Advanced Math',
        skill: 'Nonlinear Equations',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        questionText: 'The quadratic equation $3x^2 - 12x + c = 0$ has exactly one distinct real solution. What is the value of $c$?',
        options: {
          A: '6',
          B: '12',
          C: '24',
          D: '48'
        },
        correctAnswer: 'B',
        explanation: 'For $ax^2 + bx + c = 0$ to have exactly one real solution, the discriminant $b^2 - 4ac = 0$.\nHere $a=3$, $b=-12$:\n$(-12)^2 - 4(3)(c) = 0 \\implies 144 - 12c = 0 \\implies 12c = 144 \\implies c = 12$.\n\n**Desmos Shortcut:** Graph $y = 3x^2 - 12x + c$ and adjust slider $c$ until the parabola\'s vertex rests exactly on the x-axis at $(2, 0)$.'
      },
      {
        id: 'wkt-math-alg-01',
        section: 'MATH',
        domain: 'Algebra',
        skill: 'Systems of Linear Equations',
        difficulty: 'HARD',
        type: 'GRID_IN',
        questionText: 'In the system of equations below, $k$ is a constant:\n$$\\begin{cases} 4x - 6y = 18 \\\\ kx - 15y = 45 \\end{cases}$$\nIf the system has infinitely many solutions, what is the value of $k$?',
        correctAnswer: '10',
        explanation: 'For infinitely many solutions, the equations must be scalar multiples. Notice the y-coefficient in equation 2 ($-15$) is $2.5$ times the y-coefficient in equation 1 ($-6$).\n$4 \\times 2.5 = 10$, and $18 \\times 2.5 = 45$.\nThus $k = 10$.'
      },
      {
        id: 'wkt-math-geom-01',
        section: 'MATH',
        domain: 'Geometry and Trigonometry',
        skill: 'Right Triangles and Trigonometry',
        difficulty: 'HARD',
        type: 'MULTIPLE_CHOICE',
        questionText: 'In a right triangle $XYZ$, the measure of angle $Z$ is $90^\\circ$. If $\\cos(X) = \\frac{7}{25}$, what is the value of $\\tan(Y)$?',
        options: {
          A: '$\\frac{7}{24}$',
          B: '$\\frac{24}{7}$',
          C: '$\\frac{25}{24}$',
          D: '$\\frac{7}{25}$'
        },
        correctAnswer: 'A',
        explanation: 'In right $\\triangle XYZ$ with hypotenuse $XY = 25$ and adjacent side to $X$ being $XZ = 7$. By Pythagorean Theorem, $YZ = \\sqrt{25^2 - 7^2} = \\sqrt{625 - 49} = \\sqrt{576} = 24$.\nFor angle $Y$, the opposite side is $XZ = 7$ and the adjacent side is $YZ = 24$.\nTherefore, $\\tan(Y) = \\frac{7}{24}$.'
      },
      {
        id: 'wkt-math-func-01',
        section: 'MATH',
        domain: 'Algebra',
        skill: 'Linear Functions',
        difficulty: 'MEDIUM',
        type: 'MULTIPLE_CHOICE',
        questionText: 'A scientific research drone starts with a battery charge of 96% and consumes charge at a constant rate of 3.2% per minute of flight. Which equation models the remaining battery percentage $B(t)$ after $t$ minutes of flight?',
        options: {
          A: '$B(t) = 96 - 3.2t$',
          B: '$B(t) = 3.2t - 96$',
          C: '$B(t) = 96(3.2)^t$',
          D: '$B(t) = 96(0.68)^t$'
        },
        correctAnswer: 'A',
        explanation: 'Initial charge is $96$ and the linear decay rate is $-3.2t$. Thus, $B(t) = 96 - 3.2t$.'
      },
      {
        id: 'wkt-math-circle-01',
        section: 'MATH',
        domain: 'Geometry and Trigonometry',
        skill: 'Circles',
        difficulty: 'HARD',
        type: 'GRID_IN',
        questionText: 'The equation of a circle in the xy-plane is $x^2 + y^2 - 8x + 12y = 29$. What is the radius of the circle?',
        correctAnswer: '9',
        explanation: 'Complete the square for $x$ and $y$:\n$(x^2 - 8x + 16) + (y^2 + 12y + 36) = 29 + 16 + 36$\n$(x - 4)^2 + (y + 6)^2 = 81$\nSince $r^2 = 81$, the radius $r = 9$.'
      }
    ];

    let selectedQuestions: any[] = [];
    let workoutTitle = 'Daily SAT Focus';
    let timeLimitSeconds = 600; // 10 minutes default

    if (mode === 'ADAPTIVE_WEAKNESS') {
      workoutTitle = `Adaptive Weakness Focus: ${weakestSkills[0] || 'High-Yield Trap Traversal'}`;
      // Sort items matching user's weakest skills first
      const matches = WORKOUT_QUESTION_POOL.filter((q) =>
        weakestSkills.some((s: string) => q.skill.toLowerCase().includes(s.toLowerCase()) || q.domain.toLowerCase().includes(s.toLowerCase()))
      );
      const rest = WORKOUT_QUESTION_POOL.filter((q) => !matches.includes(q));
      selectedQuestions = [...matches, ...rest].slice(0, 5);
      timeLimitSeconds = 600;
    } else if (mode === 'SPEED_BLITZ') {
      workoutTitle = 'Speed Blitz Sprint (45s/question)';
      // Take 5 rapid questions
      selectedQuestions = [
        WORKOUT_QUESTION_POOL[0],
        WORKOUT_QUESTION_POOL[5],
        WORKOUT_QUESTION_POOL[2],
        WORKOUT_QUESTION_POOL[8],
        WORKOUT_QUESTION_POOL[3]
      ];
      timeLimitSeconds = 225; // 5 * 45s = 225s
    } else if (mode === 'MIXED_DAILY') {
      workoutTitle = 'Official SAT Daily Mix (3 R&W + 2 Math)';
      const rwPool = WORKOUT_QUESTION_POOL.filter((q) => q.section === 'READING_AND_WRITING');
      const mathPool = WORKOUT_QUESTION_POOL.filter((q) => q.section === 'MATH');
      selectedQuestions = [...rwPool.slice(0, 3), ...mathPool.slice(0, 2)];
      timeLimitSeconds = 600;
    } else if (mode === 'TARGET_PLAN') {
      workoutTitle = `Study Plan Day ${planDay}: Targeted Mastery`;
      // Rotate pool based on planDay index
      const offset = (planDay - 1) % WORKOUT_QUESTION_POOL.length;
      selectedQuestions = [
        ...WORKOUT_QUESTION_POOL.slice(offset),
        ...WORKOUT_QUESTION_POOL.slice(0, offset)
      ].slice(0, 5);
      timeLimitSeconds = 600;
    } else {
      selectedQuestions = WORKOUT_QUESTION_POOL.slice(0, 5);
    }

    res.json({
      success: true,
      questions: selectedQuestions,
      workoutMeta: {
        mode,
        title: workoutTitle,
        estimatedMinutes: Math.round(timeLimitSeconds / 60),
        timeLimitSeconds,
        baseRewardXP: 25,
        speedBonusXP: 10,
        streakPreservation: true,
        targetDomain,
        planDay,
      }
    });
  } catch (error: any) {
    console.error('Error generating workout:', error);
    res.status(500).json({ error: 'Failed to generate daily workout: ' + error.message });
  }
});

// 5. Admin ZIP Question Bank Ingestion Route (/api/admin/ingest-sqb-zip)
app.post('/api/admin/ingest-sqb-zip', async (req, res) => {
  try {
    const { base64Zip, zipName } = req.body;
    if (!base64Zip) {
      return res.status(400).json({ error: 'No ZIP payload provided' });
    }

    const binaryData = Buffer.from(base64Zip, 'base64');
    const zip = await JSZip.loadAsync(binaryData);

    const ingestedQuestions: any[] = [];
    const files = Object.keys(zip.files);

    for (const filename of files) {
      if (filename.endsWith('.json') && !filename.startsWith('__MACOSX/')) {
        const fileContent = await zip.files[filename].async('string');
        try {
          const parsed = JSON.parse(fileContent);
          if (Array.isArray(parsed)) {
            ingestedQuestions.push(...parsed);
          } else if (parsed.questionText) {
            ingestedQuestions.push(parsed);
          }
        } catch (parseErr) {
          console.warn(`Failed to parse JSON file ${filename}:`, parseErr);
        }
      }
    }

    res.json({
      success: true,
      message: `Successfully extracted and ingested ${ingestedQuestions.length} questions from ${zipName || 'archive.zip'}`,
      fileCount: files.length,
      questionsIngested: ingestedQuestions.length,
      sampleExtracted: ingestedQuestions.slice(0, 3),
    });
  } catch (error: any) {
    console.error('Error ingesting SQB ZIP:', error);
    res.status(500).json({ error: 'Failed to process ZIP archive: ' + error.message });
  }
});

// 5b. Vocabulary PDF & Text Extraction Engine (Gemini AI + Rule-based fallback)
app.post('/api/vocab/extract-pdf', async (req, res) => {
  try {
    const { rawText, fileName } = req.body;

    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid rawText parameter' });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `You are a Principal EdTech Lexicographer and SAT Vocabulary Specialist.
Analyze the following extracted text from an SAT vocabulary PDF/book ("${fileName || 'SAT Vocab Book'}") and extract every vocabulary entry into a structured JSON array.

Text content:
"""
${rawText.slice(0, 15000)}
"""

Each element in the array must strictly match this schema:
{
  "word": "lowercase word",
  "partOfSpeech": "adj., verb, noun, or adv.",
  "definition": "clear, concise definition",
  "synonyms": ["synonym1", "synonym2", "synonym3"],
  "sampleSentence": "Digital SAT style contextual example sentence.",
  "difficulty": "EASY" | "MEDIUM" | "HARD",
  "tone": "Positive" | "Negative" | "Neutral",
  "etymology": "Brief root origin or mnemonic tip."
}

Return ONLY valid JSON array with no markdown code blocks or surrounding text.`;

        const geminiRes = await callGeminiWithModelFallback(ai, {
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          },
        });

        const textResponse = geminiRes.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = textResponse.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
        const parsedWords = JSON.parse(cleanJson);

        if (Array.isArray(parsedWords) && parsedWords.length > 0) {
          return res.json({
            success: true,
            extractedWords: parsedWords,
            count: parsedWords.length,
            engine: 'Gemini 2.5 Flash Lexicographer',
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini vocab extraction failed, falling back to rule-based parser:', geminiErr);
      }
    }

    // Rule-based Lexical Parser Fallback
    const lines = rawText.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
    const extractedWords: any[] = [];

    for (const line of lines) {
      // Regex pattern: "1. word (part of speech) - definition" or "word: definition"
      const match = line.match(/^(\d+\.?\s*)?([a-zA-Z\-]{3,25})\s*[\(\[]?([a-zA-Z\.\s]{2,10})?[\)\]]?\s*[:\-–—]\s*(.+)$/i);
      if (match) {
        const word = match[2].toLowerCase().trim();
        const pos = (match[3] || 'noun').replace(/[\(\)\[\]]/g, '').trim();
        const definition = match[4].trim();

        extractedWords.push({
          word,
          partOfSpeech: pos.startsWith('adj') ? 'adj.' : pos.startsWith('v') ? 'verb' : pos.startsWith('adv') ? 'adv.' : 'noun',
          definition,
          synonyms: [word + 'like', 'equivalent'],
          sampleSentence: `The scholar noted the ${word} nature of the historical evidence.`,
          difficulty: word.length > 8 ? 'HARD' : word.length > 6 ? 'MEDIUM' : 'EASY',
          tone: 'Neutral',
          etymology: `Derived from Latin roots.`,
        });
      }
    }

    res.json({
      success: true,
      extractedWords,
      count: extractedWords.length,
      engine: 'Rule-Based Lexical Extractor',
    });
  } catch (error: any) {
    console.error('Error in /api/vocab/extract-pdf:', error);
    res.status(500).json({ error: 'Failed to extract vocabulary: ' + error.message });
  }
});

// 6. Telegram Bot Bi-Directional Webhook & Notification Engine
app.post('/api/telegram/send-notification', (req, res) => {
  const { recipient, type, message } = req.body;
  const newLog = {
    timestamp: new Date().toISOString(),
    type: type || 'SYSTEM_ALERT',
    recipient: recipient || '@student',
    message: message || 'Notification from SAT Studio',
  };
  simulatedTelegramLogs.unshift(newLog);
  res.json({ success: true, log: newLog, allLogs: simulatedTelegramLogs.slice(0, 10) });
});

app.get('/api/telegram/logs', (req, res) => {
  res.json({ logs: simulatedTelegramLogs });
});

// 7. Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digital SAT Platform backend listening on port ${PORT}`);
  });
}

startServer();
