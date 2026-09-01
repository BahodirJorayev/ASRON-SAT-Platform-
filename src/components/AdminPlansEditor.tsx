import React, { useState } from 'react';
import { 
  CreditCard, Plus, Trash2, CheckCircle2, Crown, 
  Sparkles, Zap, ArrowRight, Eye, Save, RotateCcw, 
  ExternalLink, MoveUp, MoveDown, Layers, HelpCircle
} from 'lucide-react';
import { PricingPlanConfig, PlanTier } from '../types';

interface AdminPlansEditorProps {
  plans: PricingPlanConfig[];
  onSavePlans: (updatedPlans: PricingPlanConfig[]) => void;
  adminTelegram?: string;
}

export const INITIAL_DEFAULT_PLANS: PricingPlanConfig[] = [
  {
    id: 'plan_free',
    tier: 'FREE',
    title: 'Free Starter Pass',
    subtitle: 'Essential diagnostic tools & daily micro-drill',
    badgeText: 'STARTER',
    monthlyPriceUSD: 0,
    threeMonthPriceUSD: 0,
    yearlyPriceUSD: 0,
    discountPercent: 0,
    isHighlighted: false,
    ctaText: 'Start Free Training',
    ctaTargetUrl: '#dashboard',
    featuresList: [
      '5 Daily SAT Workout Questions / day',
      'Basic Leitner Mistake Vault (Stage 1)',
      '1 Full-Length Official Diagnostic Mock',
      'Desmos Graphing Calculator (Basic Mode)',
      'Community Public Discussion Access',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_standard',
    tier: 'STANDARD',
    title: 'Standard Scholar',
    subtitle: 'Targeted drill engine for score breakthroughs',
    badgeText: 'POPULAR',
    monthlyPriceUSD: 29,
    threeMonthPriceUSD: 69,
    yearlyPriceUSD: 199,
    discountPercent: 20,
    isHighlighted: false,
    ctaText: 'Unlock Standard Pass',
    ctaTargetUrl: 'https://t.me/rcmnx?text=Hello%20Admin!%20I%20want%20to%20subscribe%20to%20ASRON%20SAT%20Standard%20Pass.',
    featuresList: [
      'Unlimited Daily SAT Micro-Workouts',
      'Full Official SQB 10,000+ Question Bank',
      '4 Multistage Adaptive Bluebook Practice Mocks',
      '3-Stage Leitner SRS Memory Vault',
      'Full Desmos 20-Sec Shortcut Mastery Suite',
      'Telegram Daily Streak Preserver Bot',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_pro',
    tier: 'PRO',
    title: 'Executive PRO Scholar',
    subtitle: 'The 1550+ Ivy League mastery accelerator',
    badgeText: 'MOST RECOMMENDED',
    monthlyPriceUSD: 59,
    threeMonthPriceUSD: 129,
    yearlyPriceUSD: 349,
    discountPercent: 35,
    isHighlighted: true,
    ctaText: 'Claim PRO Membership',
    ctaTargetUrl: 'https://t.me/rcmnx?text=Hello%20Admin!%20I%20want%20to%20subscribe%20to%20ASRON%20SAT%20PRO%20Scholar%20Pass.',
    featuresList: [
      'Everything in Standard + All 12+ Official MST Mocks',
      '24/7 Gemini Socratic AI Tutor & Question Cloner',
      '30-Day Dynamic Adaptive Roadmap & Error Telemetry',
      'Sub-Skill Psychometric Accuracy Heatmap',
      'Speed Blitz & PvP Vocab Clash Arena',
      'Priority Manual Receipt Clearance & Verification',
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plan_vip',
    tier: 'VIP',
    title: 'VIP Inner Circle',
    subtitle: 'Direct 1-on-1 curriculum review & live masterclasses',
    badgeText: 'ELITE FELLOWSHIP',
    monthlyPriceUSD: 119,
    threeMonthPriceUSD: 279,
    yearlyPriceUSD: 699,
    discountPercent: 40,
    isHighlighted: false,
    ctaText: 'Join VIP Inner Circle',
    ctaTargetUrl: 'https://t.me/rcmnx?text=Hello%20Admin!%20I%20want%20to%20apply%20for%20ASRON%20SAT%20VIP%20Inner%20Circle.',
    featuresList: [
      'Everything in PRO + Unlimited Access',
      'Live WebRTC Whiteboard Masterclass Hosting',
      'Private 1-on-1 Score Audit & Customized Roadmap',
      'College Essay & Application Strategic Advice',
      'Dedicated Mentor Desk via Telegram',
      'Lifetime Master Certificate & Scholar ID Badge',
    ],
    updatedAt: new Date().toISOString(),
  },
];

export const AdminPlansEditor: React.FC<AdminPlansEditorProps> = ({
  plans,
  onSavePlans,
  adminTelegram = '@rcmnx',
}) => {
  const currentPlans = plans && plans.length > 0 ? plans : INITIAL_DEFAULT_PLANS;
  const [editingPlans, setEditingPlans] = useState<PricingPlanConfig[]>(currentPlans);
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>('PRO');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [saveToast, setSaveToast] = useState(false);
  const [billingCyclePreview, setBillingCyclePreview] = useState<'monthly' | 'threeMonth' | 'yearly'>('monthly');

  const activePlan = editingPlans.find((p) => p.tier === selectedPlanTier) || editingPlans[0];

  const handleUpdateActivePlan = (updates: Partial<PricingPlanConfig>) => {
    setEditingPlans((prev) =>
      prev.map((p) => (p.tier === selectedPlanTier ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const nextList = [...activePlan.featuresList, newFeatureText.trim()];
    handleUpdateActivePlan({ featuresList: nextList });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    const nextList = activePlan.featuresList.filter((_, i) => i !== idx);
    handleUpdateActivePlan({ featuresList: nextList });
  };

  const handleMoveFeature = (idx: number, direction: 'up' | 'down') => {
    const nextList = [...activePlan.featuresList];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= nextList.length) return;
    const temp = nextList[idx];
    nextList[idx] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    handleUpdateActivePlan({ featuresList: nextList });
  };

  const handleSaveAll = () => {
    onSavePlans(editingPlans);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleResetDefaults = () => {
    setEditingPlans(INITIAL_DEFAULT_PLANS);
    onSavePlans(INITIAL_DEFAULT_PLANS);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Price calculations for preview
  const displayPrice = {
    monthly: activePlan.monthlyPriceUSD,
    threeMonth: activePlan.threeMonthPriceUSD,
    yearly: activePlan.yearlyPriceUSD,
  }[billingCyclePreview];

  return (
    <div id="admin-plans-editor" className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Pricing Tiers & Plans saved successfully! Live updates active across Landing & Dashboard.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/30 text-[#D4AF37] text-xs font-mono font-bold border border-[#D4AF37]/20">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Dynamic Pricing CMS & Tier Matrix</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
            Pricing Plans & Feature Matrix Editor
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
            Customize plan prices, discount tags, feature checklists, and CTA target redirects to Telegram <span className="font-mono font-bold text-[#E07A5F]">{adminTelegram}</span>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="btn-reset-plans-default"
            onClick={handleResetDefaults}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            id="btn-save-all-plans"
            onClick={handleSaveAll}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] hover:opacity-95 text-[#0B1B3D] text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save All Plans (Publish Live)</span>
          </button>
        </div>
      </div>

      {/* Tier Selector Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs overflow-x-auto">
        {(['FREE', 'STANDARD', 'PRO', 'VIP'] as const).map((tier) => {
          const plan = editingPlans.find((p) => p.tier === tier);
          const isSelected = selectedPlanTier === tier;
          return (
            <button
              key={tier}
              id={`tab-select-plan-${tier.toLowerCase()}`}
              onClick={() => setSelectedPlanTier(tier)}
              className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-between gap-2 ${
                isSelected
                  ? 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {tier === 'PRO' || tier === 'VIP' ? <Crown className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{tier}</span>
              </div>
              <span className="text-[10px] opacity-75">${plan?.monthlyPriceUSD || 0}/mo</span>
            </button>
          );
        })}
      </div>

      {/* Editor & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Plan Configuration Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
                1. Plan Metadata & Badge
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <span className="font-medium text-slate-600 dark:text-slate-300">Featured Highlight</span>
                <input
                  type="checkbox"
                  checked={activePlan.isHighlighted}
                  onChange={(e) => handleUpdateActivePlan({ isHighlighted: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37] rounded"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Plan Title</label>
                <input
                  type="text"
                  value={activePlan.title}
                  onChange={(e) => handleUpdateActivePlan({ title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Badge Label</label>
                <input
                  type="text"
                  value={activePlan.badgeText || ''}
                  onChange={(e) => handleUpdateActivePlan({ badgeText: e.target.value })}
                  placeholder="e.g. MOST POPULAR, BEST VALUE"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Plan Subtitle / Tagline</label>
                <input
                  type="text"
                  value={activePlan.subtitle || ''}
                  onChange={(e) => handleUpdateActivePlan({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
                2. Price Points ($ USD) & Discount Badge
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Monthly ($)</label>
                  <input
                    type="number"
                    value={activePlan.monthlyPriceUSD}
                    onChange={(e) => handleUpdateActivePlan({ monthlyPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">3-Month ($)</label>
                  <input
                    type="number"
                    value={activePlan.threeMonthPriceUSD}
                    onChange={(e) => handleUpdateActivePlan({ threeMonthPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">1-Year ($)</label>
                  <input
                    type="number"
                    value={activePlan.yearlyPriceUSD}
                    onChange={(e) => handleUpdateActivePlan({ yearlyPriceUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Discount %</label>
                  <input
                    type="number"
                    value={activePlan.discountPercent}
                    onChange={(e) => handleUpdateActivePlan({ discountPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-[#E07A5F]"
                  />
                </div>
              </div>
            </div>

            {/* CTA Settings */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
              <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
                3. CTA Button & Redirect Link
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 uppercase">Button Text</label>
                  <input
                    type="text"
                    value={activePlan.ctaText || ''}
                    onChange={(e) => handleUpdateActivePlan({ ctaText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-500 uppercase">Target Redirect Link</label>
                  <input
                    type="text"
                    value={activePlan.ctaTargetUrl || ''}
                    onChange={(e) => handleUpdateActivePlan({ ctaTargetUrl: e.target.value })}
                    placeholder={`https://t.me/${adminTelegram.replace('@', '')}`}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Feature Checklist Builder */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
                  4. Dynamic Feature Checklist ({activePlan.featuresList.length})
                </h3>
              </div>

              {/* Add New Feature */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a new feature description (e.g. 24/7 Gemini Socratic AI Tutor)..."
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3.5 py-2 rounded-xl bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] text-xs font-bold flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Features List with reorder and delete */}
              <div className="space-y-2 pt-2 max-h-64 overflow-y-auto pr-1">
                {activePlan.featuresList.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="text-[#0B1B3D] dark:text-slate-200 truncate">{feat}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveFeature(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFeature(idx, 'down')}
                        disabled={idx === activePlan.featuresList.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1 rounded text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Live Interactive Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Live Landing Preview</span>
            </span>

            {/* Cycle Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-[10px] font-mono font-bold">
              <button
                type="button"
                onClick={() => setBillingCyclePreview('monthly')}
                className={`px-2 py-0.5 rounded ${billingCyclePreview === 'monthly' ? 'bg-white dark:bg-slate-700 text-[#0B1B3D] dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                1M
              </button>
              <button
                type="button"
                onClick={() => setBillingCyclePreview('threeMonth')}
                className={`px-2 py-0.5 rounded ${billingCyclePreview === 'threeMonth' ? 'bg-white dark:bg-slate-700 text-[#0B1B3D] dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                3M
              </button>
              <button
                type="button"
                onClick={() => setBillingCyclePreview('yearly')}
                className={`px-2 py-0.5 rounded ${billingCyclePreview === 'yearly' ? 'bg-white dark:bg-slate-700 text-[#0B1B3D] dark:text-white shadow-xs' : 'text-slate-500'}`}
              >
                1Y
              </button>
            </div>
          </div>

          {/* Pricing Card Replica */}
          <div
            className={`p-6 sm:p-7 rounded-3xl transition-all relative overflow-hidden flex flex-col justify-between shadow-lg ${
              activePlan.isHighlighted
                ? 'bg-gradient-to-b from-[#121A2F] via-[#0E1626] to-[#0A0F1D] text-white border-2 border-[#D4AF37]'
                : 'bg-white dark:bg-[#121A2F] text-[#0B1B3D] dark:text-[#EAEBED] border border-[#E5E0D8] dark:border-[#1E293B]'
            }`}
          >
            {/* Top Badge */}
            {activePlan.badgeText && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] shadow-xs">
                  {activePlan.badgeText}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold tracking-wider text-[#D4AF37] uppercase">
                  {activePlan.tier} PASS
                </span>
                <h4 className="text-xl font-extrabold tracking-tight">{activePlan.title}</h4>
                <p className="text-xs text-slate-400 leading-snug">{activePlan.subtitle}</p>
              </div>

              {/* Price Display */}
              <div className="py-2 flex items-baseline gap-2 border-y border-slate-200/20 dark:border-slate-800">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight">
                  ${displayPrice}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {billingCyclePreview === 'monthly' ? '/ month' : billingCyclePreview === 'threeMonth' ? '/ 3 months' : '/ year'}
                </span>
                {activePlan.discountPercent > 0 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#E07A5F]/20 text-[#E07A5F] border border-[#E07A5F]/30 ml-auto">
                    -{activePlan.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Features List */}
              <div className="space-y-2.5 pt-2">
                <div className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">Included Powers:</div>
                <ul className="space-y-2 text-xs">
                  {activePlan.featuresList.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <a
                href={activePlan.ctaTargetUrl || `https://t.me/${adminTelegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
                  activePlan.isHighlighted
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] hover:opacity-95'
                    : 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] hover:bg-slate-800'
                }`}
              >
                <span>{activePlan.ctaText || 'Get Started'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
