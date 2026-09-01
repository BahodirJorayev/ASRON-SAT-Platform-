import React, { useState, useEffect } from 'react';
import {
  Flame,
  Trophy,
  Crown,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Share2,
  Check,
  ArrowRight,
  Gift,
  Target,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';

export interface StreakMilestone {
  days: number;
  title: string;
  badgeLabel: string;
  bonusXP: number;
  iconName: 'flame' | 'trophy' | 'crown';
  gradientBg: string;
  cardBorder: string;
  glowColor: string;
  themeColor: string;
  congratulatoryMessage: string;
  scientificBenefit: string;
  unlockedPerk: string;
  nextGoalTeaser: string;
}

export const STREAK_MILESTONES: Record<number, StreakMilestone> = {
  7: {
    days: 7,
    title: '7-Day Consistency Master',
    badgeLabel: '1-WEEK HABIT FORMED',
    bonusXP: 150,
    iconName: 'flame',
    gradientBg: 'from-amber-500 via-orange-600 to-rose-600',
    cardBorder: 'border-amber-300',
    glowColor: 'shadow-amber-500/30',
    themeColor: '#F59E0B',
    congratulatoryMessage:
      'Phenomenal work! You have maintained an unbroken 7-day study streak. Neuro-scientific studies demonstrate that 7 consecutive days of micro-practice permanently cements question-pattern recognition and Desmos intuition.',
    scientificBenefit: '+18% increase in active recall & retention for Digital SAT question archetypes.',
    unlockedPerk: 'Unlocked Bronze Flame Badge & Special Practice Multipliers',
    nextGoalTeaser: 'Next major milestone: 30-Day Habit Master (23 days to go!)',
  },
  30: {
    days: 30,
    title: '30-Day Iron Discipline',
    badgeLabel: '1-MONTH ELITE HABIT',
    bonusXP: 500,
    iconName: 'trophy',
    gradientBg: 'from-blue-600 via-indigo-600 to-purple-700',
    cardBorder: 'border-indigo-300',
    glowColor: 'shadow-indigo-500/30',
    themeColor: '#6366F1',
    congratulatoryMessage:
      'Incredible milestone! A full 30 days of unbroken preparation places you in the top 5% of all SAT students worldwide. Your cognitive stamina is now primed to easily sustain full-length 2-Stage adaptive Bluebook test modules.',
    scientificBenefit: 'Estimated +120 to +180 score point growth through continuous spaced repetition.',
    unlockedPerk: 'Unlocked Silver Trophy Badge & Priority AI Cloned Question Generation',
    nextGoalTeaser: 'Next legendary milestone: 100-Day Centurion (70 days to go!)',
  },
  100: {
    days: 100,
    title: '100-Day Centurion Legend',
    badgeLabel: '99TH PERCENTILE DEDICATION',
    bonusXP: 2000,
    iconName: 'crown',
    gradientBg: 'from-emerald-600 via-teal-700 to-cyan-800',
    cardBorder: 'border-emerald-300',
    glowColor: 'shadow-emerald-500/30',
    themeColor: '#10B981',
    congratulatoryMessage:
      'Legendary dedication unlocked! 100 days of unbroken consistency. You have achieved true Digital SAT mastery across Leitner SRS error vaults, advanced algebra regressions, and high-density rhetorical passages.',
    scientificBenefit: 'Maximum exam stamina and near-zero error rate on fundamental & medium difficulty questions.',
    unlockedPerk: 'Unlocked Gold Centurion Crown & Exclusive Ivy League Strategy Blueprints',
    nextGoalTeaser: 'Target 1550+ / 1600 Score: You possess the discipline of top university scholars!',
  },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  milestoneDay?: number;
  onClaimMilestoneReward: (milestoneDays: number, bonusXP: number) => void;
}

export const MilestoneCelebrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  milestoneDay = 7,
  onClaimMilestoneReward,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<number>(milestoneDay);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Sync with prop when modal opens
  useEffect(() => {
    if (isOpen) {
      // Pick best default milestone based on user's streak or provided prop
      if ([7, 30, 100].includes(milestoneDay)) {
        setSelectedMilestone(milestoneDay);
      } else if (user.streakDays >= 100) {
        setSelectedMilestone(100);
      } else if (user.streakDays >= 30) {
        setSelectedMilestone(30);
      } else {
        setSelectedMilestone(7);
      }

      // Trigger multi-stage confetti
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#F59E0B', '#10B981', '#6366F1'],
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#F59E0B', '#10B981', '#6366F1'],
          });
        }, 300);
      } catch {
        // Confetti fallback
      }
    }
  }, [isOpen, milestoneDay, user.streakDays]);

  // Check if current selected milestone is already claimed
  const milestone = STREAK_MILESTONES[selectedMilestone] || STREAK_MILESTONES[7];
  const alreadyClaimed = user.claimedMilestones?.includes(milestone.days) || false;

  useEffect(() => {
    setIsClaimed(alreadyClaimed);
  }, [alreadyClaimed, selectedMilestone]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleClaim = () => {
    setIsClaimed(true);
    onClaimMilestoneReward(milestone.days, milestone.bonusXP);
    // Burst of confetti on claim
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.7 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch {
      // ignore
    }
  };

  const handleShare = () => {
    const text = `🔥 I just hit a ${milestone.days}-day study streak on AURA SAT and unlocked the "${milestone.title}" milestone +${milestone.bonusXP} XP! Check out https://aura-sat.io`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] rounded-3xl max-w-xl w-full border border-[#E8E2D5] shadow-2xl overflow-hidden relative flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Milestone Selector Tabs (7, 30, 100 Days) */}
        <div className="bg-[#1C1917] px-6 pt-5 pb-3 flex items-center justify-between gap-2 border-b border-white/10">
          <div className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak Milestones</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[7, 30, 100].map((days) => {
              const isSelected = selectedMilestone === days;
              const isUserReached = user.streakDays >= days;
              const isMilestoneClaimed = user.claimedMilestones?.includes(days);

              return (
                <button
                  key={days}
                  onClick={() => setSelectedMilestone(days)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-white text-[#1C1917] shadow-md scale-105'
                      : isUserReached
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <Flame
                    className={`w-3 h-3 ${
                      days === 100
                        ? 'text-emerald-400'
                        : days === 30
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}
                  />
                  <span>{days} Days</span>
                  {isMilestoneClaimed && <span className="text-[10px] text-emerald-400">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hero Banner with Dynamic Gradient */}
        <div
          className={`bg-gradient-to-br ${milestone.gradientBg} p-6 sm:p-8 text-white relative overflow-hidden text-center flex flex-col items-center justify-center`}
        >
          {/* Subtle background graphics */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          {/* Badge Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md border-2 border-white/40 shadow-2xl flex items-center justify-center mb-3 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-3xl animate-ping opacity-25"></div>
            {milestone.iconName === 'crown' && <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-200 drop-shadow-md" />}
            {milestone.iconName === 'trophy' && <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-300 drop-shadow-md" />}
            {milestone.iconName === 'flame' && <Flame className="w-10 h-10 sm:w-12 sm:h-12 text-amber-200 fill-amber-300 drop-shadow-md" />}
          </div>

          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[10px] sm:text-xs font-mono font-black tracking-widest uppercase border border-white/30 text-white mb-2 shadow-xs">
            ★ {milestone.badgeLabel} ★
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {milestone.title}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <div className="px-3 py-1 rounded-xl bg-white text-[#1C1917] font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>+{milestone.bonusXP} XP BONUS</span>
            </div>

            <div className="px-3 py-1 rounded-xl bg-black/25 backdrop-blur-xs border border-white/20 text-white font-mono text-xs font-bold">
              Current Streak: {user.streakDays} Days
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Congratulatory message box */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
              <Award className="w-4 h-4 text-[#2563EB]" />
              <span>Achievement Recognition</span>
            </div>
            <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
              {milestone.congratulatoryMessage}
            </p>
          </div>

          {/* Scientific Benefit & Unlocked Perk */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cognitive Impact</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-snug">
                {milestone.scientificBenefit}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-800">
                <Gift className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Unlocked Reward</span>
              </div>
              <p className="text-[11px] text-blue-900 leading-snug">
                {milestone.unlockedPerk}
              </p>
            </div>
          </div>

          {/* Next Milestone Teaser */}
          <div className="px-4 py-2.5 rounded-xl bg-[#F3EFE6] border border-[#E8E2D5] flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-[#57534E]">
              <Target className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{milestone.nextGoalTeaser}</span>
            </div>
            <span className="font-mono font-bold text-[#1C1917]">
              {user.streakDays >= milestone.days ? 'COMPLETED' : `${milestone.days - user.streakDays}d left`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleClaim}
              disabled={isClaimed}
              className={`w-full sm:flex-1 py-3.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isClaimed
                  ? 'bg-emerald-600 text-white cursor-default opacity-90'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-blue-600/25 hover:scale-[1.02] active:scale-98'
              }`}
            >
              {isClaimed ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>+{milestone.bonusXP} XP Reward Claimed!</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>Claim +{milestone.bonusXP} XP Bonus Reward</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="w-full sm:w-auto px-4 py-3.5 rounded-2xl border border-[#D6CEBE] hover:bg-[#FAF7F2] text-[#1C1917] font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              title="Share Streak Milestone"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
