/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorldManifest } from '../types/world';
import { resetWorldManifest, saveWorldManifest } from '../data/worldManifest';
import { sound } from '../utils/audio';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Check, 
  Sliders, 
  MapPin, 
  ShieldAlert,
  Copy
} from 'lucide-react';

interface SettingsViewProps {
  manifest: WorldManifest;
  onUpdateManifest: (updated: WorldManifest) => void;
  devModeEnabled: boolean;
  onToggleDevMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  manifest,
  onUpdateManifest,
  devModeEnabled,
  onToggleDevMode,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExportJson = () => {
    sound.playClick(880);
    const jsonStr = JSON.stringify(manifest, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world.manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    sound.playClick(640);
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    sound.playClick(500);
    if (confirm("Réinitialiser les coordonnées vers le modèle canonique ?")) {
      const reset = resetWorldManifest();
      onUpdateManifest(reset);
      sound.playChime();
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.continents && Array.isArray(parsed.continents)) {
          saveWorldManifest(parsed);
          onUpdateManifest(parsed);
          setImportError(null);
          sound.playChime();
        } else {
          setImportError("Format de manifeste invalide : tableau 'continents' manquant.");
        }
      } catch (err) {
        setImportError("Erreur de parsing JSON : syntaxe invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full h-full bg-slate-950 text-slate-100 overflow-y-auto p-6 md:p-8 select-none">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-['Outfit']">
              Paramètres & Géographie Planétaire
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Gestion du contrat géographique canonique (world.manifest.json) et ancres spatiales.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Télécharger JSON</span>
            </button>

            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        {/* Developer Mode Toggle Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-white block mb-1">
              Mode Développeur : Calibrage Interactif des Ancres
            </span>
            <p className="text-xs text-slate-400 max-w-xl">
              Permet de sélectionner n'importe quel continent sur la carte planétaire et de déplacer son ancre par simple clic. Les coordonnées sont automatiquement enregistrées dans le stockage local.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick(600);
              onToggleDevMode();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all shrink-0 cursor-pointer ${
              devModeEnabled
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {devModeEnabled ? 'Désactiver le Mode Dév' : 'Activer le Mode Dév'}
          </button>
        </div>

        {/* Import & Reset Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 font-mono flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Importer un Manifeste Géographique</span>
            </span>
            <p className="text-xs text-slate-400 mb-4">
              Chargez un fichier world.manifest.json pour remplacer la disposition des continents.
            </p>
            <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Sélectionner le fichier JSON</span>
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
            {importError && (
              <p className="text-xs text-red-400 mt-2">{importError}</p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-2 font-mono flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Réinitialisation Canonique</span>
            </span>
            <p className="text-xs text-slate-400 mb-4">
              Rétablit les coordonnées d'origine certifiées alignées avec l'illustration planétaire de référence.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span>Restaurer les Valeurs d'Usine</span>
            </button>
          </div>
        </div>

        {/* Canonical Continents Anchor Table */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Table des Ancres Normalisées (8 Continents)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Identifiant</th>
                  <th className="py-2.5 px-3">Nom du Continent</th>
                  <th className="py-2.5 px-3">Noyau OS</th>
                  <th className="py-2.5 px-3">Coord. Panorama (X, Y)</th>
                  <th className="py-2.5 px-3">Rayon Zone</th>
                  <th className="py-2.5 px-3">Actifs Associés</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {manifest.continents.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-cyan-400">{c.id}</td>
                    <td className="py-2.5 px-3 font-medium text-white">{c.name}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-950 border border-slate-800 text-slate-300">
                        {c.kernelType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {c.panoramaCoords.x}%, {c.panoramaCoords.y}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-400">
                      {c.panoramaCoords.radius}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {c.primaryAssetIds.length > 0 ? c.primaryAssetIds.join(', ') : 'Expansion L2'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
