/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Volume2, 
  VolumeX, 
  Eye, 
  RotateCw, 
  SunMedium, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { sound } from '../utils/audio';

interface BottomControlDockProps {
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  onResetCamera: () => void;
  activeViewLabel?: string;
  wireframe?: boolean;
  onToggleWireframe?: () => void;
  lightingPreset?: 'DAY' | 'SUNSET' | 'CYBER_NIGHT';
  onChangeLighting?: (preset: 'DAY' | 'SUNSET' | 'CYBER_NIGHT') => void;
}

export const BottomControlDock: React.FC<BottomControlDockProps> = ({
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
  activeViewLabel = "Vue Orbitale",
  wireframe,
  onToggleWireframe,
  lightingPreset = 'DAY',
  onChangeLighting,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(sound.enabled);

  const toggleAudio = () => {
    sound.enabled = !sound.enabled;
    setAudioEnabled(sound.enabled);
    if (sound.enabled) sound.playClick(880);
  };

  return (
    <div 
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ease-out select-none ${
        collapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
      style={{ maxWidth: 'min(920px, 94vw)' }}
    >
      {/* Collapse/Expand tab button attached to the top edge */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => {
            sound.playClick(520);
            setCollapsed(!collapsed);
          }}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium tracking-wide bg-slate-900/90 text-slate-300 hover:text-amber-300 border border-b-0 border-slate-700/80 rounded-t-lg backdrop-blur-md shadow-lg transition-colors cursor-pointer"
        >
          {collapsed ? (
            <>
              <ChevronUp className="w-3 h-3 text-amber-400" />
              <span>Afficher les Commandes (H)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Masquer l'Interface</span>
            </>
          )}
        </button>
      </div>

      {/* Main Glassmorphic Control Bar */}
      <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl px-4 py-2.5 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3 md:gap-6 text-xs text-slate-300">
        {/* Left segment: Active View Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-slate-400">Mode :</span>
          <span className="font-semibold text-white tracking-wide">{activeViewLabel}</span>
        </div>

        {/* Center segment: Quick Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => {
              sound.playClick(600);
              onToggleAutoRotate();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Basculer la rotation automatique de la caméra"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Rotation</span>
          </button>

          <button
            onClick={() => {
              sound.playClick(720);
              onResetCamera();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors"
            title="Recentrer la caméra orbitale"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Recentrer</span>
          </button>

          {onToggleWireframe && (
            <button
              onClick={() => {
                sound.playClick(780);
                onToggleWireframe();
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                wireframe ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Afficher le maillage fil de fer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filaire</span>
            </button>
          )}

          {onChangeLighting && (
            <div className="flex items-center border-l border-slate-700/60 pl-1.5 ml-0.5">
              <button
                onClick={() => {
                  sound.playClick(660);
                  const next = lightingPreset === 'DAY' ? 'SUNSET' : lightingPreset === 'SUNSET' ? 'CYBER_NIGHT' : 'DAY';
                  onChangeLighting(next);
                }}
                className="flex items-center gap-1.5 px-2 py-1 text-slate-400 hover:text-amber-300 transition-colors"
                title="Cycles d'éclairage planétaire"
              >
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-medium">
                  {lightingPreset === 'DAY' ? 'Jour Solaire' : lightingPreset === 'SUNSET' ? 'Crépuscule' : 'Nuit Cyan'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Right segment: Audio Synthesizer toggle & helper */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`p-1.5 rounded-lg border transition-colors ${
              audioEnabled ? 'bg-slate-900 border-slate-700 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-600'
            }`}
            title={audioEnabled ? "Désactiver les synthétiseurs procéduraux" : "Activer les synthétiseurs audio"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <span className="hidden lg:inline text-[11px] text-slate-500">
            Navigation : Clic gauche orbiter · Clic droit pan · Molette zoom
          </span>
        </div>
      </div>
    </div>
  );
};
