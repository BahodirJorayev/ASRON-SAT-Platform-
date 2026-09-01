import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Layers,
  Sparkles,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Lock,
  Flame,
  Check,
  X,
  Play,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  BarChart3,
  FileText,
  AlertCircle
} from 'lucide-react';
import { MockTest, MockTestQuestion, Question, MockTestCategory, MockModuleType, Difficulty } from '../types';

interface AdminMockManagerProps {
  mockTests: MockTest[];
  questions: Question[];
  onAddMockTest?: (newTest: MockTest) => void;
  onUpdateMockTest?: (updatedTest: MockTest) => void;
  onDeleteMockTest?: (testId: string) => void;
  onPreviewMockTest?: (test: MockTest) => void;
}

export const AdminMockManager: React.FC<AdminMockManagerProps> = ({
  mockTests,
  questions,
  onAddMockTest,
  onUpdateMockTest,
  onDeleteMockTest,
  onPreviewMockTest,
}) => {
  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | MockTestCategory>('ALL');

  // Modal / Drawer State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: 'OFFICIAL_MOCK' | 'PAST_EXAM' | 'SECTIONAL_PRACTICE' | 'PREDICTION_TEST';
    isPublished: boolean;
    isProOnly: boolean;
    totalTimeMinutes: number;
    tags: string;
    assignedQuestions: MockTestQuestion[];
  }>({
    title: '',
    description: '',
    category: 'OFFICIAL_MOCK',
    isPublished: true,
    isProOnly: false,
    totalTimeMinutes: 134,
    tags: 'Official Bluebook, MST Adaptive, Full Length',
    assignedQuestions: [],
  });

  // Active module tab in the question assignor drawer
  const [activeModuleTab, setActiveModuleTab] = useState<MockModuleType>('RW_M1');
  const [assignorSearch, setAssignorSearch] = useState('');
  const [assignorDomainFilter, setAssignorDomainFilter] = useState('ALL');

  // Summary Metrics
  const totalTests = mockTests.length;
  const publishedTests = mockTests.filter((t) => t.isPublished).length;
  const proTests = mockTests.filter((t) => t.isProOnly).length;
  const totalAttempts = mockTests.reduce((acc, t) => acc + (t.attemptsCount || 0), 0);
  const avgOverallScore =
    totalTests > 0
      ? Math.round(
          mockTests.reduce((acc, t) => acc + (t.averageScore || 1320), 0) / totalTests
        )
      : 1320;

  // Filtered mock tests
  const filteredTests = useMemo(() => {
    return mockTests.filter((test) => {
      if (categoryFilter !== 'ALL' && test.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = test.title.toLowerCase().includes(q);
        const matchDesc = test.description?.toLowerCase().includes(q);
        const matchTags = test.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [mockTests, categoryFilter, searchQuery]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingTest(null);
    setFormData({
      title: '',
      description: 'Official 2-Stage Multistage Adaptive Simulation replicating exact College Board blueprints.',
      category: 'OFFICIAL_MOCK',
      isPublished: true,
      isProOnly: false,
      totalTimeMinutes: 134,
      tags: 'Official Blueprint, MST Adaptive, 2026 Edition',
      assignedQuestions: [],
    });
    setIsTestModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (test: MockTest) => {
    setEditingTest(test);
    setFormData({
      title: test.title,
      description: test.description || '',
      category: test.category || 'OFFICIAL_MOCK',
      isPublished: test.isPublished,
      isProOnly: test.isProOnly,
      totalTimeMinutes: test.totalTimeMinutes || 134,
      tags: test.tags ? test.tags.join(', ') : 'Official Blueprint, MST Adaptive',
      assignedQuestions: test.questions || [],
    });
    setIsTestModalOpen(true);
  };

  // Auto-Fill algorithm from Question Bank
  const handleAutoFillModule = (moduleType: MockModuleType) => {
    const isRW = moduleType.startsWith('RW');
    const targetSection = isRW ? 'READING_AND_WRITING' : 'MATH';
    const targetCount = isRW ? 27 : 22;

    const availablePool = questions.filter((q) => q.section === targetSection);
    if (availablePool.length === 0) return;

    // Filter by difficulty if Stage 2 Easy vs Hard
    let filteredPool = availablePool;
    if (moduleType.includes('EASY')) {
      filteredPool = availablePool.filter((q) => q.difficulty === 'EASY' || q.difficulty === 'MEDIUM');
    } else if (moduleType.includes('HARD')) {
      filteredPool = availablePool.filter((q) => q.difficulty === 'HARD' || q.difficulty === 'MEDIUM');
    }

    if (filteredPool.length === 0) filteredPool = availablePool;

    // Pick target count items
    const selectedSlice = filteredPool.slice(0, targetCount);
    const newModuleQs: MockTestQuestion[] = selectedSlice.map((q, idx) => ({
      id: `mq-${moduleType}-${Date.now()}-${idx}`,
      mockTestId: editingTest?.id || 'new-mock',
      questionId: q.id,
      question: q,
      moduleType,
      moduleNumber: moduleType.includes('M1') ? 1 : 2,
      section: targetSection,
      difficultyTier: q.difficulty,
      orderIndex: idx + 1,
    }));

    // Replace questions of this moduleType in form data
    setFormData((prev) => ({
      ...prev,
      assignedQuestions: [
        ...prev.assignedQuestions.filter((mq) => mq.moduleType !== moduleType),
        ...newModuleQs,
      ],
    }));
  };

  // Full Test Auto-Fill (all 4 modules at once)
  const handleAutoFillEntireTest = () => {
    const modules: MockModuleType[] = ['RW_M1', 'RW_M2_EASY', 'RW_M2_HARD', 'MATH_M1', 'MATH_M2_EASY', 'MATH_M2_HARD'];
    let allAssigned: MockTestQuestion[] = [];

    modules.forEach((mod) => {
      const isRW = mod.startsWith('RW');
      const targetSection = isRW ? 'READING_AND_WRITING' : 'MATH';
      const targetCount = isRW ? 27 : 22;

      const pool = questions.filter((q) => q.section === targetSection);
      let subPool = pool;
      if (mod.includes('EASY')) {
        subPool = pool.filter((q) => q.difficulty === 'EASY' || q.difficulty === 'MEDIUM');
      } else if (mod.includes('HARD')) {
        subPool = pool.filter((q) => q.difficulty === 'HARD' || q.difficulty === 'MEDIUM');
      }
      if (subPool.length === 0) subPool = pool;

      const chosen = subPool.slice(0, targetCount);
      const generated = chosen.map((q, idx) => ({
        id: `mq-${mod}-${Date.now()}-${idx}`,
        mockTestId: editingTest?.id || 'new-mock',
        questionId: q.id,
        question: q,
        moduleType: mod,
        moduleNumber: mod.includes('M1') ? 1 : 2,
        section: targetSection,
        difficultyTier: q.difficulty,
        orderIndex: idx + 1,
      }));

      allAssigned = [...allAssigned, ...generated];
    });

    setFormData((prev) => ({
      ...prev,
      assignedQuestions: allAssigned,
    }));
  };

  // Save Test Handler
  const handleSaveTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedTags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingTest) {
      const updated: MockTest = {
        ...editingTest,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        isPublished: formData.isPublished,
        isProOnly: formData.isProOnly,
        totalTimeMinutes: Number(formData.totalTimeMinutes) || 134,
        tags: parsedTags,
        questions: formData.assignedQuestions,
        updatedAt: new Date().toISOString(),
      };
      onUpdateMockTest?.(updated);
    } else {
      const newTest: MockTest = {
        id: `mock-custom-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        isPublished: formData.isPublished,
        isProOnly: formData.isProOnly,
        totalTimeMinutes: Number(formData.totalTimeMinutes) || 134,
        timeLimitSecs: (Number(formData.totalTimeMinutes) || 134) * 60,
        tags: parsedTags,
        questions: formData.assignedQuestions,
        attemptsCount: 0,
        averageScore: 1320,
        createdAt: new Date().toISOString(),
      };
      onAddMockTest?.(newTest);
    }

    setIsTestModalOpen(false);
  };

  // Toggle Publish Status
  const handleTogglePublish = (test: MockTest) => {
    const updated = { ...test, isPublished: !test.isPublished };
    onUpdateMockTest?.(updated);
  };

  return (
    <div className="space-y-6 font-sans text-[#1E1B18]">
      {/* 1. Header & Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
          <div className="text-2xl font-extrabold font-mono text-[#1E1B18]">{totalTests}</div>
          <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
            Total Mock Tests
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
          <div className="text-2xl font-extrabold font-mono text-[#2A9D8F]">{publishedTests}</div>
          <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
            Live &amp; Published
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
          <div className="text-2xl font-extrabold font-mono text-[#E07A5F]">{proTests}</div>
          <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
            PRO Pass Only
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs">
          <div className="text-2xl font-extrabold font-mono text-[#3D405B]">
            {totalAttempts.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase font-bold text-[#78716C] tracking-wider mt-0.5">
            Student Attempts
          </div>
        </div>
      </div>

      {/* 2. Action Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78716C]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mock tests..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] placeholder-[#78716C]/60 focus:outline-none focus:ring-1 focus:ring-[#E07A5F]"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] rounded-xl border border-[#E5E0D8] text-xs">
            {(['ALL', 'OFFICIAL_MOCK', 'PAST_EXAM', 'SECTIONAL_PRACTICE'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-[#1E1B18] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1E1B18]'
                }`}
              >
                {cat === 'ALL'
                  ? 'All'
                  : cat === 'OFFICIAL_MOCK'
                  ? 'Official Mocks'
                  : cat === 'PAST_EXAM'
                  ? 'Past Exams'
                  : 'Sectionals'}
              </button>
            ))}
          </div>
        </div>

        {/* Create Test CTA */}
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-extrabold shadow-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={14} />
          <span>Create New Mock Test</span>
        </button>
      </div>

      {/* 3. Mock Tests Table */}
      <div className="rounded-3xl bg-white border border-[#E5E0D8] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#1E1B18]">
            <thead className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[10px] uppercase font-bold text-[#78716C] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Test Title &amp; Category</th>
                <th className="py-3.5 px-4">Access Tier</th>
                <th className="py-3.5 px-4">Questions</th>
                <th className="py-3.5 px-4">Attempts &amp; Avg</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E0D8]">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#78716C]">
                    No mock tests match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    {/* Title & Category */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-[#1E1B18] truncate">{test.title}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FAF5F0] text-[#E07A5F] border border-[#FCD9CE]">
                          {test.category || 'OFFICIAL_MOCK'}
                        </span>
                        <span className="text-[10px] text-[#78716C]">
                          {test.totalTimeMinutes}m
                        </span>
                      </div>
                    </td>

                    {/* Access Tier */}
                    <td className="py-3.5 px-4">
                      {test.isProOnly ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF4F0] text-[#E07A5F] border border-[#FCD9CE] flex items-center gap-1 w-fit">
                          <Lock size={10} /> PRO PASS
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF8F5] text-[#2A9D8F] border border-[#BCE8DE] w-fit">
                          FREE
                        </span>
                      )}
                    </td>

                    {/* Questions Count */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[#3D405B]">
                        {test.questions?.length || 98} Qs
                      </span>
                    </td>

                    {/* Attempts & Avg */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-[#1E1B18]">
                        Avg: {test.averageScore || 1320}
                      </div>
                      <div className="text-[10px] text-[#78716C]">
                        {test.attemptsCount || 0} taken
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(test)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                          test.isPublished
                            ? 'bg-[#EBF8F5] text-[#2A9D8F] border-[#BCE8DE]'
                            : 'bg-[#FAF8F5] text-[#78716C] border-[#E5E0D8]'
                        }`}
                      >
                        {test.isPublished ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewMockTest?.(test)}
                          title="Preview Test in Bluebook Engine"
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EBE5DF] text-[#3D405B] transition-all cursor-pointer"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(test)}
                          title="Edit Mock Test & Assign Questions"
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EBE5DF] text-[#1E1B18] transition-all cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteMockTest?.(test.id)}
                          title="Delete Test"
                          className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-rose-50 text-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TEST BUILDER / QUESTION ASSIGNOR MODAL */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E5E0D8] rounded-3xl p-6 sm:p-8 max-w-4xl w-full space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0EBE4] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#E07A5F]">
                  Mock Test CMS Builder
                </span>
                <h3 className="text-lg font-bold text-[#1E1B18]">
                  {editingTest ? `Edit "${editingTest.title}"` : 'Create Full-Length Mock Test'}
                </h3>
              </div>
              <button
                onClick={() => setIsTestModalOpen(false)}
                className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1E1B18] hover:bg-[#FAF8F5] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTest} className="space-y-6">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1E1B18]">Test Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. October 2026 Official Prediction Mock #4"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1E1B18]">Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide overview of test rigor, question types, and target cohort..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E1B18]">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  >
                    <option value="OFFICIAL_MOCK">Official Bluebook Mock</option>
                    <option value="PAST_EXAM">Past Real Exam (2024-2026)</option>
                    <option value="SECTIONAL_PRACTICE">Sectional Practice (RW / Math)</option>
                    <option value="PREDICTION_TEST">Prediction Diagnostic Mock</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1E1B18]">Total Time (Minutes)</label>
                  <input
                    type="number"
                    value={formData.totalTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, totalTimeMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1E1B18]">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Official Blueprint, MST Adaptive, Desmos Graphing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E07A5F]"
                  />
                </div>

                <div className="flex items-center gap-6 sm:col-span-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#1E1B18] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                      className="rounded border-[#E5E0D8] text-[#E07A5F] focus:ring-0 cursor-pointer"
                    />
                    <span>Publish Immediately to Student Catalog</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-[#E07A5F] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isProOnly}
                      onChange={(e) => setFormData({ ...formData, isProOnly: e.target.checked })}
                      className="rounded border-[#E5E0D8] text-[#E07A5F] focus:ring-0 cursor-pointer"
                    />
                    <span>PRO Pass Only (Paywall Locked)</span>
                  </label>
                </div>
              </div>

              {/* 5. MODULE QUESTION ASSIGNOR */}
              <div className="space-y-4 pt-4 border-t border-[#F0EBE4]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] flex items-center gap-2">
                      <Layers size={14} className="text-[#E07A5F]" />
                      2-Stage MST Module Question Assignor
                    </h4>
                    <p className="text-[11px] text-[#78716C]">
                      Total Assigned: <strong>{formData.assignedQuestions.length} Questions</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoFillEntireTest}
                    className="px-4 py-2 rounded-xl bg-[#FAF5F0] hover:bg-[#FFF0EB] text-[#E07A5F] text-xs font-bold border border-[#FCD9CE] transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <Sparkles size={13} />
                    <span>Auto-Fill All 4 Modules from Bank</span>
                  </button>
                </div>

                {/* Module Selector Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'RW_M1', label: 'RW Mod 1 (Base)', target: 27 },
                    { id: 'RW_M2_EASY', label: 'RW Mod 2 (Easy)', target: 27 },
                    { id: 'RW_M2_HARD', label: 'RW Mod 2 (Hard)', target: 27 },
                    { id: 'MATH_M1', label: 'Math Mod 1 (Base)', target: 22 },
                    { id: 'MATH_M2_EASY', label: 'Math Mod 2 (Easy)', target: 22 },
                    { id: 'MATH_M2_HARD', label: 'Math Mod 2 (Hard)', target: 22 },
                  ].map((m) => {
                    const count = formData.assignedQuestions.filter((q) => q.moduleType === m.id).length;
                    const isCurrent = activeModuleTab === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveModuleTab(m.id as MockModuleType)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-[#1E1B18] text-white border-[#1E1B18]'
                            : 'bg-[#FAF8F5] text-[#78716C] border-[#E5E0D8] hover:border-[#78716C]'
                        }`}
                      >
                        <div className="text-[10px] font-bold leading-tight">{m.label}</div>
                        <div className="text-[10px] font-mono mt-0.5 opacity-90">
                          {count} / {m.target} Qs
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Active Module Question Panel */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1E1B18]">
                      Active Module: {activeModuleTab}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAutoFillModule(activeModuleTab)}
                      className="text-xs font-bold text-[#E07A5F] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles size={12} />
                      <span>Auto-Fill This Module ({activeModuleTab.startsWith('RW') ? 27 : 22} Qs)</span>
                    </button>
                  </div>

                  {/* List of currently assigned questions in this module */}
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {formData.assignedQuestions.filter((q) => q.moduleType === activeModuleTab).length === 0 ? (
                      <div className="p-4 text-center text-xs text-[#78716C] border border-dashed border-[#E5E0D8] rounded-xl">
                        No questions assigned to {activeModuleTab} yet. Click "Auto-Fill This Module" above.
                      </div>
                    ) : (
                      formData.assignedQuestions
                        .filter((q) => q.moduleType === activeModuleTab)
                        .map((mq, idx) => (
                          <div
                            key={mq.id}
                            className="p-2.5 rounded-xl bg-white border border-[#E5E0D8] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              <span className="font-mono font-bold text-[#78716C]">#{idx + 1}</span>
                              <span className="font-medium text-[#1E1B18] truncate">
                                {mq.question?.questionText || mq.questionId}
                              </span>
                              <span className="text-[10px] font-mono px-1 rounded bg-[#FAF8F5] text-[#3D405B]">
                                {mq.question?.skill || mq.difficultyTier}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  assignedQuestions: prev.assignedQuestions.filter((q) => q.id !== mq.id),
                                }));
                              }}
                              className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F0EBE4]">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#E5E0D8] hover:bg-[#FAF8F5] text-xs font-bold text-[#78716C] cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-[#1E1B18] hover:bg-[#3D405B] text-white text-xs font-extrabold shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  {editingTest ? 'Save Changes' : 'Create & Publish Mock Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
