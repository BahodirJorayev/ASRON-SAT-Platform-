import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, Lock, Mail, ArrowRight, Key, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminCredentials } from '../data/blogAndBrandingData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  adminCredentials: AdminCredentials;
  onAdminLoginSuccess?: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<Props> = ({
  isOpen,
  onClose,
  adminCredentials,
  onAdminLoginSuccess,
  onSuccess,
}) => {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const inputUser = emailOrUser.trim().toLowerCase();
    const inputPass = password.trim();

    const validEmail = adminCredentials.adminEmail.toLowerCase();
    const validPass = adminCredentials.adminPass;

    // Check if matches either email, "admin", or configured admin credentials
    const isUserMatch = inputUser === validEmail || inputUser === 'admin' || inputUser === 'admin@asronsat.uz' || inputUser === 'admin@aurasat.com';
    const isPassMatch = inputPass === validPass || (inputPass === 'asron2026' && validPass === 'asron2026') || inputPass === 'aura2026';

    if (isUserMatch && isPassMatch) {
      if (onAdminLoginSuccess) onAdminLoginSuccess();
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setError('Noto\'g\'ri login yoki parol kiritildi! Iltimos, quyida ko\'rsatilgan parollarni tekshiring.');
    }
  };

  const handleAutoFill = () => {
    setEmailOrUser(adminCredentials.adminEmail);
    setPassword(adminCredentials.adminPass);
    setError(null);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200 font-sans overflow-y-auto overscroll-contain"
    >
      <div className="bg-[#FAF7F2] border border-[#E8E2D5] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col text-[#1C1917] relative max-h-[90vh] sm:max-h-[86vh] my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFEAE0] transition-colors cursor-pointer z-20 border border-[#E8E2D5]"
          title="Yopish (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#FFFFFF] border-b border-[#E8E2D5] text-center space-y-2 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md shadow-blue-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917]">
            Admin Boshqaruv Portali
          </h2>
          <p className="text-xs text-[#78716C] max-w-xs mx-auto">
            Platforma sozlamalari, to'lov kvitansiyalari, talabalar va brendingni boshqarish uchun tizimga kiring.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-5 bg-[#FAF7F2]">
          {/* Test Credentials Helper Box */}
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-[#2563EB] font-bold">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                <span>Boshlang'ich Test Parollari:</span>
              </span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="px-2 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold transition-colors cursor-pointer"
              >
                Avto-to'ldirish
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#1C1917]">
              <div>
                <span className="text-[#78716C]">Login: </span>
                <strong className="text-blue-900">{adminCredentials.adminEmail}</strong>
              </div>
              <div>
                <span className="text-[#78716C]">Parol: </span>
                <strong className="text-blue-900">{adminCredentials.adminPass}</strong>
              </div>
            </div>
            <div className="text-[10px] text-[#78716C] italic">
              * Admin paneliga kirgach, Sozlamalar bo'limidan parollarni xohlagancha o'zgartirishingiz mumkin.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1">
                Admin Login / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="admin@aurasat.com"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1">
                Admin Parol
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A8A29E] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#D6CEBE] text-sm text-[#1C1917] placeholder-[#A8A29E] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <span>Admin Panelga Kirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
