/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentMissionState } from '../types/world';

export interface AgentWorkLog {
  id: string;
  timestamp: string;
  agentName: string;
  assetId: string;
  action: string;
  status: 'PENDING' | 'EXECUTING' | 'VALIDATED' | 'AWAITING_INPUT';
  isSimulated: boolean;
}

export const SIMULATED_AGENT_MISSIONS: AgentMissionState[] = [
  {
    missionId: "MISSION-A0-STRAT-01",
    title: "Supervision du Protocole de Consensus A0",
    assignedAssetId: "A0-01",
    status: "ACTIVE",
    leadAgent: "Agent Archon-A0 (Simulation)",
    workflowId: "WF-STRAT-902",
    evidenceRef: "ipfs://sim-evidence-a0-902.json",
    lastTelemetry: "Synchronisation des délibérations inter-OS stable à 99.8%",
    isSimulated: true
  },
  {
    missionId: "MISSION-TECH-KERNEL-02",
    title: "Indexation Quantique du Registre L0",
    assignedAssetId: "TECH-01",
    status: "STANDBY",
    leadAgent: "Agent Imhotep-L0 (Simulation)",
    workflowId: "WF-KERNEL-404",
    evidenceRef: null,
    lastTelemetry: "Canal d'énergie cyan stabilisé à 4.2 THz",
    isSimulated: true
  },
  {
    missionId: "MISSION-LIFE-BIOME-03",
    title: "Régulation des Terrasses Botaniques & PARA",
    assignedAssetId: "LIFE-01",
    status: "ACTIVE",
    leadAgent: "Agent Gaia-Sync (Simulation)",
    workflowId: "WF-LIFE-711",
    evidenceRef: "ipfs://sim-evidence-life-711.json",
    lastTelemetry: "Flux hydrologique solarpunk nominal dans les 6 frameworks",
    isSimulated: true
  },
  {
    missionId: "MISSION-BIZ-LOGISTICS-04",
    title: "Ordonnancement du Fret Portuaire Autonome",
    assignedAssetId: "BIZ-02",
    status: "ACTIVE",
    leadAgent: "Agent Hermes-Biz (Simulation)",
    workflowId: "WF-BIZ-105",
    evidenceRef: "ipfs://sim-evidence-biz-105.json",
    lastTelemetry: "14 navires autonomes en rotation / 3 portiques opérationnels",
    isSimulated: true
  }
];

export class AgentServiceAdapter {
  private static backendConnected: boolean = false;

  public static isBackendConnected(): boolean {
    return this.backendConnected;
  }

  public static getMissionsForAsset(assetId: string): AgentMissionState[] {
    return SIMULATED_AGENT_MISSIONS.filter(m => m.assignedAssetId === assetId);
  }

  public static getAllMissions(): AgentMissionState[] {
    return SIMULATED_AGENT_MISSIONS;
  }

  public static getBackendStatusLabel(): { label: string; badge: string } {
    if (this.backendConnected) {
      return { label: "Connecté au runtime A'Space OS", badge: "bg-emerald-950/60 text-emerald-300 border-emerald-500/40" };
    }
    return {
      label: "Données de simulation locales (Backend non connecté)",
      badge: "bg-slate-900/80 text-amber-300 border-amber-500/30"
    };
  }
}
