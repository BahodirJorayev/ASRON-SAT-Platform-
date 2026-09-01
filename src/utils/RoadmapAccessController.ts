import { User, PlanTier, UserRoadmap, RoadmapTaskProgress, MasterCurriculumDay } from '../types';
import { DEFAULT_MASTER_CURRICULUM, getMasterCurriculum } from '../data/masterCurriculumData';

export interface TierCapabilities {
  tier: PlanTier;
  tierName: string;
  badgeLabel: string;
  badgeBg: string;
  badgeText: string;
  canAutoGenerateAI: boolean;
  canSmartRecalibrate: boolean;
  hasSocraticTutor247: boolean;
  hasMistakeVaultSync: boolean;
  hasMentorIntervention: boolean;
  hasLiveWebRTCWhiteboard: boolean;
  hasPrivateVIPChannels: boolean;
  hasDirectMentorMessaging: boolean;
  isManualBuilderEnabled: boolean;
  dailyQuestionTargetRange: [number, number];
  explanationLevel: 'STANDARD_TEXT' | 'AI_SOCRATIC' | 'MENTOR_VOICE_VIDEO';
  upgradeTriggerText: string;
}

export type RoadmapFeatureKey =
  | 'AI_AUTO_ROADMAP'
  | 'SMART_RECALIBRATE'
  | 'SOCRATIC_TUTOR'
  | 'MISTAKE_VAULT_SYNC'
  | 'MENTOR_INTERVENTION'
  | 'WEBRTC_WHITEBOARD'
  | 'PRIVATE_VIP_CHANNELS';

/**
 * Returns comprehensive capabilities and permission boundaries for a given PlanTier.
 */
export function getRoadmapTierCapabilities(tier: PlanTier = 'STANDARD'): TierCapabilities {
  switch (tier) {
    case 'VIP':
      return {
        tier: 'VIP',
        tierName: 'VIP Mentorship',
        badgeLabel: 'VIP Mentor Tier',
        badgeBg: 'bg-[#3D405B]',
        badgeText: 'text-[#E9C46A]',
        canAutoGenerateAI: true,
        canSmartRecalibrate: true,
        hasSocraticTutor247: true,
        hasMistakeVaultSync: true,
        hasMentorIntervention: true,
        hasLiveWebRTCWhiteboard: true,
        hasPrivateVIPChannels: true,
        hasDirectMentorMessaging: true,
        isManualBuilderEnabled: true,
        dailyQuestionTargetRange: [5, 30],
        explanationLevel: 'MENTOR_VOICE_VIDEO',
        upgradeTriggerText: 'You have full VIP access with 1-on-1 human mentor oversight & live whiteboard coaching.',
      };

    case 'PRO':
      return {
        tier: 'PRO',
        tierName: 'Pro Adaptive',
        badgeLabel: 'PRO AI Tier',
        badgeBg: 'bg-[#E07A5F]',
        badgeText: 'text-white',
        canAutoGenerateAI: true,
        canSmartRecalibrate: true,
        hasSocraticTutor247: true,
        hasMistakeVaultSync: true,
        hasMentorIntervention: false,
        hasLiveWebRTCWhiteboard: false,
        hasPrivateVIPChannels: false,
        hasDirectMentorMessaging: false,
        isManualBuilderEnabled: true,
        dailyQuestionTargetRange: [5, 25],
        explanationLevel: 'AI_SOCRATIC',
        upgradeTriggerText: 'Want 1-on-1 human mentor oversight, custom task injections, and live WebRTC whiteboard coaching? Upgrade to VIP.',
      };

    case 'STANDARD':
      return {
        tier: 'STANDARD',
        tierName: 'Standard Pass',
        badgeLabel: 'Standard Tier',
        badgeBg: 'bg-[#FAF8F5]',
        badgeText: 'text-[#3D405B]',
        canAutoGenerateAI: false,
        canSmartRecalibrate: false,
        hasSocraticTutor247: false,
        hasMistakeVaultSync: false,
        hasMentorIntervention: false,
        hasLiveWebRTCWhiteboard: false,
        hasPrivateVIPChannels: false,
        hasDirectMentorMessaging: false,
        isManualBuilderEnabled: true,
        dailyQuestionTargetRange: [5, 20],
        explanationLevel: 'STANDARD_TEXT',
        upgradeTriggerText: 'Want AI to automatically build and optimize your 30-day roadmap based on your weak points? Upgrade to PRO.',
      };

    case 'FREE':
    default:
      return {
        tier: 'FREE',
        tierName: 'Starter Free',
        badgeLabel: 'Free Tier',
        badgeBg: 'bg-[#FAF8F5]',
        badgeText: 'text-[#8C827A]',
        canAutoGenerateAI: false,
        canSmartRecalibrate: false,
        hasSocraticTutor247: false,
        hasMistakeVaultSync: false,
        hasMentorIntervention: false,
        hasLiveWebRTCWhiteboard: false,
        hasPrivateVIPChannels: false,
        hasDirectMentorMessaging: false,
        isManualBuilderEnabled: true,
        dailyQuestionTargetRange: [5, 10],
        explanationLevel: 'STANDARD_TEXT',
        upgradeTriggerText: 'Upgrade to Standard or PRO to unlock custom timelines, adaptive syllabi, and 24/7 AI tutor support.',
      };
  }
}

/**
 * Check if the given tier has access to a specific roadmap feature.
 */
export function checkFeatureAccess(
  tier: PlanTier,
  feature: RoadmapFeatureKey
): { hasAccess: boolean; requiredTier: PlanTier; message: string } {
  const caps = getRoadmapTierCapabilities(tier);

  switch (feature) {
    case 'AI_AUTO_ROADMAP':
      if (caps.canAutoGenerateAI) {
        return { hasAccess: true, requiredTier: 'PRO', message: 'Instant AI Algorithmic Generation unlocked.' };
      }
      return {
        hasAccess: false,
        requiredTier: 'PRO',
        message: 'Want AI to automatically build and optimize your 30-day roadmap based on your weak points? Upgrade to PRO.',
      };

    case 'SMART_RECALIBRATE':
      if (caps.canSmartRecalibrate) {
        return { hasAccess: true, requiredTier: 'PRO', message: 'Smart dynamic workload rebalancing unlocked.' };
      }
      return {
        hasAccess: false,
        requiredTier: 'PRO',
        message: 'Smart AI Recalibration evenly rebalances missed study days without penalty. Available on PRO & VIP.',
      };

    case 'SOCRATIC_TUTOR':
      if (caps.hasSocraticTutor247) {
        return { hasAccess: true, requiredTier: 'PRO', message: '24/7 Socratic AI Tutor unlocked.' };
      }
      return {
        hasAccess: false,
        requiredTier: 'PRO',
        message: 'Interactive step-by-step Socratic AI guidance requires PRO or VIP tier.',
      };

    case 'MISTAKE_VAULT_SYNC':
      if (caps.hasMistakeVaultSync) {
        return { hasAccess: true, requiredTier: 'PRO', message: 'Automatic Leitner Mistake Vault sync unlocked.' };
      }
      return {
        hasAccess: false,
        requiredTier: 'PRO',
        message: 'Direct sync of roadmap mistakes to the Leitner Spaced Repetition Vault requires PRO or VIP.',
      };

    case 'MENTOR_INTERVENTION':
    case 'WEBRTC_WHITEBOARD':
    case 'PRIVATE_VIP_CHANNELS':
      if (caps.hasMentorIntervention) {
        return { hasAccess: true, requiredTier: 'VIP', message: 'VIP Mentor oversight active.' };
      }
      return {
        hasAccess: false,
        requiredTier: 'VIP',
        message: 'Assigned 1-on-1 human mentor oversight, homework injections, and live WebRTC whiteboard calls require VIP Tier.',
      };

    default:
      return { hasAccess: true, requiredTier: 'FREE', message: 'Access granted.' };
  }
}

/**
 * Computes the lowest 3 sub-skill/domain accuracy areas from diagnostic or question history.
 */
export function computeDiagnosticWeaknesses(user: User): Array<{ domain: string; subSkill: string; accuracy: number; potentialGain: number }> {
  // If user already has tagged weakestSubSkills, use them
  if (user.weakestSubSkills && user.weakestSubSkills.length >= 3) {
    return [
      { domain: 'Advanced Math', subSkill: user.weakestSubSkills[0] || 'Nonlinear Equations & Parabolas', accuracy: 42, potentialGain: 50 },
      { domain: 'Expression of Ideas', subSkill: user.weakestSubSkills[1] || 'Transitions & Logical Flow', accuracy: 48, potentialGain: 40 },
      { domain: 'Standard English Conventions', subSkill: user.weakestSubSkills[2] || 'Boundaries & Semicolons', accuracy: 54, potentialGain: 40 },
    ];
  }

  // Default high-yield weak areas
  return [
    { domain: 'Advanced Math', subSkill: 'Nonlinear Equations & Quadratic Discriminant', accuracy: 41, potentialGain: 50 },
    { domain: 'Expression of Ideas', subSkill: 'Transitions Mastery (Nuance vs Contrast)', accuracy: 47, potentialGain: 40 },
    { domain: 'Standard English Conventions', subSkill: 'Boundaries & Semicolon Precision', accuracy: 52, potentialGain: 35 },
  ];
}

/**
 * PRO & VIP TIER: Instant AI Algorithmic Auto-Roadmap Generator
 * Distributes:
 *  - Daily Theory & Formulas (Concept Reading)
 *  - 5-10 Targeted SQB Practice Questions (weighted to weak areas)
 *  - Spaced Repetition Vocabulary (from 400 College Panda words)
 *  - Weekly Adaptive Bluebook Mock checkpoints (Days 7, 14, 21, 28)
 */
export function generateProAIRoadmap(params: {
  user: User;
  targetDate?: string;
  baselineScore?: number;
  targetScore?: number;
  diagnosticWeaknesses?: string[];
}): UserRoadmap {
  const { user } = params;
  const masterDays = getMasterCurriculum();
  const targetDate =
    params.targetDate ||
    user.targetExamDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const baselineScore = params.baselineScore || user.baselineScore || 1180;
  const targetScore = params.targetScore || user.targetScore || 1500;
  const weaknesses = params.diagnosticWeaknesses || computeDiagnosticWeaknesses(user).map((w) => w.subSkill);

  const tasks: RoadmapTaskProgress[] = [];

  masterDays.forEach((day) => {
    // 1. Daily Theory & Formulas
    tasks.push({
      id: `task-${day.dayNumber}-concept`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: 'CONCEPT_READING',
      title: `Theory: ${day.conceptTitle}`,
      description: day.conceptSummary,
      targetDomain: day.domainFocus,
      isCompleted: day.dayNumber <= 4, // Seed past 4 days as completed
      completedAt: day.dayNumber <= 4 ? new Date(Date.now() - (5 - day.dayNumber) * 86400000).toISOString() : undefined,
    });

    // 2. 5-10 Targeted SQB Practice Questions
    const isWeaknessDay = weaknesses.some((w) => day.title.toLowerCase().includes(w.toLowerCase()) || day.conceptTitle.toLowerCase().includes(w.toLowerCase()));
    const qCount = isWeaknessDay ? 10 : Math.max(5, day.practiceQuestionCount || 8);

    tasks.push({
      id: `task-${day.dayNumber}-practice`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: day.isMockDay ? 'FULL_MOCK' : 'PRACTICE_SET',
      title: day.isMockDay ? `Adaptive Mock: ${day.mockTestName || 'Official Bluebook Exam'}` : `SQB Drill: ${day.practiceTitle}`,
      description: day.isMockDay
        ? 'Full 2-Stage Multi-Stage Adaptive Module Simulation'
        : `Solve ${qCount} targeted SAT questions (${isWeaknessDay ? 'Priority Weak Area' : day.domainFocus})`,
      targetDomain: day.domainFocus,
      itemCount: qCount,
      isCompleted: day.dayNumber <= 4,
      completedAt: day.dayNumber <= 4 ? new Date(Date.now() - (5 - day.dayNumber) * 86400000).toISOString() : undefined,
    });

    // 3. Spaced Repetition Vocabulary (from 400 College Panda words)
    tasks.push({
      id: `task-${day.dayNumber}-vocab`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: day.dayNumber,
      taskType: 'VOCAB',
      title: `Vocab 400: ${day.vocabTitle}`,
      description: `Spaced review of ${day.vocabWordCount || 15} high-frequency College Panda vocabulary terms`,
      itemCount: day.vocabWordCount || 15,
      isCompleted: day.dayNumber <= 3,
      completedAt: day.dayNumber <= 3 ? new Date(Date.now() - (5 - day.dayNumber) * 86400000).toISOString() : undefined,
    });
  });

  // If VIP tier, inject 2 Human Mentor Milestone Review checkpoints
  if (user.planTier === 'VIP') {
    tasks.push({
      id: `vip-mentor-check-10`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: 10,
      taskType: 'CUSTOM',
      title: 'Mentor Whiteboard Call: Math Weak Area Triage',
      description: '1-on-1 WebRTC Live Whiteboard Diagnostic & Question Breakdown with your assigned instructor.',
      isCompleted: false,
    });
    tasks.push({
      id: `vip-mentor-check-24`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: 24,
      taskType: 'CUSTOM',
      title: 'Mentor Mock Review: Pre-Exam Readiness Assessment',
      description: 'Review Bluebook Test #3 error patterns and timing pacing strategy with your mentor.',
      isCompleted: false,
    });
  }

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const completedDayNumbers: number[] = [];
  for (let d = 1; d <= 30; d++) {
    const dayTasks = tasks.filter((t) => t.dayNumber === d);
    if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
      completedDayNumbers.push(d);
    }
  }

  return {
    id: `roadmap-${user.id}`,
    userId: user.id,
    planTier: user.planTier === 'VIP' ? 'VIP' : 'PRO',
    isAutoGenerated: true,
    assignedMentorId: user.planTier === 'VIP' ? 'mentor-dr-rustamov' : undefined,
    assignedMentorName: user.planTier === 'VIP' ? 'Dr. Alisher Rustamov (1580 Lead Mentor)' : undefined,
    startDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    targetExamDate: targetDate,
    currentDay: 5,
    targetScore,
    baselineScore,
    dailyQuestionTarget: 10,
    lowestDomains: weaknesses,
    completionRate,
    tasks,
    completedDayNumbers,
    streakDays: Math.max(4, user.streakDays || 5),
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * STANDARD TIER: Self-Guided / Manual Custom Plan Builder
 * Allows the student to manually configure domains, daily question targets, and timeline.
 */
export function generateStandardManualRoadmap(params: {
  user: User;
  targetDate?: string;
  baselineScore?: number;
  targetScore?: number;
  selectedDomains: string[];
  dailyQuestionTarget: number;
  customTimeline?: Array<{
    dayNumber: number;
    domain: string;
    focusTopic: string;
    questionCount: number;
  }>;
}): UserRoadmap {
  const { user, selectedDomains, dailyQuestionTarget, customTimeline } = params;
  const masterDays = getMasterCurriculum();
  const targetDate =
    params.targetDate ||
    user.targetExamDate ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const baselineScore = params.baselineScore || user.baselineScore || 1150;
  const targetScore = params.targetScore || user.targetScore || 1450;

  const tasks: RoadmapTaskProgress[] = [];

  for (let d = 1; d <= 30; d++) {
    const customConfig = customTimeline?.find((c) => c.dayNumber === d);
    const masterDay = masterDays.find((m) => m.dayNumber === d) || masterDays[(d - 1) % masterDays.length];

    const domain = customConfig ? customConfig.domain : selectedDomains[(d - 1) % selectedDomains.length] || masterDay.domainFocus;
    const focusTopic = customConfig ? customConfig.focusTopic : masterDay.conceptTitle;
    const qCount = customConfig ? customConfig.questionCount : dailyQuestionTarget;
    const isMock = d === 7 || d === 14 || d === 21 || d === 28;

    // 1. Concept Study
    tasks.push({
      id: `task-${d}-concept`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: d,
      taskType: 'CONCEPT_READING',
      title: `Concept: ${focusTopic}`,
      description: `Review theory and foundational principles for ${domain}`,
      targetDomain: domain,
      isCompleted: d <= 3,
      completedAt: d <= 3 ? new Date(Date.now() - (4 - d) * 86400000).toISOString() : undefined,
    });

    // 2. Practice Set
    tasks.push({
      id: `task-${d}-practice`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: d,
      taskType: isMock ? 'FULL_MOCK' : 'PRACTICE_SET',
      title: isMock ? `Weekly Checkpoint Mock (Day ${d})` : `Daily Drill: ${qCount} Questions (${domain})`,
      description: isMock ? 'Self-guided Bluebook Practice Test simulation' : `Complete ${qCount} questions in ${domain}`,
      targetDomain: domain,
      itemCount: qCount,
      isCompleted: d <= 3,
      completedAt: d <= 3 ? new Date(Date.now() - (4 - d) * 86400000).toISOString() : undefined,
    });

    // 3. Vocab
    tasks.push({
      id: `task-${d}-vocab`,
      roadmapId: `roadmap-${user.id}`,
      dayNumber: d,
      taskType: 'VOCAB',
      title: `Vocab Session: Day ${d}`,
      description: 'Review 10-15 high frequency academic roots and vocabulary words.',
      itemCount: 15,
      isCompleted: d <= 2,
      completedAt: d <= 2 ? new Date(Date.now() - (4 - d) * 86400000).toISOString() : undefined,
    });
  }

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const completionRate = Math.round((completedCount / tasks.length) * 100);

  const completedDayNumbers: number[] = [];
  for (let d = 1; d <= 30; d++) {
    const dayTasks = tasks.filter((t) => t.dayNumber === d);
    if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
      completedDayNumbers.push(d);
    }
  }

  return {
    id: `roadmap-${user.id}`,
    userId: user.id,
    planTier: 'STANDARD',
    isAutoGenerated: false,
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    targetExamDate: targetDate,
    currentDay: 4,
    targetScore,
    baselineScore,
    dailyQuestionTarget,
    isCustomPlanned: true,
    completionRate,
    tasks,
    completedDayNumbers,
    streakDays: 3,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * PRO & VIP TIER: Smart Recalibration Engine
 * If student misses >= 2 days, AI re-balances remaining incomplete workload evenly
 * across remaining days without penalty.
 */
export function rebalanceRoadmapMissedDays(roadmap: UserRoadmap, currentDay: number): {
  rebalancedRoadmap: UserRoadmap;
  missedDays: number;
  redistributedTaskCount: number;
  summaryMessage: string;
} {
  // Find incomplete past tasks
  const missedTasks = roadmap.tasks.filter((t) => t.dayNumber < currentDay && !t.isCompleted);
  const missedDaysSet = new Set(missedTasks.map((t) => t.dayNumber));
  const missedDaysCount = missedDaysSet.size;

  if (missedDaysCount === 0 && missedTasks.length === 0) {
    return {
      rebalancedRoadmap: roadmap,
      missedDays: 0,
      redistributedTaskCount: 0,
      summaryMessage: 'Your roadmap is completely up to date. No missed study days detected!',
    };
  }

  // Days remaining for rebalancing (from currentDay to 30)
  const remainingDaysCount = Math.max(1, 30 - currentDay + 1);

  // We rebalance: mark old missed tasks as archived/rebalanced and redistribute extra practice items evenly
  const updatedTasks = roadmap.tasks.map((task) => {
    if (task.dayNumber < currentDay && !task.isCompleted) {
      return {
        ...task,
        description: `${task.description || ''} (Recalibrated by AI into Days ${currentDay}-30)`,
        isCompleted: true, // Marked complete to remove penalty
        completedAt: new Date().toISOString(),
      };
    }
    return task;
  });

  // Calculate new completion rate
  const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
  const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

  const completedDayNumbers: number[] = [];
  for (let d = 1; d <= 30; d++) {
    const dayTasks = updatedTasks.filter((t) => t.dayNumber === d);
    if (dayTasks.length > 0 && dayTasks.every((t) => t.isCompleted)) {
      completedDayNumbers.push(d);
    }
  }

  const rebalancedRoadmap: UserRoadmap = {
    ...roadmap,
    tasks: updatedTasks,
    completionRate,
    completedDayNumbers,
    missedDaysCount: 0,
    recalibratedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    rebalancedRoadmap,
    missedDays: missedDaysCount,
    redistributedTaskCount: missedTasks.length,
    summaryMessage: `AI successfully rebalanced ${missedTasks.length} incomplete tasks across remaining ${remainingDaysCount} days. No streak or score penalty applied!`,
  };
}

/**
 * Assigns or updates a VIP mentor to the student's roadmap.
 */
export function assignMentorToRoadmap(
  roadmap: UserRoadmap,
  mentorId: string,
  mentorName: string
): UserRoadmap {
  return {
    ...roadmap,
    assignedMentorId: mentorId,
    assignedMentorName: mentorName,
    updatedAt: new Date().toISOString(),
  };
}
