/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Tech_ComputationalObeliskAsset: AssetContract = {
  id: "TECH-02",
  name: "Obélisque de Calcul Scalaire",
  code: "TECH-OBELISK-DATA",
  parentContinent: "TECH_OS",
  category: "Télémesure & Routage",
  purpose: "Relais de bus synchrone et émetteur de signaux quantiques",
  footprint: { width: 5, depth: 5, height: 11 },
  polyBudget: { maxTriangles: 6000, targetMeshes: 6 },
  interiorAvailable: false,
  metadata: {
    author: "Corporation Solaire Imhotep",
    version: "1.8.0",
    architectureStyle: "Obélisque Monolithique & Gravures Cyan",
    energySource: "Canalisation Magnétique de Surface",
    assignedKernel: "Tech OS Telemetry"
  },
  interactionPoints: [
    { id: "beacon", name: "Capteur Zénithal", description: "Émetteur faisceau haute fréquence", position: [0, 10, 0] },
    { id: "glyph_slot", name: "Matrice de Glyphes", description: "Bus de registres scalaires", position: [0, 4.5, 0.9] },
    { id: "pedestal", name: "Socle de Refroidissement", description: "Échangeur thermique à convection", position: [0, 0.8, 0] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Tech-ComputationalObelisk";

    const sandstoneMat = MaterialLibrary.createAncientSandstone();
    const goldMat = MaterialLibrary.createSovereignGold();
    const cyanMat = MaterialLibrary.createCyanCircuit();
    const basaltMat = MaterialLibrary.createDarkBasalt();

    // 1. Multi-tiered base pedestal
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.6, 4.2), basaltMat);
    base1.position.y = 0.3;
    base1.receiveShadow = true;
    group.add(base1);

    const base2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.6, 3.0), sandstoneMat);
    base2.position.y = 0.8;
    group.add(base2);

    // 2. Main Tapered Obelisk Shaft
    const shaftGeom = new THREE.CylinderGeometry(0.8, 1.4, 7.5, 4);
    shaftGeom.rotateY(Math.PI / 4);
    const shaft = new THREE.Mesh(shaftGeom, sandstoneMat);
    shaft.position.y = 4.8;
    shaft.castShadow = true;
    group.add(shaft);

    // 3. Glowing Cyan Circuit Inset along shaft
    const grooveGeom = new THREE.BoxGeometry(0.25, 6.2, 0.15);
    const grooveFront = new THREE.Mesh(grooveGeom, cyanMat);
    grooveFront.position.set(0, 4.8, 0.9);
    group.add(grooveFront);

    // 4. Golden Pyramidion Cap at Tip
    const capGeom = new THREE.ConeGeometry(0.85, 1.6, 4);
    capGeom.rotateY(Math.PI / 4);
    const cap = new THREE.Mesh(capGeom, goldMat);
    cap.position.y = 9.2;
    group.add(cap);

    // 5. Floating Telemetry Halo Ring
    const haloGeom = new THREE.TorusGeometry(1.6, 0.08, 8, 24);
    haloGeom.rotateX(Math.PI / 2);
    const halo = new THREE.Mesh(haloGeom, cyanMat);
    halo.position.y = 7.0;
    group.add(halo);

    // 6. Contact shadow
    group.add(MaterialLibrary.createContactShadow(3.2));

    return group;
  }
};
