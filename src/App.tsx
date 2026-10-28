/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorldManifest, ContinentId, PerformanceTelemetry } from './types/world';
import { loadWorldManifest, saveWorldManifest } from './data/worldManifest';
import { TopNavigation, ActiveNavTab } from './components/TopNavigation';
import { Breadcrumbs } from './components/Breadcrumbs';
import { PlanetaryView } from './components/PlanetaryView';
import { ContinentView } from './components/ContinentView';
import { AssetInspectorView } from './components/AssetInspectorView';
import { BuildingInteriorView } from './components/BuildingInteriorView';
import { AssetFactoryView } from './components/AssetFactoryView';
import { ObservatoryView } from './components/ObservatoryView';
import { SettingsView } from './components/SettingsView';
import { sound } from './utils/audio';
import { ASSET_MAP } from './engine/assets/assetRegistry';

type SubViewMode = 'DEFAULT' | 'INSPECTOR' | 'INTERIOR';

export default function App() {
  const [manifest, setManifest] = useState<WorldManifest>(loadWorldManifest());
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('PLANET');
  const [activeContinentId, setActiveContinentId] = useState<ContinentId>('TECH_OS');
  const [subView, setSubView] = useState<SubViewMode>('DEFAULT');
  const [inspectedAssetId, setInspectedAssetId] = useState<string>('TECH-01');
  const [interiorType, setInteriorType] = useState<string>('KERNEL_CORE');
  const [interiorBuildingName, setInteriorBuildingName] = useState<string>('Pyramide Kernel L0');
  const [devModeEnabled, setDevModeEnabled] = useState<boolean>(false);

  // Performance telemetry state
  const [telemetry, setTelemetry] = useState<PerformanceTelemetry>({
    fps: 60,
    frameTimeMs: 16.6,
    drawCalls: 18,
    triangles: 24500,
    geometries: 24,
    textures: 6,
    loadedAssets: 8,
    sceneLoadDurationMs: 45,
    memoryUsageMb: null,
    gpuRenderer: "WebGL Accelerator",
    isSoftwareGl: false,
  });

  // Keyboard shortcut listener (Esc to go back, H for HUD toggle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (subView !== 'DEFAULT') {
          sound.playClick(500);
          setSubView('DEFAULT');
        } else if (activeTab === 'CONTINENT') {
          sound.playClick(500);
          setActiveTab('PLANET');
        }
      } else if (e.key === '1') {
        setActiveTab('PLANET');
      } else if (e.key === '2') {
        setActiveTab('CONTINENT');
      } else if (e.key === '3') {
        setActiveTab('FACTORY');
      } else if (e.key === '4') {
        setActiveTab('OBSERVATORY');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [subView, activeTab]);

  // Navigate to Continent 3D scene
  const handleSelectContinent = (continentId: ContinentId) => {
    setActiveContinentId(continentId);
    setSubView('DEFAULT');
    setActiveTab('CONTINENT');
  };

  // Inspect 3D Building
  const handleSelectBuildingForInspection = (assetId: string) => {
    setInspectedAssetId(assetId);
    setSubView('INSPECTOR');
  };

  // Enter Building Interior
  const handleEnterBuildingInterior = (type: string, name: string) => {
    setInteriorType(type);
    setInteriorBuildingName(name);
    setSubView('INTERIOR');
  };

  // Update Continent Coordinates in Developer Mode
  const handleUpdateContinentCoords = (continentId: string, coords: { x: number; y: number }) => {
    const updatedContinents = manifest.continents.map((c) => {
      if (c.id === continentId) {
        return {
          ...c,
          panoramaCoords: {
            ...c.panoramaCoords,
            x: coords.x,
            y: coords.y,
          },
        };
      }
      return c;
    });
    const updated = { ...manifest, continents: updatedContinents };
    setManifest(updated);
    saveWorldManifest(updated);
  };

  const currentContinent = manifest.continents.find((c) => c.id === activeContinentId);
  const currentAsset = ASSET_MAP[inspectedAssetId];

  return (
    <div className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 font-['Outfit'] select-none overflow-hidden">
      {/* Top Navigation Bar meeting Top Bar Contract */}
      <TopNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          sound.playClick(620);
          setSubView('DEFAULT');
          setActiveTab(tab);
        }}
        devModeEnabled={devModeEnabled}
        onToggleDevMode={() => setDevModeEnabled(!devModeEnabled)}
      />

      {/* Navigational Breadcrumbs */}
      <Breadcrumbs
        continentName={
          activeTab === 'CONTINENT' || subView !== 'DEFAULT'
            ? currentContinent?.shortName
            : undefined
        }
        buildingName={
          subView === 'INSPECTOR'
            ? currentAsset?.name
            : subView === 'INTERIOR'
              ? interiorBuildingName
              : undefined
        }
        subView={
          subView === 'INSPECTOR'
            ? 'Inspection 3D'
            : subView === 'INTERIOR'
              ? 'Intérieur 360°'
              : undefined
        }
        onGoHome={() => {
          sound.playClick(500);
          setSubView('DEFAULT');
          setActiveTab('PLANET');
        }}
        onGoContinent={
          subView !== 'DEFAULT'
            ? () => {
                sound.playClick(550);
                setSubView('DEFAULT');
                setActiveTab('CONTINENT');
              }
            : undefined
        }
      />

      {/* Main View Area */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {activeTab === 'PLANET' && (
          <PlanetaryView
            manifest={manifest}
            onSelectContinent={handleSelectContinent}
            devModeEnabled={devModeEnabled}
            onUpdateContinentCoords={handleUpdateContinentCoords}
          />
        )}

        {activeTab === 'CONTINENT' && subView === 'DEFAULT' && (
          <ContinentView
            continentId={activeContinentId}
            continentName={currentContinent?.name || 'Continent'}
            onSelectBuildingForInspection={handleSelectBuildingForInspection}
            onEnterBuildingInterior={handleEnterBuildingInterior}
            onBackToPlanet={() => {
              sound.playClick(500);
              setActiveTab('PLANET');
            }}
            onReportTelemetry={setTelemetry}
          />
        )}

        {activeTab === 'CONTINENT' && subView === 'INSPECTOR' && (
          <AssetInspectorView
            initialAssetId={inspectedAssetId}
            onBackToContinent={() => {
              sound.playClick(500);
              setSubView('DEFAULT');
            }}
            onEnterInterior={(type, name) => {
              setInteriorType(type);
              setInteriorBuildingName(name);
              setSubView('INTERIOR');
            }}
          />
        )}

        {activeTab === 'CONTINENT' && subView === 'INTERIOR' && (
          <BuildingInteriorView
            interiorType={interiorType}
            buildingName={interiorBuildingName}
            onBackToContinent={() => {
              sound.playClick(500);
              setSubView('DEFAULT');
            }}
          />
        )}

        {activeTab === 'FACTORY' && (
          <AssetFactoryView
            onInspectAsset={(id) => {
              setInspectedAssetId(id);
              setActiveContinentId(
                (ASSET_MAP[id]?.parentContinent as ContinentId) || 'TECH_OS'
              );
              setSubView('INSPECTOR');
              setActiveTab('CONTINENT');
            }}
          />
        )}

        {activeTab === 'OBSERVATORY' && (
          <ObservatoryView telemetry={telemetry} />
        )}

        {activeTab === 'SETTINGS' && (
          <SettingsView
            manifest={manifest}
            onUpdateManifest={(updated) => setManifest(updated)}
            devModeEnabled={devModeEnabled}
            onToggleDevMode={() => setDevModeEnabled(!devModeEnabled)}
          />
        )}
      </main>
    </div>
  );
}
