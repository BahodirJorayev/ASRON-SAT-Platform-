import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  Zap,
  Target,
  Calendar,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Shield,
  Award,
  Video,
  MessageSquare,
  Lock,
  ChevronRight,
  Sliders,
  BookOpen,
  TrendingUp,
  Flame,
  UserCheck,
  BrainCircuit,
  GripVertical,
  Plus,
  Trash2,
  ExternalLink,
  Check
} from 'lucide-react';
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
  RoadmapAccessController,
  TierCapabilities
} from '../lib/RoadmapAccessController';
import {
  getMasterCurriculum,
  saveUserRoadmap
} from '../data/masterCurriculumData';

interface Props {
  user: User;
  currentRoadmap: UserRoadmap;
  practiceHistory?: UserQuestionPractice[];
  mistakeVault?: MistakeVaultItem[];
  allQuestions?: Question[];
  onRoadmapUpdated: (updatedRoadmap: UserRoadmap) => void;
  onCloseBuilder?: () => void;
  onOpenPaywall?: () => void;
  onOpenSocraticTutor?: (question?: Question) => void;
  onOpenMistakeVault?: () => void;
  onOpenMockTests?: (mockId?: string) => void;
}

const ALL_SAT_DOMAINS = [
  'Advanced Math',
  'Standard English Conventions',
  'Craft and Structure',
  'Expression of Ideas',
  'Information and Ideas',
  'Algebra',
  'Problem-Solving and Data Analysis',
  'Geometry and Trigonometry',
];

export const RoadmapBuilderView: React.FC<Props> = ({
  user,
  currentRoadmap,
  practiceHistory = [],
  mistakeVault = [],
  allQuestions = [],
  onRoadmapUpdated,
  onCloseBuilder,
  onOpenPaywall,
  onOpenSocraticTutor,
  onOpenMistakeVault,
  onOpenMockTests,
}) => {
  const currentTier = (user.planTier || 'STANDARD') as PlanTier;
  const capabilities: TierCapabilities = useMemo(
    () => RoadmapAccessController.getTierCapabilities(currentTier),
    [currentTier]
  );

  // Active sub-view in Builder
  const [activeBuilderTab, setActiveBuilderTab] = useState<'AI_GEN' | 'MANUAL_PLANNER' | 'VIP_MENTOR'>(
    capabilities.canAutoGenerateRoadmap ? 'AI_GEN' : 'MANUAL_PLANNER'
  );

  // Form State for Manual / AI generation
  const [baselineScore, setBaselineScore] = useState<number>(
    user.baselineScore || currentRoadmap.baselineScore || 1180
  );
  const [targetScore, setTargetScore] = useState<number>(
    user.targetScore || currentRoadmap.targetScore || 1520
  );
  const [targetExamDate, setTargetExamDate] = useState<string>(
    currentRoadmap.targetExamDate
      ? currentRoadmap.targetExamDate.slice(0, 10)
      : new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const [dailyQuestions, setDailyQuestions] = useState<number>(
    currentRoadmap.dailyQuestionTarget || 8
  );
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    currentRoadmap.lowestDomains && currentRoadmap.lowestDomains.length > 0
      ? currentRoadmap.lowestDomains
      : ['Advanced Math', 'Standard English Conventions', 'Craft and Structure']
  );

  // Drag & drop timeline state for manual planner
  const [timelineDays, setTimelineDays] = useState<MasterCurriculumDay[]>(() => getMasterCurriculum());
  const [draggedDayIdx, setDraggedDayIdx] = useState<number | null>(null);

  // AI Diagnostic Analysis State
  const diagnosticAnalysis = useMemo(() => {
    return RoadmapAccessController.analyzeDiagnosticWeakPoints(
      user,
      practiceHistory,
      mistakeVault,
      allQuestions
    );
  }, [user, practiceHistory, mistakeVault, allQuestions]);

  // Recalibration State
  const recalibrationStatus = useMemo(() => {
    return RoadmapAccessController.checkMissedDaysAndRecalibrate(currentRoadmap);
  }, [currentRoadmap]);

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'info' | 'warn'; text: string } | null>(
    null
  );

  // Live Whiteboard Modal (VIP Feature)
  const [isWhiteboardModalOpen, setIsWhiteboardModalOpen] = useState(false);
  const [mentorMessage, setMentorMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Robert Harrison (VIP Mentor)',
      text: 'Welcome to your VIP 1-on-1 portal! I have reviewed your baseline diagnostic. We will focus our live session on Advanced Nonlinear quadratics and Boundaries.',
      time: '10:15 AM',
    },
  ]);

  const showNotification = (text: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setNotificationMsg({ type, text });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Toggle domain selection for manual planner
  const handleToggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      if (selectedDomains.length > 1) {
        setSelectedDomains(selectedDomains.filter((d) => d !== domain));
      }
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  // Handle 1-Click AI Generation (PRO / VIP)
  const handleGenerateAIRoadmap = () => {
    if (!capabilities.canAutoGenerateRoadmap) {
      if (onOpenPaywall) onOpenPaywall();
      return;
    }

    const newRoadmap = RoadmapAccessController.generateAIAlgorithmicRoadmap({
      user,
      baselineScore,
      targetScore,
      targetExamDate,
      lowest3Domains: diagnosticAnalysis.lowest3Domains,
      dailyQuestionTarget: dailyQuestions,
    });

    saveUserRoadmap(newRoadmap);
    onRoadmapUpdated(newRoadmap);
    showNotification('30-Day AI Algorithmic Roadmap generated from your diagnostic weak points!');
  };

  // Handle Smart Recalibration
  const handleTriggerRecalibration = () => {
    if (!capabilities.canSmartRecalibrate) {
      if (onOpenPaywall) onOpenPaywall();
      return;
    }

    if (recalibrationStatus.recalibratedRoadmap) {
      saveUserRoadmap(recalibrationStatus.recalibratedRoadmap);
      onRoadmapUpdated(recalibrationStatus.recalibratedRoadmap);
      showNotification(
        recalibrationStatus.message || 'Workload rebalanced evenly across remaining days!'
      );
    } else {
      showNotification('Your roadmap is currently on track! No missed days detected.', 'info');
    }
  };

  // Handle Manual Custom Roadmap Save (STANDARD)
  const handleSaveManualPlan = () => {
    const manualRoadmap = RoadmapAccessController.generateManualRoadmap({
      user,
      baselineScore,
      targetScore,
      targetExamDate,
      selectedDomains,
      dailyQuestionTarget: dailyQuestions,
    });

    saveUserRoadmap(manualRoadmap);
    onRoadmapUpdated(manualRoadmap);
    showNotification('Custom 30-Day self-guided timeline saved successfully!');
  };

  // Drag & drop handlers for manual planner
  const handleDragStart = (idx: number) => {
    setDraggedDayIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedDayIdx === null || draggedDayIdx === targetIdx) return;

    const updated = [...timelineDays];
    const [moved] = updated.splice(draggedDayIdx, 1);
    updated.splice(targetIdx, 0, moved);
    setTimelineDays(updated);
    setDraggedDayIdx(targetIdx);
  };

  const handleSendMessageToMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorMessage.trim()) return;

    const newMsg = {
      sender: user.fullName || 'Student',
      text: mentorMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSentMessages((prev) => [...prev, newMsg]);
    setMentorMessage('');

    setTimeout(() => {
      setSentMessages((prev) => [
        ...prev,
        {
          sender: 'Dr. Robert Harrison (VIP Mentor)',
          text: 'Got your question! I have added a personalized quadratic drill to your Day 6 roadmap and will review this on our whiteboard session.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-[#1E1B18] pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {notificationMsg && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-semibold shadow-md ${
            notificationMsg.type === 'success'
              ? 'bg-[#2A9D8F]/10 border-[#2A9D8F]/30 text-[#2A9D8F]'
              : notificationMsg.type === 'info'
              ? 'bg-[#3D405B]/10 border-[#3D405B]/30 text-[#3D405B]'
              : 'bg-[#E07A5F]/10 border-[#E07A5F]/30 text-[#E07A5F]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg.text}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HEADER: TIER BADGE & NAVIGATION TABS */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 rounded-xl bg-[#3D405B] text-white">
              <Compass className="w-5 h-5 text-[#E9C46A]" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1E1B18]">
              Roadmap Engine & Plan Builder
            </h1>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${capabilities.badgeColor}`}
            >
              {capabilities.badgeLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#8C827A] max-w-2xl">
            {currentTier === 'VIP'
              ? 'AI algorithmic auto-scheduling active with Dr. Robert Harrison assigned as your Master Digital SAT Coach.'
              : currentTier === 'PRO'
              ? 'Algorithmic 30-day adaptive roadmap active with automated diagnostic triage and smart recalibration.'
              : 'Standard Self-Planner active. Configure exam milestones or upgrade to PRO for AI-automated weak point triage.'}
          </p>
        </div>

        {/* Builder Navigation Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveBuilderTab('AI_GEN')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeBuilderTab === 'AI_GEN'
                ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                : 'text-[#6B645C] hover:text-[#1E1B18]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#E07A5F]" />
            <span>AI Auto-Roadmap</span>
            {!capabilities.canAutoGenerateRoadmap && (
              <Lock className="w-3 h-3 text-[#8C827A]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveBuilderTab('MANUAL_PLANNER')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeBuilderTab === 'MANUAL_PLANNER'
                ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                : 'text-[#6B645C] hover:text-[#1E1B18]'
            }`}
          >
            <Sliders className="w-4 h-4 text-[#3D405B]" />
            <span>Custom Timeline</span>
          </button>

          {currentTier === 'VIP' && (
            <button
              type="button"
              onClick={() => setActiveBuilderTab('VIP_MENTOR')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeBuilderTab === 'VIP_MENTOR'
                  ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                  : 'text-[#6B645C] hover:text-[#1E1B18]'
              }`}
            >
              <Award className="w-4 h-4 text-[#E9C46A]" />
              <span>VIP Mentor Lounge</span>
            </button>
          )}

          {onCloseBuilder && (
            <button
              type="button"
              onClick={onCloseBuilder}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-[#6B645C] hover:bg-[#E5E0D8]/40 transition-colors"
            >
              View Active Roadmap
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* UPGRADE PROMPT BANNER FOR STANDARD / FREE TIER */}
      {/* ========================================================================= */}
      {capabilities.isUpgradeRequiredForAuto && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FAF8F5] via-white to-[#FAF8F5] border border-[#E07A5F]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#E07A5F]/10 text-[#E07A5F] shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E1B18]">
                Unlock Algorithmic Weak-Point Auto-Triage
              </h3>
              <p className="text-xs text-[#6B645C] mt-0.5 max-w-xl">
                {capabilities.upgradePromptText}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPaywall}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E07A5F] text-white hover:bg-[#D0694E] shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#E9C46A]" />
            <span>Upgrade to PRO ($29/mo)</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: AI ALGORITHMIC AUTO-ROADMAP GENERATOR (PRO / VIP) */}
      {/* ========================================================================= */}
      {activeBuilderTab === 'AI_GEN' && (
        <div className="space-y-6">
          {/* Diagnostic Analysis Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#2A9D8F]/10 text-[#2A9D8F]">
                  <BrainCircuit className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#1E1B18]">
                    1. Real-Time Diagnostic Accuracy Triage
                  </h3>
                  <p className="text-xs text-[#8C827A]">
                    Identifies your lowest 3 sub-skill domains across all practice tests to optimize point yield.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/20">
                AI Engine Synced
              </span>
            </div>

            {/* Accuracies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {diagnosticAnalysis.domainAccuracies.map((item, idx) => {
                const isLowest3 = idx < 3;
                return (
                  <div
                    key={item.domain}
                    className={`p-4 rounded-2xl border transition-all ${
                      isLowest3
                        ? 'bg-[#FAF8F5] border-[#E07A5F] ring-1 ring-[#E07A5F]/20'
                        : 'bg-white border-[#E5E0D8]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-[#1E1B18] truncate pr-1">
                        {item.domain}
                      </span>
                      {isLowest3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#E07A5F] text-white shrink-0">
                          Priority #{idx + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline justify-between mt-2">
                      <span
                        className={`text-lg font-bold ${
                          item.accuracy < 50
                            ? 'text-[#E07A5F]'
                            : item.accuracy < 70
                            ? 'text-[#E9C46A]'
                            : 'text-[#2A9D8F]'
                        }`}
                      >
                        {item.accuracy}%
                      </span>
                      <span className="text-[11px] text-[#8C827A]">
                        {item.wrong} error{item.wrong === 1 ? '' : 's'} logged
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs text-[#3D405B] flex items-start gap-2.5">
              <TrendingUp className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
              <span>{diagnosticAnalysis.suggestedFocusSummary}</span>
            </div>
          </div>

          {/* Goal & Milestone Parameters */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-base font-bold text-[#1E1B18] border-b border-[#E5E0D8] pb-4">
              2. Score Target & Test Date Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Baseline Score */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">
                  Baseline Diagnostic Score
                </label>
                <input
                  type="number"
                  min={400}
                  max={1600}
                  step={10}
                  value={baselineScore}
                  onChange={(e) => setBaselineScore(parseInt(e.target.value) || 1180)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E0D8] text-sm font-bold text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              {/* Target Score */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">
                  Target SAT Score
                </label>
                <input
                  type="number"
                  min={400}
                  max={1600}
                  step={10}
                  value={targetScore}
                  onChange={(e) => setTargetScore(parseInt(e.target.value) || 1520)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E0D8] text-sm font-bold text-[#E07A5F] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              {/* Target Exam Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">
                  Target Exam Date
                </label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E5E0D8] text-sm font-semibold text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                />
              </div>

              {/* Daily Intensity Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#1E1B18]">Daily Question Target</label>
                  <span className="font-bold text-[#3D405B]">{dailyQuestions} q's/day</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={20}
                  value={dailyQuestions}
                  onChange={(e) => setDailyQuestions(parseInt(e.target.value))}
                  className="w-full h-2 bg-[#FAF8F5] rounded-lg appearance-none cursor-pointer accent-[#E07A5F] mt-2"
                />
                <div className="flex justify-between text-[10px] text-[#8C827A]">
                  <span>5 (Relaxed)</span>
                  <span>10 (Standard)</span>
                  <span>20 (Intensive)</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E0D8]">
              <div className="text-xs text-[#8C827A]">
                Predicted Score Gain:{' '}
                <span className="font-bold text-[#2A9D8F]">
                  +{Math.max(targetScore - baselineScore, 80)} pts
                </span>{' '}
                over 30 structured days.
              </div>

              <button
                type="button"
                onClick={handleGenerateAIRoadmap}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-[#E07A5F] text-white hover:bg-[#D0694E] shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#E9C46A]" />
                <span>
                  {capabilities.canAutoGenerateRoadmap
                    ? 'Generate Algorithmic 30-Day Plan'
                    : 'Upgrade to PRO to Generate'}
                </span>
              </button>
            </div>
          </div>

          {/* Smart Recalibration Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-[#3D405B] text-white">
                  <RotateCcw className="w-4 h-4 text-[#E9C46A]" />
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#1E1B18]">
                    Smart Workload Recalibration (Missed Days Re-balancer)
                  </h3>
                  <p className="text-xs text-[#8C827A]">
                    Life happens. If you miss $\ge 2$ days, our algorithm re-balances your uncompleted questions evenly across the remaining timeline without penalty.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-[#1E1B18]">
                  Recalibration Status:{' '}
                  {recalibrationStatus.missedDaysCount >= 2 ? (
                    <span className="text-[#E07A5F] font-bold">
                      {recalibrationStatus.missedDaysCount} Missed Days Detected
                    </span>
                  ) : (
                    <span className="text-[#2A9D8F] font-bold">On Schedule (0 Missed Days)</span>
                  )}
                </div>
                <div className="text-[11px] text-[#8C827A] mt-0.5">
                  Last recalibration:{' '}
                  {currentRoadmap.recalibratedAt
                    ? new Date(currentRoadmap.recalibratedAt).toLocaleDateString()
                    : 'Never (Plan pristine)'}
                </div>
              </div>

              <button
                type="button"
                onClick={handleTriggerRecalibration}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E5E0D8] text-[#3D405B] hover:bg-[#FAF8F5] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run Smart Recalibration</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANUAL CUSTOM TIMELINE PLANNER (STANDARD TIER) */}
      {/* ========================================================================= */}
      {activeBuilderTab === 'MANUAL_PLANNER' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <h3 className="text-base font-bold text-[#1E1B18]">
                Custom Self-Guided Syllabus Planner
              </h3>
              <p className="text-xs text-[#8C827A]">
                Manually pick your focus domains and daily question target. You can drag and reorder topics across your 30-day timeline.
              </p>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">Target Exam Date</label>
                <input
                  type="date"
                  value={targetExamDate}
                  onChange={(e) => setTargetExamDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#1E1B18] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">Baseline Score</label>
                <input
                  type="number"
                  value={baselineScore}
                  onChange={(e) => setBaselineScore(parseInt(e.target.value) || 1100)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#1E1B18] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1E1B18] block">Daily Questions</label>
                <input
                  type="number"
                  min={3}
                  max={30}
                  value={dailyQuestions}
                  onChange={(e) => setDailyQuestions(parseInt(e.target.value) || 8)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#1E1B18] bg-[#FAF8F5]"
                />
              </div>
            </div>

            {/* Domain Selection Chips */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1E1B18] block">
                Select Priority Domains (Assigned sequentially across days)
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SAT_DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain);
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => handleToggleDomain(domain)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#3D405B] text-white border-[#3D405B]'
                          : 'bg-[#FAF8F5] text-[#6B645C] border-[#E5E0D8] hover:bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-[#E9C46A]" />}
                      <span>{domain}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Timeline Reorder list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                  30-Day Timeline Topics (Drag to re-order)
                </span>
                <span className="text-[11px] text-[#8C827A]">Showing 30 Days</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto p-1">
                {timelineDays.slice(0, 15).map((day, idx) => (
                  <div
                    key={day.dayNumber}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    className="p-3 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5] hover:bg-white transition-all flex items-center justify-between text-xs cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <GripVertical className="w-4 h-4 text-[#8C827A] shrink-0" />
                      <span className="font-bold text-[#1E1B18]">Day {idx + 1}</span>
                      <span className="text-[#8C827A] truncate">• {day.title}</span>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#3D405B] shrink-0">
                      {day.domainFocus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={handleSaveManualPlan}
                className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#3D405B] text-white hover:bg-[#2F3146] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4 text-[#E9C46A]" />
                <span>Save Manual Timeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: VIP TIER MENTOR OVERSIGHT & LIVE WHITEBOARD */}
      {/* ========================================================================= */}
      {activeBuilderTab === 'VIP_MENTOR' && currentTier === 'VIP' && (
        <div className="space-y-6">
          {/* Assigned Mentor Card */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E0D8] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#3D405B] text-[#E9C46A] flex items-center justify-center font-bold text-xl border border-[#E9C46A]/30 shadow-xs">
                  RH
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1E1B18]">
                      Dr. Robert Harrison
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2A9D8F]/10 text-[#2A9D8F] border border-[#2A9D8F]/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-xs text-[#8C827A] mt-0.5">
                    Lead Digital SAT Specialist • 1590 SAT Scorer • Assigned VIP Coach
                  </p>
                </div>
              </div>

              {/* Action: Whiteboard Session */}
              <button
                type="button"
                onClick={() => setIsWhiteboardModalOpen(true)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#3D405B] text-white hover:bg-[#2F3146] shadow-xs flex items-center gap-2 transition-all"
              >
                <Video className="w-4 h-4 text-[#E9C46A]" />
                <span>Launch Live Whiteboard Session</span>
              </button>
            </div>

            {/* Mentor Overview Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <span className="text-[11px] text-[#8C827A] font-semibold block">
                  Next Scheduled 1-on-1 Review
                </span>
                <div className="font-bold text-sm text-[#1E1B18]">
                  Tomorrow, 4:00 PM EST
                </div>
                <div className="text-[10px] text-[#2A9D8F] font-semibold">
                  Focus: Module 2 Hard Math Traps
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <span className="text-[11px] text-[#8C827A] font-semibold block">
                  Mentor Injected Tasks
                </span>
                <div className="font-bold text-sm text-[#1E1B18]">
                  3 Custom Homework Sets
                </div>
                <div className="text-[10px] text-[#E07A5F] font-semibold">
                  Synced into Days 4, 7, and 12
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-1">
                <span className="text-[11px] text-[#8C827A] font-semibold block">
                  Proprietary Mocks Assigned
                </span>
                <div className="font-bold text-sm text-[#1E1B18]">
                  OnePrep Ivy League Mock #3
                </div>
                <div className="text-[10px] text-[#3D405B] font-semibold">
                  Adaptive Section Unlocked
                </div>
              </div>
            </div>

            {/* 1-on-1 Direct Messaging Thread */}
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#1E1B18]">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#E07A5F]" />
                  Direct 1-on-1 Coach Chat
                </span>
                <span className="text-[10px] text-[#8C827A]">Private VIP Channel</span>
              </div>

              <div className="space-y-2.5 max-h-48 overflow-y-auto p-1">
                {sentMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs ${
                      msg.sender.includes('VIP Mentor')
                        ? 'bg-white border border-[#E5E0D8] text-[#1E1B18]'
                        : 'bg-[#3D405B] text-white ml-8'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-semibold">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessageToMentor} className="flex gap-2">
                <input
                  type="text"
                  value={mentorMessage}
                  onChange={(e) => setMentorMessage(e.target.value)}
                  placeholder="Ask Dr. Harrison a question about your roadmap or mock..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-[#E5E0D8] text-xs text-[#1E1B18] focus:outline-none focus:border-[#E07A5F]"
                />
                <button
                  type="submit"
                  disabled={!mentorMessage.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#E07A5F] text-white hover:bg-[#D0694E] disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: LIVE WEBRTC WHITEBOARD COACHING SIMULATOR (VIP TIER) */}
      {/* ========================================================================= */}
      {isWhiteboardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] border border-[#E5E0D8] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Whiteboard Top bar */}
            <div className="p-4 bg-[#1E1B18] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2A9D8F] animate-ping" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#E9C46A]" />
                    VIP Live Whiteboard Coaching • Dr. Robert Harrison
                  </h4>
                  <p className="text-[11px] text-[#8C827A]">
                    Low-Latency Audio & Interactive SAT Math Workspace Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 text-white font-mono">
                  00:14:32
                </span>
                <button
                  type="button"
                  onClick={() => setIsWhiteboardModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  End Call
                </button>
              </div>
            </div>

            {/* Whiteboard Canvas Mock */}
            <div className="flex-1 bg-[#FAF8F5] p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="max-w-xl w-full bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-xs space-y-4 font-mono text-xs">
                <div className="text-xs font-bold text-[#E07A5F] uppercase tracking-wider">
                  Live Coach Annotation • Problem: Quadratic Discriminant Form
                </div>
                <div className="text-sm text-[#1E1B18] font-sans">
                  {"For what value of k does the equation 2x² - 8x + k = 0 have exactly one real solution?"}
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-[#3D405B] space-y-1 text-xs">
                  <div>{'Δ = b² - 4ac = 0'}</div>
                  <div>{'(-8)² - 4(2)(k) = 0'}</div>
                  <div>{'64 - 8k = 0 ⟹ 8k = 64 ⟹ k = 8'}</div>
                </div>
                <div className="text-[11px] text-[#2A9D8F] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified by Dr. Harrison: "Remember, one real solution always implies $\Delta = 0$."</span>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="p-4 bg-white border-t border-[#E5E0D8] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#8C827A]">
                <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                Microphone connected • Screen sharing enabled
              </div>
              <button
                type="button"
                onClick={() => setIsWhiteboardModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#3D405B] text-white hover:bg-[#2F3146] transition-colors"
              >
                Close Whiteboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
