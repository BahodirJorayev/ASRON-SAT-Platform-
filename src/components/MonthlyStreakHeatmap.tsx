import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, CheckCircle2, Calendar, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface MonthlyStreakHeatmapProps {
  user: User;
  onDayClick?: (dateStr: string, isCompleted: boolean) => void;
  className?: string;
}

export const MonthlyStreakHeatmap: React.FC<MonthlyStreakHeatmapProps> = ({
  user,
  onDayClick,
  className = '',
}) => {
  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    dayNumber: number;
    completed: boolean;
    score?: string;
    xp?: number;
  } | null>(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed (August = 7)
  const currentDay = today.getDate();

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  const monthName = monthNames[currentMonth];

  // Number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = (firstDayWeekday + 6) % 7;

  // Generate simulated history for the month based on user's streakDays
  // e.g. If user has streakDays = 14, the last 14 days up to today are completed
  const daysData = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const isPastOrToday = dayNum <= currentDay;
    const isToday = dayNum === currentDay;
    
    // Simulate realistic completed pattern based on user.streakDays
    const streakStartDay = Math.max(1, currentDay - user.streakDays + 1);
    const inCurrentStreak = isPastOrToday && dayNum >= streakStartDay;
    
    // Prior days in month may have sporadic completions
    const isSporadicComplete = isPastOrToday && (dayNum % 3 !== 0 || dayNum % 5 === 0);
    const isCompleted = inCurrentStreak || (isPastOrToday && isSporadicComplete);

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const score = isCompleted ? (dayNum % 4 === 0 ? '5/5 (100%)' : '4/5 (80%)') : undefined;
    const xp = isCompleted ? 25 : 0;

    return {
      dayNum,
      isToday,
      isPastOrToday,
      isCompleted,
      dateStr,
      score,
      xp,
    };
  });

  const totalCompletedThisMonth = daysData.filter(d => d.isCompleted).length;
  const monthlyCompletionRate = Math.round((totalCompletedThisMonth / Math.max(1, currentDay)) * 100);

  const dayLabels = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  return (
    <div className={`rounded-2xl bg-white border border-[#EBE5DF] p-4 sm:p-5 shadow-xs text-[#1E1B18] ${className}`}>
      {/* Header with Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#F2ECE4]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center border border-[#E07A5F]/20 font-bold shrink-0">
            <Flame size={18} className="fill-[#E07A5F]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#1E1B18] flex items-center gap-1.5">
              <span>{monthName} {currentYear} Davomat Matritsasi</span>
            </h3>
            <p className="text-[11px] text-[#78716C] font-mono">
              Oylik faollik: <strong className="text-[#1E1B18]">{totalCompletedThisMonth} kun</strong> ({monthlyCompletionRate}%)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <div className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EBE5DF] flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[#2A9D8F]" />
            <span className="text-[#57534E]">Muzlatish:</span>
            <strong className="text-[#1E1B18]">{user.streakFreezes || 2}x</strong>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-[#E07A5F]/10 text-[#E07A5F] border border-[#E07A5F]/30 font-bold flex items-center gap-1">
            <Flame size={13} className="fill-[#E07A5F]" />
            <span>{user.streakDays}-Kunlik Ketma-ketlik</span>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1.5 text-center mb-1.5">
        {dayLabels.map((lbl, idx) => (
          <div key={idx} className="text-[10px] font-mono font-semibold text-[#A8A29E] uppercase">
            {lbl}
          </div>
        ))}
      </div>

      {/* Calendar Grid (LeetCode / GitHub Consistency Style) */}
      <div className="grid grid-cols-7 gap-1.5 relative">
        {/* Empty slots for starting offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-9 sm:h-10 rounded-xl bg-transparent opacity-0" />
        ))}

        {/* Days of current month */}
        {daysData.map((d) => {
          const isSelected = hoveredDay?.dayNumber === d.dayNum;
          
          let cellStyle = 'bg-[#FAF8F5] text-[#A8A29E] border-[#EBE5DF]';
          if (d.isCompleted) {
            cellStyle = 'bg-[#2A9D8F] text-white border-[#248277] shadow-2xs font-bold';
          } else if (d.isToday) {
            cellStyle = 'bg-[#E07A5F]/15 text-[#E07A5F] border-[#E07A5F] font-extrabold ring-2 ring-[#E07A5F]/30';
          } else if (d.isPastOrToday) {
            cellStyle = 'bg-[#F2ECE4] text-[#78716C] border-[#E5DFD7]';
          }

          return (
            <motion.div
              key={d.dayNum}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() =>
                setHoveredDay({
                  dateStr: d.dateStr,
                  dayNumber: d.dayNum,
                  completed: d.isCompleted,
                  score: d.score,
                  xp: d.xp,
                })
              }
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => onDayClick?.(d.dateStr, d.isCompleted)}
              className={`h-9 sm:h-10 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-all relative ${cellStyle}`}
            >
              <span className="text-[11px] leading-none">{d.dayNum}</span>
              {d.isCompleted && (
                <span className="w-1 h-1 rounded-full bg-white/90 mt-0.5" />
              )}
              {d.isToday && !d.isCompleted && (
                <span className="w-1 h-1 rounded-full bg-[#E07A5F] mt-0.5 animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tooltip details bar */}
      <div className="mt-3 pt-2.5 border-t border-[#F2ECE4] flex items-center justify-between text-[11px] text-[#78716C]">
        {hoveredDay ? (
          <div className="flex items-center gap-2 font-mono">
            <span className="font-semibold text-[#1E1B18]">{hoveredDay.dateStr}:</span>
            {hoveredDay.completed ? (
              <span className="text-[#2A9D8F] flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> Bajarilgan ({hoveredDay.score} • +{hoveredDay.xp} XP)
              </span>
            ) : hoveredDay.dayNumber === currentDay ? (
              <span className="text-[#E07A5F] font-bold">🔥 Bugungi mashg'ulot kutilmoqda</span>
            ) : (
              <span className="text-[#A8A29E]">Mashg'ulot o'tkazilmagan</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#78716C]">
            <Calendar size={12} />
            <span>Kunlar ustiga surib batafsil ko'ring</span>
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-2 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2A9D8F]" />
            <span>Bajarilgan</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#FAF8F5] border border-[#EBE5DF]" />
            <span>Bo'sh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
