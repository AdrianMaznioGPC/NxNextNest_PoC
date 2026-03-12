import type {
  Cart,
  Collection,
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
  product("p-1", "ceramic-brake-pads", "Ceramic Brake Pads", "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.", "1486262715619-67b85e0b08d3", "89.99", "Axle", ["Front", "Rear"]),
  product("p-2", "drilled-rotors", "Drilled & Slotted Rotors", "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.", "1492144534655-ae79c964c9d7", "149.99", "Size", ["12 in", "13 in"]),
  product("p-3", "performance-air-filter", "Performance Air Filter", "Washable and reusable high-flow air filter. Increases airflow for better throttle response.", "1489824904134-891ab64532f1", "54.99", "Fitment", ["Universal", "Direct-Fit"]),
  product("p-4", "iridium-spark-plugs", "Iridium Spark Plugs (Set of 4)", "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.", "1517524008697-84bbe3c3fd98", "39.99", "Heat Range", ["6", "7", "8"]),
  product("p-5", "coilover-kit", "Adjustable Coilover Kit", "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.", "1494976388531-d1058494cdd8", "899.99", "Fitment", ["Front & Rear Set"]),
  product("p-6", "sway-bar-end-links", "Sway Bar End Links", "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.", "1504215680853-026ed2a45def", "64.99", "Position", ["Front", "Rear"]),
  product("p-7", "led-headlight-bulbs", "LED Headlight Bulbs (Pair)", "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.", "1605559424843-9e4c228bf1c2", "79.99", "Bulb Size", ["H11", "9005", "9006"]),
  product("p-8", "smoked-tail-lights", "Smoked Tail Light Covers", "UV-resistant smoked tail light covers for a sleek custom appearance.", "1609521263047-f8f205293f24", "44.99", "Fitment", ["Universal"]),
  product("p-9", "cat-back-exhaust", "Cat-Back Exhaust System", "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.", "1552519507-da3b142c6e3d", "649.99", "Tip Style", ["Polished", "Burnt Titanium"]),
  product("p-10", "exhaust-tip-clamp-on", "Clamp-On Exhaust Tip", 'Universal stainless steel clamp-on exhaust tip. Fits 2.5" to 3" pipes.', "1549399542-7e3f8b79c341", "29.99", "Finish", ["Chrome", "Black"]),
  product("p-11", "short-ram-intake", "Short Ram Intake Kit", "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.", "1606577924006-27d39b132ae2", "129.99", "Pipe Diameter", ["2.5 in", "3 in"]),
  product("p-12", "wheel-spacers", "Wheel Spacers (Pair)", "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.", "1562911791-c7a97b729ec5", "74.99", "Thickness", ["15mm", "20mm", "25mm"]),
];

export const collections: Collection[] = [
  { handle: "", title: "All", description: "All car parts", seo: { title: "All", description: "All car parts" }, path: "/search", updatedAt: new Date().toISOString() },
  { handle: "brakes", title: "Brakes", description: "Brake pads, rotors, and calipers", seo: { title: "Brakes", description: "Brake pads, rotors, and calipers" }, path: "/search/brakes", updatedAt: new Date().toISOString() },
  { handle: "engine", title: "Engine", description: "Air filters, spark plugs, and intake systems", seo: { title: "Engine", description: "Air filters, spark plugs, and intake systems" }, path: "/search/engine", updatedAt: new Date().toISOString() },
  { handle: "suspension", title: "Suspension", description: "Coilovers, sway bars, and bushings", seo: { title: "Suspension", description: "Coilovers, sway bars, and bushings" }, path: "/search/suspension", updatedAt: new Date().toISOString() },
  { handle: "lighting", title: "Lighting", description: "Headlights, tail lights, and LED upgrades", seo: { title: "Lighting", description: "Headlights, tail lights, and LED upgrades" }, path: "/search/lighting", updatedAt: new Date().toISOString() },
  { handle: "exhaust", title: "Exhaust", description: "Cat-back systems, mufflers, and exhaust tips", seo: { title: "Exhaust", description: "Cat-back systems, mufflers, and exhaust tips" }, path: "/search/exhaust", updatedAt: new Date().toISOString() },
];

export const collectionProductMap: Record<string, string[]> = {
  "": products.map((p) => p.id),
  brakes: ["p-1", "p-2"],
  engine: ["p-3", "p-4"],
  suspension: ["p-5", "p-6"],
  lighting: ["p-7", "p-8"],
  exhaust: ["p-9", "p-10"],
  "hidden-homepage-featured-items": ["p-1", "p-5", "p-9"],
  "hidden-homepage-carousel": ["p-2", "p-3", "p-7", "p-11", "p-12"],
};

export const menus: Record<string, Menu[]> = {
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

export const pages: Page[] = [
  { id: "page-1", title: "About", handle: "about", body: "<p>We are a modern car parts company committed to quality products and great customer experiences.</p>", bodySummary: "We are a modern car parts company.", seo: { title: "About Us", description: "Learn about our company and mission." }, createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString() },
  { id: "page-2", title: "Terms & Conditions", handle: "terms-and-conditions", body: "<p>These are the terms and conditions for using our store.</p>", bodySummary: "Terms and conditions.", seo: { title: "Terms & Conditions", description: "Read our terms and conditions." }, createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString() },
  { id: "page-3", title: "Privacy Policy", handle: "privacy-policy", body: "<p>Your privacy is important to us.</p>", bodySummary: "Our privacy policy.", seo: { title: "Privacy Policy", description: "Read our privacy policy." }, createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString() },
  { id: "page-4", title: "FAQ", handle: "faq", body: "<h2>FAQ</h2><h3>How long does shipping take?</h3><p>5-7 business days.</p>", bodySummary: "Frequently asked questions.", seo: { title: "FAQ", description: "Frequently asked questions." }, createdAt: "2024-01-01T00:00:00Z", updatedAt: new Date().toISOString() },
];

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
