import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Check,
  Sparkles,
  Camera,
  Image as ImageIcon,
  Loader2,
  Crown,
  Shield,
  User as UserIcon,
  BookOpen,
  Compass,
  Cpu,
  Feather,
  Glasses,
  Atom,
} from 'lucide-react';
import { User } from '../types';
import { uploadUserAvatar } from '../lib/supabase';

export interface MinimalistAvatarPreset {
  id: number;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  url: string;
  themeColor: string;
}

export const MINIMALIST_SCHOLAR_PRESETS: MinimalistAvatarPreset[] = [
  {
    id: 1,
    name: 'The Polymath',
    subtitle: 'Mantiq va Fan Uyg‘unligi',
    icon: Compass,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=PolymathScholar&backgroundColor=f5f0eb,ebe5df',
    themeColor: '#3D405B',
  },
  {
    id: 2,
    name: 'The Logician',
    subtitle: 'Desmos & 800 Math Dahosi',
    icon: Cpu,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=LogicianMatrix&backgroundColor=e8eef3,dbe4ee',
    themeColor: '#2A9D8F',
  },
  {
    id: 3,
    name: 'The Classicist',
    subtitle: 'Ritorika & SAT Lug‘at Ustasi',
    icon: Feather,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=ClassicistSage&backgroundColor=fdf6e7,faecd1',
    themeColor: '#D4AF37',
  },
  {
    id: 4,
    name: 'The Cosmologist',
    subtitle: 'Chuqur Analitika & Tahlil',
    icon: Atom,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CosmologistSigma&backgroundColor=f3eff8,e8dff2',
    themeColor: '#818CF8',
  },
  {
    id: 5,
    name: 'The Critical Reader',
    subtitle: 'Matn & Dalil Strukturasi',
    icon: Glasses,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=CriticalReader&backgroundColor=fbf0ec,f7e2d9',
    themeColor: '#E07A5F',
  },
  {
    id: 6,
    name: 'The Grandmaster',
    subtitle: '1550+ SAT Strategisti',
    icon: Crown,
    url: 'https://api.dicebear.com/7.x/bottts/svg?seed=SATGrandmaster&backgroundColor=f4f4f5,e4e4e7',
    themeColor: '#1E1B18',
  },
];

interface AvatarSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSelectAvatar: (avatarUrl: string, isCustom: boolean, defaultIndex?: number) => void;
}

export const AvatarSelectorModal: React.FC<AvatarSelectorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectAvatar,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<number>(
    currentUser.defaultAvatarIndex || 1
  );
  const [previewUrl, setPreviewUrl] = useState<string>(
    currentUser.avatarUrl || MINIMALIST_SCHOLAR_PRESETS[0].url
  );
  const [isCustomUpload, setIsCustomUpload] = useState<boolean>(
    currentUser.customAvatar || false
  );
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isPro = currentUser.planTier === 'PRO' || currentUser.planTier === 'VIP';

  const handleSelectPreset = (preset: MinimalistAvatarPreset) => {
    setSelectedPresetId(preset.id);
    setPreviewUrl(preset.url);
    setIsCustomUpload(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Iltimos, faqat rasm fayllarini (.png, .jpg, .webp) yuklang.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Rasm hajmi 5MB dan oshmasligi kerak.');
      return;
    }

    try {
      setUploading(true);
      const { url, error } = await uploadUserAvatar(currentUser.id, file);
      if (url) {
        setPreviewUrl(url);
        setIsCustomUpload(true);
        setSelectedPresetId(0);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSave = () => {
    onSelectAvatar(
      previewUrl,
      isCustomUpload,
      isCustomUpload ? undefined : selectedPresetId
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
      <div
        className="w-full max-w-xl bg-[#FAF8F5] border border-[#E5E0D8] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EBE5DF] bg-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-[#1E1B18] tracking-tight">
              Profil Rasmini Tanlash
            </h2>
            <p className="text-xs text-[#78716C] mt-0.5">
              Shaxsiy rasmingizni yuklang yoki 6 ta minimalist akademik avatardan birini tanlang
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#78716C] hover:text-[#1E1B18] hover:bg-[#EFEAE3] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Active Preview Box */}
          <div className="p-4 rounded-xl bg-white border border-[#E5E0D8] flex items-center gap-4">
            <div className="relative shrink-0">
              <div
                className={`w-20 h-20 rounded-2xl p-1 bg-white border-2 overflow-hidden shadow-xs ${
                  isPro
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-[#1E1B18]'
                }`}
              >
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover rounded-xl bg-[#FAF8F5]"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[#1E1B18] truncate">
                  {currentUser.fullName}
                </span>
                {isPro && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-0.5">
                    <Crown size={10} className="text-amber-600 fill-amber-500" />
                    PRO
                  </span>
                )}
              </div>
              <p className="text-xs text-[#78716C] font-mono mt-0.5">
                @{currentUser.username}
              </p>
              <p className="text-xs text-[#57534E] mt-1.5">
                {isCustomUpload
                  ? '📷 Maxsus yuklangan shaxsiy rasm tanlangan'
                  : `🎓 Minimalist Preset: ${
                      MINIMALIST_SCHOLAR_PRESETS.find((p) => p.id === selectedPresetId)?.name ||
                      'Akademik'
                    }`}
              </p>
            </div>
          </div>

          {/* Option A: Direct Custom Image Upload */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8A29E] mb-2 flex items-center justify-between">
              <span>Shaxsiy Rasm Yuklash (.png, .jpg, .webp)</span>
              <span className="text-[10px] lowercase text-[#78716C]">Maks: 5MB</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[#E07A5F] bg-[#E07A5F]/5'
                  : 'border-[#D5CEC5] hover:border-[#1E1B18] bg-white/70 hover:bg-white'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={onFileInputChange}
              />

              {uploading ? (
                <div className="flex flex-col items-center justify-center py-2 text-[#E07A5F]">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-xs font-medium">Rasm yuklanmoqda...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#57534E] mb-2">
                    <Upload size={18} />
                  </div>
                  <div className="text-xs font-semibold text-[#1E1B18]">
                    Rasmni bu yerga tashlang yoki faylni tanlang
                  </div>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    Supabase Storage xavfsiz serveriga saqlanadi
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Option B: 6 Default Minimalist Scholar Presets */}
          <div>
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#A8A29E] mb-2.5">
              6 Ta Standart Akademik Avatar Preseti
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {MINIMALIST_SCHOLAR_PRESETS.map((preset) => {
                const isSelected = !isCustomUpload && selectedPresetId === preset.id;
                const IconComponent = preset.icon;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col items-center text-center ${
                      isSelected
                        ? 'bg-white border-[#1E1B18] ring-2 ring-[#1E1B18]/10 shadow-xs'
                        : 'bg-white/80 border-[#E5E0D8] hover:border-[#C4BCB3] hover:bg-white'
                    }`}
                  >
                    {/* Selected Check Pill */}
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#1E1B18] text-white flex items-center justify-center">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}

                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#EBE5DF] bg-[#FAF8F5] mb-2 p-0.5 shadow-2xs">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="w-full min-w-0">
                      <div className="text-xs font-semibold text-[#1E1B18] truncate flex items-center justify-center gap-1">
                        <IconComponent size={12} style={{ color: preset.themeColor }} />
                        <span>{preset.name}</span>
                      </div>
                      <div className="text-[10px] text-[#78716C] truncate mt-0.5">
                        {preset.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-[#EBE5DF] bg-white flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#57534E] hover:bg-[#EFEAE3] transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={uploading}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1E1B18] hover:bg-[#3D405B] text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
          >
            Saqlash va Qo‘llash
          </button>
        </div>
      </div>
    </div>
  );
};
export default AvatarSelectorModal;
