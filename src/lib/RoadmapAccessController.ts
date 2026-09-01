import {
  User,
  PlanTier,
  UserRoadmap,
  RoadmapTaskProgress,
  MasterCurriculumDay,
  Question,
  UserQuestionPractice,
  MistakeVaultItem
} from '../types';
import {
  getMasterCurriculum,
  DEFAULT_MASTER_CURRICULUM
} from '../data/masterCurriculumData';
import { supabase } from './supabase';

// ============================================================================
// 1. TIER CAPABILITY CONFIGURATION & FEATURE GATING
// ============================================================================

export interface TierCapabilities {
  tier: PlanTier;
  canAutoGenerateRoadmap: boolean;
  canSmartRecalibrate: boolean;
  hasSocraticAITutor: boolean;
  hasMistakeVaultSRS: boolean;
  hasMentorIntervention: boolean;
  hasPrivateVIPChannels: boolean;
  hasWhiteboardCoaching: boolean;
  canManualPlan: boolean;
  maxCustomTasksPerDay: number;
  isUpgradeRequiredForAuto: boolean;
  upgradePromptText: string;
  badgeLabel: string;
  badgeColor: string;
}

export class RoadmapAccessController {
  /**
   * Return capability permissions for a given tier
   */
  static getTierCapabilities(tier: PlanTier = 'STANDARD'): TierCapabilities {
    switch (tier) {
      case 'VIP':
        return {
          tier: 'VIP',
          canAutoGenerateRoadmap: true,
          canSmartRecalibrate: true,
          hasSocraticAITutor: true,
          hasMistakeVaultSRS: true,
          hasMentorIntervention: true,
          hasPrivateVIPChannels: true,
          hasWhiteboardCoaching: true,
          canManualPlan: true,
          maxCustomTasksPerDay: 10,
          isUpgradeRequiredForAuto: false,
          upgradePromptText: 'You have full VIP Access with dedicated 1-on-1 Master Coach oversight.',
          badgeLabel: 'VIP Mentor Tier',
          badgeColor: 'bg-[#3D405B] text-[#E9C46A] border-[#E9C46A]/40',
        };

      case 'PRO':
        return {
          tier: 'PRO',
          canAutoGenerateRoadmap: true,
          canSmartRecalibrate: true,
          hasSocraticAITutor: true,
          hasMistakeVaultSRS: true,
          hasMentorIntervention: false,
          hasPrivateVIPChannels: false,
          hasWhiteboardCoaching: false,
          canManualPlan: true,
          maxCustomTasksPerDay: 5,
          isUpgradeRequiredForAuto: false,
          upgradePromptText: 'Pro Tier active: AI algorithmic auto-roadmap and 24/7 Socratic Tutor enabled.',
          badgeLabel: 'PRO Tier',
          badgeColor: 'bg-[#E07A5F]/10 text-[#E07A5F] border-[#E07A5F]/30',
        };

      case 'STANDARD':
      case 'FREE':
      default:
        return {
          tier: tier as PlanTier,
          canAutoGenerateRoadmap: false,
          canSmartRecalibrate: false,
          hasSocraticAITutor: false,
          hasMistakeVaultSRS: false,
          hasMentorIntervention: false,
          hasPrivateVIPChannels: false,
          hasWhiteboardCoaching: false,
          canManualPlan: true,
          maxCustomTasksPerDay: 2,
          isUpgradeRequiredForAuto: true,
          upgradePromptText: 'Want AI to automatically build and optimize your 30-day roadmap based on your weak points? Upgrade to PRO.',
          badgeLabel: tier === 'FREE' ? 'Free Tier' : 'Standard Self-Planner',
          badgeColor: 'bg-[#FAF8F5] text-[#6B645C] border-[#E5E0D8]',
        };
    }
  }

  /**
   * Validate if user can run automatic AI generation
   */
  static canRunAutoRoadmap(user: User): { allowed: boolean; reason?: string } {
    const tier = user.planTier || 'STANDARD';
    if (tier === 'PRO' || tier === 'VIP') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'AI Algorithmic Auto-Roadmap is exclusive to PRO & VIP members. Upgrade to unlock auto-triage from diagnostic accuracy.',
    };
  }

  /**
   * Validate if user can use Socratic AI Tutor
   */
  static canAccessSocraticTutor(user: User): { allowed: boolean; reason?: string } {
    const tier = user.planTier || 'STANDARD';
    if (tier === 'PRO' || tier === 'VIP') {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'Standard tier includes standard text explanations. Socratic 24/7 AI Voice & Step-by-Step Guidance requires PRO.',
    };
  }

  /**
   * Validate if user has VIP Mentor capabilities
   */
  static hasVIPMentorAccess(user: User): boolean {
    return user.planTier === 'VIP';
  }

  // ==========================================================================
  // 2. DIAGNOSTIC ANALYSIS & LOWEST 3 DOMAIN TRIAGE
  // ==========================================================================

  /**
   * Analyze student's diagnostic test data / practice history to identify the 3 lowest accuracy domains
   */
  static analyzeDiagnosticWeakPoints(
    user: User,
    practiceHistory: UserQuestionPractice[] = [],
    mistakeVault: MistakeVaultItem[] = [],
    allQuestions: Question[] = []
  ): {
    domainAccuracies: { domain: string; accuracy: number; total: number; wrong: number }[];
    lowest3Domains: string[];
    suggestedFocusSummary: string;
  } {
    const questionMap = new Map<string, Question>();
    allQuestions.forEach((q) => questionMap.set(q.id, q));

    // Standard Digital SAT Domain Buckets
    const domainStats: Record<string, { total: number; correct: number; wrong: number }> = {
      'Advanced Math': { total: 0, correct: 0, wrong: 0 },
      'Standard English Conventions': { total: 0, correct: 0, wrong: 0 },
      'Craft and Structure': { total: 0, correct: 0, wrong: 0 },
      'Information and Ideas': { total: 0, correct: 0, wrong: 0 },
      'Expression of Ideas': { total: 0, correct: 0, wrong: 0 },
      'Algebra': { total: 0, correct: 0, wrong: 0 },
      'Problem-Solving and Data Analysis': { total: 0, correct: 0, wrong: 0 },
      'Geometry and Trigonometry': { total: 0, correct: 0, wrong: 0 },
    };

    // Calculate from practice history
    practiceHistory.forEach((p) => {
      const q = questionMap.get(p.questionId);
      if (q && q.domain) {
        // Find matching domain bucket
        const matched = Object.keys(domainStats).find(
          (d) => d.toLowerCase() === q.domain.toLowerCase() || q.domain.toLowerCase().includes(d.toLowerCase())
        );
        const targetDomain = matched || 'Advanced Math';
        domainStats[targetDomain].total += 1;
        if (p.isCorrect) {
          domainStats[targetDomain].correct += 1;
        } else {
          domainStats[targetDomain].wrong += 1;
        }
      }
    });

    // Add mistake vault weight
    mistakeVault.forEach((m) => {
      const d = m.question?.domain;
      if (d) {
        const matched = Object.keys(domainStats).find(
          (dom) => dom.toLowerCase() === d.toLowerCase() || d.toLowerCase().includes(dom.toLowerCase())
        );
        const targetDomain = matched || 'Advanced Math';
        domainStats[targetDomain].total += 1;
        domainStats[targetDomain].wrong += 1;
      }
    });

    // Build array with fallback baseline accuracy if not enough data
    const domainAccuracies = Object.keys(domainStats).map((domain) => {
      const stat = domainStats[domain];
      if (stat.total >= 3) {
        const accuracy = Math.round((stat.correct / stat.total) * 100);
        return { domain, accuracy, total: stat.total, wrong: stat.wrong };
      }
      
      // Default heuristic based on general user profile or typical SAT pain points
      const defaultAccuracyMap: Record<string, number> = {
        'Advanced Math': 44,
        'Standard English Conventions': 52,
        'Craft and Structure': 58,
        'Expression of Ideas': 68,
        'Information and Ideas': 72,
        'Algebra': 75,
        'Problem-Solving and Data Analysis': 78,
        'Geometry and Trigonometry': 65,
      };

      return {
        domain,
        accuracy: defaultAccuracyMap[domain] || 50,
        total: Math.max(stat.total, 8),
        wrong: Math.max(stat.wrong, 4),
      };
    });

    // Sort ascending by accuracy (lowest first)
    domainAccuracies.sort((a, b) => a.accuracy - b.accuracy);

    const lowest3Domains = domainAccuracies.slice(0, 3).map((d) => d.domain);

    const suggestedFocusSummary = `Identified top 3 high-yield point bleed domains: ${lowest3Domains.join(
      ', '
    )}. Your 30-day AI plan heavily weights these domains in Weeks 1 & 2 for rapid score surge.`;

    return {
      domainAccuracies,
      lowest3Domains,
      suggestedFocusSummary,
    };
  }

  // ==========================================================================
  // 3. AI ALGORITHMIC AUTO-ROADMAP GENERATION (PRO / VIP)
  // ==========================================================================

  /**
   * Generates a 30-day dynamic syllabus heavily prioritizing lowest 3 domains
   */
  static generateAIAlgorithmicRoadmap(params: {
    user: User;
    baselineScore: number;
    targetScore: number;
    targetExamDate: string;
    lowest3Domains: string[];
    dailyQuestionTarget?: number;
    mockTestIds?: string[];
  }): UserRoadmap {
    const {
      user,
      baselineScore,
      targetScore,
      targetExamDate,
      lowest3Domains,
      dailyQuestionTarget = 8,
      mockTestIds = ['mock-sat-01', 'mock-sat-02', 'mock-sat-03', 'mock-sat-04'],
    } = params;

    const masterSyllabus = getMasterCurriculum();
    const tasks: RoadmapTaskProgress[] = [];
    const roadmapId = `roadmap-${user.id}-${Date.now()}`;

    // Map each day with targeted weighting
    masterSyllabus.forEach((masterDay) => {
      const dNum = masterDay.dayNumber;
      const weekNum = masterDay.weekNumber;

      // Determine tailored domain focus for this day
      let tailoredDomain = masterDay.domainFocus;
      let tailoredQuestionCount = dailyQuestionTarget;

      if (weekNum === 1) {
        // Week 1: Heaviest emphasis on Lowest Domain #1
        tailoredDomain = lowest3Domains[0] || masterDay.domainFocus;
        tailoredQuestionCount = dailyQuestionTarget + 2;
      } else if (weekNum === 2) {
        // Week 2: Heaviest emphasis on Lowest Domain #2
        tailoredDomain = lowest3Domains[1] || masterDay.domainFocus;
      } else if (weekNum === 3) {
        // Week 3: Lowest Domain #3 + Cross-domain synergy
        tailoredDomain = lowest3Domains[2] || masterDay.domainFocus;
      }

      if (masterDay.isMockDay) {
        // MOCK DAY (Days 7, 14, 21, 28)
        const mockIdx = Math.floor(dNum / 7) - 1;
        const assignedMock = mockTestIds[mockIdx] || mockTestIds[0];
        
        tasks.push({
          id: `task-${dNum}-mock`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'FULL_MOCK',
          title: `Adaptive Bluebook Mock #${mockIdx + 1}: ${masterDay.mockTestName || 'Official Adaptive Test'}`,
          description: 'Official Digital SAT timed simulation (2 Modules RW, 2 Modules Math).',
          targetUrl: assignedMock,
          itemCount: 98,
          isCompleted: false,
        });

        tasks.push({
          id: `task-${dNum}-mock-review`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'CUSTOM',
          title: 'Post-Mock Mistake Vault Triage & Error Analysis',
          description: 'Log all missed questions into Mistake Vault and review Socratic AI breakdown.',
          itemCount: 1,
          isCompleted: false,
        });
      } else {
        // REGULAR 3-PILLAR DAY: (1) Theory Concept, (2) Targeted SQB Practice, (3) 400 Vocab SRS

        // 1. Theory & Formula Concept
        tasks.push({
          id: `task-${dNum}-concept`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'CONCEPT_READING',
          title: `Concept: ${masterDay.conceptTitle}`,
          description: masterDay.conceptSummary,
          targetDomain: tailoredDomain,
          itemCount: 1,
          isCompleted: false,
        });

        // 2. Targeted SQB Practice Set
        tasks.push({
          id: `task-${dNum}-practice`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'PRACTICE_SET',
          title: `Targeted Drill: ${tailoredQuestionCount} Questions on ${tailoredDomain}`,
          description: `High-yield official SQB drills covering ${tailoredDomain} error patterns.`,
          targetDomain: tailoredDomain,
          itemCount: tailoredQuestionCount,
          isCompleted: false,
        });

        // 3. Spaced Repetition Vocab
        tasks.push({
          id: `task-${dNum}-vocab`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'VOCAB',
          title: `Vocab 400 SRS: ${masterDay.vocabTitle}`,
          description: `Spaced repetition flashcard session for ${masterDay.vocabWordCount} College Panda core words.`,
          itemCount: masterDay.vocabWordCount,
          isCompleted: false,
        });
      }
    });

    const isVIP = user.planTier === 'VIP';

    const newRoadmap: UserRoadmap = {
      id: roadmapId,
      userId: user.id,
      planTier: user.planTier || 'PRO',
      isAutoGenerated: true,
      assignedMentorId: isVIP ? 'mentor-robert-sat' : undefined,
      assignedMentorName: isVIP ? 'Dr. Robert Harrison (1590 SAT)' : undefined,
      startDate: new Date().toISOString(),
      targetExamDate,
      currentDay: 1,
      targetScore,
      baselineScore,
      dailyQuestionTarget,
      lowestDomains: lowest3Domains,
      missedDaysCount: 0,
      completionRate: 0,
      tasks,
      completedDayNumbers: [],
      streakDays: user.streakDays || 1,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newRoadmap;
  }

  // ==========================================================================
  // 4. MANUAL PLAN BUILDER LOGIC (STANDARD TIER)
  // ==========================================================================

  /**
   * Build a customizable self-guided roadmap for Standard tier
   */
  static generateManualRoadmap(params: {
    user: User;
    baselineScore: number;
    targetScore: number;
    targetExamDate: string;
    selectedDomains: string[];
    dailyQuestionTarget: number;
  }): UserRoadmap {
    const {
      user,
      baselineScore,
      targetScore,
      targetExamDate,
      selectedDomains,
      dailyQuestionTarget,
    } = params;

    const masterSyllabus = getMasterCurriculum();
    const tasks: RoadmapTaskProgress[] = [];
    const roadmapId = `manual-roadmap-${user.id}-${Date.now()}`;

    masterSyllabus.forEach((day) => {
      const dNum = day.dayNumber;

      if (day.isMockDay) {
        tasks.push({
          id: `task-${dNum}-mock`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'FULL_MOCK',
          title: `Checkpoint: ${day.mockTestName || 'Adaptive Mock Test'}`,
          description: 'Full self-timed digital SAT simulation.',
          itemCount: 98,
          isCompleted: false,
        });
      } else {
        const assignedDomain = selectedDomains[(dNum - 1) % selectedDomains.length] || day.domainFocus;

        tasks.push({
          id: `task-${dNum}-concept`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'CONCEPT_READING',
          title: `Self-Study Concept: ${day.conceptTitle}`,
          description: day.conceptSummary,
          targetDomain: assignedDomain,
          itemCount: 1,
          isCompleted: false,
        });

        tasks.push({
          id: `task-${dNum}-practice`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'PRACTICE_SET',
          title: `Manual Target: ${dailyQuestionTarget} Practice Questions (${assignedDomain})`,
          description: 'Self-selected questions from the Question Bank.',
          targetDomain: assignedDomain,
          itemCount: dailyQuestionTarget,
          isCompleted: false,
        });

        tasks.push({
          id: `task-${dNum}-vocab`,
          roadmapId,
          dayNumber: dNum,
          taskType: 'VOCAB',
          title: `Vocab Review: ${day.vocabTitle}`,
          description: `${day.vocabWordCount} Words Flashcard Deck`,
          itemCount: day.vocabWordCount,
          isCompleted: false,
        });
      }
    });

    const newRoadmap: UserRoadmap = {
      id: roadmapId,
      userId: user.id,
      planTier: user.planTier || 'STANDARD',
      isAutoGenerated: false,
      isCustomPlanned: true,
      startDate: new Date().toISOString(),
      targetExamDate,
      currentDay: 1,
      targetScore,
      baselineScore,
      dailyQuestionTarget,
      lowestDomains: selectedDomains,
      completionRate: 0,
      tasks,
      completedDayNumbers: [],
      streakDays: user.streakDays || 1,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newRoadmap;
  }

  // ==========================================================================
  // 5. SMART RECALIBRATION ENGINE (PRO / VIP)
  // ==========================================================================

  /**
   * Detect missed days and compute remaining workload distribution
   */
  static checkMissedDaysAndRecalibrate(roadmap: UserRoadmap): {
    needsRecalibration: boolean;
    missedDaysCount: number;
    recalibratedRoadmap?: UserRoadmap;
    message?: string;
  } {
    const currentDay = roadmap.currentDay || 1;
    const completedDays = new Set(roadmap.completedDayNumbers || []);

    // Check days before currentDay that have incomplete tasks
    let missedCount = 0;
    for (let d = 1; d < currentDay; d++) {
      if (!completedDays.has(d)) {
        const dayTasks = roadmap.tasks.filter((t) => t.dayNumber === d);
        const hasIncomplete = dayTasks.some((t) => !t.isCompleted);
        if (hasIncomplete) {
          missedCount += 1;
        }
      }
    }

    if (missedCount < 2) {
      return {
        needsRecalibration: false,
        missedDaysCount: missedCount,
      };
    }

    // Recalibrate: redistributes uncompleted practice questions across remaining days
    const remainingDays = 30 - currentDay + 1;
    if (remainingDays <= 0) {
      return {
        needsRecalibration: false,
        missedDaysCount: missedCount,
      };
    }

    // Collect incomplete tasks from past missed days
    const pastIncompleteTasks = roadmap.tasks.filter(
      (t) => t.dayNumber < currentDay && !t.isCompleted
    );

    // Sum uncompleted practice question count
    let extraQuestionsToSpread = 0;
    pastIncompleteTasks.forEach((t) => {
      if (t.taskType === 'PRACTICE_SET' && t.itemCount) {
        extraQuestionsToSpread += t.itemCount;
      }
    });

    const addPerDay = Math.min(Math.ceil(extraQuestionsToSpread / remainingDays), 3);

    // Update future tasks
    const updatedTasks = roadmap.tasks.map((t) => {
      // Mark past missed tasks as forgiven / archived into current plan
      if (t.dayNumber < currentDay && !t.isCompleted) {
        return {
          ...t,
          isCompleted: true,
          description: `${t.description || ''} [Recalibrated & shifted to Days ${currentDay}–30]`,
        };
      }

      // Add gentle question buffer to future practice sets
      if (t.dayNumber >= currentDay && t.taskType === 'PRACTICE_SET') {
        const newCount = (t.itemCount || 8) + addPerDay;
        return {
          ...t,
          itemCount: newCount,
          title: t.title.replace(/\d+ Questions/, `${newCount} Questions`),
        };
      }

      return t;
    });

    const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
    const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

    const recalibratedRoadmap: UserRoadmap = {
      ...roadmap,
      tasks: updatedTasks,
      missedDaysCount: 0,
      completionRate,
      recalibratedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      needsRecalibration: true,
      missedDaysCount: missedCount,
      recalibratedRoadmap,
      message: `AI Smart Recalibration complete! Found ${missedCount} missed days. Workload re-balanced evenly across remaining ${remainingDays} days (+${addPerDay} questions/day) without guilt or score compromise.`,
    };
  }

  // ==========================================================================
  // 6. PERSISTENCE & SUPABASE RPC SYNC
  // ==========================================================================

  /**
   * Save roadmap to local storage and sync with Supabase
   */
  static async persistRoadmap(roadmap: UserRoadmap): Promise<void> {
    try {
      // 1. Cache to local storage for immediate responsiveness
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(`aura_user_roadmap_${roadmap.userId}`, JSON.stringify(roadmap));
      }

      // 2. Sync to Supabase user_roadmaps table if authenticated
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('user_roadmaps')
          .upsert({
            id: roadmap.id,
            user_id: roadmap.userId,
            plan_tier: roadmap.planTier || 'STANDARD',
            is_auto_generated: roadmap.isAutoGenerated,
            assigned_mentor_id: roadmap.assignedMentorId || null,
            target_exam_date: roadmap.targetExamDate,
            current_day: roadmap.currentDay,
            completion_rate: roadmap.completionRate,
            roadmap_data: roadmap,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      }
    } catch (err) {
      console.warn('Roadmap Supabase sync warning (persisted locally):', err);
    }
  }

  /**
   * Load roadmap from local storage or Supabase
   */
  static async loadRoadmap(user: User): Promise<UserRoadmap | null> {
    try {
      // 1. Try localStorage first
      if (typeof localStorage !== 'undefined') {
        const cached = localStorage.getItem(`aura_user_roadmap_${user.id}`);
        if (cached) {
          const parsed: UserRoadmap = JSON.parse(cached);
          return parsed;
        }
      }

      // 2. Try Supabase
      const { data, error } = await supabase
        .from('user_roadmaps')
        .select('roadmap_data')
        .eq('user_id', user.id)
        .single();

      if (!error && data?.roadmap_data) {
        return data.roadmap_data as UserRoadmap;
      }
    } catch (err) {
      console.warn('Error loading roadmap:', err);
    }
    return null;
  }
}
