import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Clock,
  Calculator,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  ArrowRight,
  X,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MockTest, User } from '../types';

interface PreTestModalProps {
  isOpen: boolean;
  test: MockTest | null;
  user: User;
  onClose: () => void;
  onLaunchTest: (test: MockTest, startInFullscreen: boolean) => void;
  onOpenPaywall?: () => void;
}

export const PreTestModal: React.FC<PreTestModalProps> = ({
  isOpen,
  test,
  user,
  onClose,
  onLaunchTest,
  onOpenPaywall,
}) => {
  const [fullscreenConsent, setFullscreenConsent] = useState(true);
  const [understoodMST, setUnderstoodMST] = useState(true);
  const [understoodTiming, setUnderstoodTiming] = useState(true);

  if (!isOpen || !test) return null;

  const isProLocked = test.isProOnly && user.planTier !== 'PRO';

  const handleLaunch = () => {
    if (isProLocked) {
      onOpenPaywall?.();
      return;
    }

    if (fullscreenConsent && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Fullscreen request may be blocked by iframe or browser permissions
      });
    }

    onLaunchTest(test, fullscreenConsent);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl bg-white rounded-3xl border border-[#E5E0D8] shadow-2xl overflow-hidden font-sans text-[#1E1B18] my-8"
      >
        {/* Header Bar */}
        <div className="px-6 py-5 bg-[#FAF8F5] border-b border-[#E5E0D8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1E1B18] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              MST
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-[#E5E0D8] text-[#E07A5F]">
                  Official Bluebook Simulation
                </span>
                {test.isProOnly && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE]">
                    PRO PASS
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#1E1B18] mt-0.5">
                {test.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#78716C] hover:text-[#1E1B18] hover:bg-white border border-transparent hover:border-[#E5E0D8] transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Pro Lock Alert */}
          {isProLocked && (
            <div className="p-4 rounded-2xl bg-[#FFF4F0] border border-[#FCD9CE] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-white text-[#E07A5F] border border-[#FCD9CE] shrink-0 mt-0.5">
                <Lock size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#1E1B18]">PRO Pass Required</h4>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  This full-length adaptive simulation is exclusive to AURA SAT PRO members. Upgrade to unlock all 12+ official adaptive mocks, AI trap diagnostics, and detailed score percentiles.
                </p>
                <button
                  onClick={() => onOpenPaywall?.()}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Sparkles size={12} />
                  <span>Unlock PRO Mocks for $59</span>
                </button>
              </div>
            </div>
          )}

          {/* Section 1: Bluebook 2-Stage MST Architecture */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-2">
              <Layers size={14} className="text-[#E07A5F]" />
              2-Stage Multistage Adaptive Engine (MST)
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1B18]">Stage 1: Baseline Module</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#78716C] border border-[#E5E0D8]">
                    Standard Mix
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] leading-relaxed">
                  All students receive an identical distribution of Easy, Medium, and Hard items. Your raw score here determines your routing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EBE5DF] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1B18]">Stage 2: Adaptive Routing</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE]">
                    Easy or Hard
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] leading-relaxed">
                  High performers route to the <strong>Hard Module</strong> (scoring up to 800). Routing to Easy caps the section score at ~600.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Structure & Timing */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-2">
              <Clock size={14} className="text-[#3D405B]" />
              Exact Test Structure &amp; Timing (2h 14m Total)
            </h3>

            <div className="rounded-2xl border border-[#E5E0D8] overflow-hidden divide-y divide-[#E5E0D8] text-xs">
              <div className="p-3.5 bg-[#FAF8F5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#E07A5F]" />
                  <span className="font-bold text-[#1E1B18]">Section 1: Reading &amp; Writing</span>
                </div>
                <div className="text-[#78716C] font-medium text-right">
                  <strong>2 Modules &bull; 54 Qs &bull; 64 mins</strong> (32 min/mod)
                </div>
              </div>

              <div className="p-2.5 bg-[#FFFDF9] text-center text-[11px] text-[#854D0E] font-medium border-y border-[#FEF08A]">
                ☕ 10-Minute Official Intermission / Break
              </div>

              <div className="p-3.5 bg-[#FAF8F5] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2A9D8F]" />
                  <span className="font-bold text-[#1E1B18]">Section 2: Math</span>
                </div>
                <div className="text-[#78716C] font-medium text-right">
                  <strong>2 Modules &bull; 44 Qs &bull; 70 mins</strong> (35 min/mod)
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Permitted Bluebook Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-2">
              <Calculator size={14} className="text-[#2A9D8F]" />
              Built-in Testing Tools
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#FAF8F5] text-[#1E1B18]">
                  <Calculator size={14} />
                </div>
                <div>
                  <div className="font-bold text-[#1E1B18]">Desmos Calculator</div>
                  <div className="text-[10px] text-[#78716C]">Available all Math Qs</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#FAF8F5] text-[#1E1B18]">
                  <BookOpen size={14} />
                </div>
                <div>
                  <div className="font-bold text-[#1E1B18]">Reference Sheet</div>
                  <div className="text-[10px] text-[#78716C]">Geometry &amp; Trig formulas</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5E0D8] flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#FAF8F5] text-[#1E1B18]">
                  <ShieldCheck size={14} />
                </div>
                <div>
                  <div className="font-bold text-[#1E1B18]">Flag &amp; Strikethrough</div>
                  <div className="text-[10px] text-[#78716C]">Eliminate choices (A-D)</div>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Checkboxes */}
          <div className="space-y-2.5 pt-2 border-t border-[#F0EBE4]">
            <label className="flex items-start gap-2.5 text-xs text-[#3D405B] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={fullscreenConsent}
                onChange={(e) => setFullscreenConsent(e.target.checked)}
                className="mt-0.5 rounded border-[#E5E0D8] text-[#1E1B18] focus:ring-0 cursor-pointer"
              />
              <span>
                <strong>Launch in Fullscreen:</strong> Replicate true distraction-free testing environment without browser tabs.
              </span>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-[#3D405B] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={understoodMST}
                onChange={(e) => setUnderstoodMST(e.target.checked)}
                className="mt-0.5 rounded border-[#E5E0D8] text-[#1E1B18] focus:ring-0 cursor-pointer"
              />
              <span>
                I understand that once a module timer expires, answers cannot be modified in prior sections.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-t border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-white text-xs font-bold text-[#78716C] hover:text-[#1E1B18] transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleLaunch}
            disabled={!understoodMST || isProLocked}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#1E1B18] hover:bg-[#3D405B] disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Maximize2 size={14} />
            <span>Launch Fullscreen Bluebook Engine</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
