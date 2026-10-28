/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export function detectSoftwareGl(glContext?: WebGLRenderingContext | WebGL2RenderingContext | null): boolean {
  try {
    const gl = glContext || document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}

export function disposeHierarchy(obj: THREE.Object3D): void {
  obj.traverse((child) => {
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
}

export function createCurvedBridge(start: THREE.Vector3, end: THREE.Vector3, width = 0.8, archHeight = 0.6): THREE.Group {
  const group = new THREE.Group();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  mid.y += archHeight;

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(20);
  
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -0.15);
  shape.lineTo(width / 2, -0.15);
  shape.lineTo(width / 2, 0.15);
  shape.lineTo(-width / 2, 0.15);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    extrudePath: curve,
    steps: 20,
    bevelEnabled: false
  });

  const mat = new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    roughness: 0.35,
    metalness: 0.2
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  // Pillar supports at start and end
  [start, end].forEach((pos) => {
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.35, pos.y, 8);
    const pillar = new THREE.Mesh(pillarGeom, mat);
    pillar.position.set(pos.x, pos.y / 2, pos.z);
    group.add(pillar);
  });

  return group;
}
