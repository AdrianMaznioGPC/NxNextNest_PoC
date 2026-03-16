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

function catPath(handle: string, id: string) {
  return `/categories/${handle}/c/${id}`;
}

type CollectionDef = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: { url: string; altText: string; width: number; height: number };
  subs?: { id: string; handle: string; title: string; description: string }[];
};

function makeCollections(defs: CollectionDef[]): Collection[] {
  return defs.map((d) => ({
    id: d.id,
    handle: d.handle,
    title: d.title,
    description: d.description,
    seo: { title: d.title, description: d.description },
    path: catPath(d.handle, d.id),
    image: d.image,
    subcollections: d.subs?.map((s) => ({
      id: s.id,
      handle: s.handle,
      title: s.title,
      description: s.description,
      seo: { title: s.title, description: s.description },
      path: catPath(s.handle, s.id),
      parentId: d.id,
      updatedAt: now,
    })),
    updatedAt: now,
  }));
}

const frCollections = makeCollections([
  {
    id: "cat-brakes", handle: "freins", title: "Freins",
    description: "Plaquettes, disques et étriers de frein",
    image: { url: IMG_BRAKES, altText: "Freins", width: 600, height: 400 },
    subs: [
      { id: "cat-pads", handle: "plaquettes-de-frein", title: "Plaquettes de frein", description: "Plaquettes de frein céramique et semi-métalliques" },
      { id: "cat-rotors", handle: "disques-de-frein", title: "Disques de frein", description: "Disques percés, rainurés et de remplacement OEM" },
    ],
  },
  {
    id: "cat-engine", handle: "moteur", title: "Moteur",
    description: "Filtres à air, bougies et systèmes d'admission",
    image: { url: IMG_ENGINE, altText: "Moteur", width: 600, height: 400 },
    subs: [
      { id: "cat-filters", handle: "filtres-a-air", title: "Filtres à air", description: "Filtres à air performance et remplacement OEM" },
      { id: "cat-ignition", handle: "allumage", title: "Allumage", description: "Bougies, bobines et composants d'allumage" },
    ],
  },
  {
    id: "cat-suspension", handle: "suspension", title: "Suspension",
    description: "Combinés filetés, barres stabilisatrices et silentblocs",
    image: { url: IMG_SUSPENSION, altText: "Suspension", width: 600, height: 400 },
  },
  {
    id: "cat-lighting", handle: "eclairage", title: "Éclairage",
    description: "Phares, feux arrière et améliorations LED",
    image: { url: IMG_LIGHTING, altText: "Éclairage", width: 600, height: 400 },
  },
  {
    id: "cat-exhaust", handle: "echappement", title: "Échappement",
    description: "Lignes cat-back, silencieux et embouts d'échappement",
    image: { url: IMG_EXHAUST, altText: "Échappement", width: 600, height: 400 },
  },
]);

const ieCollections = makeCollections([
  {
    id: "cat-brakes", handle: "brakes", title: "Brakes",
    description: "Brake pads, rotors, and calipers",
    image: { url: IMG_BRAKES, altText: "Brakes", width: 600, height: 400 },
    subs: [
      { id: "cat-pads", handle: "brake-pads", title: "Brake Pads", description: "Ceramic and semi-metallic brake pads" },
      { id: "cat-rotors", handle: "brake-rotors", title: "Brake Rotors", description: "Drilled, slotted, and OEM replacement rotors" },
    ],
  },
  {
    id: "cat-engine", handle: "engine", title: "Engine",
    description: "Air filters, spark plugs, and intake systems",
    image: { url: IMG_ENGINE, altText: "Engine", width: 600, height: 400 },
    subs: [
      { id: "cat-filters", handle: "air-filters", title: "Air Filters", description: "Performance and OEM replacement air filters" },
      { id: "cat-ignition", handle: "ignition", title: "Ignition", description: "Spark plugs, coil packs, and ignition components" },
    ],
  },
  {
    id: "cat-suspension", handle: "suspension", title: "Suspension",
    description: "Coilovers, sway bars, and bushings",
    image: { url: IMG_SUSPENSION, altText: "Suspension", width: 600, height: 400 },
  },
  {
    id: "cat-lighting", handle: "lighting", title: "Lighting",
    description: "Headlights, tail lights, and LED upgrades",
    image: { url: IMG_LIGHTING, altText: "Lighting", width: 600, height: 400 },
  },
  {
    id: "cat-exhaust", handle: "exhaust", title: "Exhaust",
    description: "Cat-back systems, mufflers, and exhaust tips",
    image: { url: IMG_EXHAUST, altText: "Exhaust", width: 600, height: 400 },
  },
]);

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
  "cat-pads": ["p-1"],
  "cat-rotors": ["p-2"],
  "cat-filters": ["p-3"],
  "cat-ignition": ["p-4"],
  "cat-brakes": ["p-1", "p-2"],
  "cat-engine": ["p-3", "p-4"],
  "cat-suspension": ["p-5", "p-6"],
  "cat-lighting": ["p-7", "p-8"],
  "cat-exhaust": ["p-9", "p-10"],
  "hidden-homepage-featured-items": ["p-1", "p-5", "p-9"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
};
