/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { WorldManifest, LocationAnchor, ContinentId } from '../types/world';
import { sound } from '../utils/audio';
import { Sparkles, MapPin, ExternalLink, Move } from 'lucide-react';

interface PlanetaryViewProps {
  manifest: WorldManifest;
  onSelectContinent: (continentId: ContinentId) => void;
  devModeEnabled: boolean;
  onUpdateContinentCoords?: (continentId: string, coords: { x: number; y: number }) => void;
}

export const PlanetaryView: React.FC<PlanetaryViewProps> = ({
  manifest,
  onSelectContinent,
  devModeEnabled,
  onUpdateContinentCoords,
}) => {
  const [hoveredContinent, setHoveredContinent] = useState<LocationAnchor | null>(null);
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Subtle animated ocean shimmer & atmospheric particle layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle nodes for atmospheric motes
    const particles = Array.from({ length: 48 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0002,
      size: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle atmospheric edge vignette
      const grad = ctx.createRadialGradient(
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.2,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.75
      );
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.0)');
      grad.addColorStop(0.7, 'rgba(2, 6, 23, 0.2)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.7)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating atmospheric motes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = 1;
        if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1;
        if (p.y > 1) p.y = 0;

        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha * (0.6 + Math.sin(time + p.x * 10) * 0.4)})`;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!devModeEnabled || !selectedAnchorId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onUpdateContinentCoords?.(selectedAnchorId, {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    });
    sound.playClick(800);
  };

  return (
    <div 
      ref={containerRef}
      onClick={handleContainerClick}
      className="relative w-full h-full overflow-hidden bg-slate-950 flex items-center justify-center cursor-default select-none"
    >
      {/* Background Canonical Planetary Panorama */}
      <img
        src={manifest.primaryImage}
        alt="A'Space Canonical Ocean Planet"
        className="w-full h-full object-cover object-center pointer-events-none filter brightness-95 contrast-105"
        referrerPolicy="no-referrer"
      />

      {/* Atmospheric Shimmer Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Developer Mode Banner */}
      {devModeEnabled && (
        <div className="absolute top-4 left-6 z-20 flex items-center gap-3 px-4 py-2 bg-slate-900/90 border border-amber-500/60 rounded-xl text-xs text-amber-300 shadow-xl backdrop-blur-md">
          <Move className="w-4 h-4 text-amber-400" />
          <span>
            Mode Développeur : Cliquez sur une ancre pour la sélectionner, puis cliquez n'importe où sur la carte pour la repositionner.
          </span>
          {selectedAnchorId && (
            <span className="font-semibold text-white bg-amber-500/30 px-2 py-0.5 rounded">
              Ancre : {selectedAnchorId}
            </span>
          )}
        </div>
      )}

      {/* Interactive Continent Anchor Zones */}
      {manifest.continents.map((continent) => {
        const isHovered = hoveredContinent?.id === continent.id;
        const isSelectedDev = selectedAnchorId === continent.id;
        const coords = continent.panoramaCoords;

        return (
          <div
            key={continent.id}
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            onMouseEnter={() => {
              setHoveredContinent(continent);
              sound.playClick(580);
            }}
            onMouseLeave={() => setHoveredContinent(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (devModeEnabled) {
                setSelectedAnchorId(continent.id);
                sound.playClick(700);
              } else {
                sound.playTransition();
                onSelectContinent(continent.id as ContinentId);
              }
            }}
          >
            {/* Radar Circular Anchor Beacon */}
            <div className="relative group cursor-pointer flex items-center justify-center">
              {/* Outer Pulse Wave */}
              <div 
                className="absolute rounded-full transition-all duration-300"
                style={{
                  width: `${coords.radius * 2.8}vw`,
                  height: `${coords.radius * 2.8}vw`,
                  border: `1.5px solid ${continent.accentColor}`,
                  opacity: isHovered ? 0.8 : 0.25,
                  transform: isHovered ? 'scale(1.08)' : 'scale(1.0)',
                  backgroundColor: isHovered ? `${continent.accentColor}15` : 'transparent'
                }}
              />

              {/* Center Beacon Marker */}
              <div 
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform duration-300 shadow-xl ${
                  isHovered ? 'scale-125' : 'scale-100'
                }`}
                style={{
                  backgroundColor: '#020617ee',
                  borderColor: isSelectedDev ? '#F59E0B' : continent.accentColor,
                  boxShadow: `0 0 16px ${continent.accentColor}66`
                }}
              >
                <MapPin className="w-4 h-4" style={{ color: continent.accentColor }} />
              </div>

              {/* Permanent Tag Label */}
              <div className="absolute top-10 whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-700/80 text-[11px] font-semibold text-slate-200 tracking-wide backdrop-blur-md shadow-lg pointer-events-none">
                {continent.shortName}
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating Detailed Inspection Card when Hovered */}
      {hoveredContinent && (
        <div 
          className="absolute bottom-20 left-6 z-20 w-96 p-4 rounded-xl bg-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-md text-slate-200 animate-in fade-in zoom-in-95 duration-150"
          style={{ borderTop: `3px solid ${hoveredContinent.accentColor}` }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
              {hoveredContinent.kernelType === 'CITADEL' ? 'Noyau Gouvernance A0' : hoveredContinent.kernelType === 'EXPANSION' ? 'Domaine d\'Expansion L2+' : `Système ${hoveredContinent.kernelType} OS`}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {hoveredContinent.id}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-1 font-['Outfit']">
            {hoveredContinent.name}
          </h3>
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            {hoveredContinent.subtitle}
          </p>

          <p className="text-xs text-slate-300 mb-3.5 leading-relaxed line-clamp-3">
            {hoveredContinent.description}
          </p>

          {/* Subzones or Frameworks */}
          {hoveredContinent.frameworks && (
            <div className="mb-3.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                Frameworks Intégrés (6 Pôles) :
              </span>
              <div className="grid grid-cols-2 gap-1 text-[11px] text-emerald-300">
                {hoveredContinent.frameworks.map((fw, i) => (
                  <div key={i} className="truncate">· {fw}</div>
                ))}
              </div>
            </div>
          )}

          {hoveredContinent.subZones && hoveredContinent.subZones.length > 0 && (
            <div className="mb-3.5 pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
                Sous-Zones d'Intérêt :
              </span>
              <div className="flex flex-wrap gap-1.5">
                {hoveredContinent.subZones.map(sz => (
                  <span key={sz.id} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {sz.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              sound.playTransition();
              onSelectContinent(hoveredContinent.id as ContinentId);
            }}
            className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <span>Entrer dans la Scène 3D du Continent</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
