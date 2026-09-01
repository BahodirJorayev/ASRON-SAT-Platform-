import React, { useState } from 'react';
import {
  User as UserIcon,
  Crown,
  Flame,
  Zap,
  Target,
  Award,
  Calendar,
  Mail,
  Phone,
  AtSign,
  Save,
  CheckCircle2,
  Sparkles,
  LogOut,
  TrendingUp,
  Shield,
  BookOpen,
  Edit3,
  RefreshCw,
  School,
  Trophy,
  Download,
  Check,
  ChevronRight,
  Clock,
  BarChart3,
  ExternalLink,
  Heart
} from 'lucide-react';
import { User, PlanTier } from '../types';
import { saveUserProfile, signOutUser } from '../lib/supabase';
import { CREATIVE_AVATARS, CreativeAvatar } from '../data/creativeAvatars';

interface Props {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onOpenPaywall: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
}

interface TargetCollege {
  id: string;
  name: string;
  location: string;
  satRange: string;
  minSat: number;
  badge: string;
}

const TARGET_COLLEGES: TargetCollege[] = [
  { id: 'mit', name: 'MIT (Massachusetts Institute of Tech)', location: 'Cambridge, MA', satRange: '1540 - 1580', minSat: 1540, badge: 'Ivy Plus' },
  { id: 'harvard', name: 'Harvard University', location: 'Cambridge, MA', satRange: '1510 - 1580', minSat: 1510, badge: 'Ivy League' },
  { id: 'stanford', name: 'Stanford University', location: 'Stanford, CA', satRange: '1500 - 1570', minSat: 1500, badge: 'Top Tier' },
  { id: 'columbia', name: 'Columbia University', location: 'New York, NY', satRange: '1500 - 1560', minSat: 1500, badge: 'Ivy League' },
  { id: 'kaist', name: 'KAIST Global Scholar', location: 'Daejeon, Korea', satRange: '1480 - 1550', minSat: 1480, badge: 'Full Scholarship' },
  { id: 'nyu', name: 'New York University (NYU)', location: 'New York, NY', satRange: '1450 - 1540', minSat: 1450, badge: 'Top Tier' },
  { id: 'berkeley', name: 'UC Berkeley', location: 'Berkeley, CA', satRange: '1440 - 1540', minSat: 1440, badge: 'Public Ivy' },
];

export const ProfileView: React.FC<Props> = ({
  currentUser,
  onUpdateUser,
  onOpenPaywall,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [username, setUsername] = useState(currentUser.username);
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phoneNumber || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [mathTarget, setMathTarget] = useState(780);
  const [rwTarget, setRwTarget] = useState(770);
  const [targetExamDate, setTargetExamDate] = useState(currentUser.targetExamDate || '2026-10-04');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || CREATIVE_AVATARS[0].url);
  const [selectedColleges, setSelectedColleges] = useState<string[]>(['mit', 'stanford']);
  const [customAvatarSeed, setCustomAvatarSeed] = useState('');

  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'AVATARS' | 'SETTINGS' | 'TROPHIES'>('OVERVIEW');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isPro = currentUser.planTier === 'PRO';
  const calculatedTargetScore = mathTarget + rwTarget;

  // Calculate days remaining to exam
  const today = new Date();
  const examDate = new Date(targetExamDate);
  const diffTime = examDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const handleToggleCollege = (collegeId: string) => {
    setSelectedColleges((prev) =>
      prev.includes(collegeId) ? prev.filter((id) => id !== collegeId) : [...prev, collegeId]
    );
  };

  const handleApplyCustomSeed = () => {
    if (!customAvatarSeed.trim()) return;
    const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customAvatarSeed.trim())}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    setAvatarUrl(url);
  };

  const handleExportData = () => {
    const dataToExport = {
      user: currentUser,
      exportDate: new Date().toISOString(),
      platform: 'AURA Digital SAT Adaptive Prep',
      stats: {
        streakDays: currentUser.streakDays,
        xpPoints: currentUser.xpPoints,
        testsCompleted: currentUser.testsCompletedCount,
        predictedScore: currentUser.predictedScore,
        targetScore: calculatedTargetScore,
        selectedColleges,
      }
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraSAT_Profile_${currentUser.username || 'student'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const updated: User = {
      ...currentUser,
      fullName: fullName.trim(),
      username: username.trim().replace(/^@/, ''),
      phoneNumber: phoneNumber.trim(),
      bio: bio.trim(),
      targetScore: calculatedTargetScore,
      targetExamDate,
      avatarUrl: avatarUrl.trim() || currentUser.avatarUrl,
    };

    await saveUserProfile(updated);
    onUpdateUser(updated);

    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Find active avatar object
  const currentAvatarObj = CREATIVE_AVATARS.find((a) => a.url === avatarUrl) || CREATIVE_AVATARS[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-8 font-sans text-[#1C1917] animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Creative Profile Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            
            {/* Creative Avatar Frame */}
            <div className="relative group cursor-pointer" onClick={() => setActiveSubTab('AVATARS')}>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 shadow-md shadow-blue-500/20">
                <img
                  src={avatarUrl || CREATIVE_AVATARS[0].url}
                  alt={fullName}
                  className="w-full h-full rounded-[22px] object-cover bg-white p-1"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 bg-emerald-500 text-white font-mono text-[10px] font-bold border-2 border-white rounded-full flex items-center gap-1 shadow-xs">
                <Sparkles className="w-2.5 h-2.5" />
                <span>Faol</span>
              </span>
            </div>

            <div className="space-y-1.5 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#1C1917] tracking-tight">
                  {fullName || 'Student'}
                </h1>
                <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  @{username || 'user'}
                </span>
                {isPro ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-300">
                    <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    PRO ACCELERATOR PASS
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-[#57534E] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E8E2D5]">
                    {currentUser.planTier} REJA
                  </span>
                )}
              </div>

              <p className="text-xs text-[#57534E] max-w-xl line-clamp-2">
                {bio || 'Digital SAT Aspirant • Aiming for 1550+ Ivy League standard • Focus on Desmos algebra & rhetorical synthesis.'}
              </p>

              {/* Badges and Contacts */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#78716C] pt-1">
                <span className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8E2D5]">
                  <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{currentUser.email}</span>
                </span>
                {phoneNumber && (
                  <span className="flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-lg border border-[#E8E2D5]">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-mono">{phoneNumber}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 bg-rose-50 text-rose-800 px-2.5 py-1 rounded-lg border border-rose-200 font-bold font-mono">
                  <Target className="w-3.5 h-3.5 text-rose-600" />
                  <span>Maqsad: {calculatedTargetScore}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch lg:self-auto justify-end">
            <button
              onClick={() => setActiveSubTab('AVATARS')}
              className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Kreativ Avatarlar</span>
            </button>

            {!isPro && (
              <button
                onClick={onOpenPaywall}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="w-4 h-4 fill-white" />
                <span>PRO ga O'tish</span>
              </button>
            )}

            <button
              onClick={onSignOut}
              className="px-3 py-2 rounded-xl bg-[#FAF7F2] hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 text-[#57534E] font-bold text-xs border border-[#D6CEBE] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Akkauntdan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#E8E2D5] overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'OVERVIEW'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] border border-[#E8E2D5]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Natijalar & Universitetlar</span>
          </button>

          <button
            onClick={() => setActiveSubTab('AVATARS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'AVATARS'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] border border-[#E8E2D5]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Kreativ Avatarlar To'plami</span>
          </button>

          <button
            onClick={() => setActiveSubTab('TROPHIES')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'TROPHIES'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] border border-[#E8E2D5]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Yutuqlar & Badjlar</span>
          </button>

          <button
            onClick={() => setActiveSubTab('SETTINGS')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'SETTINGS'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#57534E] hover:text-[#1C1917] hover:bg-[#F3EFE6] border border-[#E8E2D5]'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Profil Sozlamalari</span>
          </button>
        </div>
      </div>

      {/* 2. TAB: OVERVIEW & UNIVERSITY TARGETS */}
      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold">PROGNOZ BALL</span>
                <Target className="w-4 h-4 text-[#2563EB]" />
              </div>
              <div className="text-3xl font-black font-mono text-[#1C1917]">
                {currentUser.predictedScore || 1420}
              </div>
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +{(currentUser.predictedScore || 1420) - (currentUser.baselineScore || 1280)} ball o'sish
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold">IMTIHONGACHA</span>
                <Clock className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-3xl font-black font-mono text-rose-600">
                {daysRemaining} <span className="text-sm font-bold text-[#1C1917]">Kun</span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                Sana: <strong>{targetExamDate}</strong>
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold">O'QISH SERIYASI</span>
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-3xl font-black font-mono text-amber-600">
                {currentUser.streakDays} <span className="text-sm font-bold text-[#1C1917]">Kun</span>
              </div>
              <p className="text-[11px] text-[#78716C]">
                {currentUser.streakFreezes} ta muzlatgich mavjud
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D5] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span className="font-bold">TAJRIBA (XP)</span>
                <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
              <div className="text-3xl font-black font-mono text-emerald-600">
                {currentUser.xpPoints.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                Level {Math.floor(currentUser.xpPoints / 250) + 1} Aspirant
              </p>
            </div>
          </div>

          {/* Dream Colleges Match Radar */}
          <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E8E2D5]">
              <div>
                <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
                  <School className="w-5 h-5 text-[#2563EB]" />
                  <span>Maqsadli Universitetlar va SAT Mosligi (Dream Colleges)</span>
                </h3>
                <p className="text-xs text-[#78716C] mt-0.5">
                  Sizning {currentUser.predictedScore || 1420} ballingiz dunyoning top universitetlari median ko'rsatkichiga qanchalik mos kelishini tekshiring.
                </p>
              </div>
              <button
                onClick={handleExportData}
                className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EFE6] border border-[#E8E2D5] text-xs font-bold text-[#57534E] flex items-center gap-1.5 transition-colors cursor-pointer self-start"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Hisobotni Yuklash (JSON)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TARGET_COLLEGES.map((college) => {
                const isSelected = selectedColleges.includes(college.id);
                const currentScore = currentUser.predictedScore || 1420;
                const isMatch = currentScore >= college.minSat;

                return (
                  <div
                    key={college.id}
                    onClick={() => handleToggleCollege(college.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-blue-50/40 border-[#2563EB] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E8E2D5] hover:border-[#D6CEBE]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-[#E8E2D5] text-[#57534E]">
                          {college.badge}
                        </span>
                        <h4 className="font-bold text-xs text-[#1C1917] mt-1.5 leading-snug">
                          {college.name}
                        </h4>
                        <p className="text-[10px] text-[#78716C]">{college.location}</p>
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-white border-[#D6CEBE]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-[#78716C]">SAT Oralig'i:</div>
                        <div className="font-mono font-bold text-[#1C1917]">{college.satRange}</div>
                      </div>

                      <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        isMatch
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {isMatch ? '✅ Raqobatbardosh' : `+${college.minSat - currentScore} pts kerak`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: CREATIVE AVATAR COLLECTION (No human faces, full creative catalog) */}
      {activeSubTab === 'AVATARS' && (
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E8E2D5]">
            <div>
              <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Kreativ SAT Avatarlar To'plami</span>
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Profil rasmingiz uchun odam rasmlari o'rniga o'ziga xos ilmiy, kosmik va zakovat timsollaridan birini tanlang.
              </p>
            </div>

            {isSaved && (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Avatar yangilandi!
              </span>
            )}
          </div>

          {/* Active Selected Avatar Hero */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-[#E8E2D5] flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl p-1 bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <img
                src={avatarUrl}
                alt="Selected"
                className="w-full h-full rounded-xl object-cover bg-white p-1"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-lg">{currentAvatarObj.iconSymbol}</span>
                <h4 className="font-extrabold text-sm text-[#1C1917]">{currentAvatarObj.name}</h4>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {currentAvatarObj.title}
                </span>
                <span className="text-[10px] font-mono text-[#78716C] bg-white px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                  {currentAvatarObj.category}
                </span>
              </div>
              <p className="text-xs text-[#57534E]">{currentAvatarObj.description}</p>
            </div>
            <button
              onClick={() => handleSave()}
              className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer shrink-0"
            >
              Ushbu Avatarni Saqlash
            </button>
          </div>

          {/* Creative Avatars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CREATIVE_AVATARS.map((avatar) => {
              const isCurrent = avatarUrl === avatar.url;

              return (
                <div
                  key={avatar.id}
                  onClick={() => setAvatarUrl(avatar.url)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-blue-50/50 border-[#2563EB] ring-2 ring-blue-400/20 shadow-xs scale-102'
                      : 'bg-[#FAF7F2] border-[#E8E2D5] hover:border-purple-300 hover:bg-[#FFFFFF]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl p-1 bg-gradient-to-br from-[#FAF7F2] to-[#E8E2D5] border border-[#D6CEBE] shrink-0 shadow-2xs">
                      <img
                        src={avatar.url}
                        alt={avatar.name}
                        className="w-full h-full rounded-xl object-cover bg-white"
                      />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1">
                        <span>{avatar.iconSymbol}</span>
                        <h4 className="font-bold text-xs text-[#1C1917] truncate">{avatar.name}</h4>
                      </div>
                      <p className="text-[11px] font-semibold text-[#2563EB] truncate">{avatar.title}</p>
                      <span className="text-[9px] font-mono text-[#78716C]">{avatar.category}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-[#57534E] leading-relaxed line-clamp-2">
                    {avatar.description}
                  </p>

                  <div className="pt-2 border-t border-[#E8E2D5] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#78716C]">
                      {isCurrent ? '✅ Tanlangan' : 'Tanlash'}
                    </span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isCurrent ? 'bg-[#2563EB] border-[#2563EB]' : 'border-[#D6CEBE]'
                    }`}>
                      {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom Avatar Generator Seed Box */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-2">
            <div className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>O'zingizga xos avatar generatsiya qilish</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customAvatarSeed}
                onChange={(e) => setCustomAvatarSeed(e.target.value)}
                placeholder="Ixtiyoriy so'z yoki taxallus yozing (masalan: Phoenix1600, IvyGenius)..."
                className="flex-1 px-3.5 py-2 bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
              />
              <button
                onClick={handleApplyCustomSeed}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Generatsiya
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: BADGES & TROPHIES */}
      {activeSubTab === 'TROPHIES' && (
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="pb-4 border-b border-[#E8E2D5]">
            <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Erishilgan Yutuqlar va SAT Medallari</span>
            </h3>
            <p className="text-xs text-[#78716C] mt-0.5">
              Mashqlar, streak davomiyligi va to'liq Bluebook MST mock testlarini tugatganingizda ochiladigan kuboklar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🔥</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  OCHILGAN
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">7-Kunlik Streak Qahramoni</h4>
              <p className="text-xs text-[#57534E]">Ketma-ket 7 kun davomida kunlik 10 daqiqalik mashqni muvaffaqiyatli yakunladingiz.</p>
              <div className="text-[10px] font-bold text-amber-800 pt-1">+100 XP Mukofot</div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">📐</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-200 text-[#2563EB]">
                  OCHILGAN
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Desmos Regressiya Ustasi</h4>
              <p className="text-xs text-[#57534E]">Nonlinear tenglamalar va koordinatalar tizimida 50+ savolni Desmosda yechdingiz.</p>
              <div className="text-[10px] font-bold text-[#2563EB] pt-1">+150 XP Mukofot</div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🧠</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">
                  OCHILGAN
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">SRS Xatolar Ombori (Vault Zero)</h4>
              <p className="text-xs text-[#57534E]">Leitner tizimidagi barcha muddati kelgan xatolarni to'liq qaytarib mustahkamlagansiz.</p>
              <div className="text-[10px] font-bold text-emerald-800 pt-1">+200 XP Mukofot</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🛡️</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8E2D5] text-[#78716C]">
                  {currentUser.streakDays}/30 KUN
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">30-Kunlik Temir Iroda</h4>
              <p className="text-xs text-[#57534E]">Uzluksiz 30 kun o'qish seriyasini saqlang va super-avatar unvoniga ega bo'ling.</p>
              <div className="text-[10px] font-bold text-[#78716C] pt-1">+500 XP Mukofot</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🏛️</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8E2D5] text-[#78716C]">
                  1550+ TARGET
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Ivy League Club (1550+)</h4>
              <p className="text-xs text-[#57534E]">To'liq MST 2.4 adaptiv mock imtihonida 1550 dan yuqori ball qayd eting.</p>
              <div className="text-[10px] font-bold text-[#78716C] pt-1">+1,000 XP Mukofot</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D5] space-y-2 opacity-75">
              <div className="flex items-center justify-between">
                <span className="text-2xl">⚡</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8E2D5] text-[#78716C]">
                  {currentUser.testsCompletedCount || 4}/10 MOCK
                </span>
              </div>
              <h4 className="font-bold text-sm text-[#1C1917]">Bluebook MST Veteran</h4>
              <p className="text-xs text-[#57534E]">10 ta to'liq rasmiy standartdagi adaptiv imtihonni topshiring.</p>
              <div className="text-[10px] font-bold text-[#78716C] pt-1">+750 XP Mukofot</div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: PROFILE SETTINGS & EDIT FORM */}
      {activeSubTab === 'SETTINGS' && (
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
            <div>
              <h3 className="font-bold text-base text-[#1C1917] flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#2563EB]" />
                <span>Profil Ma'lumotlari va SAT Maqsadlari</span>
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                Barcha o'zgarishlar darhol saqlanadi va platformadagi barcha bo'limlarga tatbiq etiladi.
              </p>
            </div>

            {isSaved && (
              <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                Muvaffaqiyatli saqlandi!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  To'liq Ism & Familiya *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Bahodir J."
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-sm font-medium text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Username / Taxallus (@handle) *
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masalan: bahodir_sat"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-sm font-mono font-medium text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
                <p className="text-[10px] text-[#78716C] mt-1">
                  Community chat va talabalar qidiruvida boshqalar sizni shu username orqali topishadi.
                </p>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Telefon Raqam (SMS xabarnomalar uchun)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-sm font-mono text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Email Manzil
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full pl-9 pr-3 py-2.5 bg-[#EFEAE0]/50 border border-[#E8E2D5] rounded-xl text-sm font-medium text-[#78716C] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Target Exam Date */}
              <div>
                <label className="text-xs font-bold text-[#1C1917] block mb-1">
                  Rasmiy SAT Imtihon Sanasi
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-sm text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Target Score Calculator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#1C1917] block">
                    Maqsadli Ball: <span className="text-[#2563EB] font-mono font-bold text-sm">{calculatedTargetScore}</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#78716C]">Math: {mathTarget} + RW: {rwTarget}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#57534E]">
                    <span>Math (200-800): <strong>{mathTarget}</strong></span>
                    <input
                      type="range"
                      min="400"
                      max="800"
                      step="10"
                      value={mathTarget}
                      onChange={(e) => setMathTarget(Number(e.target.value))}
                      className="w-36 h-1.5 bg-[#E8E2D5] rounded-lg accent-[#2563EB] cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#57534E]">
                    <span>Reading & Writing (200-800): <strong>{rwTarget}</strong></span>
                    <input
                      type="range"
                      min="400"
                      max="800"
                      step="10"
                      value={rwTarget}
                      onChange={(e) => setRwTarget(Number(e.target.value))}
                      className="w-36 h-1.5 bg-[#E8E2D5] rounded-lg accent-[#2563EB] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="text-xs font-bold text-[#1C1917] block mb-1">
                Bio / SAT Maqsadi & Qiziqishlar
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Masalan: SAT 1550+ ball olib, MIT yoki Stanford Computer Science fakultetiga grant yutish..."
                className="w-full p-3 bg-[#FAF7F2] border border-[#E8E2D5] rounded-xl text-xs text-[#1C1917] focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D5]">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}</span>
              </button>

              <button
                type="button"
                onClick={onSignOut}
                className="px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Akkauntdan Chiqish (Sign Out)</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
