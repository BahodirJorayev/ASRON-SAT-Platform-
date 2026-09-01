import React, { useState, useEffect } from 'react';
import {
  X,
  Crown,
  Check,
  Zap,
  Sparkles,
  Upload,
  Send,
  Shield,
  ShieldCheck,
  ArrowRight,
  Flame,
  BrainCircuit,
  Lock
} from 'lucide-react';
import { User, PlanTier, PricingPlanConfig } from '../types';
import { INITIAL_DEFAULT_PLANS } from './AdminPlansEditor';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  pricingPlans?: PricingPlanConfig[];
  adminTelegram?: string;
  onUploadReceipt: (receiptData: { plan: PlanTier; amount: number; imageUrl: string }) => void;
  onDirectUpgrade?: (tier: PlanTier) => void;
}

export const PaywallModal: React.FC<Props> = ({
  isOpen,
  onClose,
  user,
  pricingPlans = INITIAL_DEFAULT_PLANS,
  adminTelegram = '@rcmnx',
  onUploadReceipt,
  onDirectUpgrade,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('PRO');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const handleSimulateReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectedPlanConfig = pricingPlans.find((p) => p.tier === selectedPlan) || pricingPlans[2];

  const handleSubmitReceipt = () => {
    const amount = selectedPlanConfig ? (selectedPlanConfig.monthlyPriceUSD ?? selectedPlanConfig.priceMonthly ?? 29) : (selectedPlan === 'VIP' ? 149 : selectedPlan === 'PRO' ? 59 : 29);
    onUploadReceipt({
      plan: selectedPlan,
      amount,
      imageUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    });
    setIsSubmitted(true);
  };

  const handleInstantDemoActivate = () => {
    if (onDirectUpgrade) {
      onDirectUpgrade(selectedPlan);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto overscroll-contain font-sans animate-in fade-in duration-200"
    >
      <div className="bg-[#0A0F1D] border border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col text-[#F3F4F6] max-h-[90vh] sm:max-h-[86vh] my-auto relative">
        {/* Header - Fixed & Always Visible */}
        <div className="px-5 sm:px-6 py-4 bg-[#0B1B3D] border-b border-[#1E293B] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#0B1B3D] font-bold shadow-md shrink-0">
              <Crown className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-white">
                Unlock 1550+ Digital SAT Workspace
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Official Bluebook MST Engine, Desmos speedrun modules, and 24/7 Socratic AI.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#94A3B8] hover:text-white hover:bg-[#121A2F] transition-colors cursor-pointer border border-[#1E293B]"
            title="Yopish (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 sm:p-8 overflow-y-auto overscroll-contain flex-1 space-y-6 sm:space-y-8 bg-[#0A0F1D]">
          {!isSubmitted ? (
            <>
              {/* Dynamic Pricing Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pricingPlans.map((plan) => {
                  const isSelected = selectedPlan === plan.tier;
                  const isCurrent = user.planTier === plan.tier;

                  return (
                    <div
                      key={plan.id || plan.tier}
                      onClick={() => setSelectedPlan(plan.tier)}
                      className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#121A2F] border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-xl'
                          : 'bg-[#121A2F]/60 border-[#1E293B] hover:border-slate-600'
                      }`}
                    >
                      {plan.badgeText && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] text-[9px] font-mono font-extrabold uppercase tracking-wider shadow-xs">
                          {plan.badgeText}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="text-xs uppercase font-mono text-[#D4AF37] font-bold">
                          {plan.title || plan.name}
                        </div>
                        <div className="text-xl font-bold font-mono text-white">
                          ${plan.monthlyPriceUSD ?? plan.priceMonthly ?? 0} <span className="text-xs font-normal text-[#94A3B8]">/ mo</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-[#CBD5E1] pt-2 border-t border-[#1E293B]">
                          {(plan.featuresList || plan.features || []).slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                              <span className="line-clamp-1">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={`mt-4 text-center text-[11px] font-bold font-mono ${isSelected ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                        {isCurrent ? 'Current Tier' : isSelected ? 'Selected' : 'Choose Pass'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Payment Methods & Telegram Receipt Upload Workflow */}
              <div className="p-6 rounded-2xl bg-[#121A2F] border border-[#1E293B] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Send className="w-4 h-4 text-[#D4AF37]" />
                      <span>Official Direct Telegram Billing Desk</span>
                    </h4>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      Send payment proof or request direct invoice via Telegram handle: <a href={`https://t.me/${adminTelegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-[#E07A5F] font-mono font-bold hover:underline">{adminTelegram}</a>
                    </p>
                  </div>

                  {/* Instant Demo Activate for evaluation */}
                  <button
                    onClick={handleInstantDemoActivate}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] font-extrabold text-xs shadow-md whitespace-nowrap transition-all hover:opacity-90 cursor-pointer"
                  >
                    ⚡ Instant Demo Unlock ({selectedPlan})
                  </button>
                </div>

                {/* Screenshot Uploader */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <label className="flex-1 w-full p-4 border border-dashed border-[#1E293B] hover:border-[#D4AF37] rounded-xl bg-[#0A0F1D] flex items-center justify-center gap-3 cursor-pointer text-xs text-[#D1D5DB] transition-colors">
                    <Upload className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span>
                      {receiptImage ? 'Receipt Selected (Click to change)' : 'Upload Payment Receipt Screenshot'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSimulateReceiptUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleSubmitReceipt}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#0B1B3D] hover:bg-[#122756] border border-[#D4AF37]/50 text-white font-extrabold text-xs transition-colors shadow-md whitespace-nowrap cursor-pointer"
                  >
                    Submit Receipt for 1-Click Verification
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Receipt Submitted Success Notification */
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white">Payment Receipt Received!</h3>
              <p className="text-xs text-[#94A3B8] max-w-md mx-auto leading-relaxed">
                Your receipt for the <strong className="text-[#D4AF37]">{selectedPlan} PASS</strong> has been queued in the Admin Approvals Desk. Contact <strong className="text-[#E07A5F]">{adminTelegram}</strong> for instant expedited verification.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#0B1B3D] text-white font-bold text-xs border border-[#D4AF37]/50 hover:bg-[#122756] transition-colors cursor-pointer"
                >
                  Return to Studio
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
