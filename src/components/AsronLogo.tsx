import React from 'react';

export interface AsronLogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'mark-only' | 'monochrome';
  inverted?: boolean;
}

/**
 * ASRON SAT Official Geometric Brand Logo
 * 3 rounded ascending block segments forming the signature growth delta / upward peak.
 */
export const AsronLogo: React.FC<AsronLogoProps> = ({
  size = 36,
  className = '',
  variant = 'mark-only',
  inverted = false,
}) => {
  // Brand Colors
  const navyBg = '#0B1B3D';
  const fillWhite = '#FFFFFF';
  const fillNavy = '#0B1B3D';

  const markColor = inverted
    ? '#0B1B3D'
    : variant === 'monochrome'
    ? 'currentColor'
    : fillWhite;

  const textColor = inverted
    ? '#0B1B3D'
    : variant === 'monochrome'
    ? 'currentColor'
    : '#0B1B3D';

  // Mark SVG element (the exact 3-segment upward ascend delta)
  const MarkSVG = (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* 
        Geometry:
        1. Long diagonal bar (top-left to apex): angle -45°, length ~40, thickness 10, corner radius 5
        2. Short parallel diagonal bar (upper-right): parallel to bar 1
        3. Bottom Chevron (upward peak with rounded cap and rounded ends)
      */}
      {/* 1. Long Upper-Left Diagonal Capsule */}
      <rect
        x="32"
        y="21"
        width="11"
        height="40"
        rx="5.5"
        transform="rotate(-45 32 21)"
        fill={markColor}
      />

      {/* 2. Short Upper-Right Parallel Capsule */}
      <rect
        x="55"
        y="36"
        width="11"
        height="26"
        rx="5.5"
        transform="rotate(-45 55 36)"
        fill={markColor}
      />

      {/* 3. Bottom Ascending Chevron Peak */}
      <path
        d="M38.5 56.5L49.5 45.5C50.3 44.7 51.7 44.7 52.5 45.5L63.5 56.5"
        stroke={markColor}
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'mark-only') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-[#0B1B3D] dark:bg-[#0B1B3D] text-white p-1.5 shadow-sm ${className}`}
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="32"
            y="21"
            width="11"
            height="40"
            rx="5.5"
            transform="rotate(-45 32 21)"
            fill="#FFFFFF"
          />
          <rect
            x="55"
            y="36"
            width="11"
            height="26"
            rx="5.5"
            transform="rotate(-45 55 36)"
            fill="#FFFFFF"
          />
          <path
            d="M38.5 56.5L49.5 45.5C50.3 44.7 51.7 44.7 52.5 45.5L63.5 56.5"
            stroke="#FFFFFF"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <div
          className="rounded-xl bg-[#0B1B3D] flex items-center justify-center shadow-sm shrink-0"
          style={{ width: size, height: size, padding: size * 0.12 }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="32"
              y="21"
              width="11"
              height="40"
              rx="5.5"
              transform="rotate(-45 32 21)"
              fill="#FFFFFF"
            />
            <rect
              x="55"
              y="36"
              width="11"
              height="26"
              rx="5.5"
              transform="rotate(-45 55 36)"
              fill="#FFFFFF"
            />
            <path
              d="M38.5 56.5L49.5 45.5C50.3 44.7 51.7 44.7 52.5 45.5L63.5 56.5"
              stroke="#FFFFFF"
              strokeWidth="11"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className="font-extrabold tracking-tight text-[#0B1B3D] dark:text-[#EAEBED] text-base">
            ASRON SAT
          </span>
          <span className="text-[9px] font-mono tracking-wider uppercase text-[#64748B] dark:text-[#94A3B8] font-semibold mt-0.5">
            Digital SAT Intelligence
          </span>
        </div>
      </div>
    );
  }

  // Monochrome / direct embed
  return MarkSVG;
};

export default AsronLogo;
