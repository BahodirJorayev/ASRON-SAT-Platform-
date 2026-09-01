import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Question, User } from '../types';
import { DailyWorkoutView } from './DailyWorkoutView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onWorkoutComplete: (score: number, missedQuestions: Question[], userAnswers: Record<string, string>) => void;
  onOpenSocraticTutor?: (question: Question) => void;
  onOpenMistakeVault?: () => void;
  onOpenPaywall?: () => void;
}

export const DailyWorkoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  onWorkoutComplete,
  onOpenSocraticTutor,
  onOpenMistakeVault = () => {},
  onOpenPaywall,
}) => {
  // Escape key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto overscroll-contain font-sans animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF8F5] border border-[#EBE5DF] rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col text-[#1E1B18] max-h-[94vh] sm:max-h-[90vh] my-auto relative">
        {/* Fixed Top Bar with Close Button */}
        <div className="px-5 py-3.5 bg-white border-b border-[#EBE5DF] flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#78716C]">
              Digital SAT OnePrep Engine
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5] border border-[#EBE5DF] transition-colors cursor-pointer"
            title="Yopish (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Daily Workout View Container */}
        <div className="overflow-y-auto flex-1">
          <DailyWorkoutView
            user={user}
            onWorkoutComplete={onWorkoutComplete}
            onReturnToDashboard={onClose}
            onOpenMistakeVault={() => {
              onClose();
              onOpenMistakeVault();
            }}
            onOpenPaywall={onOpenPaywall}
            onOpenSocraticTutor={onOpenSocraticTutor}
          />
        </div>
      </div>
    </div>
  );
};
