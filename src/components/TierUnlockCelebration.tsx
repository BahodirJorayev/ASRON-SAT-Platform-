import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Zap, 
  ArrowRight, Crown, Award, BookOpen, Bot, Video, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, PlanTier } from '../types';
import { AsronLogo } from './AsronLogo';

interface TierUnlockCelebrationProps {
  user: User;
  onClose: () => void;
  onEnterWorkspace: () => void;
}

export const TierUnlockCelebration: React.FC<TierUnlockCelebrationProps> = ({
  user,
  onClose,
  onEnterWorkspace,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Generate or retrieve scholar ID
  const scholarId = user.scholarId || `ASRON-2026-${user.id.slice(-4).toUpperCase() || '7789'}`;
  const tier: PlanTier = user.planTier || 'PRO';

  useEffect(() => {
    // Launch celebratory gold and terracotta fireworks
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 99999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#D4AF37', '#E07A5F', '#0B1B3D', '#FFFFFF'],
    });
    fire(0.2, {
      spread: 60,
      colors: ['#D4AF37', '#F59E0B', '#E07A5F'],
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#D4AF37', '#FFFFFF', '#E07A5F'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#D4AF37', '#E07A5F'],
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#D4AF37', '#38BDF8'],
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: -y * 20 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const tierDetails = {
    FREE: {
      name: 'Free Starter Access',
      badge: 'STARTER SCHOLAR',
      bgGradient: 'from-[#1E293B] via-[#0F172A] to-[#0A0F1D]',
      accentColor: '#94A3B8',
      foilGradient: 'from-slate-300 via-slate-100 to-slate-400',
    },
    STANDARD: {
      name: 'Standard Scholar Pass',
      badge: 'STANDARD SCHOLAR',
      bgGradient: 'from-[#1A2E40] via-[#0B1B3D] to-[#0A0F1D]',
      accentColor: '#38BDF8',
      foilGradient: 'from-sky-300 via-blue-100 to-indigo-300',
    },
    PRO: {
      name: 'Executive PRO Scholar Pass',
      badge: 'PRO SCHOLAR',
      bgGradient: 'from-[#241A08] via-[#121A2F] to-[#0A0F1D]',
      accentColor: '#D4AF37',
      foilGradient: 'from-[#F5D77F] via-[#FFEBB0] to-[#C59B27]',
    },
    VIP: {
      name: 'VIP Inner Circle Fellowship',
      badge: 'VIP INNER CIRCLE',
      bgGradient: 'from-[#38160D] via-[#1A122A] to-[#0A0F1D]',
      accentColor: '#E07A5F',
      foilGradient: 'from-[#FFAA8A] via-[#FFD7CA] to-[#E07A5F]',
    },
  }[tier];

  const privileges = [
    {
      icon: <Zap className="w-4 h-4 text-[#D4AF37]" />,
      title: '30-Day Dynamic AI Adaptive Roadmap',
      desc: 'Precision daily micro-drills recalibrated from your error telemetry.',
    },
    {
      icon: <Award className="w-4 h-4 text-[#E07A5F]" />,
      title: 'Unlimited Multistage Bluebook Practice Mocks',
      desc: 'Full 100% faithful MST test simulations with real scoring curves.',
    },
    {
      icon: <Bot className="w-4 h-4 text-[#38BDF8]" />,
      title: '24/7 Gemini Socratic AI Tutor & Mistake Clones',
      desc: 'Instant step-by-step guidance without spoiling answers + clone generator.',
    },
    {
      icon: <Video className="w-4 h-4 text-emerald-400" />,
      title: 'Live WebRTC Whiteboard Masterclasses & Group Access',
      desc: 'Direct collaborative sessions, audio channels, and verified community.',
    },
  ];

  return (
    <AnimatePresence>
      <div 
        id="tier-unlock-celebration-modal"
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-2xl bg-[#0A0F1D]/90"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-gradient-to-b from-[#121A2F] via-[#0E1626] to-[#0A0F1D] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(212,175,55,0.18)] text-white overflow-hidden my-auto"
        >
          {/* Subtle Background Glow Elements */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#E07A5F]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close / Dismiss button */}
          <button
            id="btn-close-tier-celebration"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20"
            title="Dismiss Celebration"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="text-center space-y-2 mb-6">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#E07A5F]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-mono font-bold tracking-wider uppercase"
            >
              <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Membership Unlocked • High Honor</span>
            </motion.div>
            
            <motion.h2
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#D4AF37] bg-clip-text text-transparent"
            >
              Welcome to {tierDetails.name}
            </motion.h2>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Your official credentials have been minted and armed on the ASRON SAT neural testing network.
            </p>
          </div>

          {/* 3D Physical-styled Metallic Scholar Card */}
          <div className="perspective-1000 mb-8 flex justify-center">
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              animate={{
                rotateX: mousePos.y,
                rotateY: mousePos.x,
                scale: isHovered ? 1.02 : 1,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
              className={`relative w-full max-w-md h-56 sm:h-60 rounded-2xl p-5 sm:p-6 bg-gradient-to-br ${tierDetails.bgGradient} border border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden cursor-pointer select-none`}
            >
              {/* Metallic Light Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-2xl pointer-events-none" />

              {/* Card Top Row: Logo & Chip */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <AsronLogo size="sm" showText={false} />
                  <div>
                    <span className="text-xs font-black tracking-widest font-mono text-white block">ASRON SAT</span>
                    <span className="text-[9px] text-[#D4AF37] font-mono tracking-wider block">OFFICIAL SCHOLAR ID</span>
                  </div>
                </div>

                {/* EMV Microchip & Hologram */}
                <div className="flex items-center gap-2">
                  <div className="w-9 h-7 rounded bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#AA771C] border border-[#FFEBB0]/60 flex items-center justify-center shadow-inner">
                    <div className="grid grid-cols-2 gap-0.5 w-6 h-4 opacity-70">
                      <div className="border-r border-b border-black/30" />
                      <div className="border-b border-black/30" />
                      <div className="border-r border-black/30" />
                      <div />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Center: Scholar Name & ID */}
              <div className="space-y-1 z-10 my-auto">
                <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Candidate & Scholar</div>
                <div className="text-lg sm:text-xl font-black tracking-wide text-white uppercase font-sans drop-shadow-md truncate">
                  {user.fullName || user.username || 'Executive Scholar'}
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>@{user.username || 'scholar'}</span>
                  <span className="text-[#D4AF37]">•</span>
                  <span className="text-[#D4AF37] font-bold tracking-wider">{scholarId}</span>
                </div>
              </div>

              {/* Card Bottom: Tier Foil Stamp & Expiry */}
              <div className="flex items-center justify-between z-10 border-t border-white/10 pt-3">
                <div className={`px-3 py-1 rounded-md bg-gradient-to-r ${tierDetails.foilGradient} text-[#0A0F1D] text-[10px] sm:text-xs font-black tracking-widest uppercase shadow-md`}>
                  {tierDetails.badge}
                </div>

                <div className="text-right">
                  <div className="text-[9px] text-slate-400 font-mono">STATUS / EXPIRY</div>
                  <div className="text-[11px] font-mono font-bold text-[#D4AF37]">
                    {user.tierExpiresAt ? new Date(user.tierExpiresAt).toLocaleDateString() : 'LIFETIME PRIVILEGE'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Unlocked Privilege Matrix */}
          <div className="space-y-2.5 mb-8">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Activated Privileges & Superpowers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {privileges.map((p, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08 }}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/30 transition-colors flex items-start gap-3"
                >
                  <div className="p-2 rounded-lg bg-black/40 border border-white/5 shrink-0 mt-0.5">
                    {p.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-100">{p.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              id="btn-enter-elite-workspace"
              onClick={onEnterWorkspace}
              className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#E07A5F] to-[#D4AF37] bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-[#0B1B3D] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Enter Elite Workspace</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
