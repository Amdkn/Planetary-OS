/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export type ContinentId = 
  | 'A0_CITADEL'
  | 'TECH_OS'
  | 'LIFE_OS'
  | 'BIZ_OS'
  | 'L2_CRYO'
  | 'L2_VOLCANO'
  | 'L2_ATOLL'
  | 'L2_PLATEAU';

export type OSKernelType = 'CITADEL' | 'TECH' | 'LIFE' | 'BUSINESS' | 'EXPANSION';

export interface LocationAnchor {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  kernelType: OSKernelType;
  // Normalized 2D coordinates on the canonical planetary panorama (0-100%)
  panoramaCoords: {
    x: number; // percentage from left
    y: number; // percentage from top
    radius: number; // click radius in %
  };
  // 3D coordinates in the planetary navigation space
  world3DCoords: {
    x: number;
    y: number;
    z: number;
  };
  // Color accents for Solarpunk sci-fi palette
  accentColor: string;
  badgeColor: string;
  description: string;
  frameworks?: string[];
  subZones: SubZoneAnchor[];
  primaryAssetIds: string[];
}

export interface SubZoneAnchor {
  id: string;
  name: string;
  purpose: string;
  coords3D: [number, number, number];
}

export interface WorldManifest {
  version: string;
  canonicalEpoch: string;
  primaryImage: string;
  referenceImages: {
    a0Citadel: string;
    techOs: string;
    lifeOs: string;
    businessOs: string;
    archipelago: string;
    panorama: string;
  };
  continents: LocationAnchor[];
}

// Asset Factory Contract
export interface AssetContract {
  id: string;
  name: string;
  code: string;
  parentContinent: ContinentId;
  category: string;
  purpose: string;
  footprint: {
    width: number;
    depth: number;
    height: number;
  };
  polyBudget: {
    maxTriangles: number;
    targetMeshes: number;
  };
  interiorAvailable: boolean;
  interiorType?: 'COUNCIL_HALL' | 'KERNEL_CORE' | 'BIOSPHERE_TERRACE' | 'LOGISTICS_BRIDGE';
  metadata: {
    author: string;
    version: string;
    architectureStyle: string;
    energySource: string;
    assignedKernel: string;
  };
  interactionPoints: {
    id: string;
    name: string;
    description: string;
    position: [number, number, number];
  }[];
  // Procedural generator method
  generate: () => THREE.Group;
}

export interface AssetValidationResult {
  assetId: string;
  timestamp: number;
  passed: boolean;
  triangles: number;
  vertices: number;
  meshCount: number;
  materialCount: number;
  boundingBox: {
    width: number;
    height: number;
    depth: number;
  };
  checks: {
    name: string;
    passed: boolean;
    details: string;
  }[];
  artisticApproval: 'APPROVED' | 'PENDING' | 'REJECTED';
}

// Future Agentic Integration Contract
export interface AgentMissionState {
  missionId: string;
  title: string;
  assignedAssetId: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED' | 'COMPLETED' | 'STANDBY';
  leadAgent: string;
  workflowId: string;
  evidenceRef: string | null;
  lastTelemetry: string;
  isSimulated: true; // Strictly marked as simulated until backend connection
}

export interface PerformanceTelemetry {
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  triangles: number;
  geometries: number;
  textures: number;
  loadedAssets: number;
  sceneLoadDurationMs: number;
  memoryUsageMb: number | null;
  gpuRenderer: string;
  isSoftwareGl: boolean;
}
