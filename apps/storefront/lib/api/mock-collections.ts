import type { Collection, Menu } from "lib/types";
import { mockProducts } from "./mock-products";
import type { Product } from "lib/types";

export const mockCollections: Collection[] = [
  {
    handle: "",
    title: "All",
    description: "All car parts",
    seo: { title: "All", description: "All car parts" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "brakes",
    title: "Brakes",
    description: "Brake pads, rotors, and calipers",
    seo: { title: "Brakes", description: "Brake pads, rotors, and calipers" },
    path: "/search/brakes",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "engine",
    title: "Engine",
    description: "Air filters, spark plugs, and intake systems",
    seo: { title: "Engine", description: "Air filters, spark plugs, and intake systems" },
    path: "/search/engine",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "suspension",
    title: "Suspension",
    description: "Coilovers, sway bars, and bushings",
    seo: { title: "Suspension", description: "Coilovers, sway bars, and bushings" },
    path: "/search/suspension",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "lighting",
    title: "Lighting",
    description: "Headlights, tail lights, and LED upgrades",
    seo: { title: "Lighting", description: "Headlights, tail lights, and LED upgrades" },
    path: "/search/lighting",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "exhaust",
    title: "Exhaust",
    description: "Cat-back systems, mufflers, and exhaust tips",
    seo: { title: "Exhaust", description: "Cat-back systems, mufflers, and exhaust tips" },
    path: "/search/exhaust",
    updatedAt: new Date().toISOString(),
  },
];

const collectionProductMap: Record<string, string[]> = {
  "": mockProducts.map((p) => p.id),
  brakes: ["p-1", "p-2"],
  engine: ["p-3", "p-4"],
  suspension: ["p-5", "p-6"],
  lighting: ["p-7", "p-8"],
  exhaust: ["p-9", "p-10"],
  "hidden-homepage-featured-items": ["p-1", "p-5", "p-9"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
};

export function getProductsForCollection(handle: string): Product[] {
  const ids = collectionProductMap[handle];
  if (!ids) return [];
  return ids
    .map((id) => mockProducts.find((p) => p.id === id))
    .filter(Boolean) as Product[];
}

export const mockMenus: Record<string, Menu[]> = {
  "next-js-frontend-header-menu": [
    { title: "All", path: "/search" },
    { title: "Brakes", path: "/search/brakes" },
    { title: "Engine", path: "/search/engine" },
    { title: "Suspension", path: "/search/suspension" },
    { title: "Lighting", path: "/search/lighting" },
    { title: "Exhaust", path: "/search/exhaust" },
  ],
  "next-js-frontend-footer-menu": [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Terms & Conditions", path: "/terms-and-conditions" },
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "FAQ", path: "/faq" },
  ],
};
