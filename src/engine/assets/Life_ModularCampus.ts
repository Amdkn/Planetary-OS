/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Life_ModularCampusAsset: AssetContract = {
  id: "LIFE-02",
  name: "Campus Modulaire des 6 Pôles",
  code: "LIFE-CAMPUS-6FRAMEWORKS",
  parentContinent: "LIFE_OS",
  category: "Organisation & Méthodologie",
  purpose: "Complexe de travail des 6 frameworks de vie (Ikigai, Roue, 12WY, PARA, GTD, DEAL)",
  footprint: { width: 14, depth: 14, height: 8 },
  polyBudget: { maxTriangles: 12500, targetMeshes: 12 },
  interiorAvailable: false,
  metadata: {
    author: "Guildes Végétales de Life OS",
    version: "2.4.0",
    architectureStyle: "Dômes Géodésiques Solarpunk & Verrières",
    energySource: "Canaux Circulaires Hydro-Solaires",
    assignedKernel: "Life OS Productivity & Organization"
  },
  interactionPoints: [
    { id: "plaza", name: "Agora Centrale Circulaire", description: "Point de convergence et de synthèse", position: [0, 1.2, 0] },
    { id: "dome_para", name: "Dôme PARA & Connaissance", description: "Projets, Domaines, Ressources, Archives", position: [4.2, 2.5, 0] },
    { id: "dome_gtd", name: "Dôme GTD & Action", description: "Collecte, Traitement et Exécution sereine", position: [2.1, 2.5, 3.6] },
    { id: "dome_12wy", name: "Dôme 12-Week Year", description: "Cycles d'accélération et jalons trimestriels", position: [-2.1, 2.5, 3.6] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Life-ModularCampus";

    const marbleMat = MaterialLibrary.createWhiteMarble();
    const goldMat = MaterialLibrary.createSovereignGold();
    const glassMat = MaterialLibrary.createBiodomeGlass();
    const foliageMat = MaterialLibrary.createSolarpunkFoliage(0x10B981);
    const waterMat = MaterialLibrary.createLuminousCrystal(0x38BDF8);

    // 1. Central Plaza circular base
    const baseGeom = new THREE.CylinderGeometry(6.6, 7.0, 0.8, 32);
    const base = new THREE.Mesh(baseGeom, marbleMat);
    base.position.y = 0.4;
    base.receiveShadow = true;
    group.add(base);

    // Central reflecting pool
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 24), waterMat);
    pool.position.y = 0.82;
    group.add(pool);

    // Central Monolith Fountain
    const fountain = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 2.2, 8), goldMat);
    fountain.position.y = 1.6;
    group.add(fountain);

    // 2. Six Circular Biodome Pavilions surrounding the center
    const domeCount = 6;
    const radius = 4.3;
    for (let i = 0; i < domeCount; i++) {
      const angle = (i / domeCount) * Math.PI * 2;
      const dx = Math.cos(angle) * radius;
      const dz = Math.sin(angle) * radius;

      // Dome stone base
      const domeBase = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.4, 0.6, 12), marbleMat);
      domeBase.position.set(dx, 0.9, dz);
      group.add(domeBase);

      // Glass Geodesic Biodome
      const domeGlass = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), glassMat);
      domeGlass.position.set(dx, 1.2, dz);
      group.add(domeGlass);

      // Internal foliage plant inside each dome
      const plant = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 6), foliageMat);
      plant.position.set(dx, 1.4, dz);
      group.add(plant);

      // Connecting sky-bridge to center
      const bridgeLen = 2.4;
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, bridgeLen), goldMat);
      bridge.position.set(dx * 0.55, 0.85, dz * 0.55);
      bridge.rotation.y = -angle + Math.PI / 2;
      group.add(bridge);
    }

    // 3. Contact shadow
    group.add(MaterialLibrary.createContactShadow(7.0));

    return group;
  }
};
