import React from 'react';
import { User, Question } from '../types';
import { DailyWorkoutEngine } from './DailyWorkoutEngine';

export interface DailyWorkoutViewProps {
  user: User;
  onWorkoutComplete?: (score: number, missedQuestions: Question[], userAnswers: Record<string, string>) => void;
  onReturnToDashboard?: () => void;
  onOpenMistakeVault?: () => void;
  onOpenPaywall?: () => void;
  onOpenSocraticTutor?: (question: Question, userWrongAnswer?: string) => void;
  onOpenDiagnostic?: () => void;
}

export const DailyWorkoutView: React.FC<DailyWorkoutViewProps> = ({
  user,
  onWorkoutComplete,
  onReturnToDashboard = () => {},
  onOpenMistakeVault = () => {},
  onOpenPaywall,
  onOpenSocraticTutor,
  onOpenDiagnostic,
}) => {
  return (
    <DailyWorkoutEngine
      user={user}
      onWorkoutComplete={onWorkoutComplete}
      onReturnToDashboard={onReturnToDashboard}
      onOpenMistakeVault={onOpenMistakeVault}
      onOpenPaywall={onOpenPaywall}
      onOpenSocraticTutor={onOpenSocraticTutor}
      onOpenDiagnostic={onOpenDiagnostic}
    />
  );
};
