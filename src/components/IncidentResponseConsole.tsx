import React, { useState } from 'react';
import { SecurityIncident } from '../types/soc';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Terminal, 
  Play, 
  Lock, 
  Search, 
  Filter, 
  Clock, 
  ArrowRight,
  Server
} from 'lucide-react';

interface IncidentResponseConsoleProps {
  incidents: SecurityIncident[];
  onExecutePlaybook: (incidentId: string) => void;
  compact?: boolean;
}

export const IncidentResponseConsole: React.FC<IncidentResponseConsoleProps> = ({
  incidents,
  onExecutePlaybook,
  compact = false,
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || '');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const filteredIncidents = incidents.filter((inc) => {
    const matchesSeverity = filterSeverity === 'all' || inc.severity === filterSeverity;
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.affectedAsset.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.threatActor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  const handleRunPlaybook = (id: string) => {
    setIsExecuting(true);
    setExecutionLog([
      `[INIT] Engaging SOAR containment pipeline for ${selectedIncident?.affectedAsset}...`,
      `[EBPF] Enforcing micro-segmentation ingress block rule...`,
      `[AUTH] Invalidating active Kerberos TGT and bearer session tokens...`,
      `[AUDIT] Cryptographic forensic dump exported to S3 cold vault.`,
      `[SUCCESS] Playbook successfully executed. Asset isolated from intranet.`,
    ]);

    setTimeout(() => {
      onExecutePlaybook(id);
      setIsExecuting(false);
    }, 1200);
  };

  return (
    <div className={`flex flex-col bg-[#070d18] border border-cyan-900/30 rounded-xl overflow-hidden ${compact ? 'h-[440px]' : 'h-full min-h-[580px]'}`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1222] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <h2 className="font-display font-bold text-sm tracking-wide text-white uppercase">
            Incident Dispatch & Mitigation Command
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {incidents.filter(i => i.status === 'Investigating').length} OPEN INVESTIGATIONS
          </span>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-slate-900 p-0.5 rounded border border-slate-800 text-xs">
            {['all', 'critical', 'high'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded capitalize cursor-pointer transition-colors text-[11px] ${
                  filterSeverity === sev
                    ? 'bg-cyan-950 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Incidents Queue */}
        <div className="md:col-span-5 border-r border-cyan-900/20 flex flex-col bg-[#060a14] overflow-hidden">
          {/* Search box */}
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search affected host, actor, or vector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#091122] border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Incident List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filteredIncidents.map((incident) => {
              const isSelected = selectedIncident?.id === incident.id;
              const isCritical = incident.severity === 'critical';

              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-l-2 border-cyan-400'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-slate-400 font-medium">
                      {incident.id}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-600/50'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-600/50'
                      }`}
                    >
                      {incident.severity}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-100 mb-1 line-clamp-1">
                    {incident.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="truncate max-w-[160px] text-slate-300">
                      {incident.affectedAsset}
                    </span>
                    <span
                      className={`${
                        incident.status === 'Investigating'
                          ? 'text-amber-400'
                          : incident.status === 'Contained'
                          ? 'text-cyan-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Forensic Inspector & Playbook Execution */}
        {selectedIncident && (
          <div className="md:col-span-7 flex flex-col bg-[#070e1c] p-4 overflow-y-auto">
            {/* Incident Header */}
            <div className="flex items-start justify-between pb-3 mb-3 border-b border-cyan-900/30">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-cyan-400 font-bold">
                    {selectedIncident.id}
                  </span>
                  <span className="text-slate-400 font-mono text-xs">·</span>
                  <span className="text-slate-400 font-mono text-xs">
                    {selectedIncident.detectionTime}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-display">
                  {selectedIncident.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">MITRE TACTIC</span>
                <span className="text-xs font-mono text-rose-300 font-semibold">
                  {selectedIncident.mitreTactic}
                </span>
              </div>
            </div>

            {/* Incident Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-[#091224] rounded border border-cyan-900/30 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block">TARGET ASSET</span>
                <div className="flex items-center gap-1.5 text-slate-200 truncate mt-0.5">
                  <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{selectedIncident.affectedAsset}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">ATTRIBUTED ACTOR</span>
                <span className="text-amber-300 font-semibold block mt-0.5">
                  {selectedIncident.threatActor}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">ASSIGNED LEAD</span>
                <span className="text-slate-300 block mt-0.5">
                  {selectedIncident.assignedAnalyst}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">REMEDIATION POSTURE</span>
                <span
                  className={`font-semibold block mt-0.5 ${
                    selectedIncident.playbookExecuted
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {selectedIncident.playbookExecuted ? 'Mitigation Deployed' : 'Action Required'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-400 font-mono uppercase block mb-1">
                Forensic Analysis & Triage Findings
              </span>
              <p className="text-xs text-slate-300 leading-relaxed bg-[#050912] p-3 rounded border border-slate-800 font-sans">
                {selectedIncident.description}
              </p>
            </div>

            {/* Automated Playbook Trigger Box */}
            <div className="p-3.5 bg-gradient-to-br from-[#0c1a30] to-[#07101f] border border-cyan-500/40 rounded-lg mb-4 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white uppercase font-display">
                    SOAR Playbook: {selectedIncident.playbookName}
                  </span>
                </div>
                {selectedIncident.playbookExecuted && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Executed
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 mb-3">
                Automated orchestration will enact micro-segmentation, revoke Kerberos tickets, and notify SOC director.
              </p>

              <button
                disabled={isExecuting || selectedIncident.playbookExecuted}
                onClick={() => handleRunPlaybook(selectedIncident.id)}
                className={`w-full py-2 px-4 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  selectedIncident.playbookExecuted
                    ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                    : isExecuting
                    ? 'bg-cyan-900 text-cyan-300 cursor-wait'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                }`}
              >
                {selectedIncident.playbookExecuted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Playbook Already Executed & Verified</span>
                  </>
                ) : isExecuting ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span>Executing SOAR Mitigation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Execute Playbook Now</span>
                  </>
                )}
              </button>
            </div>

            {/* Execution Log Terminal */}
            {executionLog.length > 0 && (
              <div className="p-3 bg-[#04070e] border border-cyan-950 rounded font-mono text-[11px] text-cyan-300/90 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-500 pb-1 mb-1 border-b border-slate-900">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>SOAR EXECUTION AUDIT TRAIL</span>
                </div>
                {executionLog.map((log, i) => (
                  <div key={i} className="leading-snug">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
