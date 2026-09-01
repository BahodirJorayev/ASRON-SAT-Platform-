import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Bell,
  CheckCircle2,
  Flame,
  Zap,
  Sparkles,
  ShieldCheck,
  Clock,
  ExternalLink
} from 'lucide-react';
import { TelegramNotification, User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  notifications: TelegramNotification[];
  onTriggerSimulatedNotification: (type: 'DAILY_WORKOUT_READY' | 'STREAK_DANGER' | 'RECEIPT_APPROVED') => void;
}

export const TelegramNotificationSimulator: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  notifications,
  onTriggerSimulatedNotification,
}) => {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 font-sans overflow-y-auto overscroll-contain"
    >
      <div className="bg-[#111111] border border-[#1F2937] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col text-[#F3F4F6] max-h-[90vh] sm:max-h-[85vh] my-auto">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A0A0A] border-b border-[#1F2937] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs text-white">@AuraSatPrepBot (Telegram Engine)</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-[#9CA3AF]">
                Connected to <strong className="text-blue-400">{user.telegramId}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-colors cursor-pointer border border-[#374151]"
            title="Yopish (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-[#0A0A0A]">
          <div className="text-center text-[10px] text-[#6B7280] py-1 font-mono uppercase tracking-wider">
            Official Bi-Directional Retention Stream
          </div>

          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3.5 rounded-xl bg-[#111111] border border-[#1F2937] space-y-1.5 shadow-xs"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  {notif.type === 'STREAK_DANGER' ? (
                    <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  ) : notif.type === 'RECEIPT_APPROVED' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                  )}
                  {notif.type.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-[#6B7280] font-mono">
                  {new Date(notif.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[#D1D5DB] leading-relaxed font-sans">{notif.message}</p>
            </div>
          ))}
        </div>

        {/* Trigger Test Bot Pushes */}
        <div className="p-4 bg-[#0A0A0A] border-t border-[#1F2937] space-y-2">
          <div className="text-[10px] uppercase font-mono text-[#9CA3AF] tracking-wider font-bold">
            Simulate Automated Background Cron Events:
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onTriggerSimulatedNotification('DAILY_WORKOUT_READY')}
              className="px-2.5 py-2 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F2937] text-[11px] text-blue-400 font-bold transition-colors text-center cursor-pointer"
            >
              09:00 Daily Workout
            </button>
            <button
              onClick={() => onTriggerSimulatedNotification('STREAK_DANGER')}
              className="px-2.5 py-2 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F2937] text-[11px] text-rose-400 font-bold transition-colors text-center cursor-pointer"
            >
              20:00 Streak Danger
            </button>
            <button
              onClick={() => onTriggerSimulatedNotification('RECEIPT_APPROVED')}
              className="px-2.5 py-2 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#1F2937] text-[11px] text-emerald-400 font-bold transition-colors text-center cursor-pointer"
            >
              Receipt Approved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
