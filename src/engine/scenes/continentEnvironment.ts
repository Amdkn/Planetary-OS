/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { ContinentId } from '../../types/world';
import { ASSET_MAP } from '../assets/assetRegistry';
import { MaterialLibrary } from '../assets/materialLibrary';
import { createCurvedBridge } from '../threeUtils';

export interface PlacedBuilding {
  assetId: string;
  name: string;
  position: THREE.Vector3;
  meshGroup: THREE.Group;
  collider: THREE.Box3;
}

export interface ContinentSceneBundle {
  rootGroup: THREE.Group;
  buildings: PlacedBuilding[];
  cleanup: () => void;
  defaultCameraPos: THREE.Vector3;
  defaultLookAt: THREE.Vector3;
}

export function buildContinentEnvironment(continentId: ContinentId): ContinentSceneBundle {
  const root = new THREE.Group();
  root.name = `Continent-${continentId}`;
  const buildings: PlacedBuilding[] = [];

  // Ocean Water Plane surrounding continent
  const waterGeom = new THREE.PlaneGeometry(120, 120, 32, 32);
  waterGeom.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.15,
    metalness: 0.6,
    transparent: true,
    opacity: 0.88,
  });
  const water = new THREE.Mesh(waterGeom, waterMat);
  water.position.y = -0.05;
  water.receiveShadow = true;
  root.add(water);

  let defaultCam = new THREE.Vector3(0, 18, 26);
  let defaultLook = new THREE.Vector3(0, 2, 0);

  if (continentId === 'A0_CITADEL') {
    defaultCam = new THREE.Vector3(0, 20, 24);
    defaultLook = new THREE.Vector3(0, 4, 0);

    // 1. Central Circular Island Platform (White Marble Cliffs)
    const marbleMat = MaterialLibrary.createWhiteMarble();
    const goldMat = MaterialLibrary.createSovereignGold();

    // Multi-tier island
    const islandTier1 = new THREE.Mesh(new THREE.CylinderGeometry(16, 18, 2.5, 36), marbleMat);
    islandTier1.position.y = 1.25;
    islandTier1.receiveShadow = true;
    root.add(islandTier1);

    const islandTier2 = new THREE.Mesh(new THREE.CylinderGeometry(12, 13, 1.8, 32), marbleMat);
    islandTier2.position.y = 3.0;
    islandTier2.receiveShadow = true;
    root.add(islandTier2);

    // Gold trim rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(16.1, 0.2, 8, 36), goldMat);
    ring1.rotateX(Math.PI / 2);
    ring1.position.y = 2.5;
    root.add(ring1);

    // Surrounding crystal lamps
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const lx = Math.cos(angle) * 14.5;
      const lz = Math.sin(angle) * 14.5;
      const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 3.0, 8), goldMat);
      lamp.position.set(lx, 4.0, lz);
      const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), MaterialLibrary.createLuminousCrystal(0x38BDF8));
      beacon.position.set(lx, 5.7, lz);
      root.add(lamp);
      root.add(beacon);
    }

    // Radial Viaduct Bridges stretching into the ocean
    const bridgeAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    bridgeAngles.forEach((ang) => {
      const start = new THREE.Vector3(Math.cos(ang) * 16, 2.5, Math.sin(ang) * 16);
      const end = new THREE.Vector3(Math.cos(ang) * 32, 1.0, Math.sin(ang) * 32);
      root.add(createCurvedBridge(start, end, 2.4, 0.8));
    });

    // Place A0-01 (Citadel) at center
    const citadelAsset = ASSET_MAP['A0-01'];
    if (citadelAsset) {
      const group = citadelAsset.generate();
      group.position.set(0, 3.9, 0);
      root.add(group);
      buildings.push({
        assetId: 'A0-01',
        name: citadelAsset.name,
        position: new THREE.Vector3(0, 3.9, 0),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

    // Place A0-02 (Gateway) on front terrace
    const gatewayAsset = ASSET_MAP['A0-02'];
    if (gatewayAsset) {
      const group = gatewayAsset.generate();
      group.position.set(0, 2.5, 9.5);
      root.add(group);
      buildings.push({
        assetId: 'A0-02',
        name: gatewayAsset.name,
        position: new THREE.Vector3(0, 2.5, 9.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

  } else if (continentId === 'TECH_OS') {
    defaultCam = new THREE.Vector3(-4, 18, 22);
    defaultLook = new THREE.Vector3(0, 3, 0);

    const sandMat = MaterialLibrary.createAncientSandstone();
    const cyanMat = MaterialLibrary.createCyanCircuit();
    const basaltMat = MaterialLibrary.createDarkBasalt();

    // Terraced Desert Plateau
    const plateau1 = new THREE.Mesh(new THREE.BoxGeometry(32, 2.4, 28), sandMat);
    plateau1.position.y = 1.2;
    plateau1.receiveShadow = true;
    root.add(plateau1);

    const plateau2 = new THREE.Mesh(new THREE.BoxGeometry(22, 2.0, 18), sandMat);
    plateau2.position.set(-2, 3.2, -2);
    plateau2.receiveShadow = true;
    root.add(plateau2);

    // Cyan Aqueduct / Energy Canal cutting across the desert
    const canal = new THREE.Mesh(new THREE.BoxGeometry(28, 0.2, 2.8), cyanMat);
    canal.position.set(0, 2.45, 6);
    root.add(canal);

    // Desert palm trees
    const woodMat = MaterialLibrary.createLivingWood();
    const palmLeafMat = MaterialLibrary.createSolarpunkFoliage(0x059669);
    const treePositions = [[-10, 2.4, 8], [-12, 2.4, 6], [8, 2.4, 8], [11, 2.4, 5], [-8, 2.4, -9], [9, 2.4, -9]];
    treePositions.forEach(([tx, ty, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.25, 2.8, 6), woodMat);
      trunk.position.set(tx, ty + 1.4, tz);
      trunk.rotation.z = (Math.random() - 0.5) * 0.2;
      root.add(trunk);
      const crown = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1.2, 5), palmLeafMat);
      crown.position.set(tx, ty + 2.8, tz);
      root.add(crown);
    });

    // Place TECH-01 (Kernel Pyramid)
    const pyramidAsset = ASSET_MAP['TECH-01'];
    if (pyramidAsset) {
      const group = pyramidAsset.generate();
      group.position.set(-2, 4.2, -3);
      root.add(group);
      buildings.push({
        assetId: 'TECH-01',
        name: pyramidAsset.name,
        position: new THREE.Vector3(-2, 4.2, -3),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

    // Place TECH-02 (Obelisk)
    const obeliskAsset = ASSET_MAP['TECH-02'];
    if (obeliskAsset) {
      const group = obeliskAsset.generate();
      group.position.set(7.5, 2.4, 4.5);
      root.add(group);
      buildings.push({
        assetId: 'TECH-02',
        name: obeliskAsset.name,
        position: new THREE.Vector3(7.5, 2.4, 4.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

  } else if (continentId === 'LIFE_OS') {
    defaultCam = new THREE.Vector3(0, 19, 23);
    defaultLook = new THREE.Vector3(0, 3, 0);

    const grassMat = MaterialLibrary.createSolarpunkFoliage(0x059669);
    const marbleMat = MaterialLibrary.createWhiteMarble();
    const waterMat = MaterialLibrary.createLuminousCrystal(0x38BDF8);

    // Stepped Solarpunk Green Terraces
    const terr1 = new THREE.Mesh(new THREE.CylinderGeometry(17, 19, 2.2, 28), grassMat);
    terr1.position.y = 1.1;
    terr1.receiveShadow = true;
    root.add(terr1);

    const terr2 = new THREE.Mesh(new THREE.CylinderGeometry(12, 13, 1.8, 24), grassMat);
    terr2.position.set(0, 2.9, -2.5);
    terr2.receiveShadow = true;
    root.add(terr2);

    // River waterfalls running down into the ocean
    const river = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.2, 16), waterMat);
    river.position.set(0, 2.22, 5.0);
    root.add(river);

    // Place LIFE-01 (Great World Tree Sanctuary)
    const treeAsset = ASSET_MAP['LIFE-01'];
    if (treeAsset) {
      const group = treeAsset.generate();
      group.position.set(0, 3.8, -3.5);
      root.add(group);
      buildings.push({
        assetId: 'LIFE-01',
        name: treeAsset.name,
        position: new THREE.Vector3(0, 3.8, -3.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

    // Place LIFE-02 (Modular Campus of 6 frameworks)
    const campusAsset = ASSET_MAP['LIFE-02'];
    if (campusAsset) {
      const group = campusAsset.generate();
      group.position.set(0, 2.2, 7.5);
      group.scale.set(0.85, 0.85, 0.85);
      root.add(group);
      buildings.push({
        assetId: 'LIFE-02',
        name: campusAsset.name,
        position: new THREE.Vector3(0, 2.2, 7.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

  } else if (continentId === 'BIZ_OS') {
    defaultCam = new THREE.Vector3(4, 18, 22);
    defaultLook = new THREE.Vector3(0, 3, 0);

    const dockMat = MaterialLibrary.createIndustrialSteel();
    const orangeMat = MaterialLibrary.createGantryOrange();

    // Concrete Industrial Quayside Island
    const dockIsland = new THREE.Mesh(new THREE.BoxGeometry(30, 2.0, 26), dockMat);
    dockIsland.position.y = 1.0;
    dockIsland.receiveShadow = true;
    root.add(dockIsland);

    // Deep water dock canal cutout
    const basinWater = new THREE.Mesh(new THREE.BoxGeometry(10, 0.2, 14), MaterialLibrary.createLuminousCrystal(0x0369A1));
    basinWater.position.set(-6, 1.95, 6);
    root.add(basinWater);

    // Cargo ship docked
    const shipHull = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 11), orangeMat);
    shipHull.position.set(-6, 2.4, 6);
    shipHull.castShadow = true;
    root.add(shipHull);

    // Place BIZ-01 (Solarpunk Factory)
    const factoryAsset = ASSET_MAP['BIZ-01'];
    if (factoryAsset) {
      const group = factoryAsset.generate();
      group.position.set(5.5, 2.0, -4.5);
      root.add(group);
      buildings.push({
        assetId: 'BIZ-01',
        name: factoryAsset.name,
        position: new THREE.Vector3(5.5, 2.0, -4.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

    // Place BIZ-02 (Logistics Hub)
    const logisticsAsset = ASSET_MAP['BIZ-02'];
    if (logisticsAsset) {
      const group = logisticsAsset.generate();
      group.position.set(-3.5, 2.0, 1.5);
      root.add(group);
      buildings.push({
        assetId: 'BIZ-02',
        name: logisticsAsset.name,
        position: new THREE.Vector3(-3.5, 2.0, 1.5),
        meshGroup: group,
        collider: new THREE.Box3().setFromObject(group),
      });
    }

  } else {
    // Expansion Continents (L2 Volcano, Cryo, Atoll, Plateau)
    const sandMat = MaterialLibrary.createAncientSandstone();
    const rockMat = continentId === 'L2_VOLCANO'
      ? MaterialLibrary.createDarkBasalt()
      : continentId === 'L2_CRYO'
        ? MaterialLibrary.createWhiteMarble()
        : MaterialLibrary.createSolarpunkFoliage(0x14B8A6);

    const island = new THREE.Mesh(new THREE.CylinderGeometry(14, 16, 2.2, 24), rockMat);
    island.position.y = 1.1;
    island.receiveShadow = true;
    root.add(island);

    // Exploration beacon monument
    const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(1.6), MaterialLibrary.createLuminousCrystal(0xEAB308));
    beacon.position.y = 5.2;
    root.add(beacon);
  }

  const cleanup = () => {
    root.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  };

  return {
    rootGroup: root,
    buildings,
    cleanup,
    defaultCameraPos: defaultCam,
    defaultLookAt: defaultLook,
  };
}
