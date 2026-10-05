import React from 'react';

interface CyberShieldLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showGlow?: boolean;
  animate?: boolean;
  className?: string;
}

export const CyberShieldLogo: React.FC<CyberShieldLogoProps> = ({
  size = 'md',
  showGlow = true,
  animate = false,
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      {/* Outer ambient cyan glow matching Image 1 */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md pointer-events-none transform scale-110" 
          aria-hidden="true"
        />
      )}

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle linear gradient for shield facet */}
          <linearGradient id="shieldBgGrad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0b1322" />
            <stop offset="100%" stopColor="#080e18" />
          </linearGradient>

          {/* Cyan outer border gradient */}
          <linearGradient id="cyanStrokeGrad" x1="10" y1="20" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#00d8f6" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Checkmark vibrant fill */}
          <linearGradient id="checkGrad" x1="40" y1="40" x2="65" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Outer Hexagonal Shield Path (Matches Image 1 & 2 geometry) */}
        <path
          d="M 50 6
             L 90 22
             L 90 56
             L 50 94
             L 10 56
             L 10 22
             Z"
          fill="url(#shieldBgGrad)"
          stroke="url(#cyanStrokeGrad)"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />

        {/* Concentric Dashed Radar Ring */}
        <circle
          cx="50"
          cy="48"
          r="28"
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeDasharray="4 4"
        />

        {/* Inner Cyan Target Ring */}
        <circle
          cx="50"
          cy="48"
          r="19"
          stroke="#0891b2"
          strokeWidth="2"
          fill="#071324"
        />

        {/* 4 Cardinal Reticle Crosshair Ticks (0, 90, 180, 270 deg) */}
        {/* Top tick */}
        <line x1="50" y1="20" x2="50" y2="28" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bottom tick */}
        <line x1="50" y1="68" x2="50" y2="76" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left tick */}
        <line x1="22" y1="48" x2="30" y2="48" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" />
        {/* Right tick */}
        <line x1="70" y1="48" x2="78" y2="48" stroke="#00d8f6" strokeWidth="2.5" strokeLinecap="round" />

        {/* Optional animated radar sweep line */}
        {animate && (
          <g className="animate-radar-sweep" style={{ transformOrigin: '50px 48px' }}>
            <line x1="50" y1="48" x2="78" y2="48" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
          </g>
        )}

        {/* The Characteristic Cyber Checkmark with Circular Pivot Notch */}
        {/* Pivot center circle notch */}
        <circle cx="49" cy="45" r="4.5" fill="#00d8f6" />

        {/* Checkmark body */}
        <path
          d="M 40 45
             L 48 54
             L 65 37
             L 67 40
             L 48 59
             L 37 47
             Z"
          fill="url(#checkGrad)"
          stroke="#00f0ff"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
