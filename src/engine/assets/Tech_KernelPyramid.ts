/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Tech_KernelPyramidAsset: AssetContract = {
  id: "TECH-01",
  name: "Pyramide Kernel L0",
  code: "TECH-PYRAMID-L0",
  parentContinent: "TECH_OS",
  category: "Calcul Monolithique & Registres",
  purpose: "Processeur central planétaire et compilateur souverain",
  footprint: { width: 15, depth: 15, height: 12 },
  polyBudget: { maxTriangles: 14000, targetMeshes: 9 },
  interiorAvailable: true,
  interiorType: 'KERNEL_CORE',
  metadata: {
    author: "Corporation Solaire Imhotep",
    version: "2.5.0",
    architectureStyle: "Néo-Égyptien Cybernétique & Grès Taillé",
    energySource: "Matrice Solaire & Faisceau Cyan L0",
    assignedKernel: "Tech OS Kernel"
  },
  interactionPoints: [
    { id: "apex", name: "Pyramidion d'Or Pur", description: "Capteur héliothermique et faisceau zénithal", position: [0, 10.5, 0] },
    { id: "stream", name: "Cascade Cyan Quantique", description: "Canal de refroidissement cryogénique liquide", position: [0, 5, 4.2] },
    { id: "portal", name: "Sanctuaire du Noyau L0", description: "Entrée vers la chambre intérieure des processeurs", position: [0, 1.2, 5.5] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Tech-KernelPyramid";

    const sandstoneMat = MaterialLibrary.createAncientSandstone();
    const goldMat = MaterialLibrary.createSovereignGold();
    const cyanMat = MaterialLibrary.createCyanCircuit();
    const basaltMat = MaterialLibrary.createDarkBasalt();
    const solarMat = MaterialLibrary.createSolarMirror();

    // 1. Terraced Stepped Pyramid Base
    const step1Geom = new THREE.BoxGeometry(13, 2.0, 13);
    const step1 = new THREE.Mesh(step1Geom, sandstoneMat);
    step1.position.y = 1.0;
    step1.castShadow = true;
    step1.receiveShadow = true;
    group.add(step1);

    const step2Geom = new THREE.BoxGeometry(10.5, 2.0, 10.5);
    const step2 = new THREE.Mesh(step2Geom, sandstoneMat);
    step2.position.y = 2.8;
    step2.castShadow = true;
    group.add(step2);

    const step3Geom = new THREE.BoxGeometry(8.0, 2.2, 8.0);
    const step3 = new THREE.Mesh(step3Geom, sandstoneMat);
    step3.position.y = 4.8;
    step3.castShadow = true;
    group.add(step3);

    // 2. Upper Pyramid Slopes
    const pyramidUpperGeom = new THREE.ConeGeometry(5.2, 4.6, 4);
    pyramidUpperGeom.rotateY(Math.PI / 4);
    const pyramidUpper = new THREE.Mesh(pyramidUpperGeom, sandstoneMat);
    pyramidUpper.position.y = 7.8;
    pyramidUpper.castShadow = true;
    group.add(pyramidUpper);

    // 3. Golden Pyramidion Capstone at Apex
    const capstoneGeom = new THREE.ConeGeometry(1.6, 1.8, 4);
    capstoneGeom.rotateY(Math.PI / 4);
    const capstone = new THREE.Mesh(capstoneGeom, goldMat);
    capstone.position.y = 10.4;
    group.add(capstone);

    // 4. Luminous Cyan Energy Stream down the front facade
    const streamGeom = new THREE.BoxGeometry(1.4, 7.5, 0.4);
    const stream = new THREE.Mesh(streamGeom, cyanMat);
    stream.position.set(0, 4.2, 4.6);
    group.add(stream);

    // 5. Basalt Portal Entrance & Colossi pedestals
    const entranceGeom = new THREE.BoxGeometry(3.2, 2.2, 1.4);
    const entrance = new THREE.Mesh(entranceGeom, basaltMat);
    entrance.position.set(0, 1.1, 6.2);
    group.add(entrance);

    // Golden Hieroglyph Pylons flanking the entrance
    [-2.2, 2.2].forEach(x => {
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), goldMat);
      pylon.position.set(x, 1.6, 6.4);
      group.add(pylon);
    });

    // 6. Photovoltaic solar array terraces on the side steps
    [-4.5, 4.5].forEach(x => {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 3.2), solarMat);
      panel.position.set(x, 2.05, 0);
      group.add(panel);
    });

    // 7. Ground contact shadow
    group.add(MaterialLibrary.createContactShadow(7.5));

    return group;
  }
};
