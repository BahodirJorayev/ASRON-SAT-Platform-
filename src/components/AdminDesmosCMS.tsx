import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  Zap,
  Calculator,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Code,
  Lightbulb,
  Search,
  Eye,
  Sliders
} from 'lucide-react';
import { DesmosSatHack, GlobalPlatformSettings } from '../types';
import { INITIAL_SAT_DESMOS_HACKS } from '../data/desmosHacksData';
import { DesmosLogoIcon } from './DesmosLogoIcon';
import { KaTeXRenderer } from './KaTeXRenderer';

interface Props {
  hacks: DesmosSatHack[];
  globalSettings: GlobalPlatformSettings;
  onSaveHacks: (hacks: DesmosSatHack[]) => void;
  onSaveSettings: (settings: GlobalPlatformSettings) => void;
}

export const AdminDesmosCMS: React.FC<Props> = ({
  hacks,
  globalSettings,
  onSaveHacks,
  onSaveSettings,
}) => {
  const [hacksList, setHacksList] = useState<DesmosSatHack[]>(hacks);
  const [editingHack, setEditingHack] = useState<DesmosSatHack | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Settings State
  const [desmosEnabled, setDesmosEnabled] = useState<boolean>(
    globalSettings.desmosEnabled ?? true
  );
  const [desmosIconUrl, setDesmosIconUrl] = useState<string>(
    globalSettings.desmosIconUrl || ''
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Editing/Creating
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Algebra' | 'Advanced Math' | 'Problem-Solving' | 'Geometry' | 'General'>('Algebra');
  const [formDescription, setFormDescription] = useState('');
  const [formLatex, setFormLatex] = useState('');
  const [formExampleProblem, setFormExampleProblem] = useState('');
  const [formShortcutTip, setFormShortcutTip] = useState('');

  const openCreateModal = () => {
    setEditingHack(null);
    setFormTitle('');
    setFormCategory('Algebra');
    setFormDescription('');
    setFormLatex('y = ax^2 + bx + c');
    setFormExampleProblem('');
    setFormShortcutTip('');
    setIsCreating(true);
  };

  const openEditModal = (hack: DesmosSatHack) => {
    setEditingHack(hack);
    setFormTitle(hack.title);
    setFormCategory(hack.category);
    setFormDescription(hack.description);
    setFormLatex(hack.latexFormula);
    setFormExampleProblem(hack.exampleProblem || '');
    setFormShortcutTip(hack.shortcutTip || '');
    setIsCreating(false);
  };

  const handleSaveHackItem = () => {
    if (!formTitle.trim() || !formLatex.trim()) return;

    if (isCreating) {
      const newHack: DesmosSatHack = {
        id: `hack-custom-${Date.now()}`,
        title: formTitle.trim(),
        category: formCategory,
        description: formDescription.trim(),
        latexFormula: formLatex.trim(),
        exampleProblem: formExampleProblem.trim() || undefined,
        shortcutTip: formShortcutTip.trim() || undefined,
        orderIndex: hacksList.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updated = [newHack, ...hacksList];
      setHacksList(updated);
      onSaveHacks(updated);
    } else if (editingHack) {
      const updated = hacksList.map((h) =>
        h.id === editingHack.id
          ? {
              ...h,
              title: formTitle.trim(),
              category: formCategory,
              description: formDescription.trim(),
              latexFormula: formLatex.trim(),
              exampleProblem: formExampleProblem.trim() || undefined,
              shortcutTip: formShortcutTip.trim() || undefined,
              updatedAt: new Date().toISOString(),
            }
          : h
      );
      setHacksList(updated);
      onSaveHacks(updated);
    }

    setIsCreating(false);
    setEditingHack(null);
    triggerSaveSuccess();
  };

  const handleDeleteHack = (id: string) => {
    if (confirm('Are you sure you want to delete this SAT Desmos hack?')) {
      const updated = hacksList.filter((h) => h.id !== id);
      setHacksList(updated);
      onSaveHacks(updated);
      triggerSaveSuccess();
    }
  };

  const handleResetToDefaults = () => {
    if (
      confirm(
        'Reset all SAT Desmos hacks to official Ivy League curated defaults?'
      )
    ) {
      setHacksList(INITIAL_SAT_DESMOS_HACKS);
      onSaveHacks(INITIAL_SAT_DESMOS_HACKS);
      triggerSaveSuccess();
    }
  };

  const handleSaveGlobalDesmosSettings = () => {
    const updatedSettings: GlobalPlatformSettings = {
      ...globalSettings,
      desmosEnabled,
      desmosIconUrl: desmosIconUrl.trim() || undefined,
      updatedAt: new Date().toISOString(),
    };
    onSaveSettings(updatedSettings);
    triggerSaveSuccess();
  };

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const filteredHacks = hacksList.filter((h) => {
    const matchesCat =
      selectedCategoryFilter === 'ALL' || h.category === selectedCategoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ =
      !q ||
      h.title.toLowerCase().includes(q) ||
      h.description.toLowerCase().includes(q) ||
      h.latexFormula.toLowerCase().includes(q);
    return matchesCat && matchesQ;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Status Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0B1B3D] to-[#2563EB] dark:from-[#D4AF37] dark:to-[#E07A5F] flex items-center justify-center text-white dark:text-[#0B1B3D] shadow-xs">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#0B1B3D] dark:text-white">
              Desmos Graphing Suite & SAT Hacks CMS
            </h2>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
              Manage the persistent draggable widget, custom icons, and 1550+ shortcut library
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-500" />
            <span>Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Global Widget Configuration Panel */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
        <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-[#0B1B3D] dark:text-[#D4AF37] flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          <span>Floating Widget Global Controls</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Toggle Switch */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                Enable Persistent Floating Desmos Widget
              </div>
              <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8]">
                Shows the circular glassmorphic draggable button across all student views
              </p>
            </div>
            <button
              onClick={() => setDesmosEnabled(!desmosEnabled)}
              className={`w-12 h-6.5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                desmosEnabled
                  ? 'bg-emerald-600 justify-end'
                  : 'bg-slate-300 dark:bg-slate-700 justify-start'
              }`}
            >
              <div className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
            </button>
          </div>

          {/* Custom Icon URL */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0B1B3D] dark:text-white flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Custom Floating Icon URL</span>
              </label>
              {desmosIconUrl && (
                <button
                  onClick={() => setDesmosIconUrl('')}
                  className="text-[10px] font-mono text-rose-500 hover:underline"
                >
                  Reset Icon
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={desmosIconUrl}
                onChange={(e) => setDesmosIconUrl(e.target.value)}
                placeholder="Leave blank for official Desmos green logo or enter SVG URL"
                className="flex-1 px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B1B3D] dark:focus:ring-[#D4AF37]"
              />
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-center shrink-0 overflow-hidden">
                {desmosIconUrl ? (
                  <img
                    src={desmosIconUrl}
                    alt="Icon"
                    className="w-6 h-6 object-contain"
                    onError={() => alert('Icon URL could not be loaded')}
                  />
                ) : (
                  <DesmosLogoIcon size={22} showText={false} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveGlobalDesmosSettings}
            className="px-4 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162A5A] text-white dark:bg-gradient-to-r dark:from-[#D4AF37] dark:to-[#E07A5F] dark:text-[#0B1B3D] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Widget Settings</span>
          </button>
        </div>
      </div>

      {/* SAT Hacks Library Management Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E0D8] dark:border-[#1E293B]">
          <div>
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span>SAT Desmos Hacks & Shortcuts Library ({hacksList.length})</span>
            </h3>
            <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
              Equations, shortcuts, and LaTeX templates available in the student Desmos drawer
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset all hacks to official defaults"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-3.5 py-1.5 rounded-xl bg-[#0B1B3D] hover:bg-[#162A5A] text-white dark:bg-[#D4AF37] dark:text-[#0B1B3D] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New SAT Hack</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hacks by title or formula..."
              className="w-full pl-8.5 pr-3 py-1.5 rounded-xl text-xs bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B1B3D]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'Algebra', 'Advanced Math', 'Problem-Solving', 'Geometry'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-[#0B1B3D] text-white dark:bg-white dark:text-[#0B1B3D] shadow-xs'
                      : 'bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>

        {/* Hacks Table / Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredHacks.map((hack, idx) => (
            <div
              key={hack.id}
              className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#0A0F1D] border border-[#E5E0D8] dark:border-[#1E293B] space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#0B1B3D]/10 dark:bg-amber-500/10 text-[#0B1B3D] dark:text-amber-300 border border-[#0B1B3D]/20 dark:border-amber-500/30 uppercase">
                      {hack.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      #{idx + 1}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0B1B3D] dark:text-white">
                    {hack.title}
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(hack)}
                    className="p-1.5 rounded-lg bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-[#0B1B3D] dark:hover:text-white transition-colors cursor-pointer"
                    title="Edit Hack"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteHack(hack.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 transition-colors cursor-pointer"
                    title="Delete Hack"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] dark:text-[#94A3B8] leading-relaxed line-clamp-2">
                {hack.description}
              </p>

              <div className="p-2 rounded-xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] font-mono text-xs text-[#0B1B3D] dark:text-[#D4AF37] overflow-x-auto">
                <code className="whitespace-pre-wrap">{hack.latexFormula}</code>
              </div>

              {hack.exampleProblem && (
                <div className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                  Ex: "{hack.exampleProblem}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal for Adding / Editing Hack */}
      {(isCreating || editingHack) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto font-sans animate-in fade-in duration-150">
          <div className="bg-[#FAF8F5] dark:bg-[#0A0F1D] border-2 border-[#0B1B3D]/20 dark:border-[#1E293B] rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col text-[#1E1B18] dark:text-white my-auto">
            <div className="px-5 py-4 bg-[#0B1B3D] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <h3 className="text-sm font-extrabold">
                  {isCreating ? 'Create SAT Desmos Shortcut' : 'Edit SAT Desmos Shortcut'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingHack(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {/* Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                    Shortcut Title *
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Systems of Linear Equations (Intersection Finder)"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0B1B3D]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white focus:outline-none"
                  >
                    <option value="Algebra">Algebra</option>
                    <option value="Advanced Math">Advanced Math</option>
                    <option value="Problem-Solving">Problem-Solving</option>
                    <option value="Geometry">Geometry</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                  Shortcut Method & Explanation *
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain how to execute the shortcut on Desmos in 15 seconds..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white focus:outline-none"
                />
              </div>

              {/* LaTeX Formula */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0B1B3D] dark:text-white flex items-center justify-between">
                  <span>LaTeX Expression Syntax (Pushed to Desmos) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Separate multiple lines with Enter
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={formLatex}
                  onChange={(e) => setFormLatex(e.target.value)}
                  placeholder="e.g. y = ax^2 + bx + c or y_1 ~ m*x_1 + b"
                  className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Example Problem */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                  Sample SAT Exam Question
                </label>
                <input
                  type="text"
                  value={formExampleProblem}
                  onChange={(e) => setFormExampleProblem(e.target.value)}
                  placeholder="e.g. If 2x + 3y = 12 and 4x - y = 5, what is the value of x + y?"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white focus:outline-none"
                />
              </div>

              {/* Shortcut Tip */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#0B1B3D] dark:text-white">
                  Step-by-Step Pro Tip
                </label>
                <input
                  type="text"
                  value={formShortcutTip}
                  onChange={(e) => setFormShortcutTip(e.target.value)}
                  placeholder="e.g. Click the gray dot at the intersection to get (x, y) coordinates."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-[#0B1B3D] dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="px-5 py-4 bg-white dark:bg-[#121A2F] border-t border-[#E5E0D8] dark:border-[#1E293B] flex items-center justify-end gap-2.5 shrink-0">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingHack(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHackItem}
                className="px-5 py-2 rounded-xl bg-[#0B1B3D] hover:bg-[#162A5A] text-white dark:bg-gradient-to-r dark:from-[#D4AF37] dark:to-[#E07A5F] dark:text-[#0B1B3D] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save SAT Hack</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
