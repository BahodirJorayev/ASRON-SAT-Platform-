import React from 'react';
import { User } from '../types';
import { CommunityChatHub } from './CommunityChatHub';

interface Props {
  user: User;
  usersList?: User[];
  onOpenPaywall?: () => void;
  onSelectUserProfile?: (selectedUser: User) => void;
  onOpenQuestionInBank?: (questionId: string) => void;
}

/**
 * CommunityView is the top-level view wrapper for the Telegram Web K/Z style Community & Messaging module.
 * Designed with serious executive minimalism, zero AI-fluff, WebRTC Live Studio, and high-contrast typography.
 */
export const CommunityView: React.FC<Props> = ({
  user,
  usersList,
  onSelectUserProfile,
  onOpenQuestionInBank,
}) => {
  return (
    <CommunityChatHub
      currentUser={user}
      usersList={usersList}
      onOpenQuestionInBank={onOpenQuestionInBank}
      onSelectUserProfile={onSelectUserProfile}
    />
  );
};
