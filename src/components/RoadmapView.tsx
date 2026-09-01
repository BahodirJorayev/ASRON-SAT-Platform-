import React, { useState, useEffect } from 'react';
import {
  User,
  MasterCurriculumDay,
  Question,
  UserRoadmap,
  UserQuestionPractice,
  MistakeVaultItem
} from '../types';
import { RoadmapTrackerView } from './RoadmapTrackerView';
import { RoadmapBuilderView } from './RoadmapBuilderView';
import { getUserRoadmap, saveUserRoadmap } from '../data/masterCurriculumData';

interface Props {
  user: User;
  onOpenPaywall?: () => void;
  onOpenDailyWorkout?: () => void;
  onOpenQuestionBank?: (category?: string) => void;
  onOpenVocabTrainer?: (day?: MasterCurriculumDay) => void;
  onOpenMockTests?: (mockTestId?: string) => void;
  onOpenSocraticTutor?: (question?: Question) => void;
  onOpenMistakeVault?: () => void;
}

export const RoadmapView: React.FC<Props> = ({
  user,
  onOpenPaywall,
  onOpenDailyWorkout,
  onOpenQuestionBank,
  onOpenVocabTrainer,
  onOpenMockTests,
  onOpenSocraticTutor,
  onOpenMistakeVault,
}) => {
  const [currentRoadmap, setCurrentRoadmap] = useState<UserRoadmap>(() => getUserRoadmap(user));
  const [activeViewMode, setActiveViewMode] = useState<'TRACKER' | 'BUILDER'>('TRACKER');

  useEffect(() => {
    setCurrentRoadmap(getUserRoadmap(user));
  }, [user.id]);

  const handleRoadmapUpdated = (updated: UserRoadmap) => {
    setCurrentRoadmap(updated);
    saveUserRoadmap(updated);
  };

  return (
    <div className="w-full">
      {activeViewMode === 'BUILDER' ? (
        <RoadmapBuilderView
          user={user}
          currentRoadmap={currentRoadmap}
          onRoadmapUpdated={handleRoadmapUpdated}
          onCloseBuilder={() => setActiveViewMode('TRACKER')}
          onOpenPaywall={onOpenPaywall}
          onOpenSocraticTutor={onOpenSocraticTutor}
          onOpenMistakeVault={onOpenMistakeVault}
          onOpenMockTests={onOpenMockTests}
        />
      ) : (
        <RoadmapTrackerView
          user={user}
          onOpenPlanBuilder={() => setActiveViewMode('BUILDER')}
          onOpenPaywall={onOpenPaywall}
          onOpenDailyWorkout={onOpenDailyWorkout}
          onOpenQuestionBank={onOpenQuestionBank}
          onOpenVocabTrainer={onOpenVocabTrainer}
          onOpenMockTests={onOpenMockTests}
          onOpenSocraticTutor={onOpenSocraticTutor}
          onOpenMistakeVault={onOpenMistakeVault}
        />
      )}
    </div>
  );
};
