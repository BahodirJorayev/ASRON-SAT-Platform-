import React, { useState } from 'react';
import { 
  Globe, Layout, Sparkles, Megaphone, HelpCircle, 
  MessageSquare, Plus, Trash2, Save, RotateCcw, 
  CheckCircle2, Eye, ExternalLink, MoveUp, MoveDown,
  Star, Image as ImageIcon
} from 'lucide-react';
import { GlobalPlatformSettings, UserTestimonial } from '../types';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface AdminLandingCMSProps {
  globalSettings: GlobalPlatformSettings;
  testimonials: UserTestimonial[];
  onSaveSettings: (settings: GlobalPlatformSettings) => void;
  onSaveTestimonials: (testimonials: UserTestimonial[]) => void;
}

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does ASRON SAT mirror the official Bluebook interface and scoring curve?',
    answer: 'ASRON SAT utilizes a 1:1 mathematical replica of the College Board Multistage Adaptive Testing (MST) algorithm, including authentic Module 1 routing, Desmos integration, and psychometric 200-800 scale conversions.',
  },
  {
    id: 'faq-2',
    question: 'How do I pay and unlock Standard, PRO, or VIP tiers?',
    answer: 'Payments are handled seamlessly via manual verification on Telegram (@rcmnx). Simply send your receipt or click the plan CTA to get your official Scholar ID pass minted instantly.',
  },
  {
    id: 'faq-3',
    question: 'What is the 3-Stage Leitner Mistake Vault?',
    answer: 'Whenever you miss a question during drills or mocks, it enters Stage 1. You must solve it correctly across spaced intervals (24h, 3d, 7d) and master AI-generated clone variations before it is cleared as mastered.',
  },
  {
    id: 'faq-4',
    question: 'Does the Socratic AI Tutor spoil the answer directly?',
    answer: 'No. Powered by Gemini 2.5, our AI acts as an elite Ivy League tutor, guiding you with strategic hints, Desmos 20-second shortcut formulas, and trap identification without revealing the final option prematurely.',
  },
];

export const AdminLandingCMS: React.FC<AdminLandingCMSProps> = ({
  globalSettings,
  testimonials,
  onSaveSettings,
  onSaveTestimonials,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'announcement' | 'faqs' | 'testimonials'>('hero');
  const [saveToast, setSaveToast] = useState(false);

  // Settings State
  const [settingsForm, setSettingsForm] = useState<GlobalPlatformSettings>(globalSettings);
  const [testimonialsList, setTestimonialsList] = useState<UserTestimonial[]>(testimonials);
  const [faqsList, setFaqsList] = useState<FAQItem[]>(() => {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem('asron_landing_faqs');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_FAQS;
  });

  // New FAQ form
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // New Testimonial form
  const [newTestimonial, setNewTestimonial] = useState({
    name: '',
    score: '1560',
    university: 'MIT Early Decision',
    quote: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  });

  const handleSaveAll = () => {
    onSaveSettings(settingsForm);
    onSaveTestimonials(testimonialsList);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('asron_landing_faqs', JSON.stringify(faqsList));
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    const item: FAQItem = {
      id: `faq-${Date.now()}`,
      question: newFaqQ.trim(),
      answer: newFaqA.trim(),
    };
    setFaqsList([...faqsList, item]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const handleRemoveFaq = (id: string) => {
    setFaqsList(faqsList.filter((f) => f.id !== id));
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.name.trim() || !newTestimonial.quote.trim()) return;
    const t: UserTestimonial = {
      id: `t-${Date.now()}`,
      name: newTestimonial.name.trim(),
      score: Number(newTestimonial.score) || 1550,
      university: newTestimonial.university.trim(),
      quote: newTestimonial.quote.trim(),
      avatarUrl: newTestimonial.avatarUrl,
      verifiedDate: 'Just now',
    };
    setTestimonialsList([t, ...testimonialsList]);
    setNewTestimonial({
      name: '',
      score: '1560',
      university: 'Stanford Class of 2030',
      quote: '',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });
  };

  const handleRemoveTestimonial = (id: string) => {
    setTestimonialsList(testimonialsList.filter((t) => t.id !== id));
  };

  return (
    <div id="admin-landing-cms" className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Landing Page CMS updated successfully! Instant live propagation active.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#0B1B3D] dark:text-blue-300 text-xs font-mono font-bold border border-[#0B1B3D]/10">
            <Globe className="w-3.5 h-3.5 text-[#E07A5F]" />
            <span>Global Landing & Public Marketing CMS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
            Landing Copy, Announcement Banner & FAQs
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
            Update public hero headlines, top announcement alert bar, social proof reviews, and accordion FAQs.
          </p>
        </div>

        <button
          id="btn-save-landing-cms"
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Publish Landing Changes</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E0D8] dark:border-[#1E293B] pb-2 overflow-x-auto">
        {[
          { id: 'hero', label: 'Hero & CTA Copy', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'announcement', label: 'Top Announcement Bar', icon: <Megaphone className="w-3.5 h-3.5" /> },
          { id: 'faqs', label: `Accordion FAQs (${faqsList.length})`, icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'testimonials', label: `Social Proof (${testimonialsList.length})`, icon: <MessageSquare className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`subtab-landing-${tab.id}`}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: HERO & CTA COPY */}
      {activeSubTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              Hero Section Copywriting
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Main Hero Headline</label>
                <input
                  type="text"
                  value={settingsForm.landingHeroTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, landingHeroTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Hero Subtitle & Value Proposition</label>
                <textarea
                  rows={3}
                  value={settingsForm.landingHeroSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, landingHeroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Primary CTA Button Text</label>
                <input
                  type="text"
                  value={settingsForm.landingHeroCtaText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, landingHeroCtaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                />
              </div>
            </div>
          </div>

          {/* Hero Live Preview Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0B1B3D] via-[#121A2F] to-[#0A0F1D] text-white border border-white/10 flex flex-col justify-center space-y-4 shadow-xl">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block">
              LIVE HERO PREVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {settingsForm.landingHeroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {settingsForm.landingHeroSubtitle}
            </p>
            <div className="pt-2">
              <button className="py-3 px-6 rounded-xl bg-[#D4AF37] text-[#0B1B3D] font-extrabold text-xs shadow-md">
                {settingsForm.landingHeroCtaText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TOP ANNOUNCEMENT BAR */}
      {activeSubTab === 'announcement' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
                Top Announcement Notification Bar
              </h3>
              <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                Display a persistent alert banner across the entire public platform.
              </p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold">
              <span>Enable Banner</span>
              <input
                type="checkbox"
                checked={settingsForm.announcementEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementEnabled: e.target.checked })}
                className="w-4 h-4 accent-[#E07A5F] rounded"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Banner Message</label>
              <input
                type="text"
                value={settingsForm.announcementText}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-500 uppercase">Banner Target Link (Optional)</label>
              <input
                type="text"
                value={settingsForm.announcementLink || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, announcementLink: e.target.value })}
                placeholder="https://t.me/rcmnx or #pricing"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>
          </div>

          {/* Banner Preview */}
          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1">Banner Preview:</span>
            <div className="p-3 rounded-xl bg-gradient-to-r from-[#0B1B3D] via-[#E07A5F] to-[#0B1B3D] text-white text-xs font-semibold text-center shadow-xs flex items-center justify-center gap-2">
              <Megaphone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{settingsForm.announcementText}</span>
              <ExternalLink className="w-3 h-3 text-slate-300 ml-1" />
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: ACCORDION FAQS */}
      {activeSubTab === 'faqs' && (
        <div className="space-y-6">
          {/* Add New FAQ Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              Add New Accordion FAQ
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Question (e.g. How does the 3D Tier Pass work?)"
                value={newFaqQ}
                onChange={(e) => setNewFaqQ(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
              <textarea
                rows={2}
                placeholder="Answer explanation..."
                value={newFaqA}
                onChange={(e) => setNewFaqA(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 rounded-xl bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ Item</span>
              </button>
            </div>
          </div>

          {/* FAQs List */}
          <div className="space-y-3">
            {faqsList.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-extrabold text-[#0B1B3D] dark:text-slate-100 flex items-center gap-2">
                    <span className="font-mono text-slate-400">Q{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </div>
                  <p className="text-xs text-[#78716C] dark:text-[#94A3B8] leading-relaxed pl-5">
                    {faq.answer}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFaq(faq.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: TESTIMONIALS & SOCIAL PROOF */}
      {activeSubTab === 'testimonials' && (
        <div className="space-y-6">
          {/* Add Testimonial */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              Add Verified Scholar Review
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Scholar Full Name"
                value={newTestimonial.name}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
              <input
                type="text"
                placeholder="Official Score (e.g. 1560)"
                value={newTestimonial.score}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, score: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Admitted University / Major"
                value={newTestimonial.university}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, university: e.target.value })}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
              <div className="sm:col-span-3">
                <textarea
                  rows={2}
                  placeholder="Review quote / breakthrough story..."
                  value={newTestimonial.quote}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddTestimonial}
              className="px-4 py-2 rounded-xl bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scholar Review</span>
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonialsList.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={t.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-xs text-[#0B1B3D] dark:text-slate-100">{t.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{t.university}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/40 text-[#D4AF37] border border-[#D4AF37]/30">
                        {t.score} SAT
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(t.id)}
                        className="p-1 text-rose-400 hover:text-rose-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-[#78716C] dark:text-[#94A3B8] italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
