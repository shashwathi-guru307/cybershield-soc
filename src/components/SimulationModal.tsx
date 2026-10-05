import React from 'react';
import { ThreatVectorCategory } from '../types/soc';
import { Zap, X, ShieldAlert, AlertTriangle, ArrowRight, Flame } from 'lucide-react';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerSimulation: (scenario: {
    name: string;
    vector: ThreatVectorCategory;
    targetNodeId: string;
    targetName: string;
    severity: 'critical' | 'high';
    bandwidthMbps: number;
    description: string;
    mitreTactic: string;
  }) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  onTriggerSimulation,
}) => {
  if (!isOpen) return null;

  const scenarios: {
    id: string;
    title: string;
    vector: ThreatVectorCategory;
    targetNodeId: string;
    targetName: string;
    severity: 'critical' | 'high';
    bandwidthMbps: number;
    description: string;
    mitreTactic: string;
    actor: string;
  }[] = [
    {
      id: 'sim-apt29',
      title: 'Simulate APT-29 Kerberoasting & Token Theft',
      vector: 'APT-29 Kerberoasting',
      targetNodeId: 'sensor-us-west',
      targetName: 'US-West Silicon Valley SOC',
      severity: 'critical',
      bandwidthMbps: 5400,
      description: 'Adversary leverages RC4-HMAC ticket requests to extract domain administrator Service Principal Names.',
      mitreTactic: 'Credential Access (T1558.003)',
      actor: 'APT29 / Midnight Blizzard',
    },
    {
      id: 'sim-ddos',
      title: 'Simulate 450 Gbps Anycast SYN Flood',
      vector: 'DDoS / Syn Flood',
      targetNodeId: 'sensor-ap-southeast',
      targetName: 'AP-Southeast Singapore Bastion',
      severity: 'high',
      bandwidthMbps: 450000,
      description: 'Distributed botnet saturating edge TCP state tables across Asia-Pacific egress nodes.',
      mitreTactic: 'Impact (T1498.001)',
      actor: 'Mirai Cluster 11',
    },
    {
      id: 'sim-ransomware',
      title: 'Simulate LockBit 3.0 Lateral Encryption Probe',
      vector: 'LockBit Ransomware',
      targetNodeId: 'sensor-eu-central',
      targetName: 'EU-Central Frankfurt Node',
      severity: 'critical',
      bandwidthMbps: 8900,
      description: 'Active SMB v1 probe attempting PsExec remote execution and volume shadow copy wipe.',
      mitreTactic: 'Impact (T1486)',
      actor: 'LockBit Syndicate',
    },
    {
      id: 'sim-zeroday',
      title: 'Simulate Ingress Zero-Day RCE (CVE-2026-3841)',
      vector: 'Zero-Day RCE (CVE-2026-3841)',
      targetNodeId: 'sensor-us-east',
      targetName: 'US-East Ashburn Edge Hub',
      severity: 'critical',
      bandwidthMbps: 2100,
      description: 'Heap corruption trigger against HTTP/2 multiplexing daemon allowing arbitrary unauthenticated code execution.',
      mitreTactic: 'Initial Access (T1190)',
      actor: 'Volt Typhoon Cyber Unit',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      <div className="w-full max-w-2xl bg-[#091122] border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0c172e] border-b border-cyan-900/40">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider">
              SOC Threat Injection & Playbook Simulator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-slate-300 mb-4">
            Select an adversary threat profile below to inject simulated hostile packets into the live telemetry mesh. Observe real-time trajectory arcs on the world map, waveform spikes in anomaly detection, and execute automated containment playbooks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {scenarios.map((sc) => (
              <div
                key={sc.id}
                onClick={() => {
                  onTriggerSimulation({
                    name: sc.title,
                    vector: sc.vector,
                    targetNodeId: sc.targetNodeId,
                    targetName: sc.targetName,
                    severity: sc.severity,
                    bandwidthMbps: sc.bandwidthMbps,
                    description: sc.description,
                    mitreTactic: sc.mitreTactic,
                  });
                  onClose();
                }}
                className="p-3.5 rounded-lg bg-[#070d18] border border-cyan-900/30 hover:border-cyan-400/80 hover:bg-[#0c1830] transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-rose-950/80 text-rose-300 border border-rose-600/50">
                      {sc.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {sc.actor.split('/')[0]}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {sc.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-snug mb-2 font-sans">
                    {sc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-400">
                  <span>Target: {sc.targetName.split(' ')[0]}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inject Threat <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded bg-[#060a14] border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              Simulations run in sovereign eBPF sandbox. No production assets are harmed.
            </span>
            <button
              onClick={onClose}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
