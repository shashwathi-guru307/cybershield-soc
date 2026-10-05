import React from 'react';
import { CyberShieldLogo } from './CyberShieldLogo';
import { ShieldAlert, ShieldCheck, Zap } from 'lucide-react';

export type ActiveScreen = 'wall' | 'map' | 'intel' | 'news' | 'incidents' | 'director';

interface TopNavigationProps {
  activeScreen: ActiveScreen;
  onSelectScreen: (screen: ActiveScreen) => void;
  onOpenSimulator: () => void;
  defconLevel: number;
  onToggleDefcon: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenSimulator,
  defconLevel,
  onToggleDefcon,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-3 bg-[#070e1b]/95 backdrop-blur-md border-b border-cyan-900/30 select-none">
      {/* Zone 1: Single text element wordmark with CyberShield emblem */}
      <div className="flex items-center gap-3">
        <CyberShieldLogo size="sm" showGlow={true} />
        <button
          onClick={() => onSelectScreen('wall')}
          className="text-left font-display text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors cursor-pointer"
        >
          CyberShield SOC
        </button>
      </div>

      {/* Zone 2: 5 clean single-line nav links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => onSelectScreen('wall')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'wall'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Operations Wall
        </button>
        <button
          onClick={() => onSelectScreen('map')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'map'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Threat Monitor
        </button>
        <button
          onClick={() => onSelectScreen('intel')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'intel'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Threat Intelligence
        </button>
        <button
          onClick={() => onSelectScreen('news')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'news'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          News Veracity
        </button>
        <button
          onClick={() => onSelectScreen('incidents')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'incidents'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Incident Response
        </button>
        <button
          onClick={() => onSelectScreen('director')}
          className={`cursor-pointer whitespace-nowrap transition-colors py-1 ${
            activeScreen === 'director'
              ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
              : 'hover:text-white text-slate-400'
          }`}
        >
          Command Staff
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        {/* DEFCON Status toggle button */}
        <button
          onClick={onToggleDefcon}
          title="Click to cycle security posture level"
          className={`px-3 py-1.5 rounded text-xs font-mono font-medium flex items-center gap-1.5 transition-all cursor-pointer border ${
            defconLevel === 1
              ? 'bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse'
              : defconLevel === 2
              ? 'bg-amber-950/70 text-amber-300 border-amber-500'
              : 'bg-emerald-950/50 text-emerald-300 border-emerald-600'
          }`}
        >
          {defconLevel === 1 ? (
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>DEFCON {defconLevel}</span>
        </button>

        {/* Simulate Incident CTA */}
        <button
          onClick={onOpenSimulator}
          className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded shadow-[0_0_12px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Attack</span>
        </button>
      </div>
    </header>
  );
};
