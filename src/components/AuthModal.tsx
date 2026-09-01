import React, { useState, useEffect } from 'react';
import { X, Sparkles, Shield, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, AlertCircle, Phone, AtSign, Loader2 } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../lib/supabase';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'signin' | 'signup';
  onOpenAdminLogin?: () => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signup',
  onOpenAdminLogin,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync mode whenever initialMode or isOpen changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
    }
  }, [isOpen, initialMode]);

  // Handle ESC key to close modal
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await signInWithGoogle();
      if (res.data?.user) {
        onSuccess(res.data.user);
        onClose();
      } else if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'signup') {
        const res = await signUpWithEmail(email, password, fullName, username, phoneNumber);
        if (res.data?.user) {
          onSuccess(res.data.user);
          onClose();
        } else if (res.error) {
          setErrorMessage(res.error.message);
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res.data?.user) {
          onSuccess(res.data.user);
          onClose();
        } else if (res.error) {
          setErrorMessage(res.error.message);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kirishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoStudent = () => {
    const demo: User = {
      id: 'usr-demo-alex',
      fullName: 'Alex Chen',
      username: 'alex_sat',
      email: 'alex.chen@satprep.edu',
      phoneNumber: '+998 90 123 45 67',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'Targeting 1550+ on Digital SAT • Tech & Computer Science',
      role: 'STUDENT',
      planTier: 'PRO',
      targetScore: 1550,
      baselineScore: 1280,
      potentialScore: 1560,
      predictedScore: 1420,
      weakestSubSkills: ['Circle Theorems', 'Transitions', 'Nonlinear Systems'],
      streakDays: 14,
      streakFreezes: 2,
      xpPoints: 1450,
      createdAt: new Date().toISOString(),
    };
    onSuccess(demo);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150 font-sans overflow-y-auto"
    >
      {/* Modal Container: Compact height & Mouse-wheel scrollable */}
      <div 
        className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl shadow-2xl w-full max-w-[430px] flex flex-col text-[#1C1917] relative max-h-[84vh] sm:max-h-[82vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close Button */}
        <div className="px-5 py-4 bg-[#FFFFFF] border-b border-[#E8E2D5] flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20 shrink-0">
              Σ
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-[#1C1917] leading-tight">
                {mode === 'signup' ? 'Yangi SAT Akkaunt Ochish' : 'Tizimga Kirish (Log In)'}
              </h2>
              <p className="text-[11px] text-[#78716C] leading-none mt-0.5">
                {mode === 'signup' ? "Ro'yxatdan o'ting va natijalarni saqlang" : "Hisobingizga kiring va davom eting"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer border border-[#E8E2D5]"
            title="Yopish (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body - Smooth Mouse Wheel Scrolling Enabled */}
        <div 
          className="p-5 space-y-4 bg-[#FAF7F2] overflow-y-auto flex-1 overscroll-contain"
          style={{ maxHeight: 'calc(82vh - 70px)' }}
        >
          {/* Switch Mode Tabs at Top for quick toggle */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#EFEAE0] border border-[#E0D9CB]">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMessage(null);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Kirish (Log In)
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage(null);
              }}
              className={`py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              Ro'yxatdan O'tish
            </button>
          </div>

          {/* Error notification if any */}
          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F3EFE6] border border-[#D6CEBE] text-[#1C1917] font-semibold text-xs shadow-xs flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{mode === 'signup' ? "Google orqali ro'yxatdan o'tish" : 'Google orqali kirish'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E8E2D5] w-full" />
            <span className="bg-[#FAF7F2] px-2.5 text-[10px] font-mono text-[#78716C] uppercase">
              Yoki Email orqali
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                    To'liq Ism & Familiya *
                  </label>
                  <div className="relative">
                    <UserIcon className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Masalan: Bahodir J."
                      required
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                      Username (@) *
                    </label>
                    <div className="relative">
                      <AtSign className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="bahodir_sat"
                        required
                        className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs font-mono text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                      Telefon
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+998 90..."
                        className="w-full pl-8 pr-2.5 py-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs font-mono text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                Email Manzil *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                Maxfiy Parol *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#A8A29E] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-xs text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Akkaunt Yaratish' : 'Tizimga Kirish'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Bar & Admin Entrance */}
          <div className="pt-1 space-y-2">
            <div className="p-2.5 rounded-xl bg-[#F3EFE6] border border-[#E8E2D5] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#57534E] font-medium">Tezkor Sinov:</span>
              <button
                type="button"
                onClick={handleDemoStudent}
                className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#D6CEBE] text-[#2563EB] font-bold transition-colors cursor-pointer text-[11px]"
              >
                1-Click Demo Login →
              </button>
            </div>

          {/* Admin Entrance Gateway */}
          <div className="pt-1 border-t border-[#E8E2D5] text-center">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onOpenAdminLogin) {
                  onOpenAdminLogin();
                } else if (typeof window !== 'undefined') {
                  window.location.hash = '#/admin';
                }
              }}
              className="text-[11px] font-mono text-neutral-400/60 hover:text-neutral-700 dark:hover:text-neutral-300 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
            >
              <span>🔒 Boshqaruv Markazi (Admin Portal)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

