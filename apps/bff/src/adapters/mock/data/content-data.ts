import type { Menu, Page } from "@commerce/shared-types";

export const menus: Record<string, Menu[]> = {
  "next-js-frontend-header-menu": [
    { title: "All", path: "/categories" },
    { title: "Brakes", path: "/categories/brakes" },
    { title: "Engine", path: "/categories/engine" },
    { title: "Suspension", path: "/categories/suspension" },
    { title: "Lighting", path: "/categories/lighting" },
    { title: "Exhaust", path: "/categories/exhaust" },
  ],
  "next-js-frontend-footer-menu": [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Terms & Conditions", path: "/terms-and-conditions" },
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "FAQ", path: "/faq" },
  ],
};

export const pages: Page[] = [
  {
    id: "page-1", title: "About", handle: "about",
    body: "<p>We are a modern car parts company committed to quality products and great customer experiences.</p>",
    bodySummary: "We are a modern car parts company.",
    seo: { title: "About Us", description: "Learn about our company and mission." },
    createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString(),
  },
  {
    id: "page-2", title: "Terms & Conditions", handle: "terms-and-conditions",
    body: "<p>These are the terms and conditions for using our store.</p>",
    bodySummary: "Terms and conditions.",
    seo: { title: "Terms & Conditions", description: "Read our terms and conditions." },
    createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString(),
  },
  {
    id: "page-3", title: "Privacy Policy", handle: "privacy-policy",
    body: "<p>Your privacy is important to us.</p>",
    bodySummary: "Our privacy policy.",
    seo: { title: "Privacy Policy", description: "Read our privacy policy." },
    createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString(),
  },
  {
    id: "page-4", title: "FAQ", handle: "faq",
    body: "<h2>FAQ</h2><h3>How long does shipping take?</h3><p>5-7 business days.</p>",
    bodySummary: "Frequently asked questions.",
    seo: { title: "FAQ", description: "Frequently asked questions." },
    createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString(),
  },
];
