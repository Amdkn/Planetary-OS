/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const Biz_SolarpunkFactoryAsset: AssetContract = {
  id: "BIZ-01",
  name: "Usine de Fabrication Solarpunk",
  code: "BIZ-FACTORY-SOLAR",
  parentContinent: "BIZ_OS",
  category: "Production & Robotique",
  purpose: "Ateliers d'usinage, fabrication d'artefacts et assemblage automatisé",
  footprint: { width: 14, depth: 12, height: 9 },
  polyBudget: { maxTriangles: 11000, targetMeshes: 10 },
  interiorAvailable: false,
  metadata: {
    author: "Consortium Industriel de Business OS",
    version: "2.1.0",
    architectureStyle: "Industriel Solarpunk & Toits en Dents de Scie",
    energySource: "Toitures Photovoltaïques & Chaleur Industrielle",
    assignedKernel: "Business OS Operations"
  },
  interactionPoints: [
    { id: "roof_solar", name: "Toiture Photovoltaïque", description: "Capteurs solaires en dents de scie", position: [0, 6.5, 0] },
    { id: "loading_dock", name: "Quai d'Expédition Robotisé", description: "Interface de chargement automatisée", position: [0, 1.2, 5.0] },
    { id: "chimney", name: "Cheminée de Filtration Écologique", description: "Capture carbone et vapeur pure", position: [-4.2, 7.5, -3.0] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "Biz-SolarpunkFactory";

    const steelMat = MaterialLibrary.createIndustrialSteel();
    const gantryMat = MaterialLibrary.createGantryOrange();
    const solarMat = MaterialLibrary.createSolarMirror();
    const goldMat = MaterialLibrary.createSovereignGold();

    // 1. Main Factory Foundation and Hall
    const base = new THREE.Mesh(new THREE.BoxGeometry(12, 1.0, 10), steelMat);
    base.position.y = 0.5;
    base.receiveShadow = true;
    group.add(base);

    // Main Workshop Building Block
    const hall = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.8, 8.5), steelMat);
    hall.position.y = 2.9;
    hall.castShadow = true;
    group.add(hall);

    // 2. Saw-tooth solar roofs (3 roof bays)
    for (let i = 0; i < 3; i++) {
      const zOffset = (i - 1) * 2.6;
      // Triangular roof profile using prism/wedge
      const roofGeom = new THREE.CylinderGeometry(1.6, 1.6, 10.4, 3);
      roofGeom.rotateZ(Math.PI / 2);
      const roof = new THREE.Mesh(roofGeom, solarMat);
      roof.position.set(0, 5.4, zOffset);
      roof.castShadow = true;
      group.add(roof);
    }

    // 3. Tall Ecological Filtration Stacks / Chimneys
    const chimney1 = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 6.2, 12), steelMat);
    chimney1.position.set(-4.2, 4.8, -2.8);
    group.add(chimney1);

    const chimneyCap1 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.4, 0.4, 12), gantryMat);
    chimneyCap1.position.set(-4.2, 7.9, -2.8);
    group.add(chimneyCap1);

    // 4. Overhead Orange Gantry Crane & Conveyor Viaduct
    const gantryRail = new THREE.Mesh(new THREE.BoxGeometry(11.5, 0.4, 0.4), gantryMat);
    gantryRail.position.set(0, 4.6, 4.6);
    group.add(gantryRail);

    [-4.5, 4.5].forEach(x => {
      const support = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.0, 0.4), gantryMat);
      support.position.set(x, 2.6, 4.6);
      group.add(support);
    });

    // 5. Automated Loading Bay doors
    const bayDoor = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.3), goldMat);
    bayDoor.position.set(0, 1.8, 4.4);
    group.add(bayDoor);

    // 6. Contact shadow
    group.add(MaterialLibrary.createContactShadow(6.8));

    return group;
  }
};
