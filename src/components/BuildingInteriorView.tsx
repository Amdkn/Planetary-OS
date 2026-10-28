/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { buildInteriorEnvironment } from '../engine/scenes/interiorEnvironment';
import { detectSoftwareGl } from '../engine/threeUtils';
import { sound } from '../utils/audio';
import { CornerUpLeft, RotateCw, Sparkles, Terminal, Info } from 'lucide-react';
import { AgentServiceAdapter } from '../data/agentAdapters';

interface BuildingInteriorViewProps {
  interiorType: string;
  buildingName: string;
  onBackToContinent: () => void;
}

export const BuildingInteriorView: React.FC<BuildingInteriorViewProps> = ({
  interiorType,
  buildingName,
  onBackToContinent,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [showConsole, setShowConsole] = useState<boolean>(false);

  const missions = AgentServiceAdapter.getAllMissions().slice(0, 3);
  const statusBadge = AgentServiceAdapter.getBackendStatusLabel();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const isSoftwareGl = detectSoftwareGl();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x02040a);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.2, 100);

    // Warm ambient and cool accent light
    const hemi = new THREE.HemisphereLight(0xfffbeb, 0x0284c7, 1.4);
    scene.add(hemi);

    const point = new THREE.PointLight(0x38bdf8, 3.5, 20);
    point.position.set(0, 5, 0);
    scene.add(point);

    // Build the procedural 3D interior
    const bundle = buildInteriorEnvironment(interiorType);
    scene.add(bundle.rootGroup);

    camera.position.copy(bundle.cameraPos);
    camera.lookAt(bundle.lookAtPos);

    // Smooth mouse drag look-around
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let yaw = 0;
    let pitch = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      prevX = e.clientX;
      prevY = e.clientY;

      yaw -= dx * 0.005;
      pitch = Math.max(-0.6, Math.min(0.6, pitch - dy * 0.005));

      const target = new THREE.Vector3(
        bundle.lookAtPos.x + Math.sin(yaw) * 6,
        bundle.lookAtPos.y + pitch * 4,
        bundle.lookAtPos.z - Math.cos(yaw) * 6
      );
      camera.lookAt(target);
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId = 0;
    const animate = () => {
      if (autoRotate && !isDragging) {
        yaw += 0.003;
        const target = new THREE.Vector3(
          bundle.lookAtPos.x + Math.sin(yaw) * 6,
          bundle.lookAtPos.y + pitch * 4,
          bundle.lookAtPos.z - Math.cos(yaw) * 6
        );
        camera.lookAt(target);
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

      bundle.cleanup();
      renderer.dispose();
      if (container.contains(dom)) container.removeChild(dom);
    };
  }, [interiorType]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950">
      {/* 3D Interior Viewport */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Navigation Bar */}
      <div className="absolute top-4 left-6 z-10 flex items-center gap-3">
        <button
          onClick={onBackToContinent}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-800 transition-colors shadow-lg backdrop-blur-md cursor-pointer"
        >
          <CornerUpLeft className="w-4 h-4" />
          <span>Sortir du Bâtiment</span>
        </button>

        <div className="px-3.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 backdrop-blur-md shadow-lg">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Intérieur Exploré</span>
          <span className="text-sm font-bold text-cyan-300 font-['Outfit']">{buildingName}</span>
        </div>
      </div>

      {/* Top Right Future Agent Console Toggle */}
      <div className="absolute top-4 right-6 z-10 flex items-center gap-2">
        <button
          onClick={() => {
            sound.playClick(620);
            setShowConsole(!showConsole);
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-cyan-300 transition-colors shadow-lg backdrop-blur-md cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Postes de Travail Agents</span>
        </button>
      </div>

      {/* Bottom Center Controls */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2 bg-slate-950/85 border border-slate-800 rounded-xl backdrop-blur-md shadow-xl text-xs text-slate-300">
        <button
          onClick={() => {
            sound.playClick(560);
            setAutoRotate(!autoRotate);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{autoRotate ? 'Vue Panoramique' : 'Pause'}</span>
        </button>
        <span className="text-slate-500 text-[11px]">
          Faites glisser la souris pour orienter la vue à 360°
        </span>
      </div>

      {/* Future Agent Telemetry Console Drawer */}
      {showConsole && (
        <div className="absolute top-16 right-6 z-20 w-96 p-4 rounded-xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md text-slate-200 animate-in fade-in slide-in-from-right-4 duration-150">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Intégration Agents A'Space</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
              Adapteur Typé
            </span>
          </div>

          <div className={`p-2 rounded-lg border text-[11px] mb-3 ${statusBadge.badge}`}>
            <span className="font-semibold block">{statusBadge.label}</span>
            <span className="text-slate-400 text-[10px]">
              Aucune exécution réelle n'est feinte : les flux affichés ci-dessous sont purement contractuels.
            </span>
          </div>

          <div className="space-y-2 mb-3">
            {missions.map(m => (
              <div key={m.missionId} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{m.leadAgent}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    {m.status}
                  </span>
                </div>
                <div className="text-slate-300 text-[11px] mb-1">{m.title}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  Télémétrie : {m.lastTelemetry}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowConsole(false)}
            className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            Fermer le Panneau
          </button>
        </div>
      )}
    </div>
  );
};
