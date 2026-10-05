import React, { useState, useEffect } from 'react';
import { SensorNode, ThreatEvent } from '../types/soc';
import { Shield, Filter, Play, Pause, Activity, Globe } from 'lucide-react';

interface GlobalThreatMapProps {
  sensorNodes: SensorNode[];
  threatEvents: ThreatEvent[];
  onSelectNode?: (node: SensorNode) => void;
  compact?: boolean;
}

// Convert geographic coordinates (lat, lng) to SVG viewBox coordinates [1000 x 500] (Equirectangular projection)
const coordsToSvg = (lat: number, lng: number): [number, number] => {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return [x, y];
};

export const GlobalThreatMap: React.FC<GlobalThreatMapProps> = ({
  sensorNodes,
  threatEvents,
  onSelectNode,
  compact = false,
}) => {
  const [selectedSensor, setSelectedSensor] = useState<SensorNode | null>(sensorNodes[1] || null);
  const [isLiveStream, setIsLiveStream] = useState(true);
  const [activeVectorFilter, setActiveVectorFilter] = useState<string>('all');
  const [timeTick, setTimeTick] = useState(0);

  useEffect(() => {
    if (!isLiveStream) return;
    const interval = setInterval(() => {
      setTimeTick((t) => (t + 1) % 1000);
    }, 60);
    return () => clearInterval(interval);
  }, [isLiveStream]);

  const filteredThreats = activeVectorFilter === 'all' 
    ? threatEvents 
    : threatEvents.filter(t => t.vector.toLowerCase().includes(activeVectorFilter.toLowerCase()));

  return (
    <div className={`flex flex-col bg-[#070d18] border border-cyan-900/30 rounded-xl overflow-hidden relative ${compact ? 'h-[440px]' : 'h-full min-h-[580px]'}`}>
      {/* Screen Title Bar matching Image 3 "GLOBAL THREAT MONITOR" */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1222] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            Global Threat Monitor
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            LIVE SENSOR MESH · {sensorNodes.length} NODES ACTIVE
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Pause / Live stream toggle */}
          <button
            onClick={() => setIsLiveStream(!isLiveStream)}
            className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isLiveStream ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Pause className="w-3 h-3 text-slate-400" />
                <span>LIVE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-amber-400" />
                <span>PAUSED</span>
              </>
            )}
          </button>

          {/* Quick vector filter */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800 text-xs">
            <button
              onClick={() => setActiveVectorFilter('all')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeVectorFilter === 'all' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveVectorFilter('ddos')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeVectorFilter === 'ddos' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DDoS
            </button>
            <button
              onClick={() => setActiveVectorFilter('apt')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeVectorFilter === 'apt' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              APT
            </button>
            <button
              onClick={() => setActiveVectorFilter('zero-day')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                activeVectorFilter === 'zero-day' ? 'bg-cyan-950 text-cyan-300 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Zero-Day
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 bg-[#060a14] cyber-grid overflow-hidden">
        {/* World Map SVG View */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain pointer-events-auto select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Cyan attack gradient */}
            <linearGradient id="attackGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="attackGradRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
            </linearGradient>

            {/* Glowing marker filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Continental landmass simplified vector silhouettes */}
          <g fill="#0e172a" stroke="#1e293b" strokeWidth="0.8" opacity="0.85">
            {/* North America */}
            <path d="M 120 70 L 260 70 L 280 110 L 250 160 L 230 190 L 190 230 L 180 260 L 160 250 L 140 200 L 100 160 L 80 110 Z" />
            {/* South America */}
            <path d="M 230 260 L 320 280 L 340 330 L 300 420 L 270 470 L 240 440 L 230 360 L 210 300 Z" />
            {/* Europe */}
            <path d="M 450 70 L 580 70 L 590 120 L 540 160 L 490 170 L 440 140 L 430 100 Z" />
            {/* Africa */}
            <path d="M 460 170 L 560 170 L 580 230 L 570 340 L 520 400 L 470 350 L 440 260 L 430 200 Z" />
            {/* Asia */}
            <path d="M 580 70 L 850 70 L 870 130 L 890 180 L 820 250 L 760 280 L 680 240 L 640 180 L 590 130 Z" />
            {/* Australia / Oceania */}
            <path d="M 780 320 L 880 320 L 910 380 L 870 430 L 800 420 L 760 370 Z" />
            {/* Japanese Archipelago */}
            <path d="M 865 140 L 885 160 L 875 190 L 855 170 Z" />
            {/* Southeast Asian Islands */}
            <path d="M 740 280 L 770 290 L 750 320 Z" />
            <path d="M 780 270 L 810 280 L 790 300 Z" />
          </g>

          {/* Latitude & Longitude aesthetic grid lines */}
          <g stroke="#0f172a" strokeWidth="0.5" strokeDasharray="3 3">
            <line x1="0" y1="125" x2="1000" y2="125" />
            <line x1="0" y1="250" x2="1000" y2="250" />
            <line x1="0" y1="375" x2="1000" y2="375" />
            <line x1="250" y1="0" x2="250" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="750" y1="0" x2="750" y2="500" />
          </g>

          {/* Dynamic Attack Beams (Curved Ballistic Arcs) */}
          {filteredThreats.map((threat, idx) => {
            const [srcX, srcY] = coordsToSvg(threat.sourceCoords[0], threat.sourceCoords[1]);
            const [dstX, dstY] = coordsToSvg(threat.targetCoords[0], threat.targetCoords[1]);

            // Arc control point for curve
            const midX = (srcX + dstX) / 2;
            const midY = (srcY + dstY) / 2 - 50;

            // Compute animated projectile offset along path
            const animProgress = ((timeTick * 1.5 + idx * 25) % 100) / 100;
            // Quadratic bezier point: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
            const t = animProgress;
            const projX = (1 - t) * (1 - t) * srcX + 2 * (1 - t) * t * midX + t * t * dstX;
            const projY = (1 - t) * (1 - t) * srcY + 2 * (1 - t) * t * midY + t * t * dstY;

            const isCritical = threat.severity === 'critical';

            return (
              <g key={threat.id} className="cursor-pointer">
                {/* Attack Arc Line */}
                <path
                  d={`M ${srcX} ${srcY} Q ${midX} ${midY} ${dstX} ${dstY}`}
                  fill="none"
                  stroke={isCritical ? 'url(#attackGradRose)' : 'url(#attackGradCyan)'}
                  strokeWidth={isCritical ? '2' : '1.4'}
                  strokeDasharray="4 4"
                  opacity={isCritical ? '0.75' : '0.55'}
                />

                {/* Pulsing projectile spark */}
                <circle
                  cx={projX}
                  cy={projY}
                  r={isCritical ? 3.5 : 2.5}
                  fill={isCritical ? '#f43f5e' : '#38bdf8'}
                  filter="url(#glow)"
                />

                {/* Source ping */}
                <circle
                  cx={srcX}
                  cy={srcY}
                  r="3"
                  fill="#ef4444"
                  opacity="0.8"
                />
              </g>
            );
          })}

          {/* Global Sensor Bastion Nodes */}
          {sensorNodes.map((node) => {
            const [x, y] = coordsToSvg(node.coords[0], node.coords[1]);
            const isSelected = selectedSensor?.id === node.id;
            const isUnderAttack = node.status === 'under-attack';

            return (
              <g
                key={node.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedSensor(node);
                  if (onSelectNode) onSelectNode(node);
                }}
              >
                {/* Outer radar pulse wave */}
                <circle
                  r={isUnderAttack ? '12' : '8'}
                  fill="none"
                  stroke={isUnderAttack ? '#f43f5e' : '#06b6d4'}
                  strokeWidth="1.2"
                  className={isUnderAttack ? 'animate-ping' : ''}
                  opacity="0.6"
                />

                {/* Node center point */}
                <circle
                  r={isSelected ? '6' : '4.5'}
                  fill={isUnderAttack ? '#ef4444' : isSelected ? '#38bdf8' : '#0ea5e9'}
                  stroke="#082f49"
                  strokeWidth="1.5"
                  filter="url(#glow)"
                />

                {/* Label text */}
                <text
                  x="8"
                  y="4"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                  className="select-none pointer-events-none group-hover:fill-cyan-300 transition-colors"
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Sensor Floating Telemetry Card */}
        {selectedSensor && (
          <div className="absolute top-4 left-4 p-3.5 bg-[#091122]/90 backdrop-blur-md border border-cyan-800/40 rounded-lg max-w-xs shadow-xl text-xs select-none">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-cyan-900/30">
              <div className="font-semibold text-white truncate pr-2">
                {selectedSensor.name}
              </div>
              <span
                className={`font-mono text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                  selectedSensor.status === 'under-attack'
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-600'
                    : selectedSensor.status === 'elevated'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-600'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-600'
                }`}
              >
                {selectedSensor.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px] tabular-nums">
              <div>
                <span className="text-slate-500 text-[10px] block">THROUGHPUT</span>
                <span className="text-cyan-300 font-bold">{selectedSensor.throughputGbps} Gbps</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">ACTIVE AGENTS</span>
                <span className="text-slate-200">{selectedSensor.activeAgents}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] block">BLOCKED THREATS (24H)</span>
                <span className="text-emerald-400 font-bold">
                  {selectedSensor.blockedRequestsCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Status Ticker Overlay */}
        <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-3 px-3 py-2 bg-[#091122]/85 backdrop-blur-sm border border-cyan-900/30 rounded text-xs text-slate-400 font-mono select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACTIVE THREATS: <strong className="text-cyan-300 tabular-nums">{filteredThreats.length}</strong></span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>INTERCEPTION RATE: <strong className="text-emerald-300 tabular-nums">99.98%</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Critical Vectors
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> High/Medium Vectors
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
