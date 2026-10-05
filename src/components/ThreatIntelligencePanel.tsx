import React, { useState, useEffect, useRef } from 'react';
import { CVE_INTEL_FEED } from '../data/socData';
import { Cpu, AlertTriangle, ShieldCheck, Database, Search, ArrowUpRight } from 'lucide-react';

interface ThreatIntelligencePanelProps {
  compact?: boolean;
}

export const ThreatIntelligencePanel: React.FC<ThreatIntelligencePanelProps> = ({
  compact = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [anomalySensitivity, setAnomalySensitivity] = useState<'low' | 'balanced' | 'paranoid'>('balanced');
  const [selectedThreatActor, setSelectedThreatActor] = useState<string>('APT29');
  const [liveThroughput, setLiveThroughput] = useState(384.6);
  const [anomalyPoints, setAnomalyPoints] = useState<number[]>([
    32, 35, 30, 42, 38, 36, 48, 52, 45, 41, 88, 92, 78, 54, 46, 39, 43, 40, 62, 58, 38, 35
  ]);

  // Real-time canvas waveform animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      offset += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Baseline threshold line
      const baselineY = height * 0.65;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, baselineY);
      ctx.lineTo(width, baselineY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Anomaly Detection Waveform
      ctx.beginPath();
      const points = anomalyPoints;
      const step = width / (points.length - 1);

      ctx.moveTo(0, height - (points[0] / 100) * height * 0.85);

      for (let i = 1; i < points.length; i++) {
        const x = i * step;
        const val = points[i];
        // add slight live wobble
        const wobble = Math.sin(offset + i * 0.8) * 3;
        const y = height - ((val + wobble) / 100) * height * 0.85;
        ctx.lineTo(x, y);
      }

      // Create gradient area under wave
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fillStyle = grad;
      ctx.fill();

      // Highlight Anomaly Spikes
      points.forEach((val, i) => {
        if (val > 70) {
          const x = i * step;
          const y = height - (val / 100) * height * 0.85;
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Pulse ring
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, 8 + Math.sin(offset * 2) * 2, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [anomalyPoints]);

  // Periodic random shift in throughput to simulate live traffic
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveThroughput(prev => +(prev + (Math.random() * 8 - 4)).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const threatActors = [
    {
      id: 'APT29',
      name: 'APT29 / Midnight Blizzard',
      origin: 'State-Sponsored',
      targetSectors: 'Government, Defense, Critical Infrastructure',
      primaryTTP: 'T1558 (Kerberoasting), T1190 (Public Exploit)',
      threatLevel: 'CRITICAL',
    },
    {
      id: 'VoltTyphoon',
      name: 'Volt Typhoon',
      origin: 'State-Sponsored',
      targetSectors: 'Telecommunications, Energy, Maritime',
      primaryTTP: 'Living off the Land (LotL), SOHO Routers',
      threatLevel: 'HIGH',
    },
    {
      id: 'LockBit',
      name: 'LockBit 3.0 Syndicate',
      origin: 'Financially Motivated RaaS',
      targetSectors: 'Healthcare, Finance, Supply Chain',
      primaryTTP: 'T1486 (Ransomware), Dual-Extortion',
      threatLevel: 'CRITICAL',
    },
  ];

  return (
    <div className={`flex flex-col bg-[#070d18] border border-cyan-900/30 rounded-xl overflow-hidden ${compact ? 'h-[440px]' : 'h-full min-h-[580px]'}`}>
      {/* Header bar matching Image 3 "Cyber Threat Intelligence" */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1222] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            Cyber Threat Intelligence
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            NEURAL ANOMALY ENGINE · v8.4 TELEMETRY
          </span>
        </div>

        {/* Sensitivity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">DETECTION BIAS:</span>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-xs">
            {(['low', 'balanced', 'paranoid'] as const).map((bias) => (
              <button
                key={bias}
                onClick={() => setAnomalySensitivity(bias)}
                className={`px-2 py-0.5 rounded capitalize cursor-pointer transition-colors text-[11px] ${
                  anomalySensitivity === bias
                    ? 'bg-cyan-950 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {bias}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto">
        {/* Left Column: Anomaly Detection Waveform & Real-Time Traffic */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Anomaly Detection Waveform Card */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold text-white uppercase font-display">
                  Anomaly Detection Stream
                </span>
                <span className="block text-[11px] text-slate-400 font-mono">
                  Multi-variable ingress variance vs historical baseline
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-rose-400 text-xs font-bold block">2 SPIKES DETECTED</span>
                <span className="text-[10px] text-slate-500">CONFIDENCE: 94.2%</span>
              </div>
            </div>

            {/* Canvas for dynamic waveform */}
            <div className="w-full h-36 bg-[#050811] rounded border border-slate-800 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={500}
                height={144}
                className="w-full h-full block"
              />
              <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400/80 bg-slate-950/70 px-1.5 py-0.5 rounded border border-cyan-900/50">
                WAVEFORM: REAL-TIME INGRESS
              </div>
            </div>

            {/* Graph Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-800/80 font-mono text-xs tabular-nums">
              <div>
                <span className="text-slate-500 text-[10px] block">THROUGHPUT</span>
                <span className="text-cyan-300 font-bold">{liveThroughput} Gbps</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">PEAK VARIANCE</span>
                <span className="text-amber-400 font-bold">+284%</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">CLASSIFIER</span>
                <span className="text-emerald-400 font-bold">eBPF NEURAL</span>
              </div>
            </div>
          </div>

          {/* Protocol Distribution & Traffic Breakdown */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg">
            <span className="text-xs font-semibold text-white uppercase font-display block mb-3">
              Global Protocol Inspection Breakdown
            </span>
            <div className="space-y-2.5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">HTTPS / TLS 1.3</span>
                  <span className="text-cyan-300 tabular-nums">64.2% (246.9 Gbps)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '64.2%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">DNS (UDP 53) Anomalous Rate</span>
                  <span className="text-rose-400 tabular-nums">18.4% (Elevated Flood)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '18.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">BGP / Autonomous Peering</span>
                  <span className="text-slate-300 tabular-nums">11.1% (Nominal)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '11.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-300">SSH / Bastion Session Telemetry</span>
                  <span className="text-slate-400 tabular-nums">6.3%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-600 rounded-full" style={{ width: '6.3%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Threat Actor Attribution & CVE Feed */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Active Threat Actor Intelligence */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg flex-1">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-white uppercase font-display">
                Threat Actor Signatures
              </span>
              <span className="text-[10px] text-slate-500 font-mono">MITRE ATT&CK MAPPED</span>
            </div>

            <div className="space-y-2">
              {threatActors.map((actor) => (
                <div
                  key={actor.id}
                  onClick={() => setSelectedThreatActor(actor.id)}
                  className={`p-2.5 rounded border transition-all cursor-pointer ${
                    selectedThreatActor === actor.id
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">{actor.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        actor.threatLevel === 'CRITICAL'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-600/50'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                      }`}
                    >
                      {actor.threatLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-1.5">{actor.targetSectors}</p>
                  <div className="text-[10px] font-mono text-cyan-300/80 truncate">
                    TTP: {actor.primaryTTP}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active CVE Vulnerability Matrix */}
          <div className="p-3.5 bg-[#091122] border border-cyan-900/30 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white uppercase font-display">
                CVE Defense Posture
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="divide-y divide-slate-800/80">
              {CVE_INTEL_FEED.map((cve) => (
                <div key={cve.cve} className="py-2 first:pt-0 last:pb-0 text-xs">
                  <div className="flex items-center justify-between font-mono text-[11px] mb-0.5">
                    <span className="text-cyan-400 font-semibold">{cve.cve}</span>
                    <span className="text-rose-400 font-bold">{cve.cvss}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] truncate mb-0.5">{cve.product}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="text-emerald-400">{cve.patchStatus}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
