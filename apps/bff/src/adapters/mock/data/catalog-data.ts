import type { Collection } from "@commerce/shared-types";

const IMG_BRAKES =
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop&q=80";
const IMG_ENGINE =
  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop&q=80";
const IMG_SUSPENSION =
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80";
const IMG_LIGHTING =
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&q=80";
const IMG_EXHAUST =
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80";

const now = new Date().toISOString();

function makeCollections(t: {
  brakes: string;
  brakePads: string;
  brakePadsDesc: string;
  brakeRotors: string;
  brakeRotorsDesc: string;
  brakesDesc: string;
  engine: string;
  airFilters: string;
  airFiltersDesc: string;
  ignition: string;
  ignitionDesc: string;
  engineDesc: string;
  suspension: string;
  suspensionDesc: string;
  lighting: string;
  lightingDesc: string;
  exhaust: string;
  exhaustDesc: string;
}): Collection[] {
  return [
    {
      handle: "brakes",
      title: t.brakes,
      description: t.brakesDesc,
      seo: { title: t.brakes, description: t.brakesDesc },
      path: "/categories/brakes",
      image: { url: IMG_BRAKES, altText: t.brakes, width: 600, height: 400 },
      subcollections: [
        {
          handle: "pads",
          title: t.brakePads,
          description: t.brakePadsDesc,
          seo: { title: t.brakePads, description: t.brakePadsDesc },
          path: "/categories/brakes/pads",
          parentHandle: "brakes",
          updatedAt: now,
        },
        {
          handle: "rotors",
          title: t.brakeRotors,
          description: t.brakeRotorsDesc,
          seo: { title: t.brakeRotors, description: t.brakeRotorsDesc },
          path: "/categories/brakes/rotors",
          parentHandle: "brakes",
          updatedAt: now,
        },
      ],
      updatedAt: now,
    },
    {
      handle: "engine",
      title: t.engine,
      description: t.engineDesc,
      seo: { title: t.engine, description: t.engineDesc },
      path: "/categories/engine",
      image: { url: IMG_ENGINE, altText: t.engine, width: 600, height: 400 },
      subcollections: [
        {
          handle: "filters",
          title: t.airFilters,
          description: t.airFiltersDesc,
          seo: { title: t.airFilters, description: t.airFiltersDesc },
          path: "/categories/engine/filters",
          parentHandle: "engine",
          updatedAt: now,
        },
        {
          handle: "ignition",
          title: t.ignition,
          description: t.ignitionDesc,
          seo: { title: t.ignition, description: t.ignitionDesc },
          path: "/categories/engine/ignition",
          parentHandle: "engine",
          updatedAt: now,
        },
      ],
      updatedAt: now,
    },
    {
      handle: "suspension",
      title: t.suspension,
      description: t.suspensionDesc,
      seo: { title: t.suspension, description: t.suspensionDesc },
      path: "/categories/suspension",
      image: {
        url: IMG_SUSPENSION,
        altText: t.suspension,
        width: 600,
        height: 400,
      },
      updatedAt: now,
    },
    {
      handle: "lighting",
      title: t.lighting,
      description: t.lightingDesc,
      seo: { title: t.lighting, description: t.lightingDesc },
      path: "/categories/lighting",
      image: {
        url: IMG_LIGHTING,
        altText: t.lighting,
        width: 600,
        height: 400,
      },
      updatedAt: now,
    },
    {
      handle: "exhaust",
      title: t.exhaust,
      description: t.exhaustDesc,
      seo: { title: t.exhaust, description: t.exhaustDesc },
      path: "/categories/exhaust",
      image: { url: IMG_EXHAUST, altText: t.exhaust, width: 600, height: 400 },
      updatedAt: now,
    },
  ];
}

const frCollections = makeCollections({
  brakes: "Freins",
  brakePads: "Plaquettes de frein",
  brakePadsDesc: "Plaquettes de frein céramique et semi-métalliques",
  brakeRotors: "Disques de frein",
  brakeRotorsDesc: "Disques percés, rainurés et de remplacement OEM",
  brakesDesc: "Plaquettes, disques et étriers de frein",
  engine: "Moteur",
  airFilters: "Filtres à air",
  airFiltersDesc: "Filtres à air performance et remplacement OEM",
  ignition: "Allumage",
  ignitionDesc: "Bougies, bobines et composants d'allumage",
  engineDesc: "Filtres à air, bougies et systèmes d'admission",
  suspension: "Suspension",
  suspensionDesc: "Combinés filetés, barres stabilisatrices et silentblocs",
  lighting: "Éclairage",
  lightingDesc: "Phares, feux arrière et améliorations LED",
  exhaust: "Échappement",
  exhaustDesc: "Lignes cat-back, silencieux et embouts d'échappement",
});

const ieCollections = makeCollections({
  brakes: "Brakes",
  brakePads: "Brake Pads",
  brakePadsDesc: "Ceramic and semi-metallic brake pads",
  brakeRotors: "Brake Rotors",
  brakeRotorsDesc: "Drilled, slotted, and OEM replacement rotors",
  brakesDesc: "Brake pads, rotors, and calipers",
  engine: "Engine",
  airFilters: "Air Filters",
  airFiltersDesc: "Performance and OEM replacement air filters",
  ignition: "Ignition",
  ignitionDesc: "Spark plugs, coil packs, and ignition components",
  engineDesc: "Air filters, spark plugs, and intake systems",
  suspension: "Suspension",
  suspensionDesc: "Coilovers, sway bars, and bushings",
  lighting: "Lighting",
  lightingDesc: "Headlights, tail lights, and LED upgrades",
  exhaust: "Exhaust",
  exhaustDesc: "Cat-back systems, mufflers, and exhaust tips",
});

export const collectionsByStore: Record<string, Collection[]> = {
  fr: frCollections,
  ie: ieCollections,
};

export function getAllCollectionsFlat(collections: Collection[]): Collection[] {
  const result: Collection[] = [];
  for (const c of collections) {
    result.push(c);
    if (c.subcollections) result.push(...c.subcollections);
  }
  return result;
}

export const collectionProductMap: Record<string, string[]> = {
  "brakes/pads": ["p-1"],
  "brakes/rotors": ["p-2"],
  "engine/filters": ["p-3"],
  "engine/ignition": ["p-4"],
  brakes: ["p-1", "p-2"],
  engine: ["p-3", "p-4"],
  suspension: ["p-5", "p-6"],
  lighting: ["p-7", "p-8"],
  exhaust: ["p-9", "p-10"],
  "hidden-homepage-featured-items": ["p-1", "p-5", "p-9"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
};
