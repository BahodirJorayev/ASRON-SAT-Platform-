import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  X,
  BookOpen,
  Sparkles,
  ExternalLink,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { FormulaReferenceSheet } from './FormulaReferenceSheet';
import { DesmosLogoIcon } from './DesmosLogoIcon';

interface Props {
  initialOpen?: boolean;
}

export const FloatingDesmos: React.FC<Props> = ({ initialOpen = false }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'HACKS'>('CALCULATOR');
  const [showFormulaSheet, setShowFormulaSheet] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Position state for draggable floating button
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDragEnd = (_event: any, info: any) => {
    // Snap to nearest edge
    const currentX = position.x + info.offset.x;
    const snapTo = currentX > 0 ? Math.min(10, currentX) : Math.max(-10, currentX);
    setPosition({ x: snapTo, y: position.y + info.offset.y });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(label);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  return (
    <>
      {/* 1. PERSISTENT FLOATING CIRCULAR DRAGGABLE DESMOS BUTTON */}
      {!isOpen && (
        <motion.div
          drag
          dragMomentum={false}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          animate={{ x: position.x, y: position.y }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-6 z-50 select-none touch-none"
        >
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-[#1E1B18] hover:bg-[#2A2622] text-white border-2 border-[#0A7233] shadow-2xl shadow-black/35 transition-all cursor-grab active:cursor-grabbing ring-4 ring-[#0A7233]/20"
            title="Ushlab suring yoki bosing: Rasmiy Desmos Graphing Calculator"
          >
            {/* Pulsing indicator ring */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A7233] opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#0A7233]" />
            </span>

            {/* Official Green Desmos Logo */}
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
              <DesmosLogoIcon size={40} showText={false} />
            </div>

            <div className="text-left">
              <div className="text-xs font-black tracking-tight leading-none text-white flex items-center gap-1">
                <span>Desmos</span>
                <span className="text-[9px] font-mono px-1 rounded bg-[#0A7233] text-white font-bold">SAT</span>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 font-semibold leading-tight mt-0.5">
                Grapher & Suite
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* 2. EXPANDED FLOATING MODAL WITH OFFICIAL GRAPHING CALCULATOR */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-2 sm:p-4">
            {/* Backdrop overlay only if maximized */}
            {isMaximized && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMaximized(false)}
                className="absolute inset-0 bg-black/45 backdrop-blur-xs pointer-events-auto"
              />
            )}

            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className={`pointer-events-auto bg-[#FAF8F5] border-2 border-[#1E1B18]/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                isMaximized
                  ? 'w-full h-full max-w-6xl max-h-[92vh]'
                  : 'w-full max-w-xl h-[590px] fixed bottom-6 right-6'
              }`}
            >
              {/* Window Title Bar */}
              <div className="p-3 px-4.5 border-b border-[#E5E0D8] bg-[#1E1B18] text-white flex items-center justify-between select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                    <DesmosLogoIcon size={28} showText={false} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white flex items-center gap-2">
                      <span>Official Digital SAT Desmos Suite</span>
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                        College Board Mode
                      </span>
                    </h4>
                  </div>
                </div>

                {/* Window Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab(activeTab === 'CALCULATOR' ? 'HACKS' : 'CALCULATOR')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                      activeTab === 'HACKS' ? 'bg-[#0A7233] text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {activeTab === 'HACKS' ? 'Grapher' : 'SAT Hacks'}
                  </button>

                  <button
                    onClick={() => setShowFormulaSheet(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Formula Ma'lumotnomasi"
                  >
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>Formulas</span>
                  </button>

                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title={isMaximized ? 'Kichraytirish' : "Kattalashtirish"}
                  >
                    {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-white transition-colors cursor-pointer ml-1"
                    title="Desmosni Yopish"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Calculator Main Body */}
              <div className="flex-1 w-full h-full relative bg-white overflow-hidden">
                {activeTab === 'CALCULATOR' ? (
                  <iframe
                    src="https://www.desmos.com/calculator?embed"
                    title="Desmos Official Graphing Calculator"
                    className="w-full h-full border-0 bg-white"
                    allow="clipboard-read; clipboard-write"
                  />
                ) : (
                  <div className="p-5 overflow-y-auto h-full space-y-3.5 text-xs text-[#1E1B18] bg-[#FAF8F5]">
                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#0A7233] flex items-center gap-1.5 font-mono uppercase text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>1. Parabola Uchini Topish (Vertex)</span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard('y = a(x - h)^2 + k', 'vertex')}
                          className="text-[10px] font-mono text-[#0A7233] hover:underline font-bold"
                        >
                          {copiedFormula === 'vertex' ? 'Nusxa olindi!' : 'Nusxa olish'}
                        </button>
                      </div>
                      <p className="text-[#3D405B] text-xs leading-relaxed">
                        Desmosga <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#0A7233] font-mono font-bold">y = ax^2 + bx + c</code> yozing va to'g'ridan-to'g'ri egri chiziqning tepa yoki pastki nuqtasiga bosing. <code className="font-bold text-[#1E1B18]">(h, k)</code> koordinatasi ko'rinadi.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#3D405B] flex items-center gap-1.5 font-mono uppercase text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>2. Tenglamalar Tizimi Kesishuvi</span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard('y1 ~ m*x1 + b', 'reg')}
                          className="text-[10px] font-mono text-[#3D405B] hover:underline font-bold"
                        >
                          {copiedFormula === 'reg' ? 'Nusxa olindi!' : 'Nusxa olish'}
                        </button>
                      </div>
                      <p className="text-[#3D405B] text-xs leading-relaxed">
                        Har bir tenglamani alohida qatorda yozing: <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#3D405B] font-mono font-bold">y = 2x + 3</code> va <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#3D405B] font-mono font-bold">x^2 + y^2 = 25</code>. Desmos avtomatik ravishda kesishish nuqtalarini kulrang nuqta bilan ajratib ko'rsatadi.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-emerald-800 flex items-center gap-1.5 font-mono uppercase text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>3. Regressiya va Chiziqli Moslash (~ Tilda)</span>
                        </h4>
                        <button
                          onClick={() => copyToClipboard('y1 ~ a*x1^2 + b*x1 + c', 'quad')}
                          className="text-[10px] font-mono text-emerald-800 hover:underline font-bold"
                        >
                          {copiedFormula === 'quad' ? 'Nusxa olindi!' : 'Nusxa olish'}
                        </button>
                      </div>
                      <p className="text-[#3D405B] text-xs leading-relaxed">
                        Jadval qo'shing (<code className="font-mono font-bold">x1, y1</code>), so'ngra <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-emerald-800 font-mono font-bold">y1 ~ m*x1 + b</code> kiriting. Desmos bir zumda qiyalik <code className="font-bold">m</code> va kesishuv <code className="font-bold">b</code> ni aniqlab beradi.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white border border-[#E5E0D8] space-y-1.5 shadow-2xs">
                      <h4 className="font-bold text-[#E07A5F] flex items-center gap-1.5 font-mono uppercase text-[11px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>4. Tengsizliklar Sohalari</span>
                      </h4>
                      <p className="text-[#3D405B] text-xs leading-relaxed">
                        Tengsizliklarni yozing: <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#E07A5F] font-mono font-bold">y &gt;= 3x - 5</code> va <code className="bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E5E0D8] text-[#E07A5F] font-mono font-bold">y &lt; -x + 2</code>. Bo'yalgan umumiy maydon sizning to'g'ri yechimlar to'plamingizdir.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick SAT Desmos Tips Footer */}
              <div className="py-2.5 px-4 bg-white border-t border-[#E5E0D8] flex items-center justify-between text-[11px] font-mono text-[#3D405B]">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#0A7233] font-bold">DESMOS SAT:</span>
                  <span className="truncate">Digital SAT rasmiy o'rnatilgan grafik kalkulyatori.</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-[#0A7233] hover:underline shrink-0 ml-2 cursor-pointer"
                >
                  Yashirish ✕
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Formula Reference Sheet Modal */}
      <FormulaReferenceSheet
        isOpen={showFormulaSheet}
        onClose={() => setShowFormulaSheet(false)}
      />
    </>
  );
};
