export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';

export type ThreatVectorCategory = 
  | 'DDoS / Syn Flood'
  | 'APT-29 Kerberoasting'
  | 'LockBit Ransomware'
  | 'Zero-Day RCE (CVE-2026-3841)'
  | 'Credential Stuffing'
  | 'SQL Injection & Data Exfiltration'
  | 'BGP Route Hijacking';

export interface ThreatEvent {
  id: string;
  sourceIp: string;
  sourceCountry: string;
  sourceCoords: [number, number]; // [lat, lng]
  targetLocation: string;
  targetCoords: [number, number];
  vector: ThreatVectorCategory;
  severity: ThreatSeverity;
  timestamp: string;
  bandwidthMbps: number;
  mitreTechnique: string;
  status: 'intercepted' | 'analyzing' | 'blocked';
}

export interface SecurityIncident {
  id: string;
  title: string;
  severity: ThreatSeverity;
  status: 'Investigating' | 'Contained' | 'Mitigated' | 'Escalated';
  detectionTime: string;
  affectedAsset: string;
  threatActor: string;
  mitreTactic: string;
  description: string;
  automatedPlaybookAvailable: boolean;
  playbookName: string;
  playbookExecuted: boolean;
  assignedAnalyst: string;
}

export interface SensorNode {
  id: string;
  name: string;
  region: string;
  coords: [number, number];
  status: 'nominal' | 'elevated' | 'under-attack';
  throughputGbps: number;
  blockedRequestsCount: number;
  activeAgents: number;
}

export interface AnomalyPoint {
  time: string;
  baseline: number;
  observed: number;
  anomalyScore: number;
  isSpike: boolean;
}

export interface SocPersonnel {
  name: string;
  title: string;
  role: string;
  badgeId: string;
  clearanceLevel: string;
  shift: string;
  status: 'On Duty' | 'Standby' | 'Incident Lead';
  assignedIncidentsCount: number;
  avatarUrl: string;
}
