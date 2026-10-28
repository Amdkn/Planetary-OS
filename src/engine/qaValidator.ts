/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { AssetContract, AssetValidationResult } from '../types/world';

export class AssetQAValidator {
  /**
   * Performs an automated structural and geometric audit of a 3D asset module
   * following the Tiny Town / Box Yard architectural QA principles.
   */
  public static validate(asset: AssetContract): AssetValidationResult {
    const group = asset.generate();
    
    let totalTriangles = 0;
    let totalVertices = 0;
    let meshCount = 0;
    const materialsSet = new Set<string>();

    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshCount++;
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry;
        if (geom) {
          if (geom.index) {
            totalTriangles += geom.index.count / 3;
          } else if (geom.attributes.position) {
            totalTriangles += geom.attributes.position.count / 3;
          }
          if (geom.attributes.position) {
            totalVertices += geom.attributes.position.count;
          }
        }
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => materialsSet.add(m.uuid));
        } else if (mesh.material) {
          materialsSet.add(mesh.material.uuid);
        }
      }
    });

    // Compute exact bounding box
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    const min = box.min;

    const checks: { name: string; passed: boolean; details: string }[] = [];

    // Check 1: Multi-part composite rule (minimum 3 distinct meshes for composite silhouette)
    const compositeCheck = meshCount >= 3;
    checks.push({
      name: "Structure Composite Silhouette (≥ 3 meshes)",
      passed: compositeCheck,
      details: `${meshCount} sous-maillages détectés (seuil min : 3)`
    });

    // Check 2: Triangle budget
    const budgetCheck = totalTriangles > 0 && totalTriangles <= asset.polyBudget.maxTriangles;
    checks.push({
      name: `Budget Polygonal (≤ ${asset.polyBudget.maxTriangles} tris)`,
      passed: budgetCheck,
      details: `${Math.round(totalTriangles)} triangles (budget : ${asset.polyBudget.maxTriangles})`
    });

    // Check 3: Grounding / Origin Pivot (bottom-center at y ≈ 0)
    const groundedCheck = min.y >= -0.2 && min.y <= 0.2;
    checks.push({
      name: "Pivot d'Origine & Alignement Sol (y ≈ 0)",
      passed: groundedCheck,
      details: `Min Y = ${min.y.toFixed(2)} (doit être ancré au niveau du sol)`
    });

    // Check 4: Footprint Conformity
    const footprintTolerance = 1.35; // Allow 35% margin for aesthetic overhangs
    const footprintCheck = 
      size.x <= asset.footprint.width * footprintTolerance &&
      size.z <= asset.footprint.depth * footprintTolerance &&
      size.y <= asset.footprint.height * footprintTolerance;
    checks.push({
      name: "Conformité de l'Empreinte au Sol (Footprint)",
      passed: footprintCheck,
      details: `Mesuré: ${size.x.toFixed(1)}x${size.y.toFixed(1)}x${size.z.toFixed(1)}m (Cible: ${asset.footprint.width}x${asset.footprint.height}x${asset.footprint.depth}m)`
    });

    // Check 5: Material completeness
    const materialCheck = materialsSet.size >= 2;
    checks.push({
      name: "Diversité Matériaux PBR (≥ 2 shaders)",
      passed: materialCheck,
      details: `${materialsSet.size} matériaux distincts instanciés`
    });

    // Check 6: Interaction Points
    const interactionCheck = asset.interactionPoints.length > 0;
    checks.push({
      name: "Points d'Interaction Spatiale",
      passed: interactionCheck,
      details: `${asset.interactionPoints.length} points d'intérêt configurés`
    });

    const allPassed = checks.every(c => c.passed);

    // Free temporary audit group
    group.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });

    return {
      assetId: asset.id,
      timestamp: Date.now(),
      passed: allPassed,
      triangles: Math.round(totalTriangles),
      vertices: totalVertices,
      meshCount,
      materialCount: materialsSet.size,
      boundingBox: {
        width: Math.round(size.x * 10) / 10,
        height: Math.round(size.y * 10) / 10,
        depth: Math.round(size.z * 10) / 10
      },
      checks,
      artisticApproval: allPassed ? 'APPROVED' : 'PENDING'
    };
  }
}
