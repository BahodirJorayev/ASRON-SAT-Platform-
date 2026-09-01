import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  Users,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Target,
  Edit3,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Download,
  Upload,
  BookOpen,
  Sparkles,
  Award,
  Filter,
  Eye,
  Sliders,
  Check,
  X,
  Send,
  Layers,
  ArrowRight,
  Shield
} from 'lucide-react';
import {
  User,
  MasterCurriculumDay,
  UserRoadmap,
  RoadmapTaskProgress,
  MockTest
} from '../types';
import {
  getMasterCurriculum,
  saveMasterCurriculum,
  resetMasterCurriculum,
  getUserRoadmap,
  saveUserRoadmap
} from '../data/masterCurriculumData';

interface Props {
  usersList: User[];
  mockTests?: MockTest[];
  onInspectUser?: (user: User) => void;
}

export const AdminRoadmapMonitor: React.FC<Props> = ({
  usersList,
  mockTests = [],
  onInspectUser,
}) => {
  // Main Tab in Monitor
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'CURRICULUM_BUILDER'>('STUDENTS');

  // Student Adherence Search & Filter
  const [searchStudent, setSearchStudent] = useState('');
  const [filterTier, setFilterTier] = useState<string>('ALL');
  const [filterAdherence, setFilterAdherence] = useState<string>('ALL');

  // Selected Student for Intervention
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [studentRoadmap, setStudentRoadmap] = useState<UserRoadmap | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  // Intervention Form State
  const [customTaskDay, setCustomTaskDay] = useState(1);
  const [customTaskTitle, setCustomTaskTitle] = useState('');
  const [customTaskDesc, setCustomTaskDesc] = useState('');
  const [customTaskType, setCustomTaskType] = useState<'CUSTOM' | 'PRACTICE_SET' | 'FULL_MOCK'>('CUSTOM');
  const [overrideCurrentDay, setOverrideCurrentDay] = useState(1);
  const [assignedMockId, setAssignedMockId] = useState('');
  const [interventionFeedback, setInterventionFeedback] = useState<string | null>(null);

  // Curriculum Builder State
  const [curriculumDays, setCurriculumDays] = useState<MasterCurriculumDay[]>(() => getMasterCurriculum());
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [curriculumSuccessMsg, setCurriculumSuccessMsg] = useState<string | null>(null);

  // Get current editing day
  const currentEditingDay = useMemo(() => {
    return curriculumDays.find((d) => d.dayNumber === selectedDayNumber) || curriculumDays[0];
  }, [curriculumDays, selectedDayNumber]);

  // Load student roadmap when student is clicked
  const handleOpenIntervention = (u: User) => {
    const rm = getUserRoadmap(u);
    setSelectedStudent(u);
    setStudentRoadmap(rm);
    setOverrideCurrentDay(rm.currentDay || 1);
    setCustomTaskDay(rm.currentDay || 1);
    setInterventionFeedback(null);
    setIsInterventionModalOpen(true);
  };

  // Add custom task to student
  const handleInjectCustomTask = () => {
    if (!studentRoadmap || !customTaskTitle.trim()) return;

    const newTask: RoadmapTaskProgress = {
      id: `custom-task-${Date.now()}`,
      roadmapId: studentRoadmap.id,
      dayNumber: customTaskDay,
      taskType: customTaskType,
      title: customTaskTitle.trim(),
      description: customTaskDesc.trim() || undefined,
      isCompleted: false,
    };

    const updatedTasks = [...studentRoadmap.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
    const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedRoadmap: UserRoadmap = {
      ...studentRoadmap,
      tasks: updatedTasks,
      completionRate,
      updatedAt: new Date().toISOString(),
    };

    setStudentRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
    setCustomTaskTitle('');
    setCustomTaskDesc('');
    setInterventionFeedback(`Successfully injected task for Day ${customTaskDay}!`);
    setTimeout(() => setInterventionFeedback(null), 3000);
  };

  // Adjust student current day
  const handleSaveDayOverride = () => {
    if (!studentRoadmap) return;
    const updatedRoadmap: UserRoadmap = {
      ...studentRoadmap,
      currentDay: overrideCurrentDay,
      updatedAt: new Date().toISOString(),
    };
    setStudentRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
    setInterventionFeedback(`Student current roadmap pointer updated to Day ${overrideCurrentDay}.`);
    setTimeout(() => setInterventionFeedback(null), 3000);
  };

  // Assign Mock Test to Day
  const handleAssignMockTest = () => {
    if (!studentRoadmap || !assignedMockId) return;
    const mock = mockTests.find((m) => m.id === assignedMockId);
    const mockName = mock ? mock.title : 'Adaptive Mock Test';

    const newTask: RoadmapTaskProgress = {
      id: `assigned-mock-${Date.now()}`,
      roadmapId: studentRoadmap.id,
      dayNumber: customTaskDay,
      taskType: 'FULL_MOCK',
      title: `Assigned Mock: ${mockName}`,
      description: 'Mandatory Bluebook adaptive assessment assigned by SAT Instructor.',
      targetUrl: assignedMockId,
      isCompleted: false,
    };

    const updatedTasks = [...studentRoadmap.tasks, newTask];
    const completedCount = updatedTasks.filter((t) => t.isCompleted).length;
    const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

    const updatedRoadmap: UserRoadmap = {
      ...studentRoadmap,
      tasks: updatedTasks,
      completionRate,
      updatedAt: new Date().toISOString(),
    };

    setStudentRoadmap(updatedRoadmap);
    saveUserRoadmap(updatedRoadmap);
    setInterventionFeedback(`Assigned "${mockName}" to Day ${customTaskDay}.`);
    setTimeout(() => setInterventionFeedback(null), 3000);
  };

  // Update Curriculum Day field
  const handleUpdateCurriculumField = (field: keyof MasterCurriculumDay, value: any) => {
    setCurriculumDays((prev) =>
      prev.map((d) => (d.dayNumber === selectedDayNumber ? { ...d, [field]: value } : d))
    );
  };

  // Save Master Curriculum to localStorage
  const handleSaveMasterCurriculum = () => {
    saveMasterCurriculum(curriculumDays);
    setCurriculumSuccessMsg('Master 30-Day Syllabus saved successfully!');
    setTimeout(() => setCurriculumSuccessMsg(null), 3000);
  };

  // Reset Master Curriculum
  const handleResetMasterCurriculum = () => {
    if (window.confirm('Reset all 30 days of the master curriculum to platform defaults?')) {
      const reset = resetMasterCurriculum();
      setCurriculumDays(reset);
      setCurriculumSuccessMsg('Curriculum reset to default master syllabus.');
      setTimeout(() => setCurriculumSuccessMsg(null), 3000);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(curriculumDays, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `oneprep_master_curriculum_30days_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return usersList.map((u) => {
      const rm = getUserRoadmap(u);
      return {
        user: u,
        roadmap: rm,
      };
    }).filter(({ user, roadmap }) => {
      if (searchStudent.trim()) {
        const q = searchStudent.toLowerCase();
        const matchName = user.fullName.toLowerCase().includes(q);
        const matchUser = user.username.toLowerCase().includes(q);
        const matchEmail = user.email.toLowerCase().includes(q);
        if (!matchName && !matchUser && !matchEmail) return false;
      }

      if (filterTier !== 'ALL' && user.planTier !== filterTier) {
        return false;
      }

      if (filterAdherence === 'HIGH' && roadmap.completionRate < 70) return false;
      if (filterAdherence === 'MEDIUM' && (roadmap.completionRate < 30 || roadmap.completionRate >= 70)) return false;
      if (filterAdherence === 'AT_RISK' && roadmap.completionRate >= 30) return false;

      return true;
    });
  }, [usersList, searchStudent, filterTier, filterAdherence]);

  return (
    <div className="space-y-8 font-sans text-[#1E1B18]">
      {/* Top Header & Tab Selector */}
      <div className="p-6 rounded-3xl bg-white border border-[#E5E0D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#3D405B] text-white">
              <Compass className="w-5 h-5 text-[#E9C46A]" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#1E1B18]">Roadmap CMS & Student Monitor</h2>
              <p className="text-xs text-[#8C827A]">
                Monitor real-time student adherence, inject custom interventions, and customize the 30-day master syllabus.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 p-1 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8]">
          <button
            type="button"
            onClick={() => setActiveTab('STUDENTS')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'STUDENTS'
                ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                : 'text-[#6B645C] hover:text-[#1E1B18]'
            }`}
          >
            <Users className="w-4 h-4 text-[#3D405B]" />
            <span>Student Adherence ({usersList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('CURRICULUM_BUILDER')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'CURRICULUM_BUILDER'
                ? 'bg-white text-[#1E1B18] shadow-xs border border-[#E5E0D8]'
                : 'text-[#6B645C] hover:text-[#1E1B18]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#E07A5F]" />
            <span>Master Syllabus Builder (30 Days)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STUDENT ADHERENCE TABLE & INTERVENTION */}
      {/* ========================================================================= */}
      {activeTab === 'STUDENTS' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student by name, @username, email..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E07A5F]"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#3D405B] focus:outline-none"
              >
                <option value="ALL">All Tiers</option>
                <option value="FREE">Free</option>
                <option value="STANDARD">Standard</option>
                <option value="PRO">Pro Tier</option>
                <option value="VIP">VIP Mentor Tier</option>
              </select>

              <select
                value={filterAdherence}
                onChange={(e) => setFilterAdherence(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] text-xs font-medium text-[#3D405B] focus:outline-none"
              >
                <option value="ALL">All Adherence</option>
                <option value="HIGH">High (&gt; 70%)</option>
                <option value="MEDIUM">Moderate (30–70%)</option>
                <option value="AT_RISK">At Risk (&lt; 30%)</option>
              </select>
            </div>
          </div>

          {/* Table of Students */}
          <div className="bg-white rounded-3xl border border-[#E5E0D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E5E0D8] text-[#8C827A] font-semibold">
                    <th className="py-3.5 px-4 sm:px-6">Student</th>
                    <th className="py-3.5 px-4">Tier</th>
                    <th className="py-3.5 px-4">Current Day</th>
                    <th className="py-3.5 px-4">Completion Rate</th>
                    <th className="py-3.5 px-4">Streak</th>
                    <th className="py-3.5 px-4">Target Score</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E0D8]/60">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8C827A]">
                        No students found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(({ user: u, roadmap: rm }) => {
                      let statusBadge = {
                        label: 'On Track',
                        bg: 'bg-[#2A9D8F]/10 text-[#2A9D8F] border-[#2A9D8F]/30',
                      };
                      if (rm.completionRate < 30) {
                        statusBadge = {
                          label: 'At Risk',
                          bg: 'bg-[#E9C46A]/20 text-[#B48421] border-[#E9C46A]/50',
                        };
                      }

                      return (
                        <tr key={u.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                          <td className="py-3.5 px-4 sm:px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center font-bold text-xs text-[#3D405B]">
                                {u.fullName.slice(0, 1).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-[#1E1B18]">{u.fullName}</div>
                                <div className="text-xs text-[#8C827A]">@{u.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#3D405B] border border-[#E5E0D8]">
                              {u.planTier}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#1E1B18]">
                            Day {rm.currentDay} <span className="text-xs font-normal text-[#8C827A]">/ 30</span>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1 w-32">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-[#1E1B18]">{rm.completionRate}%</span>
                                <span
                                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${statusBadge.bg}`}
                                >
                                  {statusBadge.label}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E0D8]">
                                <div
                                  className={`h-full ${
                                    rm.completionRate >= 70
                                      ? 'bg-[#2A9D8F]'
                                      : rm.completionRate >= 30
                                      ? 'bg-[#E9C46A]'
                                      : 'bg-[#E07A5F]'
                                  }`}
                                  style={{ width: `${rm.completionRate}%` }}
                                />
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 font-semibold text-[#1E1B18]">
                              <Flame className="w-3.5 h-3.5 text-[#E9C46A]" />
                              {rm.streakDays}d
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#E07A5F]">
                            {rm.targetScore}+
                          </td>

                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <button
                              type="button"
                              onClick={() => handleOpenIntervention(u)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#FAF8F5] hover:bg-[#E5E0D8]/60 text-[#3D405B] border border-[#E5E0D8] transition-colors"
                            >
                              Manage & Intervene
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEFAULT CURRICULUM TEMPLATE BUILDER (DAY 1 TO 30) */}
      {/* ========================================================================= */}
      {activeTab === 'CURRICULUM_BUILDER' && (
        <div className="space-y-6">
          {curriculumSuccessMsg && (
            <div className="p-4 rounded-2xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-[#2A9D8F] text-xs sm:text-sm font-semibold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{curriculumSuccessMsg}</span>
              </div>
            </div>
          )}

          {/* Builder Top Action Bar */}
          <div className="p-4 bg-white rounded-2xl border border-[#E5E0D8] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#1E1B18]">30-Day Master Syllabus Editor</h3>
              <p className="text-xs text-[#8C827A]">
                Edit default tasks, markdown rule summaries, and practice question counts.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetMasterCurriculum}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#8C827A] hover:text-[#1E1B18] border border-[#E5E0D8] bg-[#FAF8F5] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>

              <button
                type="button"
                onClick={handleExportJSON}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#3D405B] border border-[#E5E0D8] bg-[#FAF8F5] flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleSaveMasterCurriculum}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-[#2A9D8F] text-white hover:bg-[#248277] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Syllabus</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 30-Day Navigation Strip */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-[#E5E0D8] p-4 space-y-4 max-h-[700px] overflow-y-auto">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                Select Day (1–30)
              </h4>

              <div className="space-y-1.5">
                {curriculumDays.map((day) => {
                  const isSelected = day.dayNumber === selectedDayNumber;
                  return (
                    <button
                      key={day.dayNumber}
                      type="button"
                      onClick={() => setSelectedDayNumber(day.dayNumber)}
                      className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#FAF8F5] border-[#E07A5F] ring-1 ring-[#E07A5F]/20 text-[#1E1B18]'
                          : 'bg-white border-[#E5E0D8] text-[#6B645C] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-[#1E1B18]">Day {day.dayNumber}</span>
                          <span className="text-[#8C827A]">• W{day.weekNumber}</span>
                          {day.isMockDay && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3D405B] text-white font-semibold">
                              Mock
                            </span>
                          )}
                        </div>
                        <div className="truncate font-medium mt-0.5 text-[#3D405B]">
                          {day.title}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#2A9D8F] shrink-0">
                        {day.targetScoreGain}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Day Editor Form */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E5E0D8] p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E07A5F]">
                    Week {currentEditingDay.weekNumber} • Day {currentEditingDay.dayNumber}
                  </span>
                  <h3 className="text-lg font-bold text-[#1E1B18] mt-0.5">
                    {currentEditingDay.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3D405B] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentEditingDay.isMockDay}
                      onChange={(e) => handleUpdateCurriculumField('isMockDay', e.target.checked)}
                      className="rounded text-[#E07A5F] focus:ring-0"
                    />
                    <span>Full Mock Day</span>
                  </label>
                </div>
              </div>

              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E1B18] block">Day Title</label>
                  <input
                    type="text"
                    value={currentEditingDay.title}
                    onChange={(e) => handleUpdateCurriculumField('title', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E1B18] block">Domain Focus</label>
                  <input
                    type="text"
                    value={currentEditingDay.domainFocus}
                    onChange={(e) => handleUpdateCurriculumField('domainFocus', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#1E1B18] block">Target Score Gain</label>
                  <input
                    type="text"
                    value={currentEditingDay.targetScoreGain}
                    onChange={(e) => handleUpdateCurriculumField('targetScoreGain', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                  />
                </div>

                {currentEditingDay.isMockDay && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#1E1B18] block">Mock Test Name</label>
                    <input
                      type="text"
                      value={currentEditingDay.mockTestName || ''}
                      onChange={(e) => handleUpdateCurriculumField('mockTestName', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs sm:text-sm text-[#1E1B18] bg-[#FAF8F5] focus:outline-none focus:border-[#E07A5F]"
                      placeholder="e.g. Official Bluebook Test #1"
                    />
                  </div>
                )}
              </div>

              {/* Task 1: Concept */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E07A5F] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Task 1: Skill Concept & Theory
                </span>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={currentEditingDay.conceptTitle}
                    onChange={(e) => handleUpdateCurriculumField('conceptTitle', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#1E1B18] bg-white focus:outline-none"
                    placeholder="Concept Title..."
                  />

                  <textarea
                    rows={2}
                    value={currentEditingDay.conceptSummary}
                    onChange={(e) => handleUpdateCurriculumField('conceptSummary', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#3D405B] bg-white focus:outline-none"
                    placeholder="Short concept summary snippet..."
                  />

                  <div>
                    <label className="text-[11px] font-semibold text-[#8C827A] block mb-1">
                      Detailed Theory Markdown / Formula Notes
                    </label>
                    <textarea
                      rows={4}
                      value={currentEditingDay.conceptMarkdown || ''}
                      onChange={(e) => handleUpdateCurriculumField('conceptMarkdown', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-mono text-[#3D405B] bg-white focus:outline-none"
                      placeholder="Markdown notes, LaTeX equations ($\Delta = b^2 - 4ac$), and rules..."
                    />
                  </div>
                </div>
              </div>

              {/* Task 2: Targeted Practice */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#3D405B] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Task 2: Targeted Practice Drill
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={currentEditingDay.practiceTitle}
                      onChange={(e) => handleUpdateCurriculumField('practiceTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#1E1B18] bg-white focus:outline-none"
                      placeholder="Practice Title..."
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={currentEditingDay.practiceQuestionCount}
                      onChange={(e) =>
                        handleUpdateCurriculumField('practiceQuestionCount', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#1E1B18] bg-white focus:outline-none"
                      placeholder="Question Count"
                    />
                  </div>
                </div>
              </div>

              {/* Task 3: Vocabulary */}
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2A9D8F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Task 3: Vocabulary 400
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={currentEditingDay.vocabTitle}
                      onChange={(e) => handleUpdateCurriculumField('vocabTitle', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold text-[#1E1B18] bg-white focus:outline-none"
                      placeholder="Vocab Deck Title..."
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={currentEditingDay.vocabWordCount}
                      onChange={(e) =>
                        handleUpdateCurriculumField('vocabWordCount', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#1E1B18] bg-white focus:outline-none"
                      placeholder="Word Count"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSaveMasterCurriculum}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#E07A5F] text-white hover:bg-[#D0694E] shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Master Syllabus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANUAL STUDENT INTERVENTION DRAWER */}
      {/* ========================================================================= */}
      {isInterventionModalOpen && selectedStudent && studentRoadmap && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 border border-[#E5E0D8] shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#3D405B] text-white">
                  <Shield className="w-5 h-5 text-[#E9C46A]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1B18]">
                    Tutor Intervention: {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-[#8C827A]">
                    @{selectedStudent.username} • {selectedStudent.planTier} • Current: Day {studentRoadmap.currentDay}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsInterventionModalOpen(false)}
                className="text-[#8C827A] hover:text-[#1E1B18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {interventionFeedback && (
              <div className="p-3 rounded-xl bg-[#2A9D8F]/10 border border-[#2A9D8F]/30 text-[#2A9D8F] text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{interventionFeedback}</span>
              </div>
            )}

            {/* 1. Quick Current Day Override */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
              <span className="text-xs font-bold text-[#1E1B18] block">
                Adjust Roadmap Current Day Pointer
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={overrideCurrentDay}
                  onChange={(e) => setOverrideCurrentDay(parseInt(e.target.value) || 1)}
                  className="w-24 px-3 py-1.5 rounded-xl border border-[#E5E0D8] text-xs font-bold bg-white text-[#1E1B18]"
                />
                <button
                  type="button"
                  onClick={handleSaveDayOverride}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#3D405B] text-white hover:bg-[#2F3146] transition-colors"
                >
                  Set Pointer
                </button>
              </div>
            </div>

            {/* 2. Assign Specific Mock Test */}
            {mockTests.length > 0 && (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
                <span className="text-xs font-bold text-[#1E1B18] block">
                  Assign Full Mock Test to Student
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <select
                      value={assignedMockId}
                      onChange={(e) => setAssignedMockId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#3D405B] bg-white focus:outline-none"
                    >
                      <option value="">Select a Mock Exam...</option>
                      {mockTests.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    disabled={!assignedMockId}
                    onClick={handleAssignMockTest}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#E07A5F] text-white hover:bg-[#D0694E] disabled:opacity-50 transition-colors"
                  >
                    Assign Mock
                  </button>
                </div>
              </div>
            )}

            {/* 3. Inject Custom Task */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E5E0D8] space-y-3">
              <span className="text-xs font-bold text-[#1E1B18] block">
                Inject Custom Homework or Review Task
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-[#8C827A] block mb-1">Target Day (1–30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={customTaskDay}
                    onChange={(e) => setCustomTaskDay(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5E0D8] text-xs bg-white text-[#1E1B18]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-[#8C827A] block mb-1">Task Category</label>
                  <select
                    value={customTaskType}
                    onChange={(e) => setCustomTaskType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5E0D8] text-xs bg-white text-[#3D405B]"
                  >
                    <option value="CUSTOM">Custom Homework</option>
                    <option value="PRACTICE_SET">Question Drill</option>
                    <option value="FULL_MOCK">Mock Review</option>
                  </select>
                </div>
              </div>

              <input
                type="text"
                value={customTaskTitle}
                onChange={(e) => setCustomTaskTitle(e.target.value)}
                placeholder="Task Title (e.g. Review 5 Quadrilateral Grid-Ins)"
                className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs font-semibold bg-white text-[#1E1B18]"
              />

              <textarea
                rows={2}
                value={customTaskDesc}
                onChange={(e) => setCustomTaskDesc(e.target.value)}
                placeholder="Optional instructions for the student..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs bg-white text-[#3D405B]"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={!customTaskTitle.trim()}
                  onClick={handleInjectCustomTask}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2A9D8F] text-white hover:bg-[#248277] disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inject Task into Day {customTaskDay}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E0D8]">
              <button
                type="button"
                onClick={() => setIsInterventionModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B645C] hover:bg-[#FAF8F5] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
