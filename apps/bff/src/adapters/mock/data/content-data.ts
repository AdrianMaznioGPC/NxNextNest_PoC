import type { Menu, Page } from "@commerce/shared-types";

const now = new Date().toISOString();

export const menusByStore: Record<string, Record<string, Menu[]>> = {
  fr: {
    "next-js-frontend-header-menu": [
      { title: "Tout", path: "/categories" },
      { title: "Freins", path: "/categories/freins/c/cat-brakes" },
      { title: "Moteur", path: "/categories/moteur/c/cat-engine" },
      { title: "Suspension", path: "/categories/suspension/c/cat-suspension" },
      { title: "Éclairage", path: "/categories/eclairage/c/cat-lighting" },
      { title: "Échappement", path: "/categories/echappement/c/cat-exhaust" },
    ],
    "next-js-frontend-footer-menu": [
      { title: "Accueil", path: "/" },
      { title: "À propos", path: "/about" },
      { title: "Conditions générales", path: "/terms-and-conditions" },
      { title: "Politique de confidentialité", path: "/privacy-policy" },
      { title: "FAQ", path: "/faq" },
    ],
  },
  ie: {
    "next-js-frontend-header-menu": [
      { title: "All", path: "/categories" },
      { title: "Brakes", path: "/categories/brakes/c/cat-brakes" },
      { title: "Engine", path: "/categories/engine/c/cat-engine" },
      { title: "Suspension", path: "/categories/suspension/c/cat-suspension" },
      { title: "Lighting", path: "/categories/lighting/c/cat-lighting" },
      { title: "Exhaust", path: "/categories/exhaust/c/cat-exhaust" },
    ],
    "next-js-frontend-footer-menu": [
      { title: "Home", path: "/" },
      { title: "About", path: "/about" },
      { title: "Terms & Conditions", path: "/terms-and-conditions" },
      { title: "Privacy Policy", path: "/privacy-policy" },
      { title: "FAQ", path: "/faq" },
    ],
  },
};

export const pagesByStore: Record<string, Page[]> = {
  fr: [
    {
      id: "page-1",
      title: "À propos",
      handle: "about",
      body: "<p>Nous sommes une entreprise moderne de pièces automobiles engagée pour la qualité et la satisfaction client.</p>",
      bodySummary: "Nous sommes une entreprise moderne de pièces automobiles.",
      seo: {
        title: "À propos",
        description: "Découvrez notre entreprise et notre mission.",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-2",
      title: "Conditions générales",
      handle: "terms-and-conditions",
      body: "<p>Voici les conditions générales d'utilisation de notre boutique.</p>",
      bodySummary: "Conditions générales.",
      seo: {
        title: "Conditions générales",
        description: "Lisez nos conditions générales.",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-3",
      title: "Politique de confidentialité",
      handle: "privacy-policy",
      body: "<p>Votre vie privée est importante pour nous.</p>",
      bodySummary: "Notre politique de confidentialité.",
      seo: {
        title: "Politique de confidentialité",
        description: "Lisez notre politique de confidentialité.",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-4",
      title: "FAQ",
      handle: "faq",
      body: "<h2>FAQ</h2><h3>Quel est le délai de livraison ?</h3><p>5 à 7 jours ouvrables.</p>",
      bodySummary: "Questions fréquemment posées.",
      seo: { title: "FAQ", description: "Questions fréquemment posées." },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
  ],
  ie: [
    {
      id: "page-1",
      title: "About",
      handle: "about",
      body: "<p>We are a modern car parts company committed to quality products and great customer experiences.</p>",
      bodySummary: "We are a modern car parts company.",
      seo: {
        title: "About Us",
        description: "Learn about our company and mission.",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-2",
      title: "Terms & Conditions",
      handle: "terms-and-conditions",
      body: "<p>These are the terms and conditions for using our store.</p>",
      bodySummary: "Terms and conditions.",
      seo: {
        title: "Terms & Conditions",
        description: "Read our terms and conditions.",
      },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-3",
      title: "Privacy Policy",
      handle: "privacy-policy",
      body: "<p>Your privacy is important to us.</p>",
      bodySummary: "Our privacy policy.",
      seo: { title: "Privacy Policy", description: "Read our privacy policy." },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
    {
      id: "page-4",
      title: "FAQ",
      handle: "faq",
      body: "<h2>FAQ</h2><h3>How long does shipping take?</h3><p>5-7 business days.</p>",
      bodySummary: "Frequently asked questions.",
      seo: { title: "FAQ", description: "Frequently asked questions." },
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: now,
    },
  ],
};
