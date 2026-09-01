import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Calculator,
  ArrowRight,
  BookOpen,
  Zap,
  Filter,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DesmosSatHack } from '../types';
import { KaTeXRenderer } from './KaTeXRenderer';

interface Props {
  hacks: DesmosSatHack[];
  onInsertFormula: (latex: string) => void;
  onClose?: () => void;
}

export const DesmosHacksDrawer: React.FC<Props> = ({
  hacks,
  onInsertFormula,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [insertedId, setInsertedId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    hacks.forEach((h) => set.add(h.category));
    return ['ALL', ...Array.from(set)];
  }, [hacks]);

  const filteredHacks迷 = useMemo(() => {
    return hacks.filter((hack) => {
      const matchesCat = selectedCategory === 'ALL' || hack.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        hack.title.toLowerCase().includes(q) ||
        hack.description.toLowerCase().includes(q) ||
        hack.latexFormula.toLowerCase().includes(q) ||
        (hack.exampleProblem && hack.exampleProblem.toLowerCase().includes(q)) ||
        (hack.shortcutTip && hack.shortcutTip.toLowerCase().includes(q));

      return matchesCat && matchesQuery;
    });
  }, [hacks, selectedCategory, searchQuery]);

  const handleCopy = (latex: string, id: string) => {
    navigator.clipboard.writeText(latex);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleInsert = (latex: string, id: string) => {
    onInsertFormula(latex);
    setInsertedId(id);
    setTimeout(() => setInsertedId(null), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] dark:bg-[#0A0F1D] text-[#1E1B18] dark:text-[#EAEBED] font-sans">
      {/* Search & Category Filter Header */}
      <div className="p-3.5 sm:p-4 border-b border-[#E5E0D8] dark:border-[#1E293B] bg-white/70 dark:bg-[#121A2F]/70 backdrop-blur-xs space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#0B1B3D] to-[#2563EB] dark:from-[#D4AF37] dark:to-[#E07A5F] flex items-center justify-center text-white dark:text-[#0B1B3D] shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0B1B3D] dark:text-white tracking-tight">
                SAT Desmos Hacks & Speedrun Hub
              </h3>
              <p className="text-[10px] text-[#78716C] dark:text-[#94A3B8]">
                Instant shortcuts & 1-click formulas for the 1550+ Math threshold
              </p>
            </div>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0B1B3D]/10 dark:bg-white/10 text-[#0B1B3D] dark:text-[#D4AF37] border border-[#0B1B3D]/15 dark:border-white/15">
            {filteredHacks迷.length} {filteredHacks迷.length === 1 ? 'Hack' : 'Hacks'}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search shortcuts (e.g. vertex, intersection, regression, circle)..."
            className="w-full pl-8.5 pr-3 py-1.5 rounded-xl text-xs bg-[#F5F0EB] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0B1B3D] dark:focus:ring-[#D4AF37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#0B1B3D] text-white dark:bg-gradient-to-r dark:from-[#D4AF37] dark:to-[#E07A5F] dark:text-[#0B1B3D] shadow-xs'
                  : 'bg-white dark:bg-[#1E293B] border border-[#E5E0D8] dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Hacks Cards List */}
      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5">
        {filteredHacks迷.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              No matching SAT Desmos hacks found
            </p>
            <p className="text-[11px] text-slate-400">
              Try searching with another keyword or select "ALL" categories.
            </p>
          </div>
        ) : (
          filteredHacks迷.map((hack, index) => {
            const isCopied = copiedId === hack.id;
            const isInserted = insertedId === hack.id;

            return (
              <div
                key={hack.id || index}
                className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-2xs hover:shadow-md transition-all space-y-3 group"
              >
                {/* Card Title & Category */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#0B1B3D]/10 dark:bg-amber-500/10 text-[#0B1B3D] dark:text-amber-300 border border-[#0B1B3D]/20 dark:border-amber-500/30 uppercase">
                        {hack.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        Hack #{index + 1}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0B1B3D] dark:text-white leading-snug">
                      {hack.title}
                    </h4>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-[11px] sm:text-xs text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
                  {hack.description}
                </p>

                {/* LaTeX Formula Display Box */}
                <div className="p-2.5 rounded-xl bg-[#F5F0EB] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] relative font-mono text-xs overflow-x-auto">
                  <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                    <span>Formula Syntax:</span>
                  </div>
                  <div className="text-[#0B1B3D] dark:text-[#D4AF37] font-bold">
                    {hack.latexFormula.includes('\n') ? (
                      <div className="space-y-1">
                        {hack.latexFormula.split('\n').map((line, lIdx) => (
                          <div key={lIdx} className="bg-white/60 dark:bg-[#121A2F] px-2 py-1 rounded border border-black/5 dark:border-white/5">
                            <code>{line}</code>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <code className="bg-white/60 dark:bg-[#121A2F] px-2 py-1 rounded border border-black/5 dark:border-white/5 inline-block">
                        {hack.latexFormula}
                      </code>
                    )}
                  </div>
                </div>

                {/* Example SAT Problem & Shortcut Tip */}
                {hack.exampleProblem && (
                  <div className="p-2.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[11px] text-[#0B1B3D] dark:text-amber-200/90 space-y-1">
                    <div className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400 text-[10px] uppercase font-mono">
                      <Lightbulb className="w-3 h-3" />
                      <span>SAT Example & Shortcut:</span>
                    </div>
                    <p className="italic text-slate-700 dark:text-slate-300">
                      "{hack.exampleProblem}"
                    </p>
                    {hack.shortcutTip && (
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 pt-1 border-t border-amber-500/15 font-mono">
                        💡 {hack.shortcutTip}
                      </p>
                    )}
                  </div>
                )}

                {/* Actions: Insert to Desmos & Copy */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E5E0D8] dark:border-[#1E293B]">
                  <button
                    onClick={() => handleCopy(hack.latexFormula, hack.id)}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-mono font-bold bg-[#F5F0EB] dark:bg-[#1E293B] hover:bg-[#ECE5DD] dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy LaTeX Formula"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy LaTeX</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleInsert(hack.latexFormula, hack.id)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                      isInserted
                        ? 'bg-emerald-600 text-white scale-102'
                        : 'bg-[#0B1B3D] hover:bg-[#162A5A] text-white dark:bg-gradient-to-r dark:from-[#D4AF37] dark:to-[#E07A5F] dark:text-[#0B1B3D]'
                    }`}
                    title="Directly insert this formula into the active Desmos Graphing Calculator"
                  >
                    {isInserted ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Inserted!</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-3 h-3" />
                        <span>Insert to Calculator</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Banner */}
      <div className="p-2.5 px-4 bg-white dark:bg-[#121A2F] border-t border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Official Bluebook SAT Math Standard</span>
        </span>
        <span className="text-[#0B1B3D] dark:text-[#D4AF37] font-bold">
          ASRON SAT Intelligence
        </span>
      </div>
    </div>
  );
};
