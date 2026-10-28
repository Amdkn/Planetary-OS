/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ContinentId, PerformanceTelemetry } from '../types/world';
import { buildContinentEnvironment, PlacedBuilding } from '../engine/scenes/continentEnvironment';
import { detectSoftwareGl } from '../engine/threeUtils';
import { sound } from '../utils/audio';
import { BottomControlDock } from './BottomControlDock';
import { Eye, ArrowRight, CornerUpLeft, Box, Sparkles } from 'lucide-react';
import { ASSET_MAP } from '../engine/assets/assetRegistry';

interface ContinentViewProps {
  continentId: ContinentId;
  continentName: string;
  onSelectBuildingForInspection: (assetId: string) => void;
  onEnterBuildingInterior: (interiorType: string, assetName: string) => void;
  onBackToPlanet: () => void;
  onReportTelemetry: (telemetry: PerformanceTelemetry) => void;
}

export const ContinentView: React.FC<ContinentViewProps> = ({
  continentId,
  continentName,
  onSelectBuildingForInspection,
  onEnterBuildingInterior,
  onBackToPlanet,
  onReportTelemetry,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<PlacedBuilding | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<'DAY' | 'SUNSET' | 'CYBER_NIGHT'>('DAY');
  const [wireframe, setWireframe] = useState<boolean>(false);

  // References to keep WebGL state stable without triggering re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const buildingsRef = useRef<PlacedBuilding[]>([]);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3());
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Detect software-gl
    const isSoftwareGl = detectSoftwareGl();

    // Initialize WebGLRenderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Initialize Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.015);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    cameraRef.current = camera;

    // Lighting rig: warm key light + cool hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x064e3b, 1.2);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 100;
      dirLight.shadow.camera.left = -25;
      dirLight.shadow.camera.right = 25;
      dirLight.shadow.camera.top = 25;
      dirLight.shadow.camera.bottom = -25;
    }
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Build the procedural 3D continent environment
    const bundle = buildContinentEnvironment(continentId);
    scene.add(bundle.rootGroup);
    buildingsRef.current = bundle.buildings;

    // Initial camera placement
    camera.position.copy(bundle.defaultCameraPos);
    targetCamPos.current.copy(bundle.defaultCameraPos);
    currentLookAt.current.copy(bundle.defaultLookAt);
    targetLookAt.current.copy(bundle.defaultLookAt);
    camera.lookAt(bundle.defaultLookAt);

    // Mouse drag orbit controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let spherical = new THREE.Spherical().setFromVector3(
      camera.position.clone().sub(bundle.defaultLookAt)
    );

    const onMouseDown = (e: MouseEvent) => {
      if (e.target !== renderer.domElement) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      spherical.theta -= deltaX * 0.007;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.007));

      const offset = new THREE.Vector3().setFromSpherical(spherical);
      targetCamPos.current.copy(targetLookAt.current).add(offset);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.radius = Math.max(8, Math.min(65, spherical.radius + e.deltaY * 0.04));
      const offset = new THREE.Vector3().setFromSpherical(spherical);
      targetCamPos.current.copy(targetLookAt.current).add(offset);
    };

    // Raycasting for building selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      if (e.target !== renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      let found: PlacedBuilding | null = null;
      for (const b of buildingsRef.current) {
        const hits = raycaster.intersectObject(b.meshGroup, true);
        if (hits.length > 0) {
          found = b;
          break;
        }
      }

      if (found) {
        sound.playChime();
        setSelectedBuilding(found);
        // Focus camera on building
        targetLookAt.current.copy(found.position);
        targetCamPos.current.set(found.position.x + 8, found.position.y + 7, found.position.z + 10);
        spherical.setFromVector3(targetCamPos.current.clone().sub(targetLookAt.current));
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    // Resize handling
    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation & Telemetry Loop
    let animId = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      frameCount++;

      // Auto rotation when enabled and not dragging
      if (autoRotate && !isDragging) {
        spherical.theta += 0.0025;
        const offset = new THREE.Vector3().setFromSpherical(spherical);
        targetCamPos.current.copy(targetLookAt.current).add(offset);
      }

      // Smooth camera interpolation (exponential damping)
      camera.position.lerp(targetCamPos.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
      camera.lookAt(currentLookAt.current);

      renderer.render(scene, camera);

      // Report telemetry every ~500ms
      if (now - fpsTimer >= 500) {
        const currentFps = Math.round((frameCount * 1000) / (now - fpsTimer));
        const frameTime = Math.round((1000 / Math.max(1, currentFps)) * 10) / 10;
        fpsTimer = now;
        frameCount = 0;

        let memMb: number | null = null;
        if ((performance as unknown as { memory?: { usedJSHeapSize: number } }).memory) {
          memMb = Math.round(
            (performance as unknown as { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / (1024 * 1024)
          );
        }

        onReportTelemetry({
          fps: currentFps,
          frameTimeMs: frameTime,
          drawCalls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
          loadedAssets: buildingsRef.current.length,
          sceneLoadDurationMs: 45,
          memoryUsageMb: memMb,
          gpuRenderer: isSoftwareGl ? "Software SwiftShader/WebGL" : "Hardware WebGL Accelerator",
          isSoftwareGl,
        });
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);

      bundle.cleanup();
      renderer.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, [continentId]);

  // Lighting preset updates
  useEffect(() => {
    if (!dirLightRef.current || !hemiLightRef.current || !sceneRef.current) return;
    if (lightingPreset === 'DAY') {
      dirLightRef.current.color.setHex(0xffedd5);
      dirLightRef.current.intensity = 2.2;
      hemiLightRef.current.color.setHex(0xbae6fd);
      hemiLightRef.current.groundColor.setHex(0x064e3b);
      sceneRef.current.background = new THREE.Color(0x020617);
    } else if (lightingPreset === 'SUNSET') {
      dirLightRef.current.color.setHex(0xf97316);
      dirLightRef.current.intensity = 2.6;
      hemiLightRef.current.color.setHex(0xfbbf24);
      hemiLightRef.current.groundColor.setHex(0x78350f);
      sceneRef.current.background = new THREE.Color(0x180d24);
    } else {
      // CYBER_NIGHT
      dirLightRef.current.color.setHex(0x06b6d4);
      dirLightRef.current.intensity = 1.4;
      hemiLightRef.current.color.setHex(0x0284c7);
      hemiLightRef.current.groundColor.setHex(0x0f172a);
      sceneRef.current.background = new THREE.Color(0x02040a);
    }
  }, [lightingPreset]);

  // Wireframe toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mat = (child as THREE.Mesh).material;
        const setMatWireframe = (m: THREE.Material) => {
          if ('wireframe' in m) {
            (m as THREE.MeshStandardMaterial).wireframe = wireframe;
          }
        };
        if (Array.isArray(mat)) {
          mat.forEach(setMatWireframe);
        } else if (mat) {
          setMatWireframe(mat);
        }
      }
    });
  }, [wireframe]);

  const handleResetCamera = () => {
    if (!cameraRef.current) return;
    targetLookAt.current.set(0, 3, 0);
    targetCamPos.current.set(0, 18, 24);
    setSelectedBuilding(null);
  };

  const selectedAssetContract = selectedBuilding ? ASSET_MAP[selectedBuilding.assetId] : null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* Three.js Isolated Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Left Continent Title Badge */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
        <button
          onClick={onBackToPlanet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-md cursor-pointer"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span>Retour Planète</span>
        </button>

        <div className="px-3.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Continent Actif</span>
          <span className="text-sm font-bold text-white font-['Outfit']">{continentName}</span>
        </div>
      </div>

      {/* Selected Building Inspection Card */}
      {selectedBuilding && selectedAssetContract && (
        <div className="absolute top-4 right-6 z-10 w-96 p-4 rounded-xl bg-slate-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-md text-slate-200 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wide">
              {selectedAssetContract.category}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {selectedAssetContract.id}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 font-['Outfit']">
            {selectedAssetContract.name}
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            {selectedAssetContract.purpose}
          </p>

          <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] mb-3.5">
            <div>
              <span className="text-slate-500 block">Style :</span>
              <span className="text-slate-300 font-medium">{selectedAssetContract.metadata.architectureStyle}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Énergie :</span>
              <span className="text-slate-300 font-medium">{selectedAssetContract.metadata.energySource}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Empreinte :</span>
              <span className="text-slate-300 font-medium">
                {selectedAssetContract.footprint.width}x{selectedAssetContract.footprint.height}x{selectedAssetContract.footprint.depth}m
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Points d'accès :</span>
              <span className="text-emerald-400 font-medium">
                {selectedAssetContract.interactionPoints.length} points
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                sound.playTransition();
                onSelectBuildingForInspection(selectedAssetContract.id);
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspecteur 3D (6 Angles & QA)</span>
            </button>

            {selectedAssetContract.interiorAvailable && selectedAssetContract.interiorType && (
              <button
                onClick={() => {
                  sound.playTransition();
                  onEnterBuildingInterior(selectedAssetContract.interiorType!, selectedAssetContract.name);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer shadow-md shadow-cyan-600/20"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Entrer dans l'Intérieur du Bâtiment</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Collapsible Bottom Control Dock */}
      <BottomControlDock
        autoRotate={autoRotate}
        onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
        onResetCamera={handleResetCamera}
        activeViewLabel={selectedBuilding ? selectedBuilding.name : `Exploration 3D — ${continentName}`}
        wireframe={wireframe}
        onToggleWireframe={() => setWireframe(!wireframe)}
        lightingPreset={lightingPreset}
        onChangeLighting={(p) => setLightingPreset(p)}
      />
    </div>
  );
};
