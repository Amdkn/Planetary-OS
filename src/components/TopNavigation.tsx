/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Globe, Compass, Cpu, Activity, Settings2 } from 'lucide-react';

export type ActiveNavTab = 'PLANET' | 'CONTINENT' | 'FACTORY' | 'OBSERVATORY' | 'SETTINGS';

interface TopNavigationProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  devModeEnabled: boolean;
  onToggleDevMode: () => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  activeTab,
  onSelectTab,
  devModeEnabled,
  onToggleDevMode,
}) => {
  return (
    <header className="relative z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-950/85 border-b border-slate-800/80 backdrop-blur-md">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => onSelectTab('PLANET')}
        className="cursor-pointer flex items-center gap-2.5 whitespace-nowrap shrink-0 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-amber-500 to-emerald-500 p-[1px] flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
            <Globe className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
          </div>
        </div>
        <span className="text-base font-bold tracking-tight text-white font-['Outfit']">
          A’Space <span className="text-amber-400 font-normal">Planetary OS</span>
        </span>
      </div>

      {/* Zone 2: 5 clean single-line text navigation links */}
      <nav className="flex items-center gap-1 md:gap-2">
        <button
          onClick={() => onSelectTab('PLANET')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'PLANET'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Planète</span>
        </button>

        <button
          onClick={() => onSelectTab('CONTINENT')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'CONTINENT'
              ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Continents</span>
        </button>

        <button
          onClick={() => onSelectTab('FACTORY')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'FACTORY'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Factory (8 Actifs)</span>
        </button>

        <button
          onClick={() => onSelectTab('OBSERVATORY')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'OBSERVATORY'
              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Observatoire</span>
        </button>

        <button
          onClick={() => onSelectTab('SETTINGS')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'SETTINGS'
              ? 'bg-slate-800 text-slate-200 border border-slate-700 shadow-xs'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Paramètres</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action button */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleDevMode}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all whitespace-nowrap shrink-0 ${
            devModeEnabled
              ? 'bg-amber-500 text-slate-950 font-semibold border-amber-400 shadow-md shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
          }`}
        >
          {devModeEnabled ? 'Mode Dév : Actif' : 'Mode Développeur'}
        </button>
      </div>
    </header>
  );
};
