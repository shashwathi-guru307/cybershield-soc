import React, { useState, useEffect } from 'react';
import { TopNavigation, ActiveScreen } from './components/TopNavigation';
import { GlobalThreatMap } from './components/GlobalThreatMap';
import { ThreatIntelligencePanel } from './components/ThreatIntelligencePanel';
import { IncidentResponseConsole } from './components/IncidentResponseConsole';
import { SocDirectorConsole } from './components/SocDirectorConsole';
import { NewsVeracityAnalyzer } from './components/NewsVeracityAnalyzer';
import { MultiScreenWallView } from './components/MultiScreenWallView';
import { SimulationModal } from './components/SimulationModal';
import { CyberShieldLogo } from './components/CyberShieldLogo';
import { 
  INITIAL_SENSOR_NODES, 
  INITIAL_THREAT_EVENTS, 
  INITIAL_INCIDENTS 
} from './data/socData';
import { ThreatVectorCategory, ThreatEvent, SecurityIncident, SensorNode } from './types/soc';
import { 
  ShieldAlert, 
  BellRing, 
  CheckCircle2, 
  ChevronRight, 
  Zap, 
  Layers, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Users 
} from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('wall');
  const [sensorNodes, setSensorNodes] = useState<SensorNode[]>(INITIAL_SENSOR_NODES);
  const [threatEvents, setThreatEvents] = useState<ThreatEvent[]>(INITIAL_THREAT_EVENTS);
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_INCIDENTS);
  const [defconLevel, setDefconLevel] = useState<number>(2);
  const [isSimModalOpen, setIsSimModalOpen] = useState<boolean>(false);
  const [activeAlertBanner, setActiveAlertBanner] = useState<string | null>(null);

  // Periodic random background attack vector generator to keep telemetry lively
  useEffect(() => {
    const timer = setInterval(() => {
      const sourceIps = [
        '185.193.12.84', '194.26.29.50', '91.240.118.99', 
        '45.154.255.12', '103.145.22.8', '198.51.100.41'
      ];
      const randomIp = sourceIps[Math.floor(Math.random() * sourceIps.length)];
      const randomNode = sensorNodes[Math.floor(Math.random() * sensorNodes.length)];
      
      const newThreat: ThreatEvent = {
        id: `THR-${Math.floor(1000 + Math.random() * 9000)}`,
        sourceIp: randomIp,
        sourceCountry: 'Adversary Ingress Proxy',
        sourceCoords: [
          (Math.random() * 60 - 20),
          (Math.random() * 120 - 30)
        ],
        targetLocation: randomNode.name,
        targetCoords: randomNode.coords,
        vector: 'Credential Stuffing',
        severity: 'medium',
        timestamp: 'Just now',
        bandwidthMbps: Math.floor(400 + Math.random() * 1200),
        mitreTechnique: 'T1110 - Brute Force',
        status: 'intercepted',
      };

      setThreatEvents(prev => [newThreat, ...prev.slice(0, 7)]);
    }, 9000);

    return () => clearInterval(timer);
  }, [sensorNodes]);

  // Handle Playbook execution
  const handleExecutePlaybook = (incidentId: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'Mitigated',
            playbookExecuted: true,
          };
        }
        return inc;
      })
    );

    // If active alert was for this, clear it and restore DEFCON
    setActiveAlertBanner(null);
    setDefconLevel(3);

    // Reset all under-attack sensors to nominal
    setSensorNodes(prev =>
      prev.map(node => ({
        ...node,
        status: node.status === 'under-attack' ? 'nominal' : node.status,
      }))
    );
  };

  // Trigger attack simulation
  const handleTriggerSimulation = (scenario: {
    name: string;
    vector: ThreatVectorCategory;
    targetNodeId: string;
    targetName: string;
    severity: 'critical' | 'high';
    bandwidthMbps: number;
    description: string;
    mitreTactic: string;
  }) => {
    const newThreatId = `THR-${Math.floor(9500 + Math.random() * 400)}`;
    const newIncId = `INC-2026-${Math.floor(8900 + Math.random() * 99)}`;

    // Target coordinates
    const targetNode = sensorNodes.find(n => n.id === scenario.targetNodeId) || sensorNodes[0];

    const injectedThreat: ThreatEvent = {
      id: newThreatId,
      sourceIp: '185.220.101.99',
      sourceCountry: 'Hostile Ingress Cluster',
      sourceCoords: [54.5, 37.6],
      targetLocation: targetNode.name,
      targetCoords: targetNode.coords,
      vector: scenario.vector,
      severity: scenario.severity,
      timestamp: 'Just now',
      bandwidthMbps: scenario.bandwidthMbps,
      mitreTechnique: scenario.mitreTactic,
      status: 'intercepted',
    };

    const newIncident: SecurityIncident = {
      id: newIncId,
      title: scenario.name,
      severity: scenario.severity,
      status: 'Investigating',
      detectionTime: 'Just now',
      affectedAsset: `${targetNode.name} Core Gateway`,
      threatActor: 'Adversary Unit Alpha',
      mitreTactic: scenario.mitreTactic,
      description: scenario.description,
      automatedPlaybookAvailable: true,
      playbookName: `Isolate Host & Mitigate ${scenario.vector.split(' ')[0]} Vector`,
      playbookExecuted: false,
      assignedAnalyst: 'Elena Vance (Director & Incident Lead)',
    };

    // Update state
    setThreatEvents(prev => [injectedThreat, ...prev.slice(0, 7)]);
    setIncidents(prev => [newIncident, ...prev]);
    setDefconLevel(1);
    setActiveAlertBanner(`CRITICAL INCIDENT: ${scenario.name} detected at ${targetNode.name}. Containment required.`);

    // Set targeted sensor node to under-attack
    setSensorNodes(prev =>
      prev.map(n => (n.id === scenario.targetNodeId ? { ...n, status: 'under-attack' } : n))
    );
  };

  const handleToggleDefcon = () => {
    setDefconLevel(prev => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Primary Top Bar */}
      <TopNavigation
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        onOpenSimulator={() => setIsSimModalOpen(true)}
        defconLevel={defconLevel}
        onToggleDefcon={handleToggleDefcon}
      />

      {/* Critical Alert Ribbon (if active) */}
      {activeAlertBanner && (
        <div className="bg-rose-950/90 border-b border-rose-500/80 px-4 py-2 flex items-center justify-between text-xs text-rose-200 animate-pulse font-mono">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-bold">{activeAlertBanner}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveScreen('incidents')}
              className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold cursor-pointer transition-colors"
            >
              Open Incident Command
            </button>
            <button
              onClick={() => setActiveAlertBanner(null)}
              className="text-rose-400 hover:text-white cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Tactical Screen Viewport */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto p-4 md:p-6 flex flex-col">
        {/* Screen Breadcrumb & View Selector Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-cyan-900/30">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="text-cyan-400 font-semibold">CYBER DEFENSE OPERATIONS</span>
            <span>/</span>
            <span className="text-white uppercase font-bold">
              {activeScreen === 'wall'
                ? 'Operations Wall (All Screens)'
                : activeScreen === 'map'
                ? 'Screen 1: Global Threat Monitor'
                : activeScreen === 'intel'
                ? 'Screen 2: Cyber Threat Intelligence'
                : activeScreen === 'news'
                ? 'Screen 3: News Veracity & Correctness Report'
                : activeScreen === 'incidents'
                ? 'Screen 4: Incident Response Command'
                : 'Screen 5: Command Staff & Director Dossier'}
            </span>
          </div>

          {/* Quick Screen Pill Selectors */}
          <div className="flex items-center gap-1 bg-[#091122] p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveScreen('wall')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'wall'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Wall View</span>
            </button>
            <button
              onClick={() => setActiveScreen('map')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'map'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Threat Map</span>
            </button>
            <button
              onClick={() => setActiveScreen('intel')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'intel'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Threat Intel</span>
            </button>
            <button
              onClick={() => setActiveScreen('news')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'news'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>News Veracity</span>
            </button>
            <button
              onClick={() => setActiveScreen('incidents')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'incidents'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Incidents</span>
            </button>
            <button
              onClick={() => setActiveScreen('director')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeScreen === 'director'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Command Staff</span>
            </button>
          </div>
        </div>

        {/* Content Screens */}
        <div className="flex-1 flex flex-col">
          {activeScreen === 'wall' && (
            <MultiScreenWallView
              sensorNodes={sensorNodes}
              threatEvents={threatEvents}
              incidents={incidents}
              onExecutePlaybook={handleExecutePlaybook}
              onMaximizeScreen={(screen) => setActiveScreen(screen)}
            />
          )}

          {activeScreen === 'map' && (
            <GlobalThreatMap
              sensorNodes={sensorNodes}
              threatEvents={threatEvents}
              compact={false}
            />
          )}

          {activeScreen === 'intel' && (
            <ThreatIntelligencePanel compact={false} />
          )}

          {activeScreen === 'news' && (
            <NewsVeracityAnalyzer compact={false} />
          )}

          {activeScreen === 'incidents' && (
            <IncidentResponseConsole
              incidents={incidents}
              onExecutePlaybook={handleExecutePlaybook}
              compact={false}
            />
          )}

          {activeScreen === 'director' && (
            <SocDirectorConsole compact={false} />
          )}
        </div>
      </main>

      {/* Quiet, anti-slop footer */}
      <footer className="mt-auto border-t border-cyan-950/40 bg-[#040812] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-2">
          <CyberShieldLogo size="xs" showGlow={false} />
          <span className="text-slate-400">CYBERSHIELD SOVEREIGN THREAT NETWORK</span>
          <span className="text-slate-600">·</span>
          <span>RESTRICTED OPERATIONS CONSOLE</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <span>UTC TIME: 10:39:27</span>
          <span className="text-slate-600">·</span>
          <span>ENCRYPTION: AES-256-GCM / POST-QUANTUM KYBER</span>
        </div>
      </footer>

      {/* Simulation Trigger Modal */}
      <SimulationModal
        isOpen={isSimModalOpen}
        onClose={() => setIsSimModalOpen(false)}
        onTriggerSimulation={handleTriggerSimulation}
      />
    </div>
  );
}
