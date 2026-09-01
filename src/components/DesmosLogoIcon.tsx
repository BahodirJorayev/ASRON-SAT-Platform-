import React from 'react';

interface Props {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const DesmosLogoIcon: React.FC<Props> = ({
  className = '',
  size = 44,
  showText = true
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none shrink-0 ${className}`}
    >
      {/* Background Green Rounded Box */}
      <rect width="200" height="200" rx="44" fill="#0A7233" />

      {/* Parabola Curve (White) */}
      <path
        d="M 54 26 C 60 78, 76 130, 100 130 C 124 130, 140 78, 146 26"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sinusoidal Wave (White) */}
      <path
        d="M 28 104 C 44 116, 56 122, 68 116 C 82 108, 92 88, 108 92 C 124 96, 134 122, 150 114 C 160 108, 168 100, 172 96"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* desmos wordmark */}
      {showText && (
        <text
          x="100"
          y="166"
          textAnchor="middle"
          fill="white"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontWeight="700"
          fontSize="36"
          letterSpacing="-0.5px"
        >
          desmos
        </text>
      )}
    </svg>
  );
};
