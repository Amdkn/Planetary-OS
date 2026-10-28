/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract } from '../../types/world';
import { MaterialLibrary } from './materialLibrary';

export const A0_PlanetaryGatewayAsset: AssetContract = {
  id: "A0-02",
  name: "Passerelle Planétaire A0",
  code: "A0-GATEWAY-PORTAL",
  parentContinent: "A0_CITADEL",
  category: "Transport & Interconnexion",
  purpose: "Portail orbital et nœud de transfert intercontinental",
  footprint: { width: 10, depth: 8, height: 9 },
  polyBudget: { maxTriangles: 8000, targetMeshes: 7 },
  interiorAvailable: false,
  metadata: {
    author: "Atelier A0 Architecture",
    version: "1.1.0",
    architectureStyle: "Portail Spatial Arc Céleste",
    energySource: "Faisceau Céleste Récepteur",
    assignedKernel: "A0 Inter-OS Link"
  },
  interactionPoints: [
    { id: "gate_ring", name: "Anneau de Saut Subspatial", description: "Champ scalaire de transfert", position: [0, 4.5, 0] },
    { id: "pylon_left", name: "Pylône Balise Alpha", description: "Transpondeur de téléportation", position: [-3, 3.5, 0] },
    { id: "pylon_right", name: "Pylône Balise Bêta", description: "Stabilisateur de vecteur", position: [3, 3.5, 0] }
  ],
  generate: () => {
    const group = new THREE.Group();
    group.name = "A0-PlanetaryGateway";

    const marbleMat = MaterialLibrary.createWhiteMarble();
    const goldMat = MaterialLibrary.createSovereignGold();
    const crystalMat = MaterialLibrary.createLuminousCrystal(0x06B6D4);

    // 1. Gateway platform
    const platformGeom = new THREE.BoxGeometry(8, 0.8, 6);
    const platform = new THREE.Mesh(platformGeom, marbleMat);
    platform.position.y = 0.4;
    platform.receiveShadow = true;
    group.add(platform);

    // Platform gold borders
    const borderLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 6), goldMat);
    borderLeft.position.set(-3.9, 0.9, 0);
    group.add(borderLeft);
    const borderRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 6), goldMat);
    borderRight.position.set(3.9, 0.9, 0);
    group.add(borderRight);

    // 2. Gateway Monumental Arch Pylons
    const pylonGeom = new THREE.CylinderGeometry(0.6, 0.8, 6.5, 8);
    const pylonLeft = new THREE.Mesh(pylonGeom, marbleMat);
    pylonLeft.position.set(-2.8, 4.0, 0);
    pylonLeft.castShadow = true;
    group.add(pylonLeft);

    const pylonRight = new THREE.Mesh(pylonGeom, marbleMat);
    pylonRight.position.set(2.8, 4.0, 0);
    pylonRight.castShadow = true;
    group.add(pylonRight);

    // Gold rings on pylons
    [-2.8, 2.8].forEach(x => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.1, 8, 16), goldMat);
      ring.position.set(x, 6.2, 0);
      ring.rotateX(Math.PI / 2);
      group.add(ring);
    });

    // 3. Floating Portal Energy Ring
    const portalRingGeom = new THREE.TorusGeometry(2.4, 0.22, 16, 32);
    const portalRing = new THREE.Mesh(portalRingGeom, goldMat);
    portalRing.position.set(0, 4.6, 0);
    group.add(portalRing);

    // 4. Luminous Holographic Vortex Disc
    const discGeom = new THREE.CircleGeometry(2.2, 24);
    const discMesh = new THREE.Mesh(discGeom, crystalMat);
    discMesh.position.set(0, 4.6, 0.05);
    group.add(discMesh);

    // 5. Contact shadow
    group.add(MaterialLibrary.createContactShadow(4.5));

    return group;
  }
};
