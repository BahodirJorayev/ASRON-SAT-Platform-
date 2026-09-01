import React, { useState } from 'react';
import {
  ShieldAlert, LayoutDashboard, Users, CreditCard,
  Globe, Terminal, Sparkles, Settings, BookOpen,
  MapPin, MessageSquare, Radio, ExternalLink, ArrowRight,
  ShieldCheck, Eye, RefreshCw, Layers, Calculator
} from 'lucide-react';
import { User, PaymentReceipt, PlanTier, Question, MockTest, PricingPlanConfig, GlobalPlatformSettings, DesmosSatHack } from '../types';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminUsersManager } from './AdminUsersManager';
import { AdminPlansEditor, INITIAL_DEFAULT_PLANS } from './AdminPlansEditor';
import { AdminLandingCMS } from './AdminLandingCMS';
import { AdminQuestionFixer } from './AdminQuestionFixer';
import { AdminPDFIngestion } from './AdminPDFIngestion';
import { AdminGlobalSettings } from './AdminGlobalSettings';
import { AdminMockManager } from './AdminMockManager';
import { AdminChatManager } from './AdminChatManager';
import { AdminRoadmapMonitor } from './AdminRoadmapMonitor';
import { AdminDesmosCMS } from './AdminDesmosCMS';
import { INITIAL_SAT_DESMOS_HACKS } from '../data/desmosHacksData';
import { SiteBrandingConfig, AdminCredentials, BlogArticle, UserTestimonial } from '../data/blogAndBrandingData';

interface AdminPanelViewProps {
  currentUser: User;
  usersList: User[];
  receipts: PaymentReceipt[];
  questions?: Question[];
  mockTests?: MockTest[];
  blogArticles?: BlogArticle[];
  testimonials?: UserTestimonial[];
  pricingPlans?: PricingPlanConfig[];
  globalSettings?: GlobalPlatformSettings;
  desmosHacks?: DesmosSatHack[];
  siteBranding?: SiteBrandingConfig;
  adminCredentials?: AdminCredentials;
  onUpdateSiteBranding?: (updated: Partial<SiteBrandingConfig>) => void;
  onUpdateAdminCredentials?: (updated: AdminCredentials) => void;
  onSavePricingPlans?: (plans: PricingPlanConfig[]) => void;
  onSaveGlobalSettings?: (settings: GlobalPlatformSettings) => void;
  onSaveDesmosHacks?: (hacks: DesmosSatHack[]) => void;
  onSaveTestimonials?: (testimonials: UserTestimonial[]) => void;
  onApproveReceipt: (receiptId: string, planTier?: PlanTier) => void;
  onRejectReceipt: (receiptId: string) => void;
  onAddReceipt?: (receipt: PaymentReceipt) => void;
  onDeleteReceipt?: (receiptId: string) => void;
  onUpdateUserPlan: (userId: string, planTier: PlanTier, daysToAdd: number) => void;
  onAddUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onAddQuestion?: (question: Question) => void;
  onUpdateQuestion?: (question: Question) => void;
  onDeleteQuestion?: (questionId: string) => void;
  onIngestQuestions?: (questions: Question[], mockTitle?: string) => void;
  onAddMockTest?: (test: MockTest) => void;
  onUpdateMockTest?: (test: MockTest) => void;
  onDeleteMockTest?: (testId: string) => void;
  onPreviewMockTest?: (test: MockTest) => void;
  onNavigateToStudentView?: () => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  usersList,
  receipts,
  questions = [],
  mockTests = [],
  blogArticles = [],
  testimonials = [],
  pricingPlans = INITIAL_DEFAULT_PLANS,
  globalSettings = {
    platformName: 'ASRON SAT',
    platformTagline: 'Digital SAT Intelligence Platform',
    contactTelegram: '@rcmnx',
    contactEmail: 'support@asronsat.uz',
    contactInstagram: 'https://instagram.com/asronsat',
    landingHeroTitle: 'The Ivy League Digital SAT Intelligence Platform',
    landingHeroSubtitle: 'Master the 1550+ score threshold with authentic Bluebook MST engine, 20-second Desmos shortcuts, and 3-stage Leitner spaced error eradication.',
    landingHeroCtaText: 'Unlock 1550+ Elite Workspace',
    announcementEnabled: true,
    announcementText: '🔥 Fall 2026 Digital SAT Testing Cohort is LIVE. Early Scholar Passes Active.',
    isMaintenance: false,
    arenaEnabled: true,
    liveStreamEnabled: true,
    desmosEnabled: true,
    updatedAt: new Date().toISOString(),
  },
  desmosHacks = INITIAL_SAT_DESMOS_HACKS,
  siteBranding,
  adminCredentials,
  onUpdateSiteBranding,
  onUpdateAdminCredentials,
  onSavePricingPlans,
  onSaveGlobalSettings,
  onSaveDesmosHacks,
  onSaveTestimonials,
  onApproveReceipt,
  onRejectReceipt,
  onAddReceipt,
  onDeleteReceipt,
  onUpdateUserPlan,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  onIngestQuestions,
  onAddMockTest,
  onUpdateMockTest,
  onDeleteMockTest,
  onPreviewMockTest,
  onNavigateToStudentView,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<string>('dashboard');

  const adminTabs = [
    { id: 'dashboard', label: 'Executive Pulse', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: 'Scholars & Billing', icon: <Users className="w-4 h-4" />, count: usersList.length },
    { id: 'plans', label: 'Dynamic Pricing CMS', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'landing', label: 'Landing & Copy CMS', icon: <Globe className="w-4 h-4" /> },
    { id: 'desmos', label: 'Desmos & SAT Hacks', icon: <Calculator className="w-4 h-4 text-[#D4AF37]" />, count: desmosHacks.length },
    { id: 'questions', label: 'Question Hot-Fixer', icon: <Terminal className="w-4 h-4" />, count: questions.length },
    { id: 'ingestion', label: 'PDF & Vocab Ingestion', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'mocks', label: 'Mock Tests Manager', icon: <BookOpen className="w-4 h-4" />, count: mockTests.length },
    { id: 'roadmaps', label: 'Roadmap Telemetry', icon: <MapPin className="w-4 h-4" /> },
    { id: 'community', label: 'Chat Moderation', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: 'Brand & Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const currentTabInfo = adminTabs.find((t) => t.id === activeAdminTab) || adminTabs[0];

  return (
    <div id="admin-panel-view" className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)] bg-[#FAF8F5] dark:bg-[#0A0F1D] text-[#1E1B18] dark:text-[#EAEBED] rounded-2xl overflow-hidden border border-[#E5E0D8] dark:border-[#1E293B] shadow-sm">
      {/* LEFT ADMIN SIDEBAR PANEL */}
      <aside className="w-full lg:w-64 bg-white dark:bg-[#0F1424] border-b lg:border-b-0 lg:border-r border-[#E5E0D8] dark:border-[#1E293B] flex flex-col justify-between shrink-0 p-4 space-y-4">
        {/* Admin Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0B1B3D] text-white shadow-xs">
            <div className="p-1.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-extrabold tracking-wider text-[#D4AF37] uppercase truncate">
                {globalSettings.platformName || 'ASRON SAT'}
              </div>
              <div className="text-[11px] text-slate-300 font-mono truncate">Admin Control Panel</div>
            </div>
          </div>

          <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-500" />
              <span>Realtime Live</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">SUPER_ADMIN</span>
          </div>
        </div>

        {/* Admin Module Navigation List */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          <div className="px-2 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#A8A29E] dark:text-[#64748B]">
            Boshqaruv Bo'limlari
          </div>
          {adminTabs.map((tab) => {
            const isActive = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`admin-sidebar-nav-${tab.id}`}
                onClick={() => setActiveAdminTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono font-bold transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1B3D] text-white dark:bg-white dark:text-[#0B1B3D] shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#182035] hover:text-[#0B1B3D] dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {tab.icon}
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-[#0B1B3D]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Action: Return to Student View */}
        <div className="pt-2 border-t border-[#E5E0D8] dark:border-[#1E293B]">
          {onNavigateToStudentView && (
            <button
              id="btn-switch-to-student-view"
              onClick={onNavigateToStudentView}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#0B1B3D] dark:text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Student View ga o'tish</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN RIGHT CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-6 overflow-y-auto min-w-0 space-y-6">
        {/* Active Module Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E5E0D8] dark:border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0B1B3D] text-white flex items-center justify-center shadow-xs">
              {currentTabInfo.icon}
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] tracking-tight flex items-center gap-2">
                <span>{currentTabInfo.label}</span>
                {currentTabInfo.count !== undefined && (
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                    {currentTabInfo.count} ta
                  </span>
                )}
              </h1>
              <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
                Boshqaruv Paneli • Barcha Ma'lumotlar Jonli Boshqariladi
              </p>
            </div>
          </div>
        </div>

        {/* Active Module View Component */}
        <div className="transition-opacity duration-200">
          {activeAdminTab === 'dashboard' && (
            <AdminDashboardView
              users={usersList}
              questions={questions}
              mockTests={mockTests}
              receipts={receipts}
              globalSettings={globalSettings}
              onNavigateTab={(tab) => setActiveAdminTab(tab)}
              onApproveReceipt={(rId) => onApproveReceipt(rId, 'PRO')}
            />
          )}

          {activeAdminTab === 'users' && (
            <AdminUsersManager
              users={usersList}
              onUpdateUser={(updated) => onUpdateUser && onUpdateUser(updated)}
              onDeleteUser={(id) => onDeleteUser && onDeleteUser(id)}
              adminTelegram={globalSettings.contactTelegram || '@rcmnx'}
            />
          )}

          {activeAdminTab === 'plans' && (
            <AdminPlansEditor
              plans={pricingPlans}
              onSavePlans={(plans) => onSavePricingPlans && onSavePricingPlans(plans)}
              adminTelegram={globalSettings.contactTelegram || '@rcmnx'}
            />
          )}

          {activeAdminTab === 'landing' && (
            <AdminLandingCMS
              globalSettings={globalSettings}
              testimonials={testimonials}
              onSaveSettings={(settings) => onSaveGlobalSettings && onSaveGlobalSettings(settings)}
              onSaveTestimonials={(tests) => onSaveTestimonials && onSaveTestimonials(tests)}
            />
          )}

          {activeAdminTab === 'desmos' && (
            <AdminDesmosCMS
              hacks={desmosHacks}
              globalSettings={globalSettings}
              onSaveHacks={(updatedHacks) => onSaveDesmosHacks && onSaveDesmosHacks(updatedHacks)}
              onSaveSettings={(settings) => onSaveGlobalSettings && onSaveGlobalSettings(settings)}
            />
          )}

          {activeAdminTab === 'questions' && (
            <AdminQuestionFixer
              questions={questions}
              onUpdateQuestion={(q) => onUpdateQuestion && onUpdateQuestion(q)}
              onAddQuestion={(q) => onAddQuestion && onAddQuestion(q)}
            />
          )}

          {activeAdminTab === 'ingestion' && (
            <AdminPDFIngestion
              onImportQuestions={(newQs, title) => {
                if (onIngestQuestions) {
                  onIngestQuestions(newQs, title);
                } else if (onAddQuestion) {
                  newQs.forEach((q) => onAddQuestion(q));
                }
              }}
            />
          )}

          {activeAdminTab === 'settings' && (
            <AdminGlobalSettings
              globalSettings={globalSettings}
              onSaveSettings={(settings) => onSaveGlobalSettings && onSaveGlobalSettings(settings)}
            />
          )}

          {activeAdminTab === 'mocks' && (
            <AdminMockManager
              mockTests={mockTests}
              questions={questions}
              onAddMockTest={onAddMockTest || (() => {})}
              onUpdateMockTest={onUpdateMockTest || (() => {})}
              onDeleteMockTest={onDeleteMockTest || (() => {})}
              onPreviewMockTest={onPreviewMockTest || (() => {})}
            />
          )}

          {activeAdminTab === 'roadmaps' && (
            <AdminRoadmapMonitor
              usersList={usersList}
              onInspectUser={(u) => {
                setActiveAdminTab('users');
              }}
            />
          )}

          {activeAdminTab === 'community' && (
            <AdminChatManager
              currentUser={currentUser}
              usersList={usersList}
            />
          )}
        </div>
      </main>
    </div>
  );
};
