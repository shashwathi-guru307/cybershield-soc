import React from 'react';
import { SOC_TEAM } from '../data/socData';
import { CyberShieldLogo } from './CyberShieldLogo';
import { 
  Users, 
  Award, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Activity, 
  FileText,
  BadgeCheck
} from 'lucide-react';

interface SocDirectorConsoleProps {
  compact?: boolean;
}

export const SocDirectorConsole: React.FC<SocDirectorConsoleProps> = ({
  compact = false,
}) => {
  const director = SOC_TEAM[0];
  const staff = SOC_TEAM.slice(1);

  return (
    <div className={`flex flex-col bg-[#070d18] border border-cyan-900/30 rounded-xl overflow-hidden ${compact ? 'h-[440px]' : 'h-full min-h-[580px]'}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1222] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            SOC Command Staff & Operations Roster
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            ALPHA SHIFT · 24/7 ACTIVE WATCH
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span>ROSTER NOMINAL</span>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto">
        {/* Left Column: SOC Director Profile Card (Elena Vance, matching Image 3) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-4 bg-gradient-to-b from-[#0a1426] to-[#070e1c] border border-cyan-800/40 rounded-xl relative overflow-hidden shadow-xl">
            {/* Ambient Cyan glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-4">
              {/* Director Avatar / Portrait */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)] bg-slate-900 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                  alt="Director Elena Vance - Cybersecurity Operations Lead"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback to SVG emblem avatar if network fails
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-cyan-950 text-cyan-400 font-bold text-xl">EV</div>';
                    }
                  }}
                />
                <div className="absolute bottom-1 right-1">
                  <CyberShieldLogo size="xs" showGlow={false} />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 mb-0.5">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{director.badgeId}</span>
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {director.name}
                </h3>
                <p className="text-xs text-slate-300 font-medium leading-snug">
                  {director.title}
                </p>
                <div className="mt-2 inline-block px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 rounded">
                  {director.clearanceLevel}
                </div>
              </div>
            </div>

            {/* Director Bio & SOC Mission */}
            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4 bg-[#060c18] p-3 rounded border border-slate-800">
              "Our mission is continuous vigilance: neutralizing advanced persistent threats, orchestrating rapid incident containment, and preserving enterprise operational integrity across every sovereign border."
            </p>

            {/* Key Command Metrics */}
            <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#060b16] rounded border border-cyan-950 font-mono text-xs tabular-nums text-center">
              <div>
                <span className="text-[10px] text-slate-500 block">MTTD</span>
                <span className="text-cyan-300 font-bold text-sm">1.8 min</span>
                <span className="text-[9px] text-emerald-400 block">-34% vs avg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">MTTR</span>
                <span className="text-cyan-300 font-bold text-sm">6.4 min</span>
                <span className="text-[9px] text-emerald-400 block">Automated</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">UPTIME</span>
                <span className="text-emerald-400 font-bold text-sm">99.99%</span>
                <span className="text-[9px] text-slate-400 block">Zero SLA Breach</span>
              </div>
            </div>
          </div>

          {/* Compliance Frameworks Active */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg">
            <span className="text-xs font-semibold text-white uppercase font-display block mb-2.5">
              Verified Compliance & Audits
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">ISO/IEC 27001</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">SOC 2 Type II</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">NIST CSF 2.0</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="p-2 rounded bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">FedRAMP High</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: SOC Engineering Team & Shift Management */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-white uppercase font-display block">
                  On-Duty Security Analysts & Specialists
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Tier 1 Triage, Tier 2 Hunting, Tier 3 Forensics
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                4 PERSONNEL ACTIVE
              </span>
            </div>

            <div className="space-y-2.5">
              {staff.map((person) => (
                <div
                  key={person.badgeId}
                  className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-800/50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#0b1526] border border-cyan-900 flex items-center justify-center font-mono font-bold text-xs text-cyan-300">
                      {person.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{person.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">· {person.badgeId}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{person.title}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        person.status === 'On Duty'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {person.status}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1">
                      {person.assignedIncidentsCount} active tickets
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Handover Log & Daily Operational Directive */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                DAILY OPERATIONAL DIRECTIVE #2026-0925
              </span>
              <span className="text-[10px] text-slate-500">AUTHORIZED BY VANCE, E.</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              "Heightened threat telemetry observed targeting Asia-Pacific DNS relays and Frankfurt ingress routers. Enforce zero-tolerance rate limiting on UDP 53 bursts. All Tier 2 analysts are mandated to execute automated virtual-patching playbooks upon CVSS &gt;= 8.0 triage."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
