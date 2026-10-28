/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { MaterialLibrary } from '../assets/materialLibrary';

export interface InteriorSceneBundle {
  rootGroup: THREE.Group;
  title: string;
  subtitle: string;
  description: string;
  cameraPos: THREE.Vector3;
  lookAtPos: THREE.Vector3;
  cleanup: () => void;
}

export function buildInteriorEnvironment(interiorType: string): InteriorSceneBundle {
  const root = new THREE.Group();
  root.name = `Interior-${interiorType}`;

  let title = "Chambre Intérieure";
  let subtitle = "Structure Spatiale A'Space";
  let description = "Exploration de l'architecture intérieure.";
  let camPos = new THREE.Vector3(0, 4, 9);
  let lookAt = new THREE.Vector3(0, 2.5, 0);

  const marbleMat = MaterialLibrary.createWhiteMarble();
  const goldMat = MaterialLibrary.createSovereignGold();
  const crystalMat = MaterialLibrary.createLuminousCrystal(0x38BDF8);
  const darkBasalt = MaterialLibrary.createDarkBasalt();
  const cyanMat = MaterialLibrary.createCyanCircuit();

  if (interiorType === 'COUNCIL_HALL') {
    title = "Chambre Haute des Délibérations A0";
    subtitle = "Centre de Consensus & Gouvernance Planétaire";
    description = "Rotonde cérémonielle en or blanc et marbre où convergent les mandats des trois OS. Au centre flotte l'hologramme synchrone de la planète A'Space.";
    camPos = new THREE.Vector3(0, 4.5, 9.5);
    lookAt = new THREE.Vector3(0, 2.5, 0);

    // Circular marble floor with concentric gold inlay
    const floor = new THREE.Mesh(new THREE.CylinderGeometry(8, 8, 0.4, 32), marbleMat);
    floor.position.y = 0.2;
    floor.receiveShadow = true;
    root.add(floor);

    const floorRing = new THREE.Mesh(new THREE.TorusGeometry(5.2, 0.1, 8, 32), goldMat);
    floorRing.rotateX(Math.PI / 2);
    floorRing.position.y = 0.42;
    root.add(floorRing);

    // Curved surrounding colonnade
    const pillarCount = 10;
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const px = Math.cos(angle) * 7.2;
      const pz = Math.sin(angle) * 7.2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 7.5, 12), marbleMat);
      col.position.set(px, 4.15, pz);
      root.add(col);

      // Gold capital ring
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.3, 0.3, 12), goldMat);
      cap.position.set(px, 7.8, pz);
      root.add(cap);
    }

    // Celestial skybox rotunda ceiling (large radius, BackSide)
    const ceiling = new THREE.Mesh(
      new THREE.SphereGeometry(32, 24, 16),
      new THREE.MeshBasicMaterial({ color: 0x030712, side: THREE.BackSide })
    );
    root.add(ceiling);

    // Central Floating Holographic Globe of A'Space Planet
    const hologramGlobe = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 24), crystalMat);
    hologramGlobe.position.set(0, 3.2, 0);
    root.add(hologramGlobe);

    // Surrounding planetary orbit rings
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.04, 8, 36), goldMat);
    ring1.rotateX(Math.PI / 3);
    ring1.position.set(0, 3.2, 0);
    root.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.04, 8, 36), cyanMat);
    ring2.rotateY(Math.PI / 4);
    ring2.position.set(0, 3.2, 0);
    root.add(ring2);

    // Council Delegates' Amphitheater Seats (Curved arc)
    for (let i = -4; i <= 4; i++) {
      const angle = (i / 10) * Math.PI + Math.PI / 2;
      const sx = Math.cos(angle) * 4.4;
      const sz = Math.sin(angle) * 4.4;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.7), goldMat);
      seat.position.set(sx, 0.8, sz);
      seat.rotation.y = -angle + Math.PI / 2;
      root.add(seat);
    }

  } else if (interiorType === 'KERNEL_CORE') {
    title = "Sanctuaire du Noyau Monolithique L0";
    subtitle = "Tech OS — Registres & Compilateur Quantique";
    description = "Salle souterraine creusée dans le grès antique. Les circuits cyan s'illuminent au rythme des compilations scalaires et de l'exécution kernel.";
    camPos = new THREE.Vector3(0, 4.0, 8.5);
    lookAt = new THREE.Vector3(0, 2.8, 0);

    // Dark Basalt Floor with glowing circuit grid
    const floor = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 16), darkBasalt);
    floor.position.y = 0.2;
    floor.receiveShadow = true;
    root.add(floor);

    // Central Monolith Processor Column
    const corePillar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 8.0, 2.4), darkBasalt);
    corePillar.position.set(0, 4.4, 0);
    root.add(corePillar);

    // Glowing Cyan Core Windows
    const coreGlow = new THREE.Mesh(new THREE.BoxGeometry(2.5, 6.0, 0.3), cyanMat);
    coreGlow.position.set(0, 4.4, 0);
    root.add(coreGlow);

    // Wall Server Monoliths
    [-5, 5].forEach((x) => {
      for (let z = -4; z <= 4; z += 2.5) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 1.8), darkBasalt);
        rack.position.set(x, 2.9, z);
        root.add(rack);

        const strip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.0, 1.4), cyanMat);
        strip.position.set(x > 0 ? x - 0.6 : x + 0.6, 2.9, z);
        root.add(strip);
      }
    });

  } else if (interiorType === 'LOGISTICS_BRIDGE') {
    title = "Passerelle de Contrôle Maritime & Dispatch";
    subtitle = "Business OS — Supervision Flotte & Docks";
    description = "Pont de commandement vitré à 360° surplombant le terminal portuaire, les grues portiques et le déchargement automatisé des navires à voiles solaires.";
    camPos = new THREE.Vector3(0, 3.8, 7.5);
    lookAt = new THREE.Vector3(0, 2.2, 0);

    const steelMat = MaterialLibrary.createIndustrialSteel();
    const gantryMat = MaterialLibrary.createGantryOrange();
    const glassMat = MaterialLibrary.createBiodomeGlass();

    // Steel Floor deck
    const floor = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 12), steelMat);
    floor.position.y = 0.2;
    floor.receiveShadow = true;
    root.add(floor);

    // Panoramic window glass wall
    const windowWall = new THREE.Mesh(new THREE.BoxGeometry(13.6, 4.5, 0.2), glassMat);
    windowWall.position.set(0, 2.6, -5.5);
    root.add(windowWall);

    // Control consoles with radar screens
    for (let x = -3.5; x <= 3.5; x += 3.5) {
      const consoleDesk = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 1.4), gantryMat);
      consoleDesk.position.set(x, 0.9, -3.2);
      root.add(consoleDesk);

      const screen = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 0.1), cyanMat);
      screen.position.set(x, 1.7, -3.6);
      screen.rotation.x = -0.2;
      root.add(screen);
    }

  } else {
    // BIOSPHERE_TERRACE
    title = "Atrium Végétal du Sanctuaire Ikigai";
    subtitle = "Life OS — Cœur Régénératif & Bassins";
    description = "Chambre intérieure creusée au cœur des racines du Grand Arbre. Les prismes de lumière solaire nourrissent les plantes aquatiques et les six cercles de vie.";
    camPos = new THREE.Vector3(0, 3.8, 8.5);
    lookAt = new THREE.Vector3(0, 2.2, 0);

    const foliageMat = MaterialLibrary.createSolarpunkFoliage(0x10B981);
    const woodMat = MaterialLibrary.createLivingWood();

    const floor = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 0.4, 24), marbleMat);
    floor.position.y = 0.2;
    root.add(floor);

    // Living root boughs arching across the ceiling
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const rootArch = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 8, 8), woodMat);
      rootArch.position.set(Math.cos(angle) * 3, 4.2, Math.sin(angle) * 3);
      rootArch.rotation.z = Math.cos(angle) * 0.4;
      rootArch.rotation.x = Math.sin(angle) * 0.4;
      root.add(rootArch);
    }

    // Central healing pool
    const pool = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.1, 24), crystalMat);
    pool.position.y = 0.42;
    root.add(pool);

    // Terraced flower urns
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.4, 1.0, 8), goldMat);
      urn.position.set(Math.cos(angle) * 4.8, 0.9, Math.sin(angle) * 4.8);
      root.add(urn);

      const plant = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), foliageMat);
      plant.position.set(Math.cos(angle) * 4.8, 1.6, Math.sin(angle) * 4.8);
      root.add(plant);
    }
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
    title,
    subtitle,
    description,
    cameraPos: camPos,
    lookAtPos: lookAt,
    cleanup,
  };
}
