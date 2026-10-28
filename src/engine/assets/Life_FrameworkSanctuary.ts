/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Life_FrameworkSanctuaryAsset: AssetContract = {
  id: "LIFE-01",
  name: "Sanctuaire du Grand Arbre Vital",
  code: "LIFE-TREE-SANCTUARY",
  parentContinent: "LIFE_OS",
  category: "Régénération & Alignement",
  purpose: "Centre d'harmonisation Ikigai et biosphère mère",
  footprint: { width: 14, depth: 14, height: 15 },
  polyBudget: { maxTriangles: 13000, targetMeshes: 10 },
  interiorAvailable: true,
  interiorType: 'BIOSPHERE_TERRACE',
  metadata: {
    author: "Guildes Végétales de Life OS",
    version: "3.1.0",
    architectureStyle: "Solarpunk Bio-Organique & Arbre Céleste",
    energySource: "Photosynthèse Quantique & Canaux d'Eau Pure",
    assignedKernel: "Life OS Alignment"
  },
  interactionPoints: [
    { id: "canopy", name: "Canopée Luminescente", description: "Feuillage bioluminescent émetteur d'oxygène", position: [0, 12, 0] },
    { id: "trunk_gate", name: "Portail Racine de l'Arbre", description: "Chambre intérieure du biome d'Ikigai", position: [0, 2.5, 2.8] },
    { id: "terrace_pools", name: "Bassins des 6 Vertus", description: "Filtration d'eau régénératrice", position: [0, 1.2, 4.5] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Life-FrameworkSanctuary";

    const woodMat = MaterialLibrary.createLivingWood();
    const foliageMat = MaterialLibrary.createSolarpunkFoliage(0x10B981);
    const foliageMatLight = MaterialLibrary.createSolarpunkFoliage(0x34D399);
    const marbleMat = MaterialLibrary.createWhiteMarble();
    const goldMat = MaterialLibrary.createSovereignGold();
    const waterMat = MaterialLibrary.createLuminousCrystal(0x38BDF8);

    // 1. Concentric circular marble terrace base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(6.4, 7.0, 1.2, 32), marbleMat);
    base1.position.y = 0.6;
    base1.receiveShadow = true;
    group.add(base1);

    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 5.4, 1.0, 24), marbleMat);
    base2.position.y = 1.6;
    group.add(base2);

    // Circular water channel ring on terrace
    const waterRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.25, 8, 32), waterMat);
    waterRing.rotateX(Math.PI / 2);
    waterRing.position.y = 1.22;
    group.add(waterRing);

    // Solarpunk golden balustrades
    const balustrade = new THREE.Mesh(new THREE.TorusGeometry(4.8, 0.1, 8, 32), goldMat);
    balustrade.rotateX(Math.PI / 2);
    balustrade.position.y = 2.15;
    group.add(balustrade);

    // 2. Giant Organic Tree Trunk (twisted multi-part boughs)
    const trunkGeom = new THREE.CylinderGeometry(1.4, 2.4, 5.5, 12);
    const trunk = new THREE.Mesh(trunkGeom, woodMat);
    trunk.position.y = 4.8;
    trunk.castShadow = true;
    group.add(trunk);

    // Secondary Root Buttresses
    const rootCount = 4;
    for (let i = 0; i < rootCount; i++) {
      const angle = (i / rootCount) * Math.PI * 2;
      const rx = Math.cos(angle) * 2.0;
      const rz = Math.sin(angle) * 2.0;
      const root = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.6, 2.5, 6), woodMat);
      root.position.set(rx, 2.8, rz);
      root.rotation.z = Math.cos(angle) * 0.35;
      root.rotation.x = Math.sin(angle) * 0.35;
      group.add(root);
    }

    // 3. Multi-cluster Volumetric Foliage Canopy (Crown of the World Tree)
    const mainCrown = new THREE.Mesh(new THREE.SphereGeometry(4.2, 16, 12), foliageMat);
    mainCrown.position.set(0, 9.5, 0);
    mainCrown.scale.set(1.2, 0.7, 1.2);
    mainCrown.castShadow = true;
    group.add(mainCrown);

    // Secondary foliage puff clusters
    const clusterPositions: [number, number, number][] = [
      [-2.4, 8.8, 1.2],
      [2.2, 9.2, -1.0],
      [0.8, 10.2, 2.0],
      [-1.5, 10.0, -1.8],
      [1.8, 8.4, 1.6]
    ];
    clusterPositions.forEach((pos, idx) => {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 10), idx % 2 === 0 ? foliageMatLight : foliageMat);
      puff.position.set(pos[0], pos[1], pos[2]);
      puff.castShadow = true;
      group.add(puff);
    });

    // 4. Luminous Heart of the Sanctuary (Internal Core)
    const heartBeacon = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9), waterMat);
    heartBeacon.position.set(0, 5.2, 0);
    group.add(heartBeacon);

    // 5. Contact shadow
    group.add(MaterialLibrary.createContactShadow(7.2));

    return group;
  }
};
