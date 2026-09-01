import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, setTheme, resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-transparent ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Rejimni almashtirish"
      title={isDark ? "Yorug' rejimga o'tish (Day Mode)" : "Tungi rejimga o'tish (Night Mode)"}
      className={`p-2 rounded-xl text-neutral-600 dark:text-neutral-300 bg-[#FAF8F5] dark:bg-[#181B26] hover:bg-[#F0EBE4] dark:hover:bg-[#202534] transition-colors border border-[#E5E0D8] dark:border-[#262B3D] cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="text-amber-400 w-4 h-4 transition-transform hover:rotate-45 duration-300" />
      ) : (
        <Moon className="text-[#3D405B] w-4 h-4 transition-transform hover:-rotate-12 duration-300" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? 'Tungi Rejim' : 'Yorug‘ Rejim'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
