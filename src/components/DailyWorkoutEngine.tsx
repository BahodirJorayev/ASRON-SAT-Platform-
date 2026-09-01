import React, { useState } from 'react';
import { User, Question, WorkoutMode, WorkoutSessionSummary } from '../types';
import { WorkoutLobby } from './WorkoutLobby';
import { WorkoutActiveSession } from './WorkoutActiveSession';
import { WorkoutSummaryView } from './WorkoutSummaryView';
import { INITIAL_QUESTIONS } from '../data/mockDatabase';

export type WorkoutFlowState = 'LOBBY' | 'TESTING' | 'SUMMARY';

export interface DailyWorkoutEngineProps {
  user: User;
  onWorkoutComplete?: (score: number, missedQuestions: Question[], userAnswers: Record<string, string>) => void;
  onReturnToDashboard?: () => void;
  onOpenMistakeVault?: () => void;
  onOpenPaywall?: () => void;
  onOpenSocraticTutor?: (question: Question, userWrongAnswer?: string) => void;
  onOpenDiagnostic?: () => void;
}

export const DailyWorkoutEngine: React.FC<DailyWorkoutEngineProps> = ({
  user,
  onWorkoutComplete,
  onReturnToDashboard = () => {},
  onOpenMistakeVault = () => {},
  onOpenPaywall,
  onOpenSocraticTutor,
  onOpenDiagnostic,
}) => {
  const [state, setState] = useState<WorkoutFlowState>('LOBBY');
  const [selectedMode, setSelectedMode] = useState<WorkoutMode>('ADAPTIVE_WEAKNESS');
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [sessionMeta, setSessionMeta] = useState<any>({
    modeTitle: 'Daily SAT Focus',
    timeLimitSeconds: 600,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<WorkoutSessionSummary | null>(null);

  // Launch Workout and fetch 5 targeted items from `/api/workout/generate`
  const handleLaunchWorkout = async (mode: WorkoutMode, planDay?: number) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/workout/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          weakestSkills: user.weakestSubSkills || ['Transitions', 'Nonlinear Equations', 'Boundaries'],
          targetDomain: 'Adaptive Domain Focus',
          planDay: planDay || 1,
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setSessionQuestions(data.questions);
        setSessionMeta(data.workoutMeta || {
          modeTitle: mode === 'SPEED_BLITZ' ? 'Speed Blitz Sprint' : 'Daily SAT Focus',
          timeLimitSeconds: mode === 'SPEED_BLITZ' ? 225 : 600,
        });
      } else {
        // Fallback to initial mock database questions
        setSessionQuestions(INITIAL_QUESTIONS.slice(0, 5));
        setSessionMeta({
          modeTitle: 'Daily SAT Focus',
          timeLimitSeconds: 600,
        });
      }
      setState('TESTING');
    } catch (err) {
      console.warn('Fallback to local questions:', err);
      setSessionQuestions(INITIAL_QUESTIONS.slice(0, 5));
      setSessionMeta({
        modeTitle: 'Daily SAT Focus',
        timeLimitSeconds: 600,
      });
      setState('TESTING');
    } finally {
      setIsLoading(false);
    }
  };

  // Complete session and compute accuracy, XP, score gain, and missed questions
  const handleFinishSession = (
    answers: Record<string, string>,
    timeSpentSeconds: number,
    questionTimes: Record<string, number>
  ) => {
    let score = 0;
    const missed: Question[] = [];

    sessionQuestions.forEach((q) => {
      const userAns = (answers[q.id] || '').trim().toUpperCase();
      const correctAns = (q.correctAnswer || '').trim().toUpperCase();

      if (userAns === correctAns) {
        score += 1;
      } else {
        missed.push(q);
      }
    });

    const total = sessionQuestions.length || 5;
    const accuracy = Math.round((score / total) * 100);
    const speedBonus = timeSpentSeconds <= 420 && accuracy >= 80 ? 10 : 0;
    const baseXP = 25;
    const totalXP = baseXP + speedBonus;
    const estGain = score >= 4 ? 10 : 5;
    const newStreak = (user.streakDays || 0) + 1;

    const summaryData: WorkoutSessionSummary = {
      mode: selectedMode,
      modeTitle: sessionMeta.title || 'Daily SAT Workout',
      score,
      totalQuestions: total,
      accuracyPercentage: accuracy,
      timeSpentSeconds,
      timeLimitSeconds: sessionMeta.timeLimitSeconds || 600,
      xpEarned: totalXP,
      speedBonusXP: speedBonus,
      streakDays: newStreak,
      estimatedScoreGain: estGain,
      missedQuestions: missed,
      userAnswers: answers,
      questionTimes,
    };

    setSessionSummary(summaryData);
    setState('SUMMARY');

    // Notify parent App
    if (onWorkoutComplete) {
      onWorkoutComplete(score, missed, answers);
    }
  };

  return (
    <div className="w-full min-h-[85vh] py-6 px-4 sm:px-6 lg:px-8 flex flex-col justify-start bg-[#FAF8F5]">
      {state === 'LOBBY' && (
        <WorkoutLobby
          user={user}
          selectedMode={selectedMode}
          onSelectMode={setSelectedMode}
          onLaunchWorkout={handleLaunchWorkout}
          isLoading={isLoading}
        />
      )}

      {state === 'TESTING' && (
        <WorkoutActiveSession
          user={user}
          questions={sessionQuestions}
          mode={selectedMode}
          modeTitle={sessionMeta.title || 'Daily SAT Focus'}
          timeLimitSeconds={sessionMeta.timeLimitSeconds || 600}
          onFinishSession={handleFinishSession}
          onQuitSession={() => setState('LOBBY')}
        />
      )}

      {state === 'SUMMARY' && sessionSummary && (
        <WorkoutSummaryView
          summary={sessionSummary}
          user={user}
          onReturnToDashboard={onReturnToDashboard}
          onOpenMistakeVault={onOpenMistakeVault}
          onStartAnotherWorkout={() => {
            setSessionSummary(null);
            setState('LOBBY');
          }}
          onOpenSocraticTutor={onOpenSocraticTutor}
        />
      )}
    </div>
  );
};
