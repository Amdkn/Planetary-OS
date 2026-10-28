/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { AssetContract, AssetValidationResult } from '../types/world';
import { ASSET_MAP, ALL_CANONICAL_ASSETS } from '../engine/assets/assetRegistry';
import { AssetQAValidator } from '../engine/qaValidator';
import { detectSoftwareGl } from '../engine/threeUtils';
import { sound } from '../utils/audio';
import { 
  CornerUpLeft, 
  RotateCw, 
  Eye, 
  Box, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Compass,
  ArrowRight
} from 'lucide-react';

interface AssetInspectorViewProps {
  initialAssetId: string;
  onBackToContinent: () => void;
  onEnterInterior: (interiorType: string, assetName: string) => void;
}

type PreviewAngle = 'NE' | 'NW' | 'SE' | 'SW' | 'FRONT' | 'TOP';

export const AssetInspectorView: React.FC<AssetInspectorViewProps> = ({
  initialAssetId,
  onBackToContinent,
  onEnterInterior,
}) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAssetId);
  const [validation, setValidation] = useState<AssetValidationResult | null>(null);
  const [activeAngle, setActiveAngle] = useState<PreviewAngle>('NE');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);

  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const currentAssetGroup = useRef<THREE.Group | null>(null);

  const asset = ASSET_MAP[selectedAssetId] || ALL_CANONICAL_ASSETS[0];

  // Re-run QA validation on asset change
  useEffect(() => {
    if (asset) {
      const result = AssetQAValidator.validate(asset);
      setValidation(result);
    }
  }, [selectedAssetId]);

  // Set camera angle preset
  const applyCameraAngle = (angle: PreviewAngle) => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    const dist = 28;
    const height = 16;

    switch (angle) {
      case 'NE':
        cam.position.set(dist * 0.7, height, -dist * 0.7);
        break;
      case 'NW':
        cam.position.set(-dist * 0.7, height, -dist * 0.7);
        break;
      case 'SE':
        cam.position.set(dist * 0.7, height, dist * 0.7);
        break;
      case 'SW':
        cam.position.set(-dist * 0.7, height, dist * 0.7);
        break;
      case 'FRONT':
        cam.position.set(0, height * 0.8, dist);
        break;
      case 'TOP':
        cam.position.set(0, dist * 1.3, 0.01);
        break;
    }
    cam.lookAt(0, 6.0, 0);
    setActiveAngle(angle);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const isSoftwareGl = detectSoftwareGl();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 200);
    cameraRef.current = camera;
    applyCameraAngle('NE');

    // Studio Lighting
    const hemi = new THREE.HemisphereLight(0xffffff, 0x1e293b, 1.2);
    hemi.position.set(0, 40, 0);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    keyLight.position.set(20, 30, 20);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    rimLight.position.set(-20, 15, -20);
    scene.add(rimLight);

    // Floor turntable disc
    const turntableGeom = new THREE.CylinderGeometry(11, 11, 0.3, 48);
    const turntableMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6,
    });
    const turntable = new THREE.Mesh(turntableGeom, turntableMat);
    turntable.position.y = -0.15;
    scene.add(turntable);

    // Grid ring decal
    const gridRing = new THREE.Mesh(
      new THREE.RingGeometry(8, 8.2, 48),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
    );
    gridRing.rotateX(Math.PI / 2);
    gridRing.position.y = 0.02;
    scene.add(gridRing);

    // Load initial asset
    const group = asset.generate();
    group.position.set(0, 0, 0);
    scene.add(group);
    currentAssetGroup.current = group;

    // Mouse drag orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !currentAssetGroup.current) return;
      const dx = e.clientX - prevX;
      prevX = e.clientX;
      prevY = e.clientY;
      currentAssetGroup.current.rotation.y += dx * 0.008;
    };
    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId = 0;
    const animate = () => {
      if (autoRotate && !isDragging && currentAssetGroup.current) {
        currentAssetGroup.current.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      group.traverse(c => {
        if ((c as THREE.Mesh).isMesh) {
          (c as THREE.Mesh).geometry?.dispose();
        }
      });
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, [selectedAssetId]);

  // Wireframe toggle
  useEffect(() => {
    if (!currentAssetGroup.current) return;
    currentAssetGroup.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        const setMatWireframe = (m: THREE.Material) => {
          if ('wireframe' in m) {
            (m as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        };
        if (Array.isArray(mat)) mat.forEach(setMatWireframe);
        else if (mat) setMatWireframe(mat);
      }
    });
  }, [wireframe]);

  return (
    <div className="relative w-full h-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 overflow-hidden">
      {/* 3D Turntable Center Viewport */}
      <div className="relative flex-1 h-[55%] lg:h-full overflow-hidden flex items-center justify-center">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Back Button */}
        <button
          onClick={onBackToContinent}
          className="absolute top-4 left-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-md cursor-pointer"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span>Retour au Continent</span>
        </button>

        {/* 6 Standardized Preview Angles Selector */}
        <div className="absolute top-4 right-6 z-10 flex flex-wrap items-center gap-1.5 bg-slate-950/85 border border-slate-800/80 p-1.5 rounded-xl backdrop-blur-md shadow-xl text-xs">
          <span className="text-[11px] text-slate-400 px-2 font-medium flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Angles Caméra :</span>
          </span>
          {[
            { id: 'NE', label: 'Iso NE' },
            { id: 'NW', label: 'Iso NW' },
            { id: 'SE', label: 'Iso SE' },
            { id: 'SW', label: 'Iso SW' },
            { id: 'FRONT', label: 'Face' },
            { id: 'TOP', label: 'Dessus' }
          ].map((angle) => (
            <button
              key={angle.id}
              onClick={() => {
                sound.playClick(680);
                applyCameraAngle(angle.id as PreviewAngle);
              }}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                activeAngle === angle.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {angle.label}
            </button>
          ))}
        </div>

        {/* Turntable Control Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-slate-950/85 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md text-xs">
          <button
            onClick={() => {
              sound.playClick(580);
              setAutoRotate(!autoRotate);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{autoRotate ? 'Rotation Active' : 'Pause'}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(640);
              setWireframe(!wireframe);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              wireframe ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Maillage Filaire</span>
          </button>
        </div>
      </div>

      {/* Right Inspection & QA Sidebar */}
      <div className="w-full lg:w-[420px] h-[45%] lg:h-full bg-slate-950/95 border-t lg:border-t-0 lg:border-l border-slate-800/90 flex flex-col overflow-y-auto p-5 z-20">
        {/* Asset Switcher Tabs */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-2">
            Catalogue des 8 Actifs Procéduraux
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {ALL_CANONICAL_ASSETS.map(a => (
              <button
                key={a.id}
                onClick={() => {
                  sound.playClick(720);
                  setSelectedAssetId(a.id);
                }}
                className={`p-2 rounded-lg text-left border transition-all truncate text-xs ${
                  selectedAssetId === a.id
                    ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="font-mono text-[10px] text-slate-500">{a.id}</div>
                <div className="truncate font-medium">{a.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Asset Header */}
        <div className="pb-4 mb-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-cyan-400">{asset.code}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              Continent : {asset.parentContinent}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-1 font-['Outfit']">
            {asset.name}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {asset.purpose}
          </p>
        </div>

        {/* Automated QA Validator Card */}
        {validation && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  Contrôle Qualité 3D Automatisé (QA)
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                {validation.artisticApproval === 'APPROVED' ? 'CONFORME' : 'EN COURS'}
              </span>
            </div>

            {/* QA Metric grid */}
            <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs mb-3">
              <div>
                <span className="text-slate-500 text-[10px] block">Triangles</span>
                <span className="font-mono font-semibold text-amber-400">{validation.triangles.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Sous-Maillages</span>
                <span className="font-mono font-semibold text-cyan-400">{validation.meshCount} pièces</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Matériaux PBR</span>
                <span className="font-mono font-semibold text-emerald-400">{validation.materialCount} shaders</span>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-1.5 text-xs">
              {validation.checks.map((c, i) => (
                <div key={i} className="flex items-start gap-2 py-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-200">{c.name} : </span>
                    <span className="text-slate-400 text-[11px]">{c.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interaction Points */}
        <div className="mb-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Points d'Accès & Capteurs ({asset.interactionPoints.length})
          </span>
          <div className="space-y-1.5">
            {asset.interactionPoints.map(p => (
              <div key={p.id} className="p-2 rounded-lg bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{p.name}</div>
                  <div className="text-[11px] text-slate-400">{p.description}</div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-slate-950 px-2 py-1 rounded">
                  [{p.position.join(', ')}]
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Interior Entry Action if available */}
        {asset.interiorAvailable && asset.interiorType && (
          <div className="mt-auto pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                sound.playTransition();
                onEnterInterior(asset.interiorType!, asset.name);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <Box className="w-4 h-4" />
              <span>Entrer dans l'Intérieur ({asset.name})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
