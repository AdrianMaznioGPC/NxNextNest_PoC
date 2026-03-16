import type { Breadcrumb, Collection } from "@commerce/shared-types";

const brakePads: Collection = {
  handle: "pads",
  title: "Brake Pads",
  description: "Ceramic and semi-metallic brake pads",
  seo: { title: "Brake Pads", description: "Ceramic and semi-metallic brake pads" },
  path: "/categories/brakes/pads",
  parentHandle: "brakes",
  updatedAt: new Date().toISOString(),
};

const brakeRotors: Collection = {
  handle: "rotors",
  title: "Brake Rotors",
  description: "Drilled, slotted, and OEM replacement rotors",
  seo: { title: "Brake Rotors", description: "Drilled, slotted, and OEM replacement rotors" },
  path: "/categories/brakes/rotors",
  parentHandle: "brakes",
  updatedAt: new Date().toISOString(),
};

const engineFilters: Collection = {
  handle: "filters",
  title: "Air Filters",
  description: "Performance and OEM replacement air filters",
  seo: { title: "Air Filters", description: "Performance and OEM replacement air filters" },
  path: "/categories/engine/filters",
  parentHandle: "engine",
  updatedAt: new Date().toISOString(),
};

const engineIgnition: Collection = {
  handle: "ignition",
  title: "Ignition",
  description: "Spark plugs, coil packs, and ignition components",
  seo: { title: "Ignition", description: "Spark plugs, coil packs, and ignition components" },
  path: "/categories/engine/ignition",
  parentHandle: "engine",
  updatedAt: new Date().toISOString(),
};

export const collections: Collection[] = [
  {
    handle: "brakes", title: "Brakes",
    description: "Brake pads, rotors, and calipers",
    seo: { title: "Brakes", description: "Brake pads, rotors, and calipers" },
    path: "/categories/brakes",
    image: { url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop&q=80", altText: "Brakes", width: 600, height: 400 },
    subcollections: [brakePads, brakeRotors],
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "engine", title: "Engine",
    description: "Air filters, spark plugs, and intake systems",
    seo: { title: "Engine", description: "Air filters, spark plugs, and intake systems" },
    path: "/categories/engine",
    image: { url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop&q=80", altText: "Engine", width: 600, height: 400 },
    subcollections: [engineFilters, engineIgnition],
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "suspension", title: "Suspension",
    description: "Coilovers, sway bars, and bushings",
    seo: { title: "Suspension", description: "Coilovers, sway bars, and bushings" },
    path: "/categories/suspension",
    image: { url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=400&fit=crop&q=80", altText: "Suspension", width: 600, height: 400 },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "lighting", title: "Lighting",
    description: "Headlights, tail lights, and LED upgrades",
    seo: { title: "Lighting", description: "Headlights, tail lights, and LED upgrades" },
    path: "/categories/lighting",
    image: { url: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop&q=80", altText: "Lighting", width: 600, height: 400 },
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "exhaust", title: "Exhaust",
    description: "Cat-back systems, mufflers, and exhaust tips",
    seo: { title: "Exhaust", description: "Cat-back systems, mufflers, and exhaust tips" },
    path: "/categories/exhaust",
    image: { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop&q=80", altText: "Exhaust", width: 600, height: 400 },
    updatedAt: new Date().toISOString(),
  },
];

export function getAllCollectionsFlat(): Collection[] {
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

export function buildProductBreadcrumbs(productId: string): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [{ title: "Home", path: "/" }];

  let bestKey: string | undefined;
  for (const [key, ids] of Object.entries(collectionProductMap)) {
    if (key.startsWith("hidden-")) continue;
    if (!ids.includes(productId)) continue;
    if (!bestKey || key.includes("/")) bestKey = key;
  }
  if (!bestKey) return crumbs;

  const segments = bestKey.split("/");
  let current: Collection | undefined;
  for (let i = 0; i < segments.length; i++) {
    if (i === 0) {
      current = collections.find((c) => c.handle === segments[i]);
    } else {
      current = current?.subcollections?.find((c) => c.handle === segments[i]);
    }
    if (current) {
      crumbs.push({ title: current.title, path: current.path });
    }
  }

  return crumbs;
}
