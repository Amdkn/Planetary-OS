/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  continentName?: string;
  buildingName?: string;
  subView?: string;
  onGoHome: () => void;
  onGoContinent?: () => void;
  onGoBuilding?: () => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  continentName,
  buildingName,
  subView,
  onGoHome,
  onGoContinent,
  onGoBuilding,
}) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-4 py-2 bg-slate-950/70 border-b border-slate-900/80 backdrop-blur-xs select-none">
      <button
        onClick={onGoHome}
        className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Planète</span>
      </button>

      {continentName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <button
            onClick={onGoContinent}
            disabled={!onGoContinent}
            className={`transition-colors ${
              onGoContinent ? 'hover:text-cyan-300 cursor-pointer' : 'text-slate-300'
            }`}
          >
            {continentName}
          </button>
        </>
      )}

      {buildingName && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <button
            onClick={onGoBuilding}
            disabled={!onGoBuilding}
            className={`transition-colors ${
              onGoBuilding ? 'hover:text-emerald-300 cursor-pointer' : 'text-slate-300'
            }`}
          >
            {buildingName}
          </button>
        </>
      )}

      {subView && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="text-amber-400 font-semibold">{subView}</span>
        </>
      )}
    </nav>
  );
};
