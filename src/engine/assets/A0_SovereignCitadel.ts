/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const A0_SovereignCitadelAsset: AssetContract = {
  id: "A0-01",
  name: "Citadelle Souveraine A0",
  code: "A0-CITADEL-CORE",
  parentContinent: "A0_CITADEL",
  category: "Gouvernance & Supervision",
  purpose: "Centre stratégique planétaire et palais de consensus",
  footprint: { width: 14, depth: 14, height: 16 },
  polyBudget: { maxTriangles: 12000, targetMeshes: 8 },
  interiorAvailable: true,
  interiorType: 'COUNCIL_HALL',
  metadata: {
    author: "Atelier A0 Architecture",
    version: "1.4.0",
    architectureStyle: "Futurisme Solaire Palatial & Or Blanc",
    energySource: "Faisceau Zénithal Éthéré",
    assignedKernel: "A0 Strategic Command"
  },
  interactionPoints: [
    { id: "spire", name: "Spire Zénithale", description: "Colonne d'énergie ascensionnelle", position: [0, 14, 0] },
    { id: "council", name: "Chambre des Délibérations", description: "Accès à la salle intérieure du Conseil", position: [0, 3, 2.5] },
    { id: "rings", name: "Anneaux de Gravité Céleste", description: "Stabilisateurs gyroscopiques", position: [0, 8, 0] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "A0-SovereignCitadel";

    const marbleMat = MaterialLibrary.createWhiteMarble();
    const goldMat = MaterialLibrary.createSovereignGold();
    const crystalMat = MaterialLibrary.createLuminousCrystal(0x38BDF8);

    // 1. Base podium: Circular stepped terraces with waterfalls cutouts
    const baseGeom = new THREE.CylinderGeometry(6.5, 7.2, 1.2, 32);
    const baseMesh = new THREE.Mesh(baseGeom, marbleMat);
    baseMesh.position.y = 0.6;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Gold trim ring on base
    const baseRingGeom = new THREE.TorusGeometry(6.6, 0.15, 12, 32);
    baseRingGeom.rotateX(Math.PI / 2);
    const baseRingMesh = new THREE.Mesh(baseRingGeom, goldMat);
    baseRingMesh.position.y = 1.2;
    group.add(baseRingMesh);

    // 2. Second Terrace: Colonaded tier
    const tier2Geom = new THREE.CylinderGeometry(4.8, 5.2, 1.6, 24);
    const tier2Mesh = new THREE.Mesh(tier2Geom, marbleMat);
    tier2Mesh.position.y = 2.0;
    tier2Mesh.castShadow = true;
    group.add(tier2Mesh);

    // Outer gold colonnade pillars (Instanced or grouped)
    const pillarCount = 8;
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const px = Math.cos(angle) * 4.2;
      const pz = Math.sin(angle) * 4.2;
      const pillarGeom = new THREE.CylinderGeometry(0.2, 0.25, 2.8, 8);
      const pillar = new THREE.Mesh(pillarGeom, goldMat);
      pillar.position.set(px, 3.4, pz);
      group.add(pillar);
    }

    // 3. Central Palace Dome
    const domeGeom = new THREE.SphereGeometry(2.4, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const domeMesh = new THREE.Mesh(domeGeom, goldMat);
    domeMesh.position.y = 2.8;
    group.add(domeMesh);

    // 4. Monumental Vertical Spire (Luminous Tower)
    const spireGeom = new THREE.ConeGeometry(0.9, 8.5, 6);
    const spireMesh = new THREE.Mesh(spireGeom, marbleMat);
    spireMesh.position.y = 7.8;
    spireMesh.castShadow = true;
    group.add(spireMesh);

    // Gold spire capstone and needle
    const needleGeom = new THREE.CylinderGeometry(0.08, 0.2, 3.8, 8);
    const needleMesh = new THREE.Mesh(needleGeom, goldMat);
    needleMesh.position.y = 13.0;
    group.add(needleMesh);

    // 5. Floating Celestial Ring (Aura of A0)
    const floatRingGeom = new THREE.TorusGeometry(1.8, 0.12, 12, 32);
    floatRingGeom.rotateX(Math.PI / 2);
    const floatRingMesh = new THREE.Mesh(floatRingGeom, crystalMat);
    floatRingMesh.position.y = 11.2;
    group.add(floatRingMesh);

    // 6. Central Luminous Core / Beacon
    const coreGeom = new THREE.OctahedronGeometry(0.85, 0);
    const coreMesh = new THREE.Mesh(coreGeom, crystalMat);
    coreMesh.position.y = 11.2;
    group.add(coreMesh);

    // 7. Ground contact shadow
    group.add(MaterialLibrary.createContactShadow(7.4));

    return group;
  }
};
