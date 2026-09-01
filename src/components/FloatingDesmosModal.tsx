import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Minimize2,
  X,
  RotateCcw,
  Sparkles,
  Calculator,
  Lightbulb,
  Move,
  Layers,
  Check,
  Zap,
  ExternalLink
} from 'lucide-react';
import { DesmosSatHack } from '../types';
import { DesmosHacksDrawer } from './DesmosHacksDrawer';
import { DesmosLogoIcon } from './DesmosLogoIcon';
import { INITIAL_SAT_DESMOS_HACKS } from '../data/desmosHacksData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hacks?: DesmosSatHack[];
  customIconUrl?: string;
  isDarkMode?: boolean;
}

declare global {
  interface Window {
    Desmos?: {
      GraphingCalculator: (
        element: HTMLElement,
        options?: Record<string, any>
      ) => any;
    };
  }
}

export const FloatingDesmosModal: React.FC<Props> = ({
  isOpen,
  onClose,
  hacks = INITIAL_SAT_DESMOS_HACKS,
  customIconUrl,
  isDarkMode: propDarkMode,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CALCULATOR' | 'HACKS'>('CALCULATOR');
  const [apiLoaded, setApiLoaded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const calcContainerRef = useRef<HTMLDivElement | null>(null);
  const desmosCalcInstance = useRef<any>(null);

  // Determine dark mode
  const isDark =
    propDarkMode ??
    (typeof document !== 'undefined' &&
      document.documentElement.classList.contains('dark'));

  // Load Official Desmos API script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.Desmos) {
      setApiLoaded(true);
      return;
    }

    const scriptId = 'desmos-api-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        setApiLoaded(true);
      };
      script.onerror = () => {
        console.warn('Official Desmos API script could not load, using embed fallback.');
      };
      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setApiLoaded(true));
    }
  }, []);

  // Initialize or update Desmos Graphing Calculator instance
  useEffect(() => {
    if (!isOpen || activeTab !== 'CALCULATOR' || !calcContainerRef.current) return;

    if (window.Desmos && !desmosCalcInstance.current) {
      try {
        const calc = window.Desmos.GraphingCalculator(calcContainerRef.current, {
          keypad: true,
          graphpaper: true,
          expressions: true,
          settingsMenu: true,
          border: false,
          invertedColors: isDark,
          projectorMode: false,
          degreeMode: false,
        });

        // Set initial sample expressions for SAT
        calc.setExpression({
          id: 'initial_parabola',
          latex: 'y = 2x^2 - 8x + 6',
          color: '#2563EB',
        });
        calc.setExpression({
          id: 'initial_line',
          latex: 'y = -x + 3',
          color: '#E07A5F',
        });

        desmosCalcInstance.current = calc;
      } catch (err) {
        console.error('Error instantiating Desmos Graphing Calculator:', err);
      }
    } else if (desmosCalcInstance.current) {
      try {
        desmosCalcInstance.current.updateSettings({
          invertedColors: isDark,
        });
        desmosCalcInstance.current.resize();
      } catch {}
    }
  }, [isOpen, activeTab, apiLoaded, isDark, isExpanded]);

  // Insert formula from Hacks library into active Desmos instance
  const handleInsertFormula = (latexFormula: string) => {
    setActiveTab('CALCULATOR');
    showToast('Formula inserted into Desmos!');

    // If script is initialized
    setTimeout(() => {
      if (desmosCalcInstance.current) {
        const lines = latexFormula.split('\n');
        lines.forEach((line, idx) => {
          if (line.trim()) {
            desmosCalcInstance.current.setExpression({
              id: `sat_hack_${Date.now()}_${idx}`,
              latex: line.trim(),
            });
          }
        });
      }
    }, 150);
  };

  // Reset calculator to blank state
  const handleResetCalculator = () => {
    if (desmosCalcInstance.current) {
      desmosCalcInstance.current.setBlank();
      showToast('Calculator expressions reset');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Keyboard shortcut listener for Esc
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
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-2 sm:p-4">
      {/* Dim backdrop when maximized */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs pointer-events-auto transition-opacity"
        />
      )}

      {/* Floating Modal Window */}
      <div
        style={
          isExpanded
            ? {
                width: '90vw',
                height: '85vh',
                maxWidth: '1400px',
                maxHeight: '900px',
              }
            : {
                width: '380px',
                height: '560px',
                maxWidth: '96vw',
              }
        }
        className={`pointer-events-auto bg-[#FAF8F5] dark:bg-[#0A0F1D] border-2 border-[#0B1B3D]/20 dark:border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 font-sans text-[#1E1B18] dark:text-[#EAEBED] relative ${
          !isExpanded ? 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6' : ''
        }`}
      >
        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-[#0B1B3D] dark:bg-[#D4AF37] text-white dark:text-[#0B1B3D] text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 border border-white/20"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Control Strip */}
        <div className="px-3.5 py-2.5 sm:px-4 bg-[#0B1B3D] text-white border-b border-[#1E293B] flex items-center justify-between gap-2 select-none shrink-0">
          {/* Left: Dynamic Desmos Logo + Mode */}
          <div className="flex items-center gap-2.5 truncate">
            {customIconUrl ? (
              <img
                src={customIconUrl}
                alt="Desmos"
                className="w-6 h-6 rounded-lg object-contain shrink-0"
              />
            ) : (
              <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                <DesmosLogoIcon size={24} showText={false} />
              </div>
            )}
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-tight text-white">
                  SAT Desmos
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-[#0B1B3D] font-bold uppercase">
                  MST Engine
                </span>
              </div>
            </div>
          </div>

          {/* Center: View Switcher */}
          <div className="flex items-center p-0.5 rounded-xl bg-white/10 border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('CALCULATOR')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'CALCULATOR'
                  ? 'bg-white text-[#0B1B3D] shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calculator className="w-3 h-3" />
              <span className="hidden xs:inline">Calculator</span>
            </button>

            <button
              onClick={() => setActiveTab('HACKS')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                activeTab === 'HACKS'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>SAT Hacks</span>
            </button>
          </div>

          {/* Right: Window Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {activeTab === 'CALCULATOR' && (
              <button
                onClick={handleResetCalculator}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset all expressions"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isExpanded ? 'Restore compact mode' : 'Expand full screen'}
            >
              {isExpanded ? (
                <Minimize2 className="w-3.5 h-3.5" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
              title="Close Desmos"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-white dark:bg-[#0A0F1D]">
          {activeTab === 'CALCULATOR' ? (
            <div className="w-full h-full relative flex flex-col">
              {/* Desmos Graphing API Container */}
              <div
                ref={calcContainerRef}
                className="w-full flex-1 border-0"
                style={{ minHeight: '100%' }}
              />

              {/* Fallback Embed Iframe if Desmos script is not initialized */}
              {!window.Desmos && (
                <iframe
                  src={`https://www.desmos.com/calculator?embed${
                    isDark ? '&invertedColors=true' : ''
                  }`}
                  title="Official Desmos Graphing Suite"
                  className="w-full h-full border-0 absolute inset-0 bg-white"
                  allow="clipboard-read; clipboard-write"
                />
              )}
            </div>
          ) : (
            <DesmosHacksDrawer
              hacks={hacks}
              onInsertFormula={handleInsertFormula}
              onClose={() => setActiveTab('CALCULATOR')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
