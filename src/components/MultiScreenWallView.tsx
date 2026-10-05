import React from 'react';
import { GlobalThreatMap } from './GlobalThreatMap';
import { ThreatIntelligencePanel } from './ThreatIntelligencePanel';
import { IncidentResponseConsole } from './IncidentResponseConsole';
import { SocDirectorConsole } from './SocDirectorConsole';
import { SensorNode, ThreatEvent, SecurityIncident } from '../types/soc';
import { Maximize2, Monitor } from 'lucide-react';
import { ActiveScreen } from './TopNavigation';

interface MultiScreenWallViewProps {
  sensorNodes: SensorNode[];
  threatEvents: ThreatEvent[];
  incidents: SecurityIncident[];
  onExecutePlaybook: (incidentId: string) => void;
  onMaximizeScreen: (screen: ActiveScreen) => void;
}

export const MultiScreenWallView: React.FC<MultiScreenWallViewProps> = ({
  sensorNodes,
  threatEvents,
  incidents,
  onExecutePlaybook,
  onMaximizeScreen,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Wall Header Ribbon matching the glowing SOC operations room in Image 3 */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#091120] border border-cyan-900/30 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-xs">
            <Monitor className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-bold tracking-wider uppercase text-white font-display">
              SOC Multi-Screen Wall View
            </span>
          </div>
          <span className="hidden md:inline text-xs text-slate-500 font-mono">|</span>
          <span className="hidden md:inline text-xs text-slate-400 font-mono">
            4 SYNCHRONIZED TACTICAL DISPLAYS
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <button
            onClick={() => onMaximizeScreen('news')}
            className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-sans text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Verify News Bulletin</span>
          </button>
          <span className="text-emerald-400 hidden sm:flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping" />
            TELEMETRY: LIVE
          </span>
        </div>
      </div>

      {/* 2x2 Grid of the 4 Wall Screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Screen 1: Global Threat Monitor */}
        <div className="relative group">
          <div className="absolute top-3 right-16 z-20">
            <button
              onClick={() => onMaximizeScreen('map')}
              title="Expand Threat Monitor to Full View"
              className="p-1 rounded bg-slate-800/80 hover:bg-cyan-900/80 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <GlobalThreatMap
            sensorNodes={sensorNodes}
            threatEvents={threatEvents}
            compact={true}
          />
        </div>

        {/* Screen 2: Cyber Threat Intelligence & Anomaly Detection */}
        <div className="relative group">
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => onMaximizeScreen('intel')}
              title="Expand Threat Intelligence to Full View"
              className="p-1 rounded bg-slate-800/80 hover:bg-cyan-900/80 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <ThreatIntelligencePanel compact={true} />
        </div>

        {/* Screen 3: Incident Dispatch & Mitigation Command */}
        <div className="relative group">
          <div className="absolute top-3 right-28 z-20">
            <button
              onClick={() => onMaximizeScreen('incidents')}
              title="Expand Incident Dispatch to Full View"
              className="p-1 rounded bg-slate-800/80 hover:bg-cyan-900/80 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <IncidentResponseConsole
            incidents={incidents}
            onExecutePlaybook={onExecutePlaybook}
            compact={true}
          />
        </div>

        {/* Screen 4: SOC Director & Personnel Command */}
        <div className="relative group">
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={() => onMaximizeScreen('director')}
              title="Expand Command Staff to Full View"
              className="p-1 rounded bg-slate-800/80 hover:bg-cyan-900/80 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <SocDirectorConsole compact={true} />
        </div>
      </div>
    </div>
  );
};
