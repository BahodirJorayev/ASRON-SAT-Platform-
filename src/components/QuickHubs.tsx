import React from 'react';
import {
  FileCheck2,
  BookOpen,
  BookMarked,
  Swords,
  ArrowUpRight
} from 'lucide-react';

interface Props {
  onOpenBluebook: () => void;
  onOpenQuestionBank: () => void;
  onOpenVocabTrainer: () => void;
  onOpenMultiplayerArena: () => void;
  mockTestsCount?: number;
  questionsCount?: number;
}

export const QuickHubs: React.FC<Props> = ({
  onOpenBluebook,
  onOpenQuestionBank,
  onOpenVocabTrainer,
  onOpenMultiplayerArena,
  mockTestsCount = 6,
  questionsCount = 3000,
}) => {
  const hubs = [
    {
      id: 'bluebook',
      title: 'Bluebook Simulation',
      subtitle: 'Official 2-Stage MST Model',
      description: 'Adaptive module routing with integrated Desmos graphing, authentic timing, and instant sub-score diagnostics.',
      icon: FileCheck2,
      badge: 'Official MST',
      actionLabel: 'Launch Test',
      onClick: onOpenBluebook,
    },
    {
      id: 'qbank',
      title: 'Question Bank (SQB)',
      subtitle: `${questionsCount.toLocaleString()}+ Verified Items`,
      description: 'Filter across 4 core domains, 16 skills, and 3 difficulty tiers with step-by-step Socratic walkthroughs.',
      icon: BookOpen,
      badge: '3,000+ Items',
      actionLabel: 'Browse Bank',
      onClick: onOpenQuestionBank,
    },
    {
      id: 'vocab',
      title: 'SAT Vocab Trainer',
      subtitle: 'Leitner Spaced Repetition',
      description: 'Master high-frequency Digital SAT vocabulary, contextual tone, and subtle transition nuances in 5-minute drills.',
      icon: BookMarked,
      badge: 'Spaced Recall',
      actionLabel: 'Open Flashcards',
      onClick: onOpenVocabTrainer,
    },
    {
      id: 'arena',
      title: 'Competitive Arena',
      subtitle: '1v1 Timed Speed Duel',
      description: 'Compete against SAT peers in real-time speed duels. Track percentile standing and climb weekly leaderboards.',
      icon: Swords,
      badge: 'Live 1v1',
      actionLabel: 'Enter Arena',
      onClick: onOpenMultiplayerArena,
    },
  ];

  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] dark:text-[#F8FAFC] tracking-tight">
            Practice Modules
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Select an active training module to target your skill gaps
          </p>
        </div>
      </div>

      {/* Grid of 4 Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          return (
            <div
              key={hub.id}
              onClick={hub.onClick}
              className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 shadow-xs flex flex-col justify-between space-y-4 transition-colors hover:border-[#1E1B18] dark:hover:border-[#94A3B8] cursor-pointer group"
            >
              <div className="space-y-3">
                {/* Top row: Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-center text-[#1E1B18] dark:text-[#F8FAFC]">
                    <Icon size={16} strokeWidth={1.5} />
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
                    {hub.badge}
                  </span>
                </div>

                {/* Title and Subtitle */}
                <div>
                  <h4 className="text-sm font-bold text-[#1E1B18] dark:text-[#F8FAFC] group-hover:text-[#E07A5F] transition-colors">
                    {hub.title}
                  </h4>
                  <div className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                    {hub.subtitle}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed line-clamp-3">
                  {hub.description}
                </p>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-3 border-t border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-between text-xs font-semibold text-[#1E1B18] dark:text-[#F8FAFC]">
                <span>{hub.actionLabel}</span>
                <ArrowUpRight size={14} className="text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#1E1B18] dark:group-hover:text-white transition-colors" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
