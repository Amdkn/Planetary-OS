/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

// Shared PBR Material Factory with calibrated roughness and metalness
export class MaterialLibrary {
  // A0 Sovereign Citadel Materials
  public static createWhiteMarble(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.28,
      metalness: 0.08,
    });
  }

  public static createSovereignGold(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xEAB308,
      roughness: 0.22,
      metalness: 0.88,
    });
  }

  public static createLuminousCrystal(colorHex = 0x38BDF8): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });
  }

  // Tech OS Materials (Ancient Egypt + Cyber Kernel)
  public static createAncientSandstone(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xD4A373,
      roughness: 0.85,
      metalness: 0.05,
    });
  }

  public static createDarkBasalt(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x292524,
      roughness: 0.65,
      metalness: 0.2,
    });
  }

  public static createCyanCircuit(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x06B6D4,
      emissive: 0x06B6D4,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.5,
    });
  }

  public static createSolarMirror(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      roughness: 0.08,
      metalness: 0.92,
    });
  }

  // Life OS Materials
  public static createLivingWood(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x78350F,
      roughness: 0.75,
      metalness: 0.05,
    });
  }

  public static createSolarpunkFoliage(tint = 0x10B981): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: tint,
      roughness: 0.6,
      metalness: 0.05,
    });
  }

  public static createBiodomeGlass(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xE0F2FE,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
  }

  // Business OS Materials
  public static createIndustrialSteel(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.45,
      metalness: 0.8,
    });
  }

  public static createGantryOrange(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xEA580C,
      roughness: 0.4,
      metalness: 0.35,
    });
  }

  public static createCargoContainer(colorHex: number): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.5,
      metalness: 0.3,
    });
  }

  // Common contact shadow mesh
  public static createContactShadow(radius = 3): THREE.Mesh {
    const geom = new THREE.CircleGeometry(radius, 32);
    geom.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const shadow = new THREE.Mesh(geom, mat);
    shadow.position.y = 0.015;
    return shadow;
  }
}
