/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldManifest, LocationAnchor } from '../types/world';

export const CANONICAL_WORLD_MANIFEST: WorldManifest = {
  version: "1.0.0-canonical",
  canonicalEpoch: "2026-10-A-SPACE-OS",
  primaryImage: "/public/assets/aistudio/image_6c772a74.png",
  referenceImages: {
    a0Citadel: "/public/assets/aistudio/image_387fdd66.png",
    techOs: "/public/assets/aistudio/image_5bb3294b.png",
    lifeOs: "/public/assets/aistudio/image_1df8b060.png",
    businessOs: "/public/assets/aistudio/image_bf1a7c82.png",
    archipelago: "/public/assets/aistudio/image_30519d5f.png",
    panorama: "/public/assets/aistudio/image_763dcec8.png"
  },
  continents: [
    {
      id: "A0_CITADEL",
      name: "A0 — Citadelle Souveraine",
      shortName: "A0 Citadelle",
      subtitle: "Gouvernance Planétaire & Supervision Stratégique",
      kernelType: "CITADEL",
      panoramaCoords: {
        x: 49.6,
        y: 47.8,
        radius: 9.5
      },
      world3DCoords: {
        x: 0,
        y: 1.2,
        z: 0
      },
      accentColor: "#F59E0B", // Gold / Solarpunk Amber
      badgeColor: "border-amber-400 text-amber-300 bg-amber-950/40",
      description: "Centre géographique et noyau de commandement suprême. Palais monumental d'or et de marbre, flèche d'ascension lumineuse, observatoire céleste et passerelle planétaire vers les trois OS.",
      subZones: [
        { id: "A0-Z1", name: "Spire d'Énergie Zénithale", purpose: "Focalisateur de flux planétaire", coords3D: [0, 4.5, 0] },
        { id: "A0-Z2", name: "Cour des Délibérations", purpose: "Supervision A0 et consensus", coords3D: [0, 1.2, 2.5] },
        { id: "A0-Z3", name: "Passerelle Spatiale Éthérée", purpose: "Interface orbitale et transit", coords3D: [0, 0.8, -3.2] },
        { id: "A0-Z4", name: "Viaducs Stellaires", purpose: "Connexion vers Tech, Life et Business", coords3D: [3.2, 0.5, 0] }
      ],
      primaryAssetIds: ["A0-01", "A0-02"]
    },
    {
      id: "TECH_OS",
      name: "Tech OS — Cœur Kernel L0",
      shortName: "Tech OS",
      subtitle: "Architecture Égyptienne & Calcul Solaire Souterrain",
      kernelType: "TECH",
      panoramaCoords: {
        x: 27.5,
        y: 20.8,
        radius: 11.2
      },
      world3DCoords: {
        x: -9.5,
        y: 0.8,
        z: -7.5
      },
      accentColor: "#06B6D4", // Cyan quantum compute
      badgeColor: "border-cyan-400 text-cyan-300 bg-cyan-950/40",
      description: "Continent désertique monumental inspiré de l'Égypte antique fusionnée au génie technologique. Pyramides matricielles, obélisques informatiques, canaux d'énergie cyan et monuments solaires.",
      subZones: [
        { id: "TECH-Z1", name: "Pyramide Kernel L0", purpose: "Cœur monolithique d'exécution", coords3D: [-9.5, 2.8, -7.5] },
        { id: "TECH-Z2", name: "Allée des Obélisques Scalaires", purpose: "Routage optique et registres", coords3D: [-7.2, 1.2, -5.8] },
        { id: "TECH-Z3", name: "Aqueduc d'Énergie Cyan", purpose: "Refroidissement quantique", coords3D: [-11.0, 0.6, -9.0] },
        { id: "TECH-Z4", name: "Terrasses Photovoltaïques", purpose: "Génération énergétique solaire", coords3D: [-12.5, 1.0, -6.0] }
      ],
      primaryAssetIds: ["TECH-01", "TECH-02"]
    },
    {
      id: "LIFE_OS",
      name: "Life OS — Continent Régénératif",
      shortName: "Life OS",
      subtitle: "Biomes Vivants, Grand Arbre & 6 Frameworks",
      kernelType: "LIFE",
      panoramaCoords: {
        x: 67.2,
        y: 23.5,
        radius: 11.5
      },
      world3DCoords: {
        x: 8.8,
        y: 0.9,
        z: -7.2
      },
      accentColor: "#10B981", // Emerald solarpunk
      badgeColor: "border-emerald-400 text-emerald-300 bg-emerald-950/40",
      description: "Continent vert régénératif composé de cascades luxuriantes, de terrasses botaniques et du Grand Arbre Monde. Intègre les six frameworks méthodologiques structurés en districts autonomes.",
      frameworks: [
        "1. Ikigai (Raison d'être & Alignement)",
        "2. Wheel of Life (Roue de la Vie)",
        "3. 12 Week Year (Cycles de 12 Semaines)",
        "4. PARA (Projects, Areas, Resources, Archives)",
        "5. GTD (Getting Things Done)",
        "6. DEAL (Definition, Elimination, Automation, Liberation)"
      ],
      subZones: [
        { id: "LIFE-Z1", name: "Sanctuaire du Grand Arbre", purpose: "Harmonisation Ikigai & Biome Central", coords3D: [8.8, 3.2, -7.2] },
        { id: "LIFE-Z2", name: "Campus Modulaire des 6 Pôles", purpose: "Orchestration PARA, GTD & 12WY", coords3D: [11.2, 1.4, -5.5] },
        { id: "LIFE-Z3", name: "Dômes Botaniques Hydrophoniques", purpose: "Régénération & Santé cellulaire", coords3D: [6.5, 1.0, -9.0] },
        { id: "LIFE-Z4", name: "Cascades d'Eau Pure", purpose: "Purification et régénération", coords3D: [9.0, 0.5, -4.0] }
      ],
      primaryAssetIds: ["LIFE-01", "LIFE-02"]
    },
    {
      id: "BIZ_OS",
      name: "Business OS — Continent de Production",
      shortName: "Business OS",
      subtitle: "Fabrication Solarpunk & Logistique Maritime Autonome",
      kernelType: "BUSINESS",
      panoramaCoords: {
        x: 82.5,
        y: 57.0,
        radius: 11.0
      },
      world3DCoords: {
        x: 9.8,
        y: 0.7,
        z: 4.8
      },
      accentColor: "#F97316", // Industrial orange / copper
      badgeColor: "border-orange-400 text-orange-300 bg-orange-950/40",
      description: "Cœur opérationnel de production et d'exécution industrielle Solarpunk. Usines de robotique avancée, terminaux de conteneurs maritimes, port autonome, hangars solaires et viaducs logistiques.",
      subZones: [
        { id: "BIZ-Z1", name: "Usine de Fabrication Solarpunk", purpose: "Ateliers robotiques et impression 3D", coords3D: [9.8, 1.8, 4.8] },
        { id: "BIZ-Z2", name: "Hub Logistique Autonome", purpose: "Grues portuaires et dispatch de fret", coords3D: [7.5, 0.9, 6.2] },
        { id: "BIZ-Z3", name: "Bassin Portuaire & Docks", purpose: "Flotte de cargos à voiles rigides", coords3D: [6.0, 0.3, 7.8] },
        { id: "BIZ-Z4", name: "Complexe Énergétique & Viaduc", purpose: "Distribution motrice et ferroviaire", coords3D: [12.0, 1.2, 3.5] }
      ],
      primaryAssetIds: ["BIZ-01", "BIZ-02"]
    },
    {
      id: "L2_VOLCANO",
      name: "L2 Forge Magmatique",
      shortName: "Forge Magma",
      subtitle: "Domaine Vital : Résilience & Énergie Géothermique",
      kernelType: "EXPANSION",
      panoramaCoords: {
        x: 13.8,
        y: 39.5,
        radius: 6.5
      },
      world3DCoords: {
        x: -11.0,
        y: 1.0,
        z: -1.2
      },
      accentColor: "#EF4444",
      badgeColor: "border-red-400 text-red-300 bg-red-950/40",
      description: "Archipel volcanique abritant les fonderies géothermiques et les chambres de fusion de métaux rares. Zone d'expansion L2 réservée à l'énergie extrême.",
      subZones: [
        { id: "L2V-1", name: "Caldéra de Fusion", purpose: "Extraction géothermique", coords3D: [-11.0, 1.6, -1.2] }
      ],
      primaryAssetIds: []
    },
    {
      id: "L2_CRYO",
      name: "L2 Pics de Cristal & Glaciers",
      shortName: "Pics Cryo",
      subtitle: "Domaine Vital : Archives Froides & Pensée Profonde",
      kernelType: "EXPANSION",
      panoramaCoords: {
        x: 12.5,
        y: 63.8,
        radius: 7.2
      },
      world3DCoords: {
        x: -10.2,
        y: 1.1,
        z: 5.2
      },
      accentColor: "#38BDF8",
      badgeColor: "border-sky-400 text-sky-300 bg-sky-950/40",
      description: "Continent glaciaire purifié aux pics rocheux enneigés et monolithes de glace. Réservé aux archives cryptographiques permanentes et à la réflexion solitaire.",
      subZones: [
        { id: "L2C-1", name: "Sanctuaire des Glaces", purpose: "Stockage cryogénique de mémoire", coords3D: [-10.2, 1.8, 5.2] }
      ],
      primaryAssetIds: []
    },
    {
      id: "L2_ATOLL",
      name: "L2 Archipel des 8 Domaines",
      shortName: "Archipel L2",
      subtitle: "Domaine Vital : Roue de la Vie, Relations & Bien-Être",
      kernelType: "EXPANSION",
      panoramaCoords: {
        x: 39.5,
        y: 77.2,
        radius: 8.0
      },
      world3DCoords: {
        x: -2.8,
        y: 0.4,
        z: 7.8
      },
      accentColor: "#14B8A6",
      badgeColor: "border-teal-400 text-teal-300 bg-teal-950/40",
      description: "Ensemble d'îlots coralliens et de lagons turquoise reliés par des ponts suspendus. Espaces dédiés aux huit domaines de la vie humaine et à l'équilibre holistique.",
      subZones: [
        { id: "L2A-1", name: "Pavillon du Lagon", purpose: "Relations et harmonie", coords3D: [-2.8, 0.7, 7.8] }
      ],
      primaryAssetIds: []
    },
    {
      id: "L2_PLATEAU",
      name: "L2 Falaises Solaires",
      shortName: "Plateaux L2",
      subtitle: "Domaine Vital : Connaissance & Expérimentation Libre",
      kernelType: "EXPANSION",
      panoramaCoords: {
        x: 63.5,
        y: 79.0,
        radius: 7.5
      },
      world3DCoords: {
        x: 4.5,
        y: 0.6,
        z: 8.5
      },
      accentColor: "#EAB308",
      badgeColor: "border-yellow-400 text-yellow-300 bg-yellow-950/40",
      description: "Plateaux rocheux côtiers baignés de lumière solaire avec éoliennes marines et phares de navigation côtière. Terrains de jeu ouverts pour projets pilotes.",
      subZones: [
        { id: "L2P-1", name: "Observatoire des Falaises", purpose: "Prototypage rapide", coords3D: [4.5, 1.0, 8.5] }
      ],
      primaryAssetIds: []
    }
  ]
};

const STORAGE_KEY = 'aspace_planetary_manifest_v1';

export function loadWorldManifest(): WorldManifest {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.continents && Array.isArray(parsed.continents)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load custom manifest from localStorage, using canonical fallback', e);
  }
  return CANONICAL_WORLD_MANIFEST;
}

export function saveWorldManifest(manifest: WorldManifest): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(manifest, null, 2));
  } catch (e) {
    console.error('Failed to save manifest to localStorage', e);
  }
}

export function resetWorldManifest(): WorldManifest {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset manifest', e);
  }
  return CANONICAL_WORLD_MANIFEST;
}
