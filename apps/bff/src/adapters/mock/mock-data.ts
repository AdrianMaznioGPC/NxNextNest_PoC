import type {
  Breadcrumb,
  Cart,
  Collection,
  DomainConfigModel,
  I18nMessagesModel,
  LanguageCode,
  LocaleContext,
  Menu,
  Page,
  Product,
} from "@commerce/shared-types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;

function variants(
  prices: { amount: string }[],
  optionName: string,
  values: string[],
) {
  return values.map((value, i) => ({
    id: `var-${value.toLowerCase().replace(/\s/g, "-")}-${i}`,
    title: value,
    availableForSale: true,
    selectedOptions: [{ name: optionName, value }],
    price: {
      amount: prices[i]?.amount ?? prices[0]!.amount,
      currencyCode: "USD",
    },
  }));
}

function product(
  id: string,
  handle: string,
  title: string,
  description: string,
  imageId: string,
  price: string,
  optionName: string,
  optionValues: string[],
  tags: string[] = [],
  availableForSale = true,
): Product {
  return {
    id,
    handle,
    path: `/product/${handle}`,
    availableForSale,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `opt-${id}`, name: optionName, values: optionValues }],
    priceRange: {
      maxVariantPrice: { amount: price, currencyCode: "USD" },
      minVariantPrice: { amount: price, currencyCode: "USD" },
    },
    variants: variants([{ amount: price }], optionName, optionValues),
    featuredImage: {
      url: img(imageId),
      altText: title,
      width: 800,
      height: 800,
    },
    images: [{ url: img(imageId), altText: title, width: 800, height: 800 }],
    seo: { title, description },
    tags,
    updatedAt: new Date().toISOString(),
  };
}

export const products: Product[] = [
  product(
    "p-1",
    "ceramic-brake-pads",
    "Ceramic Brake Pads",
    "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.",
    "1486262715619-67b85e0b08d3",
    "89.99",
    "Axle",
    ["Front", "Rear"],
  ),
  product(
    "p-2",
    "drilled-rotors",
    "Drilled & Slotted Rotors",
    "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.",
    "1492144534655-ae79c964c9d7",
    "149.99",
    "Size",
    ["12 in", "13 in"],
  ),
  product(
    "p-3",
    "performance-air-filter",
    "Performance Air Filter",
    "Washable and reusable high-flow air filter. Increases airflow for better throttle response.",
    "1489824904134-891ab64532f1",
    "54.99",
    "Fitment",
    ["Universal", "Direct-Fit"],
  ),
  product(
    "p-4",
    "iridium-spark-plugs",
    "Iridium Spark Plugs (Set of 4)",
    "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.",
    "1517524008697-84bbe3c3fd98",
    "39.99",
    "Heat Range",
    ["6", "7", "8"],
  ),
  product(
    "p-5",
    "coilover-kit",
    "Adjustable Coilover Kit",
    "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.",
    "1494976388531-d1058494cdd8",
    "899.99",
    "Fitment",
    ["Front & Rear Set"],
  ),
  product(
    "p-6",
    "sway-bar-end-links",
    "Sway Bar End Links",
    "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.",
    "1504215680853-026ed2a45def",
    "64.99",
    "Position",
    ["Front", "Rear"],
  ),
  product(
    "p-7",
    "led-headlight-bulbs",
    "LED Headlight Bulbs (Pair)",
    "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.",
    "1605559424843-9e4c228bf1c2",
    "79.99",
    "Bulb Size",
    ["H11", "9005", "9006"],
  ),
  product(
    "p-8",
    "smoked-tail-lights",
    "Smoked Tail Light Covers",
    "UV-resistant smoked tail light covers for a sleek custom appearance.",
    "1609521263047-f8f205293f24",
    "44.99",
    "Fitment",
    ["Universal"],
  ),
  product(
    "p-9",
    "cat-back-exhaust",
    "Cat-Back Exhaust System",
    "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.",
    "1552519507-da3b142c6e3d",
    "649.99",
    "Tip Style",
    ["Polished", "Burnt Titanium"],
  ),
  product(
    "p-10",
    "exhaust-tip-clamp-on",
    "Clamp-On Exhaust Tip",
    'Universal stainless steel clamp-on exhaust tip. Fits 2.5" to 3" pipes.',
    "1549399542-7e3f8b79c341",
    "29.99",
    "Finish",
    ["Chrome", "Black"],
  ),
  product(
    "p-11",
    "short-ram-intake",
    "Short Ram Intake Kit",
    "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.",
    "1606577924006-27d39b132ae2",
    "129.99",
    "Pipe Diameter",
    ["2.5 in", "3 in"],
  ),
  product(
    "p-12",
    "wheel-spacers",
    "Wheel Spacers (Pair)",
    "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.",
    "1562911791-c7a97b729ec5",
    "74.99",
    "Thickness",
    ["15mm", "20mm", "25mm"],
  ),
];

// Leaf (child) collections
const brakePads: Collection = {
  handle: "pads",
  title: "Brake Pads",
  description: "Ceramic and semi-metallic brake pads",
  seo: {
    title: "Brake Pads",
    description: "Ceramic and semi-metallic brake pads",
  },
  path: "/categories/brakes/pads",
  parentHandle: "brakes",
  updatedAt: new Date().toISOString(),
};

const brakeRotors: Collection = {
  handle: "rotors",
  title: "Brake Rotors",
  description: "Drilled, slotted, and OEM replacement rotors",
  seo: {
    title: "Brake Rotors",
    description: "Drilled, slotted, and OEM replacement rotors",
  },
  path: "/categories/brakes/rotors",
  parentHandle: "brakes",
  updatedAt: new Date().toISOString(),
};

const engineFilters: Collection = {
  handle: "filters",
  title: "Air Filters",
  description: "Performance and OEM replacement air filters",
  seo: {
    title: "Air Filters",
    description: "Performance and OEM replacement air filters",
  },
  path: "/categories/engine/filters",
  parentHandle: "engine",
  updatedAt: new Date().toISOString(),
};

const engineIgnition: Collection = {
  handle: "ignition",
  title: "Ignition",
  description: "Spark plugs, coil packs, and ignition components",
  seo: {
    title: "Ignition",
    description: "Spark plugs, coil packs, and ignition components",
  },
  path: "/categories/engine/ignition",
  parentHandle: "engine",
  updatedAt: new Date().toISOString(),
};

// Top-level collections
export const collections: Collection[] = [
  {
    handle: "brakes",
    title: "Brakes",
    description: "Brake pads, rotors, and calipers",
    seo: { title: "Brakes", description: "Brake pads, rotors, and calipers" },
    path: "/categories/brakes",
    subcollections: [brakePads, brakeRotors],
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "engine",
    title: "Engine",
    description: "Air filters, spark plugs, and intake systems",
    seo: {
      title: "Engine",
      description: "Air filters, spark plugs, and intake systems",
    },
    path: "/categories/engine",
    subcollections: [engineFilters, engineIgnition],
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "suspension",
    title: "Suspension",
    description: "Coilovers, sway bars, and bushings",
    seo: {
      title: "Suspension",
      description: "Coilovers, sway bars, and bushings",
    },
    path: "/categories/suspension",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "lighting",
    title: "Lighting",
    description: "Headlights, tail lights, and LED upgrades",
    seo: {
      title: "Lighting",
      description: "Headlights, tail lights, and LED upgrades",
    },
    path: "/categories/lighting",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "exhaust",
    title: "Exhaust",
    description: "Cat-back systems, mufflers, and exhaust tips",
    seo: {
      title: "Exhaust",
      description: "Cat-back systems, mufflers, and exhaust tips",
    },
    path: "/categories/exhaust",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "Oil",
    title: "Oil",
    description: "Cat-back systems, mufflers, and exhaust tips",
    seo: {
      title: "Exhaust",
      description: "Cat-back systems, mufflers, and exhaust tips",
    },
    path: "/categories/exhaust",
    updatedAt: new Date().toISOString(),
  },
];

/** Flat list of all collections including children, for lookups */
export function getAllCollectionsFlat(): Collection[] {
  const result: Collection[] = [];
  for (const c of collections) {
    result.push(c);
    if (c.subcollections) {
      result.push(...c.subcollections);
    }
  }
  return result;
}

/**
 * Maps collection handles (or parent/child composite keys) to product IDs.
 * For child collections the key is "parent/child", e.g. "brakes/pads".
 * Parent collections with subcollections aggregate their children's products.
 */
export const collectionProductMap: Record<string, string[]> = {
  // Leaf collections
  "brakes/pads": ["p-1"],
  "brakes/rotors": ["p-2"],
  "engine/filters": ["p-3"],
  "engine/ignition": ["p-4"],
  // Parent aggregates
  brakes: ["p-1", "p-2"],
  engine: ["p-3", "p-4"],
  // Top-level leaves (no subcollections)
  suspension: ["p-5", "p-6"],
  lighting: ["p-7", "p-8"],
  exhaust: ["p-9", "p-10"],
  // Hidden homepage collections
  "hidden-homepage-featured-items": ["p-1", "p-5", "p-9"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
};

/**
 * Builds breadcrumb trail for a product by finding its most specific
 * (deepest / leaf) collection in the collectionProductMap.
 */
function buildProductBreadcrumbs(productId: string): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [{ title: "Home", path: "/" }];

  // Find the deepest collection key containing this product
  // Prefer keys with "/" (leaf) over top-level keys
  let bestKey: string | undefined;
  for (const [key, ids] of Object.entries(collectionProductMap)) {
    if (key.startsWith("hidden-")) continue;
    if (!ids.includes(productId)) continue;
    if (!bestKey || key.includes("/")) bestKey = key;
  }
  if (!bestKey) return crumbs;

  const segments = bestKey.split("/");

  // Walk from root to leaf, resolving each collection
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

// Populate breadcrumbs on all products
for (const p of products) {
  p.breadcrumbs = buildProductBreadcrumbs(p.id);
}

export const menus: Record<string, Menu[]> = {
  "next-js-frontend-header-menu": [
    { title: "All", path: "/categories" },
    { title: "Brakes", path: "/categories/brakes" },
    { title: "Engine", path: "/categories/engine" },
    { title: "Suspension", path: "/categories/suspension" },
    { title: "Lighting", path: "/categories/lighting" },
    { title: "Exhaust", path: "/categories/exhaust" },
    { title: "oil", path: "/categories/oil" },
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
    id: "page-1",
    title: "About",
    handle: "about",
    path: "/about",
    body: "<p>We are a modern car parts company committed to quality products and great customer experiences.</p>",
    bodySummary: "We are a modern car parts company.",
    seo: {
      title: "About Us",
      description: "Learn about our company and mission.",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-2",
    title: "Terms & Conditions",
    handle: "terms-and-conditions",
    path: "/terms-and-conditions",
    body: "<p>These are the terms and conditions for using our store.</p>",
    bodySummary: "Terms and conditions.",
    seo: {
      title: "Terms & Conditions",
      description: "Read our terms and conditions.",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-3",
    title: "Privacy Policy",
    handle: "privacy-policy",
    path: "/privacy-policy",
    body: "<p>Your privacy is important to us.</p>",
    bodySummary: "Our privacy policy.",
    seo: { title: "Privacy Policy", description: "Read our privacy policy." },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-4",
    title: "FAQ",
    handle: "faq",
    path: "/faq",
    body: "<h2>FAQ</h2><h3>How long does shipping take?</h3><p>5-7 business days.</p>",
    bodySummary: "Frequently asked questions.",
    seo: { title: "FAQ", description: "Frequently asked questions." },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

export const staticRouteSegmentCatalog: Record<
  string,
  {
    search: string;
    product: string;
    categories: string;
    cart: string;
  }
> = {
  "en-US": {
    search: "search",
    product: "product",
    categories: "categories",
    cart: "cart",
  },
  "es-ES": {
    search: "buscar",
    product: "producto",
    categories: "categorias",
    cart: "carrito",
  },
  "nl-NL": {
    search: "zoeken",
    product: "product",
    categories: "categorieen",
    cart: "winkelwagen",
  },
  "fr-FR": {
    search: "recherche",
    product: "produit",
    categories: "categories",
    cart: "panier",
  },
};

export const localeByLanguage: Record<LanguageCode, string> = {
  en: "en-US",
  es: "es-ES",
  nl: "nl-NL",
  fr: "fr-FR",
};

export const supportedLanguageCodes: LanguageCode[] = ["en", "es", "nl", "fr"];

export const productSlugCatalog: Record<string, Record<string, string>> = {
  "en-US": {
    "ceramic-brake-pads": "ceramic-brake-pads",
    "drilled-rotors": "drilled-rotors",
    "performance-air-filter": "performance-air-filter",
    "iridium-spark-plugs": "iridium-spark-plugs",
    "coilover-kit": "coilover-kit",
    "sway-bar-end-links": "sway-bar-end-links",
    "led-headlight-bulbs": "led-headlight-bulbs",
    "smoked-tail-lights": "smoked-tail-lights",
    "cat-back-exhaust": "cat-back-exhaust",
    "exhaust-tip-clamp-on": "exhaust-tip-clamp-on",
    "short-ram-intake": "short-ram-intake",
    "wheel-spacers": "wheel-spacers",
  },
  "es-ES": {
    "ceramic-brake-pads": "pastillas-freno-ceramicas",
    "drilled-rotors": "rotores-perforados-ranurados",
    "performance-air-filter": "filtro-aire-rendimiento",
    "iridium-spark-plugs": "bujias-iridio",
    "coilover-kit": "kit-coilover-ajustable",
    "sway-bar-end-links": "bieletas-barra-estabilizadora",
    "led-headlight-bulbs": "bombillas-led-faros",
    "smoked-tail-lights": "cubiertas-faros-traseros-ahumadas",
    "cat-back-exhaust": "escape-cat-back",
    "exhaust-tip-clamp-on": "punta-escape-abrazadera",
    "short-ram-intake": "admision-short-ram",
    "wheel-spacers": "separadores-rueda",
  },
  "nl-NL": {
    "ceramic-brake-pads": "keramische-remblokken",
    "drilled-rotors": "geperforeerde-remschijven",
    "performance-air-filter": "performance-luchtfilter",
    "iridium-spark-plugs": "iridium-bougies",
    "coilover-kit": "coilover-kit",
    "sway-bar-end-links": "stabilisatorstang-koppelstangen",
    "led-headlight-bulbs": "led-koplamp-lampen",
    "smoked-tail-lights": "getinte-achterlichten",
    "cat-back-exhaust": "cat-back-uitlaat",
    "exhaust-tip-clamp-on": "uitlaattip-klemmodel",
    "short-ram-intake": "short-ram-inlaat",
    "wheel-spacers": "wielspacers",
  },
  "fr-FR": {
    "ceramic-brake-pads": "plaquettes-de-frein-ceramique",
    "drilled-rotors": "disques-perfores-rainures",
    "performance-air-filter": "filtre-a-air-performance",
    "iridium-spark-plugs": "bougies-iridium",
    "coilover-kit": "kit-combines-filetes",
    "sway-bar-end-links": "biellettes-barre-stabilisatrice",
    "led-headlight-bulbs": "ampoules-led-phares",
    "smoked-tail-lights": "feux-arriere-fumes",
    "cat-back-exhaust": "echappement-cat-back",
    "exhaust-tip-clamp-on": "embout-echappement-collier",
    "short-ram-intake": "admission-short-ram",
    "wheel-spacers": "elargisseurs-roue",
  },
};

export const pageSlugCatalog: Record<string, Record<string, string>> = {
  "en-US": {
    about: "about",
    "terms-and-conditions": "terms-and-conditions",
    "privacy-policy": "privacy-policy",
    faq: "faq",
  },
  "es-ES": {
    about: "acerca-de",
    "terms-and-conditions": "terminos-condiciones",
    "privacy-policy": "politica-privacidad",
    faq: "preguntas-frecuentes",
  },
  "nl-NL": {
    about: "over-ons",
    "terms-and-conditions": "voorwaarden",
    "privacy-policy": "privacybeleid",
    faq: "veelgestelde-vragen",
  },
  "fr-FR": {
    about: "a-propos",
    "terms-and-conditions": "conditions-generales",
    "privacy-policy": "politique-de-confidentialite",
    faq: "faq",
  },
};

export const categorySlugCatalog: Record<string, Record<string, string>> = {
  "en-US": {
    brakes: "brakes",
    "brakes/pads": "brakes/pads",
    "brakes/rotors": "brakes/rotors",
    engine: "engine",
    "engine/filters": "engine/filters",
    "engine/ignition": "engine/ignition",
    suspension: "suspension",
    lighting: "lighting",
    exhaust: "exhaust",
    oil: "oil",
  },
  "es-ES": {
    brakes: "frenos",
    "brakes/pads": "frenos/pastillas",
    "brakes/rotors": "frenos/rotores",
    engine: "motor",
    "engine/filters": "motor/filtros",
    "engine/ignition": "motor/encendido",
    suspension: "suspension",
    lighting: "iluminacion",
    exhaust: "escape",
    oil: "aceite",
  },
  "nl-NL": {
    brakes: "remmen",
    "brakes/pads": "remmen/remblokken",
    "brakes/rotors": "remmen/remschijven",
    engine: "motor",
    "engine/filters": "motor/filters",
    "engine/ignition": "motor/ontsteking",
    suspension: "vering",
    lighting: "verlichting",
    exhaust: "uitlaat",
    oil: "olie",
  },
  "fr-FR": {
    brakes: "freins",
    "brakes/pads": "freins/plaquettes",
    "brakes/rotors": "freins/disques",
    engine: "moteur",
    "engine/filters": "moteur/filtres",
    "engine/ignition": "moteur/allumage",
    suspension: "suspension",
    lighting: "eclairage",
    exhaust: "echappement",
    oil: "huile",
  },
};

export function createEmptyCart(): Cart {
  return {
    id: `cart-${Date.now()}`,
    checkoutUrl: "/checkout",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0.00", currencyCode: "USD" },
      totalAmount: { amount: "0.00", currencyCode: "USD" },
      totalTaxAmount: { amount: "0.00", currencyCode: "USD" },
    },
  };
}

export const defaultLocaleContext: LocaleContext = {
  locale: "en-US",
  language: "en",
  region: "US",
  currency: "USD",
  market: "US",
  domain: "winparts.ie.localhost",
};

export const domainConfig: DomainConfigModel = {
  version: "2026-03-15-region-language-v1",
  updatedAt: new Date().toISOString(),
  maxAgeSeconds: 60,
  defaultDomain: defaultLocaleContext.domain,
  domains: [
    {
      host: "winparts.ie.localhost",
      canonical: true,
      storeKey: "store-a",
      experienceProfileId: "exp-store-a-v1",
      storeFlagIconSrc: "/icons/eu.svg",
      storeFlagIconLabel: "European Union",
      themeKey: "theme-default",
      themeRevision: "2026-q3-v1",
      themeTokenPack: "theme-default",
      regionCode: "US",
      defaultLanguage: "en",
      supportedLanguages: supportedLanguageCodes,
      cartUxMode: "drawer",
      cartPath: "/cart",
      openCartOnAdd: true,
      ...defaultLocaleContext,
    },
    {
      host: "winparts.es.localhost",
      canonical: true,
      storeKey: "store-b",
      experienceProfileId: "exp-store-b-v1",
      storeFlagIconSrc: "/icons/spain.svg",
      storeFlagIconLabel: "Spain",
      themeKey: "theme-green",
      themeRevision: "2026-q3-v1",
      themeTokenPack: "theme-green",
      regionCode: "ES",
      defaultLanguage: "es",
      supportedLanguages: supportedLanguageCodes,
      cartUxMode: "page",
      cartPath: "/carrito",
      openCartOnAdd: true,
      locale: "es-ES",
      language: "es",
      region: "ES",
      currency: "EUR",
      market: "ES",
      domain: "winparts.es.localhost",
    },
    {
      host: "winparts.nl.localhost",
      canonical: true,
      storeKey: "store-c",
      experienceProfileId: "exp-store-c-v1",
      storeFlagIconSrc: "/icons/netherlands.svg",
      storeFlagIconLabel: "Netherlands",
      themeKey: "theme-orange",
      themeRevision: "2026-q3-v1",
      themeTokenPack: "theme-orange",
      regionCode: "NL",
      defaultLanguage: "nl",
      supportedLanguages: supportedLanguageCodes,
      cartUxMode: "page",
      cartPath: "/winkelwagen",
      openCartOnAdd: true,
      locale: "nl-NL",
      language: "nl",
      region: "NL",
      currency: "EUR",
      market: "NL",
      domain: "winparts.nl.localhost",
    },
  ],
  aliases: [
    {
      host: "www.winparts.ie.localhost",
      canonicalHost: "winparts.ie.localhost",
    },
    {
      host: "www.winparts.nl.localhost",
      canonicalHost: "winparts.nl.localhost",
    },
    {
      host: "www.winparts.es.localhost",
      canonicalHost: "winparts.es.localhost",
    },
  ],
};

const messageCatalogByLocale: Record<
  string,
  Record<string, Record<string, string>>
> = {
  "en-US": {
    checkout: {
      title: "Checkout",
      shippingAddress: "Shipping Address",
      billingAddress: "Billing Address",
      useDifferentBillingAddress: "Use a different billing address",
      deliveryMethod: "Delivery Method",
      paymentMethod: "Payment Method",
      orderSummary: "Order Summary",
      subtotal: "Subtotal",
      taxes: "Taxes",
      shipping: "Shipping",
      total: "Total",
      placeOrder: "Place Order",
      placingOrder: "Placing Order...",
      orderError: "Something went wrong placing your order. Please try again.",
      savedAddresses: "Saved Addresses",
      useSavedAddress: "Use a saved address",
      useADifferentAddress: "Use a different address",
      saveThisAddress: "Save this address for future use",
      savedShippingLabel: "Shipping Address",
      savedBillingLabel: "Billing Address",
      defaultShipping: "Default Shipping",
      defaultBilling: "Default Billing",
      defaultShippingAndBilling: "Default Shipping & Billing",
      stepAddress: "Address",
      stepShippingPayment: "Shipping & Payment",
      stepReview: "Review",
      next: "Continue",
      back: "Back",
      edit: "Edit",
    },
    orderConfirmation: {
      title: "Order Confirmed",
      thankYou: "Thank you for your order!",
      orderNumber: "Order #{orderNumber}",
      items: "Items",
      subtotal: "Subtotal",
      shipping: "Shipping",
      taxes: "Taxes",
      total: "Total",
      deliveryMethod: "Delivery Method",
      paymentMethod: "Payment Method",
      continueShopping: "Continue Shopping",
    },
    common: {
      searchPlaceholder: "Search for products...",
    },
    nav: {
      browseProducts: "Browse Products",
      viewAllCategories: "View all categories",
      viewAllPrefix: "View all",
    },
    cart: {
      title: "My Cart",
      empty: "Your cart is empty.",
      taxes: "Taxes",
      shipping: "Shipping",
      shippingAtCheckout: "Calculated at checkout",
      total: "Total",
      checkout: "Proceed to Checkout",
    },
    page: {
      homeTitle: "Home",
      homeDescription: "High-performance ecommerce store built with Next.js.",
      searchTitle: "Search",
      searchDescription: "Search for products in the store.",
      cartTitle: "Cart",
      cartDescription: "Review and update items in your cart.",
      allCategories: "All Categories",
      allCategoriesDescription: "Browse all product categories.",
      notFoundTitle: "Not Found",
      notFoundDescription: "The requested page could not be found.",
      productsSuffix: "products",
    },
    search: {
      noResults: 'There are no products that match "{query}"',
      showing: 'Showing {totalResults} {resultsWord} for "{query}"',
      result: "result",
      results: "results",
    },
    sort: {
      relevance: "Relevance",
      trending: "Trending",
      latestArrivals: "Latest arrivals",
      priceLowToHigh: "Price: Low to high",
      priceHighToLow: "Price: High to low",
    },
  },
  "es-ES": {
    checkout: {
      title: "Pago",
      shippingAddress: "Direccion de envio",
      billingAddress: "Direccion de facturacion",
      useDifferentBillingAddress: "Usar una direccion de facturacion diferente",
      deliveryMethod: "Metodo de envio",
      paymentMethod: "Metodo de pago",
      orderSummary: "Resumen del pedido",
      subtotal: "Subtotal",
      taxes: "Impuestos",
      shipping: "Envio",
      total: "Total",
      placeOrder: "Realizar pedido",
      placingOrder: "Procesando pedido...",
      orderError: "Algo salio mal al realizar tu pedido. Intentalo de nuevo.",
      savedAddresses: "Direcciones guardadas",
      useSavedAddress: "Usar una direccion guardada",
      useADifferentAddress: "Usar una direccion diferente",
      saveThisAddress: "Guardar esta direccion para uso futuro",
      savedShippingLabel: "Direccion de envio",
      savedBillingLabel: "Direccion de facturacion",
      defaultShipping: "Envio predeterminado",
      defaultBilling: "Facturacion predeterminada",
      defaultShippingAndBilling: "Envio y facturacion predeterminados",
      stepAddress: "Direccion",
      stepShippingPayment: "Envio y pago",
      stepReview: "Revision",
      next: "Continuar",
      back: "Volver",
      edit: "Editar",
    },
    orderConfirmation: {
      title: "Pedido confirmado",
      thankYou: "Gracias por tu pedido!",
      orderNumber: "Pedido #{orderNumber}",
      items: "Articulos",
      subtotal: "Subtotal",
      shipping: "Envio",
      taxes: "Impuestos",
      total: "Total",
      deliveryMethod: "Metodo de envio",
      paymentMethod: "Metodo de pago",
      continueShopping: "Seguir comprando",
    },
    common: {
      searchPlaceholder: "Buscar productos...",
    },
    nav: {
      browseProducts: "Explorar productos",
      viewAllCategories: "Ver todas las categorías",
      viewAllPrefix: "Ver todo",
    },
    cart: {
      title: "Mi carrito",
      empty: "Tu carrito está vacío.",
      taxes: "Impuestos",
      shipping: "Envío",
      shippingAtCheckout: "Calculado al finalizar la compra",
      total: "Total",
      checkout: "Finalizar compra",
    },
    page: {
      homeTitle: "Inicio",
      homeDescription: "Tienda ecommerce de alto rendimiento con Next.js.",
      searchTitle: "Buscar",
      searchDescription: "Busca productos en la tienda.",
      cartTitle: "Carrito",
      cartDescription: "Revisa y actualiza los productos de tu carrito.",
      allCategories: "Todas las categorías",
      allCategoriesDescription: "Explora todas las categorías de productos.",
      notFoundTitle: "No encontrado",
      notFoundDescription: "No se pudo encontrar la página solicitada.",
      productsSuffix: "productos",
    },
    search: {
      noResults: 'No hay productos que coincidan con "{query}"',
      showing: 'Mostrando {totalResults} {resultsWord} para "{query}"',
      result: "resultado",
      results: "resultados",
    },
    sort: {
      relevance: "Relevancia",
      trending: "Tendencias",
      latestArrivals: "Novedades",
      priceLowToHigh: "Precio: de menor a mayor",
      priceHighToLow: "Precio: de mayor a menor",
    },
  },
  "nl-NL": {
    checkout: {
      title: "Afrekenen",
      shippingAddress: "Verzendadres",
      billingAddress: "Factuuradres",
      useDifferentBillingAddress: "Gebruik een ander factuuradres",
      deliveryMethod: "Verzendmethode",
      paymentMethod: "Betaalmethode",
      orderSummary: "Besteloverzicht",
      subtotal: "Subtotaal",
      taxes: "Belastingen",
      shipping: "Verzending",
      total: "Totaal",
      placeOrder: "Bestelling plaatsen",
      placingOrder: "Bestelling plaatsen...",
      orderError:
        "Er is iets misgegaan bij het plaatsen van je bestelling. Probeer het opnieuw.",
      savedAddresses: "Opgeslagen adressen",
      useSavedAddress: "Gebruik een opgeslagen adres",
      useADifferentAddress: "Gebruik een ander adres",
      saveThisAddress: "Bewaar dit adres voor toekomstig gebruik",
      savedShippingLabel: "Verzendadres",
      savedBillingLabel: "Factuuradres",
      defaultShipping: "Standaard verzending",
      defaultBilling: "Standaard facturering",
      defaultShippingAndBilling: "Standaard verzending en facturering",
      stepAddress: "Adres",
      stepShippingPayment: "Verzending en betaling",
      stepReview: "Overzicht",
      next: "Doorgaan",
      back: "Terug",
      edit: "Bewerken",
    },
    orderConfirmation: {
      title: "Bestelling bevestigd",
      thankYou: "Bedankt voor je bestelling!",
      orderNumber: "Bestelling #{orderNumber}",
      items: "Artikelen",
      subtotal: "Subtotaal",
      shipping: "Verzending",
      taxes: "Belastingen",
      total: "Totaal",
      deliveryMethod: "Verzendmethode",
      paymentMethod: "Betaalmethode",
      continueShopping: "Verder winkelen",
    },
    common: {
      searchPlaceholder: "Zoek naar producten...",
    },
    nav: {
      browseProducts: "Blader door producten",
      viewAllCategories: "Bekijk alle categorieen",
      viewAllPrefix: "Bekijk alle",
    },
    cart: {
      title: "Mijn winkelwagen",
      empty: "Je winkelwagen is leeg.",
      taxes: "Belastingen",
      shipping: "Verzending",
      shippingAtCheckout: "Berekend bij afrekenen",
      total: "Totaal",
      checkout: "Doorgaan naar afrekenen",
    },
    page: {
      homeTitle: "Home",
      homeDescription:
        "High-performance ecommerce storefront gebouwd met Next.js.",
      searchTitle: "Zoeken",
      searchDescription: "Zoek producten in de winkel.",
      cartTitle: "Winkelwagen",
      cartDescription: "Bekijk en wijzig artikelen in je winkelwagen.",
      allCategories: "Alle categorieen",
      allCategoriesDescription: "Bekijk alle productcategorieen.",
      notFoundTitle: "Niet gevonden",
      notFoundDescription: "De opgevraagde pagina kon niet worden gevonden.",
      productsSuffix: "producten",
    },
    search: {
      noResults: 'Er zijn geen producten die overeenkomen met "{query}"',
      showing: 'Toont {totalResults} {resultsWord} voor "{query}"',
      result: "resultaat",
      results: "resultaten",
    },
    sort: {
      relevance: "Relevantie",
      trending: "Trending",
      latestArrivals: "Nieuw binnen",
      priceLowToHigh: "Prijs: laag naar hoog",
      priceHighToLow: "Prijs: hoog naar laag",
    },
  },
  "fr-FR": {
    checkout: {
      title: "Paiement",
      shippingAddress: "Adresse de livraison",
      billingAddress: "Adresse de facturation",
      useDifferentBillingAddress:
        "Utiliser une adresse de facturation differente",
      deliveryMethod: "Mode de livraison",
      paymentMethod: "Mode de paiement",
      orderSummary: "Recapitulatif de la commande",
      subtotal: "Sous-total",
      taxes: "Taxes",
      shipping: "Livraison",
      total: "Total",
      placeOrder: "Passer la commande",
      placingOrder: "Commande en cours...",
      orderError:
        "Une erreur est survenue lors de la commande. Veuillez reessayer.",
      savedAddresses: "Adresses enregistrees",
      useSavedAddress: "Utiliser une adresse enregistree",
      useADifferentAddress: "Utiliser une autre adresse",
      saveThisAddress: "Enregistrer cette adresse pour une utilisation future",
      savedShippingLabel: "Adresse de livraison",
      savedBillingLabel: "Adresse de facturation",
      defaultShipping: "Livraison par defaut",
      defaultBilling: "Facturation par defaut",
      defaultShippingAndBilling: "Livraison et facturation par defaut",
      stepAddress: "Adresse",
      stepShippingPayment: "Livraison et paiement",
      stepReview: "Verification",
      next: "Continuer",
      back: "Retour",
      edit: "Modifier",
    },
    orderConfirmation: {
      title: "Commande confirmee",
      thankYou: "Merci pour votre commande !",
      orderNumber: "Commande #{orderNumber}",
      items: "Articles",
      subtotal: "Sous-total",
      shipping: "Livraison",
      taxes: "Taxes",
      total: "Total",
      deliveryMethod: "Mode de livraison",
      paymentMethod: "Mode de paiement",
      continueShopping: "Continuer vos achats",
    },
    common: {
      searchPlaceholder: "Rechercher des produits...",
    },
    nav: {
      browseProducts: "Parcourir les produits",
      viewAllCategories: "Voir toutes les categories",
      viewAllPrefix: "Voir tout",
    },
    cart: {
      title: "Mon panier",
      empty: "Votre panier est vide.",
      taxes: "Taxes",
      shipping: "Livraison",
      shippingAtCheckout: "Calcule a la commande",
      total: "Total",
      checkout: "Passer au paiement",
    },
    page: {
      homeTitle: "Accueil",
      homeDescription: "Storefront e-commerce haute performance avec Next.js.",
      searchTitle: "Recherche",
      searchDescription: "Recherchez des produits dans la boutique.",
      cartTitle: "Panier",
      cartDescription: "Consultez et modifiez les articles de votre panier.",
      allCategories: "Toutes les categories",
      allCategoriesDescription: "Parcourez toutes les categories de produits.",
      notFoundTitle: "Introuvable",
      notFoundDescription: "La page demandee est introuvable.",
      productsSuffix: "produits",
    },
    search: {
      noResults: 'Aucun produit ne correspond a "{query}"',
      showing: '{totalResults} {resultsWord} pour "{query}"',
      result: "resultat",
      results: "resultats",
    },
    sort: {
      relevance: "Pertinence",
      trending: "Tendance",
      latestArrivals: "Nouveautes",
      priceLowToHigh: "Prix : croissant",
      priceHighToLow: "Prix : decroissant",
    },
  },
};

export const translationVersion = "2026-03-15";

function pickNamespaces(
  catalog: Record<string, Record<string, string>>,
  namespaces: string[],
): Record<string, Record<string, string>> {
  const selected: Record<string, Record<string, string>> = {};
  for (const ns of namespaces) {
    if (catalog[ns] !== undefined) {
      selected[ns] = catalog[ns];
    }
  }
  return selected;
}

export function getMessagesForLocale(
  locale: string,
  namespaces: string[],
): I18nMessagesModel {
  const fallbackLocale = defaultLocaleContext.locale;
  const resolvedLocale = resolveCatalogLocale(locale);
  const baseCatalog =
    messageCatalogByLocale[resolvedLocale] ??
    messageCatalogByLocale[fallbackLocale]!;
  const messages = pickNamespaces(baseCatalog, namespaces);

  return {
    locale: resolvedLocale,
    namespaces,
    messages,
    translationVersion,
  };
}

export function getCatalogValue(
  locale: string,
  path: string,
): string | undefined {
  const fallbackLocale = defaultLocaleContext.locale;
  const resolvedLocale = resolveCatalogLocale(locale);
  const catalog =
    messageCatalogByLocale[resolvedLocale] ??
    messageCatalogByLocale[fallbackLocale];
  if (!catalog) return undefined;

  const parts = path.split(".");
  let current: unknown = catalog;
  for (const part of parts) {
    if (!current || typeof current !== "object" || !(part in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return typeof current === "string" ? current : undefined;
}

export function resolveCatalogLocale(localeOrLanguage?: string): string {
  if (!localeOrLanguage) {
    return defaultLocaleContext.locale;
  }

  if (messageCatalogByLocale[localeOrLanguage]) {
    return localeOrLanguage;
  }

  const language = normalizeLanguage(localeOrLanguage);
  if (language && localeByLanguage[language]) {
    return localeByLanguage[language];
  }

  return defaultLocaleContext.locale;
}

export function normalizeLanguage(input?: string): LanguageCode | undefined {
  if (!input) return undefined;
  const candidate = input.includes("-") ? input.split("-")[0] : input;
  if (
    candidate === "en" ||
    candidate === "es" ||
    candidate === "nl" ||
    candidate === "fr"
  ) {
    return candidate;
  }
  return undefined;
}
