import React, { useState } from 'react';
import { 
  Terminal, Search, Filter, Save, CheckCircle2, 
  RotateCcw, Eye, Code, BookOpen, Calculator, 
  Sparkles, AlertCircle, Trash2, Plus, Copy
} from 'lucide-react';
import { Question, SectionType, MathDomain, ReadingWritingDomain, Difficulty } from '../types';

interface AdminQuestionFixerProps {
  questions: Question[];
  onUpdateQuestion: (updatedQ: Question) => void;
  onAddQuestion?: (newQ: Question) => void;
}

export const AdminQuestionFixer: React.FC<AdminQuestionFixerProps> = ({
  questions,
  onUpdateQuestion,
  onAddQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<'ALL' | SectionType>('ALL');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id || '');
  const [saveToast, setSaveToast] = useState(false);
  const [showDesmosModal, setShowDesmosModal] = useState(false);

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];
  const [editForm, setEditForm] = useState<Question>(selectedQuestion || {
    id: 'MATH-NEW-01',
    section: 'MATH',
    domain: 'Advanced Math',
    skill: 'Nonlinear equations and systems',
    difficulty: 'HARD',
    stem: 'What is the sum of the solutions to $x^2 - 14x + 45 = 0$?',
    options: ['9', '14', '45', '-14'],
    correctAnswer: 'B',
    explanation: 'By Vieta formulas, the sum of roots for $ax^2 + bx + c = 0$ is $-b/a = -(-14)/1 = 14$.',
  });

  const handleSelectQuestion = (q: Question) => {
    setSelectedQuestionId(q.id);
    setEditForm(q);
  };

  const handleUpdateOption = (index: number, value: string) => {
    const nextOpts = [...(editForm.options || [])];
    nextOpts[index] = value;
    setEditForm({ ...editForm, options: nextOpts });
  };

  const handleSaveHotFix = () => {
    onUpdateQuestion(editForm);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const filteredQuestions = questions.filter((q) => {
    const textMatch = 
      (q.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.stem || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.skill || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.domain || '').toLowerCase().includes(searchQuery.toLowerCase());

    const sectionMatch = sectionFilter === 'ALL' || q.section === sectionFilter;
    return textMatch && sectionMatch;
  });

  return (
    <div id="admin-question-fixer" className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Question #{editForm.id} Hot-Fixed & Live Broadcasted to Student Bank & Mocks!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-mono font-bold border border-sky-300 dark:border-sky-800">
            <Terminal className="w-3.5 h-3.5" />
            <span>Universal Question & Mock Hot-Fix Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
            Live Question Editor & KaTeX Bluebook Viewport
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
            Split-screen hot-fix editor with real-time KaTeX rendering, formula preview, and student replica viewport.
          </p>
        </div>

        <button
          id="btn-save-question-hotfix"
          onClick={handleSaveHotFix}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm hover:opacity-95"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Broadcast Hot-Fix Live</span>
        </button>
      </div>

      {/* Search & Selector Filter */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions by ID (#MATH-102), stem text, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] text-xs text-[#0B1B3D] dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {(['ALL', 'MATH', 'READING_WRITING'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSectionFilter(sec)}
              className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                sectionFilter === sec
                  ? 'bg-[#0B1B3D] dark:bg-white text-white dark:text-[#0B1B3D] shadow-xs'
                  : 'bg-white dark:bg-[#121A2F] text-slate-600 dark:text-slate-400 border border-[#E5E0D8] dark:border-[#1E293B]'
              }`}
            >
              {sec === 'ALL' ? 'All Sections' : sec === 'MATH' ? 'Math' : 'R & W'}
            </button>
          ))}
        </div>
      </div>

      {/* Question Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {filteredQuestions.slice(0, 16).map((q) => (
          <button
            key={q.id}
            onClick={() => handleSelectQuestion(q)}
            className={`px-3 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition-all border ${
              q.id === editForm.id
                ? 'bg-[#0B1B3D] text-white border-[#D4AF37]'
                : 'bg-white dark:bg-[#121A2F] text-slate-600 dark:text-slate-400 border-[#E5E0D8] dark:border-[#1E293B] hover:bg-slate-50'
            }`}
          >
            <span className="text-[#D4AF37] mr-1.5">{q.section === 'MATH' ? '∑' : '¶'}</span>
            <span>{q.id}</span>
          </button>
        ))}
      </div>

      {/* Split-Screen Hot-Fix Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane (7 Cols): Editor Form */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">
                Edit Question Parameters: #{editForm.id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-300">
                {editForm.difficulty} DIFFICULTY
              </span>
            </div>

            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Section</label>
                <select
                  value={editForm.section}
                  onChange={(e) => setEditForm({ ...editForm, section: e.target.value as SectionType })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                >
                  <option value="MATH">Math</option>
                  <option value="READING_WRITING">Reading & Writing</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Domain</label>
                <input
                  type="text"
                  value={editForm.domain}
                  onChange={(e) => setEditForm({ ...editForm, domain: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Skill</label>
                <input
                  type="text"
                  value={editForm.skill}
                  onChange={(e) => setEditForm({ ...editForm, skill: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Passage (if RW) */}
            {editForm.section === 'READING_WRITING' && (
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Reading Passage</label>
                <textarea
                  rows={4}
                  value={editForm.passage || ''}
                  onChange={(e) => setEditForm({ ...editForm, passage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed font-serif"
                />
              </div>
            )}

            {/* Question Stem (KaTeX supported) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Question Stem (LaTeX: $inline$ or $$block$$)</label>
                <span className="text-[10px] font-mono text-slate-400">KaTeX Supported</span>
              </div>
              <textarea
                rows={3}
                value={editForm.stem}
                onChange={(e) => setEditForm({ ...editForm, stem: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
              />
            </div>

            {/* Options (A, B, C, D) */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Multiple Choice Options</label>
              <div className="space-y-2">
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <div key={letter} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, correctAnswer: letter })}
                      className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border transition-all ${
                        editForm.correctAnswer === letter
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}
                      title="Set as Correct Answer"
                    >
                      {letter}
                    </button>
                    <input
                      type="text"
                      value={editForm.options ? editForm.options[idx] || '' : ''}
                      onChange={(e) => handleUpdateOption(idx, e.target.value)}
                      placeholder={`Option ${letter} value...`}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <label className="text-[10px] font-mono text-slate-500 uppercase">Socratic Step-by-Step Explanation</label>
              <textarea
                rows={3}
                value={editForm.explanation || ''}
                onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Right Pane (5 Cols): Student Bluebook Viewport Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>Bluebook Student Viewport Replica</span>
            </span>

            <button
              onClick={() => setShowDesmosModal(!showDesmosModal)}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold flex items-center gap-1 border border-emerald-500/30"
            >
              <Calculator className="w-3 h-3" />
              <span>Desmos Calculator</span>
            </button>
          </div>

          {/* Bluebook Container Replica */}
          <div className="p-6 rounded-3xl bg-[#0A0F1D] text-white border border-white/10 shadow-xl space-y-5">
            {/* Bluebook Header Replica */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 font-bold">Section: {editForm.section}</span>
              </div>
              <span className="text-[#D4AF37] font-bold">#{editForm.id}</span>
            </div>

            {/* Reading Passage if applicable */}
            {editForm.passage && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 font-serif leading-relaxed max-h-48 overflow-y-auto">
                {editForm.passage}
              </div>
            )}

            {/* Stem */}
            <div className="text-sm font-sans font-medium text-slate-100 leading-relaxed">
              {editForm.stem}
            </div>

            {/* Multiple Choices */}
            <div className="space-y-2.5">
              {editForm.options?.map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                const isCorrect = editForm.correctAnswer === letter;
                return (
                  <div
                    key={letter}
                    className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs transition-all ${
                      isCorrect
                        ? 'bg-emerald-500/20 border-emerald-500 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isCorrect ? 'bg-emerald-500 text-black' : 'bg-white/10 text-slate-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="font-mono">{opt}</span>
                    {isCorrect && (
                      <span className="ml-auto text-[10px] font-mono text-emerald-400 uppercase">Correct Key</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explanation Preview */}
            {editForm.explanation && (
              <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-xs text-[#D4AF37] space-y-1">
                <div className="font-mono font-bold text-[10px] uppercase">Official Explanation:</div>
                <div className="text-slate-200">{editForm.explanation}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
