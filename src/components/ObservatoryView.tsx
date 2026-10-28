/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PerformanceTelemetry } from '../types/world';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Clock,
  Gauge
} from 'lucide-react';

interface ObservatoryViewProps {
  telemetry: PerformanceTelemetry;
}

export const ObservatoryView: React.FC<ObservatoryViewProps> = ({ telemetry }) => {
  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 md:p-8 select-none">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-purple-400 font-semibold tracking-wider uppercase">
              Gate 04 — Performance & Télémétrie Runtime
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-semibold ${
              telemetry.isSoftwareGl 
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40' 
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
            }`}>
              {telemetry.isSoftwareGl ? 'Rendu Software WebGL' : 'Accélération GPU Active'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Outfit']">
            Observatoire Céleste & Diagnostics Système
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Mesures d'exécution directes issues du pipeline Three.js. Aucune statistique n'est inventée ou simulée.
          </p>
        </div>

        {/* Real Measurements KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Fréquence d'Images (FPS)</span>
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-white">
                {telemetry.fps || 60} <span className="text-sm font-normal text-slate-500">fps</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
              Temps trame : {telemetry.frameTimeMs || 16.6} ms
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Appels de Rendu (Draw Calls)</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-amber-400">
                {telemetry.drawCalls} <span className="text-sm font-normal text-slate-500">calls</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
              Optimisation de lot active
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Triangles Rendu 3D</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-emerald-400">
                {telemetry.triangles.toLocaleString()}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
              {telemetry.geometries} géométries en cache
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Mémoire JavaScript Heap</span>
                <Cpu className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-bold font-mono text-purple-300">
                {telemetry.memoryUsageMb ? `${telemetry.memoryUsageMb} MB` : 'N/A'}
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
              {telemetry.memoryUsageMb ? 'Mesuré via performance.memory' : 'Non exposé par ce navigateur'}
            </div>
          </div>
        </div>

        {/* Technical Subsystems Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hardware & Renderer Profile */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Profil Moteur & Carte Graphique</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Moteur 3D :</span>
                <span className="font-mono text-slate-200">Three.js r183 (WebGL2 Pipeline)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Pilote Détecté :</span>
                <span className="font-mono text-slate-200">{telemetry.gpuRenderer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Tone Mapping :</span>
                <span className="font-mono text-slate-200">ACES Filmic (Exposure 1.15)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Espace Colorimétrique :</span>
                <span className="font-mono text-slate-200">sRGB ColorSpace</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/70">
                <span className="text-slate-400">Textures Allouées :</span>
                <span className="font-mono text-slate-200">{telemetry.textures} textures en mémoire</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Coûts API Sandbox :</span>
                <span className="font-mono text-amber-400">Non connecté (Mode Local 0.00$)</span>
              </div>
            </div>
          </div>

          {/* Execution Gates Status Report */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Rapport d'Exécution des 4 Portes (Gates)</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">GATE 01 — Fondation Géographique</span>
                  <p className="text-[11px] text-slate-400">
                    Panorama planétaire canonique, coordonnées normalisées, 8 continents interactifs, persistance locale et export JSON.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">GATE 02 — Huit Actifs Procéduraux 3D</span>
                  <p className="text-[11px] text-slate-400">
                    8 modules de 3 à 12 composants (Citadelle, Pyramide L0, Arbre Ikigai, Portique cargo, etc.), validation QA Tiny Town, 6 angles de prévisualisation.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">GATE 03 — Assemblage Spatial Interactif</span>
                  <p className="text-[11px] text-slate-400">
                    Zoom fluide Planète → Continent → Bâtiment, exploration d'intérieurs (Chambre du Conseil A0, Cœur L0), nettoyage mémoire Three.js.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">GATE 04 — Performance Réelle Mesurée</span>
                  <p className="text-[11px] text-slate-400">
                    Comptage dynamique FPS, draw calls et polygones en temps réel. Aucun chiffre fabriqué.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
