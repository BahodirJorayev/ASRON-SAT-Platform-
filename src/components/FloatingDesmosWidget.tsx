import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DesmosSatHack, GlobalPlatformSettings } from '../types';
import { FloatingDesmosModal } from './FloatingDesmosModal';
import { DesmosLogoIcon } from './DesmosLogoIcon';
import { INITIAL_SAT_DESMOS_HACKS } from '../data/desmosHacksData';

interface Props {
  hacks?: DesmosSatHack[];
  globalSettings?: GlobalPlatformSettings;
  isDarkMode?: boolean;
}

const STORAGE_KEYS = {
  DESMOS_OPEN: 'asron_sat_desmos_open',
  DESMOS_BTN_POS: 'asron_sat_desmos_btn_pos',
};

export const FloatingDesmosWidget: React.FC<Props> = ({
  hacks = INITIAL_SAT_DESMOS_HACKS,
  globalSettings,
  isDarkMode,
}) => {
  // Check if Desmos widget is enabled in platform settings
  const isEnabled = globalSettings?.desmosEnabled ?? true;
  const customIconUrl = globalSettings?.desmosIconUrl;

  const [isOpen, setIsOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESMOS_OPEN);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Position state for magnetic snapping
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DESMOS_BTN_POS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return { x: 0, y: 0 };
  });

  // Track dragging to distinguish between click and drag
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESMOS_OPEN, JSON.stringify(isOpen));
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DESMOS_BTN_POS, JSON.stringify(position));
    } catch {}
  }, [position]);

  if (!isEnabled) return null;

  // Handle magnetic snap on drag end
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number }; point: { x: number; y: number } }) => {
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 50);

    if (typeof window === 'undefined') return;

    const viewportWidth = window.innerWidth;
    const padding = 16;
    const buttonSize = 48; // w-12 = 48px

    // Current screen X of button
    const finalScreenX = info.point.x;
    const snapToRight = finalScreenX > viewportWidth / 2;

    // Calculate delta relative to original anchor (bottom-right: right: 16px, bottom: 24px)
    // When snapped to right edge:
    const targetX = snapToRight ? 0 : -(viewportWidth - buttonSize - padding * 2);

    // Keep Y within vertical viewport bounds
    const constrainedY = position.y + info.offset.y;

    const newPos = {
      x: targetX,
      y: constrainedY,
    };

    setPosition(newPos);
  };

  const handlePointerDown = () => {
    dragStartTimeRef.current = Date.now();
  };

  const handleClick = () => {
    // If click duration was very short and not a drag
    if (!isDraggingRef.current && Date.now() - dragStartTimeRef.current < 250) {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <>
      {/* Persistent Floating Draggable Trigger with Magnetic Snapping */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.15}
        onDragStart={() => {
          isDraggingRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className="fixed bottom-6 right-4 sm:right-6 z-50 select-none touch-none"
        style={{ cursor: 'grab' }}
      >
        <button
          type="button"
          className="w-12 h-12 rounded-full bg-[#0B1B3D] text-white dark:bg-[#E07A5F] shadow-2xl border border-white/20 flex items-center justify-center active:cursor-grabbing relative transition-colors focus:outline-none ring-4 ring-[#0B1B3D]/15 dark:ring-[#E07A5F]/20 group"
          title="Digital SAT Desmos Graphing Suite & SAT Hacks"
        >
          {/* Glowing pulse ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] dark:bg-white opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D4AF37] dark:bg-white text-[8px] font-black text-[#0B1B3D] items-center justify-center shadow-xs">
              M
            </span>
          </span>

          {/* Desmos Logo Icon */}
          {customIconUrl ? (
            <img
              src={customIconUrl}
              alt="Desmos"
              className="w-7 h-7 object-contain rounded-full pointer-events-none"
            />
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 pointer-events-none">
              <DesmosLogoIcon size={32} showText={false} />
            </div>
          )}

          {/* Tooltip on hover */}
          <div className="absolute bottom-full mb-2 right-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#0B1B3D] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap border border-[#1E293B]">
            SAT Desmos Grapher
          </div>
        </button>
      </motion.div>

      {/* Floating Desmos Controller Modal */}
      <FloatingDesmosModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hacks={hacks}
        customIconUrl={customIconUrl}
        isDarkMode={isDarkMode}
      />
    </>
  );
};
