/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Biz_LogisticsHubAsset: AssetContract = {
  id: "BIZ-02",
  name: "Hub Logistique Autonome",
  code: "BIZ-LOGISTICS-PORT",
  parentContinent: "BIZ_OS",
  category: "Logistique & Fret Maritime",
  purpose: "Dispatch maritime, stockage de conteneurs et orchestration de flux",
  footprint: { width: 14, depth: 12, height: 10 },
  polyBudget: { maxTriangles: 12000, targetMeshes: 12 },
  interiorAvailable: true,
  interiorType: 'LOGISTICS_BRIDGE',
  metadata: {
    author: "Consortium Industriel de Business OS",
    version: "2.3.0",
    architectureStyle: "Terminal Portuaire Solarpunk & Grues Portiques",
    energySource: "Énergie Marémotrice & Solaire",
    assignedKernel: "Business OS Logistics"
  },
  interactionPoints: [
    { id: "crane", name: "Grue Portique Autonome", description: "Système de transbordement robotisé", position: [-2.5, 7.5, 2.0] },
    { id: "tower", name: "Tour de Contrôle Portuaire", description: "Passerelle de dispatching maritime et radar", position: [4.5, 8.0, -3.2] },
    { id: "stacks", name: "Parc de Conteneurs Modulaires", description: "Blocs de stockage de cargaisons physiques", position: [1.2, 1.8, 0] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Biz-LogisticsHub";

    const steelMat = MaterialLibrary.createIndustrialSteel();
    const orangeMat = MaterialLibrary.createGantryOrange();
    const goldMat = MaterialLibrary.createSovereignGold();
    const glassMat = MaterialLibrary.createBiodomeGlass();

    // 1. Concrete Quayside Dock Foundation
    const quay = new THREE.Mesh(new THREE.BoxGeometry(13, 0.8, 11), steelMat);
    quay.position.y = 0.4;
    quay.receiveShadow = true;
    group.add(quay);

    // 2. Colossal Container Gantry Crane (Orange Solarpunk Portique)
    // Vertical legs
    const legGeom = new THREE.BoxGeometry(0.5, 6.8, 0.5);
    const leg1 = new THREE.Mesh(legGeom, orangeMat);
    leg1.position.set(-5.0, 4.0, -2.5);
    group.add(leg1);
    const leg2 = new THREE.Mesh(legGeom, orangeMat);
    leg2.position.set(-5.0, 4.0, 2.5);
    group.add(leg2);
    const leg3 = new THREE.Mesh(legGeom, orangeMat);
    leg3.position.set(-1.0, 4.0, -2.5);
    group.add(leg3);
    const leg4 = new THREE.Mesh(legGeom, orangeMat);
    leg4.position.set(-1.0, 4.0, 2.5);
    group.add(leg4);

    // Horizontal crane girder
    const girder = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.8, 5.5), orangeMat);
    girder.position.set(-3.0, 7.4, 0);
    girder.castShadow = true;
    group.add(girder);

    // Crane boom extension reaching over the water
    const boom = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.5, 1.0), orangeMat);
    boom.position.set(-6.5, 7.4, 0);
    group.add(boom);

    // Spreader container hoist hanging below
    const hoist = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.3, 1.0), steelMat);
    hoist.position.set(-3.0, 4.8, 0);
    group.add(hoist);

    // 3. Stacks of shipping containers (Red, Teal, Gold, Blue)
    const containerColors = [0x0284C7, 0x0D9488, 0xDC2626, 0xD97706];
    const containerPlacements = [
      { x: 1.5, y: 1.0, z: -1.8, col: 0 },
      { x: 1.5, y: 1.0, z: 0.2, col: 1 },
      { x: 1.5, y: 1.0, z: 2.2, col: 2 },
      { x: 1.5, y: 2.0, z: -1.8, col: 3 },
      { x: 1.5, y: 2.0, z: 0.2, col: 0 },
      { x: 3.5, y: 1.0, z: -0.8, col: 1 },
      { x: 3.5, y: 1.0, z: 1.2, col: 2 },
      { x: 3.5, y: 2.0, z: 1.2, col: 3 }
    ];

    containerPlacements.forEach((c) => {
      const mat = MaterialLibrary.createCargoContainer(containerColors[c.col]);
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 1.8), mat);
      box.position.set(c.x, c.y + 0.2, c.z);
      box.castShadow = true;
      group.add(box);
    });

    // 4. Harbor Master Control Tower (with panoramic glass bridge)
    const towerShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.0, 6.2, 8), steelMat);
    towerShaft.position.set(4.8, 3.8, -3.2);
    towerShaft.castShadow = true;
    group.add(towerShaft);

    // Observation bridge ring
    const towerBridge = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.3, 1.2, 12), glassMat);
    towerBridge.position.set(4.8, 6.8, -3.2);
    group.add(towerBridge);

    // Radar antenna on tower top
    const radar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6), goldMat);
    radar.position.set(4.8, 8.2, -3.2);
    group.add(radar);

    // 5. Contact shadow
    group.add(MaterialLibrary.createContactShadow(7.0));

    return group;
  }
};
