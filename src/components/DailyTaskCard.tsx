import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Target,
  Sparkles,
  Zap,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Check,
  AlertCircle,
  ExternalLink,
  Flame,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MasterCurriculumDay, RoadmapTaskProgress, User } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface Props {
  day: MasterCurriculumDay;
  tasks: RoadmapTaskProgress[];
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isCompleted: boolean;
  onToggleTask: (taskId: string) => void;
  onMarkAllDayTasks: (dayNumber: number, complete: boolean) => void;
  onOpenConceptNote?: (day: MasterCurriculumDay) => void;
  onOpenPractice?: (day: MasterCurriculumDay) => void;
  onOpenVocabTrainer?: (day: MasterCurriculumDay) => void;
  onOpenMockTest?: (mockTestId?: string) => void;
  onOpenFormulaSheet?: () => void;
}

export const DailyTaskCard: React.FC<Props> = ({
  day,
  tasks,
  isToday,
  isPast,
  isFuture,
  isCompleted,
  onToggleTask,
  onMarkAllDayTasks,
  onOpenConceptNote,
  onOpenPractice,
  onOpenVocabTrainer,
  onOpenMockTest,
  onOpenFormulaSheet,
}) => {
  const [isConceptExpanded, setIsConceptExpanded] = useState(false);

  const dayTasks = tasks.filter((t) => t.dayNumber === day.dayNumber);
  const completedTaskCount = dayTasks.filter((t) => t.isCompleted).length;
  const totalTasks = dayTasks.length || 3;
  const allTasksDone = dayTasks.length > 0 && completedTaskCount === dayTasks.length;

  const conceptTask = dayTasks.find((t) => t.taskType === 'CONCEPT_READING');
  const practiceTask = dayTasks.find((t) => t.taskType === 'PRACTICE_SET' || t.taskType === 'FULL_MOCK');
  const vocabTask = dayTasks.find((t) => t.taskType === 'VOCAB');
  const customTasks = dayTasks.filter((t) => t.taskType === 'CUSTOM');

  // Status Badge Determination
  let statusBadge = {
    label: 'Upcoming',
    bg: 'bg-[#F5F0EB]',
    text: 'text-[#8C827A]',
    border: 'border-[#E5E0D8]',
    icon: Clock,
  };

  if (allTasksDone || isCompleted) {
    statusBadge = {
      label: 'Completed',
      bg: 'bg-[#2A9D8F]/10',
      text: 'text-[#2A9D8F]',
      border: 'border-[#2A9D8F]/30',
      icon: CheckCircle2,
    };
  } else if (isToday) {
    statusBadge = {
      label: "Today's Focus",
      bg: 'bg-[#E07A5F]/10',
      text: 'text-[#E07A5F]',
      border: 'border-[#E07A5F]/30',
      icon: Flame,
    };
  } else if (isPast && !allTasksDone) {
    statusBadge = {
      label: 'Catch Up',
      bg: 'bg-[#E9C46A]/15',
      text: 'text-[#B48421]',
      border: 'border-[#E9C46A]/40',
      icon: AlertCircle,
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div
      id={`roadmap-day-${day.dayNumber}`}
      className={`relative rounded-2xl transition-all duration-200 border ${
        isToday
          ? 'bg-white border-[#E07A5F] shadow-sm ring-1 ring-[#E07A5F]/20'
          : allTasksDone
          ? 'bg-white border-[#2A9D8F]/40 shadow-2xs'
          : 'bg-white border-[#E5E0D8] hover:border-[#D5CEC5] shadow-2xs'
      }`}
    >
      {/* Day Top Bar */}
      <div className="p-5 sm:p-6 border-b border-[#E5E0D8]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
              Day {day.dayNumber} of 30
            </span>
            <span className="text-[#E5E0D8]">•</span>
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F5F0EB] text-[#3D405B] border border-[#E5E0D8]">
              {day.domainFocus}
            </span>
            {day.isMockDay && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#3D405B] text-white">
                <Award className="w-3 h-3 text-[#E9C46A]" />
                Adaptive Mock Test
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-[#2A9D8F]/10 text-[#2A9D8F]">
              {day.targetScoreGain}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#1E1B18] tracking-tight">
            {day.title}
          </h3>
        </div>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-medium text-[#8C827A]">
              {completedTaskCount} of {totalTasks} Tasks
            </span>
            <div className="w-24 h-1.5 bg-[#F5F0EB] rounded-full overflow-hidden mt-1">
              <div
                className={`h-full transition-all duration-300 ${
                  allTasksDone ? 'bg-[#2A9D8F]' : 'bg-[#E07A5F]'
                }`}
                style={{ width: `${(completedTaskCount / totalTasks) * 100}%` }}
              />
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusBadge.label}
          </span>
        </div>
      </div>

      {/* Tri-Part Micro Tasks Checklist */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* TASK 1: CONCEPT READING */}
        {conceptTask && (
          <div
            className={`p-4 rounded-xl border transition-colors ${
              conceptTask.isCompleted
                ? 'bg-[#F9FBF9] border-[#2A9D8F]/25 text-[#1E1B18]'
                : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#1E1B18]'
            }`}
          >
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  id={`btn-task-${conceptTask.id}`}
                  onClick={() => onToggleTask(conceptTask.id)}
                  className="mt-0.5 text-[#8C827A] hover:text-[#2A9D8F] transition-colors shrink-0 focus:outline-none"
                  title={conceptTask.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {conceptTask.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] fill-[#2A9D8F]/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#C4BCB3] hover:text-[#8C827A]" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#E07A5F]">
                      Task 1 • Skill Concept
                    </span>
                    {conceptTask.isCompleted && (
                      <span className="text-xs text-[#2A9D8F] font-medium">✓ Done</span>
                    )}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-semibold mt-0.5 ${
                      conceptTask.isCompleted ? 'text-[#3D405B] line-through decoration-[#2A9D8F]/50' : 'text-[#1E1B18]'
                    }`}
                  >
                    {day.conceptTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B645C] mt-1 line-clamp-2">
                    {day.conceptSummary}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsConceptExpanded(!isConceptExpanded)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#3D405B] hover:bg-[#E5E0D8]/40 border border-[#E5E0D8] flex items-center gap-1 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Notes</span>
                  {isConceptExpanded ? (
                    <ChevronUp className="w-3 h-3 text-[#8C827A]" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-[#8C827A]" />
                  )}
                </button>

                {onOpenFormulaSheet && (
                  <button
                    type="button"
                    onClick={onOpenFormulaSheet}
                    className="p-1.5 rounded-lg text-xs font-medium text-[#8C827A] hover:text-[#3D405B] hover:bg-[#E5E0D8]/40 border border-transparent hover:border-[#E5E0D8] transition-colors"
                    title="Open Formula Cheat Sheet"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Concept Markdown Notes */}
            {isConceptExpanded && day.conceptMarkdown && (
              <div className="mt-3.5 pt-3.5 border-t border-[#E5E0D8] text-xs sm:text-sm text-[#3D405B] bg-white p-3.5 rounded-lg space-y-2">
                <div className="prose prose-sm max-w-none text-[#3D405B]">
                  <KaTeXRenderer text={day.conceptMarkdown} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TASK 2: TARGETED PRACTICE / MOCK TEST */}
        {practiceTask && (
          <div
            className={`p-4 rounded-xl border transition-colors ${
              practiceTask.isCompleted
                ? 'bg-[#F9FBF9] border-[#2A9D8F]/25 text-[#1E1B18]'
                : day.isMockDay
                ? 'bg-[#3D405B]/5 border-[#3D405B]/20 text-[#1E1B18]'
                : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#1E1B18]'
            }`}
          >
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  id={`btn-task-${practiceTask.id}`}
                  onClick={() => onToggleTask(practiceTask.id)}
                  className="mt-0.5 text-[#8C827A] hover:text-[#2A9D8F] transition-colors shrink-0 focus:outline-none"
                  title={practiceTask.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {practiceTask.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] fill-[#2A9D8F]/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#C4BCB3] hover:text-[#8C827A]" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#3D405B]">
                      Task 2 • {day.isMockDay ? 'Adaptive Checkpoint' : 'Targeted Practice'}
                    </span>
                    <span className="text-xs font-medium px-2 py-0.2 rounded-full bg-[#E5E0D8]/60 text-[#6B645C]">
                      {day.isMockDay ? 'Full Mock Test' : `${day.practiceQuestionCount} SQB Questions`}
                    </span>
                    {practiceTask.isCompleted && (
                      <span className="text-xs text-[#2A9D8F] font-medium">✓ Done</span>
                    )}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-semibold mt-0.5 ${
                      practiceTask.isCompleted ? 'text-[#3D405B] line-through decoration-[#2A9D8F]/50' : 'text-[#1E1B18]'
                    }`}
                  >
                    {day.practiceTitle}
                  </h4>
                  <p className="text-xs text-[#6B645C] mt-1">
                    {day.isMockDay
                      ? 'Simulate authentic 2-stage multi-stage adaptive module routing with real scoring.'
                      : `Solve ${day.practiceQuestionCount} focused questions in practice mode with step-by-step Socratic breakdown.`}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {day.isMockDay ? (
                  <button
                    type="button"
                    onClick={() => onOpenMockTest && onOpenMockTest(day.mockTestId)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#3D405B] text-white hover:bg-[#2F3146] shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Mock</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenPractice && onOpenPractice(day)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#E07A5F] text-white hover:bg-[#D0694E] shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Practice</span>
                    <Target className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TASK 3: VOCABULARY */}
        {vocabTask && (
          <div
            className={`p-4 rounded-xl border transition-colors ${
              vocabTask.isCompleted
                ? 'bg-[#F9FBF9] border-[#2A9D8F]/25 text-[#1E1B18]'
                : 'bg-[#FAF8F5] border-[#E5E0D8] text-[#1E1B18]'
            }`}
          >
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  id={`btn-task-${vocabTask.id}`}
                  onClick={() => onToggleTask(vocabTask.id)}
                  className="mt-0.5 text-[#8C827A] hover:text-[#2A9D8F] transition-colors shrink-0 focus:outline-none"
                  title={vocabTask.isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {vocabTask.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] fill-[#2A9D8F]/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#C4BCB3] hover:text-[#8C827A]" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#2A9D8F]">
                      Task 3 • Vocabulary 400
                    </span>
                    <span className="text-xs font-medium px-2 py-0.2 rounded-full bg-[#E5E0D8]/60 text-[#6B645C]">
                      {day.vocabWordCount} Words
                    </span>
                    {vocabTask.isCompleted && (
                      <span className="text-xs text-[#2A9D8F] font-medium">✓ Done</span>
                    )}
                  </div>
                  <h4
                    className={`text-sm sm:text-base font-semibold mt-0.5 ${
                      vocabTask.isCompleted ? 'text-[#3D405B] line-through decoration-[#2A9D8F]/50' : 'text-[#1E1B18]'
                    }`}
                  >
                    {day.vocabTitle}
                  </h4>
                  <p className="text-xs text-[#6B645C] mt-1">
                    Contextual definitions, tone nuances, and fill-in-the-blank flashcards.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenVocabTrainer && onOpenVocabTrainer(day)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#3D405B] border border-[#E5E0D8] hover:bg-[#F5F0EB] shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E9C46A]" />
                  <span>Vocab Trainer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOM ADMIN-INJECTED TASKS (If Any) */}
        {customTasks.map((ct) => (
          <div
            key={ct.id}
            className={`p-4 rounded-xl border transition-colors ${
              ct.isCompleted
                ? 'bg-[#F9FBF9] border-[#2A9D8F]/25 text-[#1E1B18]'
                : 'bg-[#FFFBEB] border-[#E9C46A]/40 text-[#1E1B18]'
            }`}
          >
            <div className="flex items-start justify-between gap-3.5">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onToggleTask(ct.id)}
                  className="mt-0.5 text-[#8C827A] hover:text-[#2A9D8F] transition-colors shrink-0 focus:outline-none"
                >
                  {ct.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2A9D8F] fill-[#2A9D8F]/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#C4BCB3]" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B48421]">
                    Custom Tutor Task
                  </span>
                  <h4 className="text-sm font-semibold text-[#1E1B18] mt-0.5">{ct.title}</h4>
                  {ct.description && (
                    <p className="text-xs text-[#6B645C] mt-1">{ct.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer Quick Controls */}
      <div className="px-5 sm:px-6 py-3 bg-[#FAF8F5]/70 rounded-b-2xl border-t border-[#E5E0D8]/60 flex items-center justify-between text-xs text-[#8C827A]">
        <span>
          {allTasksDone ? 'All items logged for Day ' + day.dayNumber : `${3 - completedTaskCount} tasks remaining`}
        </span>
        <button
          type="button"
          onClick={() => onMarkAllDayTasks(day.dayNumber, !allTasksDone)}
          className="font-medium text-[#3D405B] hover:text-[#E07A5F] underline underline-offset-2 transition-colors"
        >
          {allTasksDone ? 'Mark Day Incomplete' : 'Mark All Day Tasks Complete'}
        </button>
      </div>
    </div>
  );
};
