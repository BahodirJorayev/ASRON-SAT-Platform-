import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Edit3, Check, Clock, ArrowUpRight } from 'lucide-react';

interface Props {
  targetDate?: string;
  onUpdateTargetDate?: (newDate: string) => void;
  onOpenDiagnostic?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

const UPCOMING_SAT_DATES = [
  { label: 'October 2026 Digital SAT', date: '2026-10-04T08:00:00' },
  { label: 'November 2026 Digital SAT', date: '2026-11-07T08:00:00' },
  { label: 'December 2026 Digital SAT', date: '2026-12-05T08:00:00' },
  { label: 'March 2027 Digital SAT', date: '2027-03-13T08:00:00' },
  { label: 'May 2027 Digital SAT', date: '2027-05-08T08:00:00' },
];

export const ExamCountdown: React.FC<Props> = ({
  targetDate = '2026-10-04T08:00:00',
  onUpdateTargetDate,
  onOpenDiagnostic,
}) => {
  const [currentTargetDate, setCurrentTargetDate] = useState<string>(targetDate);
  const [isChangingDate, setIsChangingDate] = useState(false);

  const calculateTimeLeft = (target: string): TimeLeft => {
    const targetTime = new Date(target).getTime();
    const now = new Date().getTime();
    const difference = targetTime - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
    const totalSeconds = Math.floor(difference / 1000);

    return { days, hours, minutes, seconds, totalSeconds };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(currentTargetDate));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(currentTargetDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentTargetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTargetDate]);

  const handleSelectDate = (dateStr: string) => {
    setCurrentTargetDate(dateStr);
    setIsChangingDate(false);
    if (onUpdateTargetDate) {
      onUpdateTargetDate(dateStr);
    }
  };

  const formattedTargetDate = new Date(currentTargetDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Calculation for progress percentage assuming typical 90-day prep window
  const prepWindowDays = 90;
  const daysRemaining = Math.max(0, timeLeft.days);
  const prepProgressPercent = Math.min(100, Math.max(8, Math.round(((prepWindowDays - daysRemaining) / prepWindowDays) * 100)));

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] p-5 sm:p-6 text-[#1E1B18] dark:text-[#F8FAFC]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Metadata & Target info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#64748B] dark:text-[#94A3B8]">
              Target Administration
            </span>

            <button
              onClick={() => setIsChangingDate(!isChangingDate)}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-white px-2 py-0.5 rounded-md hover:bg-[#F5F0EB] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            >
              <Edit3 size={12} />
              <span>Change Date</span>
            </button>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1E1B18] dark:text-[#F8FAFC]">
              {formattedTargetDate}
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5 mt-0.5">
              <span>Digital SAT Window</span>
              <span className="text-[#E5E0D8] dark:text-[#1E293B]">•</span>
              <span className="font-mono text-[#E07A5F] dark:text-[#E76F51] font-semibold">
                {timeLeft.days} days remaining
              </span>
            </p>
          </div>

          {/* Prep timeline mini bar */}
          <div className="pt-1 max-w-xs space-y-1">
            <div className="flex justify-between text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              <span>Prep Runway Pace</span>
              <span className="text-[#1E1B18] dark:text-[#F8FAFC] font-semibold">{prepProgressPercent}%</span>
            </div>
            <div className="w-full h-1 bg-[#F5F0EB] dark:bg-[#0A0F1D] rounded-full overflow-hidden border border-[#E5E0D8]/60 dark:border-[#1E293B]">
              <div
                className="h-full bg-[#1E1B18] dark:bg-[#E07A5F] rounded-full transition-all duration-500"
                style={{ width: `${prepProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Live Monospace Digital Readout Box */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#FAF8F5] dark:bg-[#0A0F1D] p-3 sm:p-4 rounded-xl border border-[#E5E0D8] dark:border-[#1E293B] self-start lg:self-center">
          <div className="text-center px-2">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#1E1B18] dark:text-[#F8FAFC] tracking-tight">
              {pad(timeLeft.days)}
            </div>
            <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              DAYS
            </div>
          </div>

          <div className="text-sm font-mono font-bold text-[#E5E0D8] dark:text-[#1E293B]">:</div>

          <div className="text-center px-2">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#1E1B18] dark:text-[#F8FAFC] tracking-tight">
              {pad(timeLeft.hours)}
            </div>
            <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              HRS
            </div>
          </div>

          <div className="text-sm font-mono font-bold text-[#E5E0D8] dark:text-[#1E293B]">:</div>

          <div className="text-center px-2">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#1E1B18] dark:text-[#F8FAFC] tracking-tight">
              {pad(timeLeft.minutes)}
            </div>
            <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              MIN
            </div>
          </div>

          <div className="text-sm font-mono font-bold text-[#E5E0D8] dark:text-[#1E293B]">:</div>

          <div className="text-center px-2">
            <div className="text-xl sm:text-2xl font-mono font-bold text-[#E07A5F] dark:text-[#E76F51] tracking-tight">
              {pad(timeLeft.seconds)}
            </div>
            <div className="text-[9px] font-mono font-semibold uppercase tracking-wider text-[#E07A5F] dark:text-[#E76F51]">
              SEC
            </div>
          </div>
        </div>
      </div>

      {/* Date Switcher Drawer / Popover */}
      <AnimatePresence>
        {isChangingDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-[#E5E0D8] dark:border-[#1E293B] space-y-2.5"
          >
            <div className="text-xs font-semibold text-[#1E1B18] dark:text-[#F8FAFC] flex items-center justify-between">
              <span>Select Official Administration:</span>
              <button
                onClick={() => setIsChangingDate(false)}
                className="text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E1B18] dark:hover:text-white text-xs font-mono"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {UPCOMING_SAT_DATES.map((item) => {
                const isSelected = currentTargetDate.startsWith(item.date.slice(0, 10));
                return (
                  <button
                    key={item.date}
                    onClick={() => handleSelectDate(item.date)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1E1B18] text-white dark:bg-[#E07A5F] font-semibold'
                        : 'bg-[#FAF8F5] dark:bg-[#0A0F1D] hover:bg-[#F5F0EB] dark:hover:bg-[#1E293B] text-[#1E1B18] dark:text-[#F8FAFC] border border-[#E5E0D8] dark:border-[#1E293B]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected ? (
                      <Check size={14} />
                    ) : (
                      <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-mono">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

