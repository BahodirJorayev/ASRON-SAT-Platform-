import React, { useState } from 'react';
import { 
  Settings, ShieldCheck, ShieldAlert, UploadCloud, 
  Send, Mail, Instagram, Youtube, Save, RotateCcw, 
  CheckCircle2, Radio, Zap, AlertTriangle, Image as ImageIcon
} from 'lucide-react';
import { GlobalPlatformSettings } from '../types';
import { uploadUserAvatar } from '../lib/supabase';
import { AsronLogo } from './AsronLogo';

interface AdminGlobalSettingsProps {
  globalSettings: GlobalPlatformSettings;
  onSaveSettings: (settings: GlobalPlatformSettings) => void;
}

export const AdminGlobalSettings: React.FC<AdminGlobalSettingsProps> = ({
  globalSettings,
  onSaveSettings,
}) => {
  const [form, setForm] = useState<GlobalPlatformSettings>(globalSettings);
  const [saveToast, setSaveToast] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleSave = () => {
    onSaveSettings(form);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      const { url } = await uploadUserAvatar('brand_logo', file);
      if (url) {
        setForm({ ...form, platformLogoUrl: url });
      }
    } catch (e) {
      console.error('Error uploading logo:', e);
    }
    setIsUploadingLogo(false);
  };

  return (
    <div id="admin-global-settings" className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Global Brand & Emergency Settings saved! Changes applied across entire application.</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[#0B1B3D] dark:text-slate-300 text-xs font-mono font-bold">
            <Settings className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Platform Governance & Brand Assets</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1B3D] dark:text-[#EAEBED]">
            Global Branding, Contacts & Emergency Switches
          </h2>
          <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
            Manage platform identity, official Telegram desk (<span className="font-mono font-bold text-[#E07A5F]">@rcmnx</span>), social links, and operational kill-switches.
          </p>
        </div>

        <button
          id="btn-save-global-settings"
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E07A5F] text-[#0B1B3D] text-xs font-extrabold flex items-center gap-2 transition-all shadow-sm hover:opacity-95"
        >
          <Save className="w-4 h-4 stroke-[2.5]" />
          <span>Save Global Configuration</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Brand Identity & Contacts */}
        <div className="space-y-6">
          {/* Brand Identity Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              1. Platform Brand Identity
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Platform Name</label>
                <input
                  type="text"
                  value={form.platformName}
                  onChange={(e) => setForm({ ...form, platformName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={form.platformTagline}
                  onChange={(e) => setForm({ ...form, platformTagline: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                />
              </div>

              {/* Logo Preview & Upload */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-[11px] font-mono text-slate-500 uppercase">Platform Vector / Image Logo</label>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center">
                    {form.platformLogoUrl ? (
                      <img src={form.platformLogoUrl} alt="Logo" className="w-10 h-10 object-contain" />
                    ) : (
                      <AsronLogo size="md" showText={false} />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="brand-logo-upload"
                      onChange={handleLogoUpload}
                      accept="image/*,.svg"
                      className="hidden"
                    />
                    <label
                      htmlFor="brand-logo-upload"
                      className="inline-block py-2 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                    >
                      {isUploadingLogo ? 'Uploading...' : 'Upload Vector Logo'}
                    </label>
                    <p className="text-[10px] text-slate-400 mt-1">Recommended: SVG or PNG with transparent background</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Social Desk */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-[#0B1B3D] dark:text-[#EAEBED] uppercase tracking-wider font-mono">
              2. Official Contact & Social Desks
            </h3>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Admin Telegram Username / Desk</span>
                </label>
                <input
                  type="text"
                  value={form.contactTelegram}
                  onChange={(e) => setForm({ ...form, contactTelegram: e.target.value })}
                  placeholder="@rcmnx"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-[#E07A5F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-sky-500" />
                  <span>Official Support Email</span>
                </label>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="text"
                  value={form.contactInstagram || ''}
                  onChange={(e) => setForm({ ...form, contactInstagram: e.target.value })}
                  placeholder="https://instagram.com/asronsat"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Emergency Switches & Maintenance */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2F] border border-[#E5E0D8] dark:border-[#1E293B] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-rose-500 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Emergency Operations & Feature Kill-Switches</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/30">
                HIGH AUTHORITY
              </span>
            </div>

            <p className="text-xs text-[#78716C] dark:text-[#94A3B8]">
              Instantly toggle platform sub-services or enter full maintenance mode in real time.
            </p>

            <div className="space-y-3">
              {/* Maintenance Mode */}
              <div className={`p-4 rounded-2xl border transition-all ${
                form.isMaintenance
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-800 dark:text-rose-300'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-extrabold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                      <span>Full Platform Maintenance Mode</span>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Redirects public visitors to a maintenance status screen.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isMaintenance}
                    onChange={(e) => setForm({ ...form, isMaintenance: e.target.checked })}
                    className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Arena Kill-Switch */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Multiplayer Vocab Clash Arena</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Live PvP speed arena matchmaking
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.arenaEnabled}
                  onChange={(e) => setForm({ ...form, arenaEnabled: e.target.checked })}
                  className="w-4 h-4 accent-[#D4AF37] rounded cursor-pointer"
                />
              </div>

              {/* WebRTC Live Stream Kill-Switch */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#0B1B3D] dark:text-slate-200 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Live WebRTC Whiteboard Masterclasses</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Real-time mesh video and canvas stream
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={form.liveStreamEnabled}
                  onChange={(e) => setForm({ ...form, liveStreamEnabled: e.target.checked })}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
