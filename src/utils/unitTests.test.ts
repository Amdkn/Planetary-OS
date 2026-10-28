/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { CANONICAL_WORLD_MANIFEST } from '../data/worldManifest';
import { ALL_CANONICAL_ASSETS } from '../engine/assets/assetRegistry';
import { AssetQAValidator } from '../engine/qaValidator';
import { AgentServiceAdapter } from '../data/agentAdapters';

test('World Manifest has canonical continents and valid coordinates', () => {
  assert.equal(CANONICAL_WORLD_MANIFEST.continents.length >= 8, true);
  
  const idSet = new Set<string>();
  for (const c of CANONICAL_WORLD_MANIFEST.continents) {
    assert.equal(idSet.has(c.id), false, `Duplicate continent id: ${c.id}`);
    idSet.add(c.id);

    // Panorama coordinates must be between 0 and 100%
    assert.equal(c.panoramaCoords.x >= 0 && c.panoramaCoords.x <= 100, true);
    assert.equal(c.panoramaCoords.y >= 0 && c.panoramaCoords.y <= 100, true);
    assert.equal(c.panoramaCoords.radius > 0, true);

    // 3D coordinates should be numeric
    assert.equal(typeof c.world3DCoords.x, 'number');
    assert.equal(typeof c.world3DCoords.y, 'number');
    assert.equal(typeof c.world3DCoords.z, 'number');
  }

  // Check the 4 core continents exist
  assert.equal(idSet.has('A0_CITADEL'), true);
  assert.equal(idSet.has('TECH_OS'), true);
  assert.equal(idSet.has('LIFE_OS'), true);
  assert.equal(idSet.has('BIZ_OS'), true);
});

test('Asset Registry contains the 8 canonical 3D modules', () => {
  assert.equal(ALL_CANONICAL_ASSETS.length, 8);
  const expectedIds = [
    'A0-01', 'A0-02', 'TECH-01', 'TECH-02',
    'LIFE-01', 'LIFE-02', 'BIZ-01', 'BIZ-02'
  ];
  
  const registeredIds = ALL_CANONICAL_ASSETS.map(a => a.id);
  for (const expected of expectedIds) {
    assert.equal(registeredIds.includes(expected), true, `Missing asset: ${expected}`);
  }
});

test('Automated QA Validator passes all 8 procedural assets', () => {
  for (const asset of ALL_CANONICAL_ASSETS) {
    const report = AssetQAValidator.validate(asset);
    assert.equal(report.passed, true, `Asset ${asset.id} failed QA: ${JSON.stringify(report.checks.filter(c => !c.passed))}`);
    assert.equal(report.meshCount >= 3, true, `Asset ${asset.id} must be composite (>= 3 parts)`);
    assert.equal(report.triangles > 0 && report.triangles <= asset.polyBudget.maxTriangles, true);
    assert.equal(report.artisticApproval, 'APPROVED');
  }
});

test('Agent Service Adapter remains honest about simulation status', () => {
  assert.equal(AgentServiceAdapter.isBackendConnected(), false);
  const status = AgentServiceAdapter.getBackendStatusLabel();
  assert.equal(status.label.includes('simulation'), true);
  
  const missions = AgentServiceAdapter.getAllMissions();
  assert.equal(missions.length >= 4, true);
  for (const m of missions) {
    assert.equal(m.isSimulated, true);
  }
});
