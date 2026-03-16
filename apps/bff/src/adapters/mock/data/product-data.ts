import type { Image } from "@commerce/shared-types";

export type MockProductRecord = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  options: { id: string; name: string; values: string[] }[];
  variants: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
  }[];
  featuredImage: Image;
  images: Image[];
  seo: { title: string; description: string };
  tags: string[];
  updatedAt: string;
};

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;

function makeVariants(optionName: string, values: string[]) {
  return values.map((value, i) => ({
    id: `var-${value.toLowerCase().replace(/\s/g, "-")}-${i}`,
    title: value,
    selectedOptions: [{ name: optionName, value }],
  }));
}

function record(
  id: string,
  handle: string,
  title: string,
  description: string,
  imageId: string,
  optionName: string,
  optionValues: string[],
  tags: string[] = [],
): MockProductRecord {
  return {
    id,
    handle,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [{ id: `opt-${id}`, name: optionName, values: optionValues }],
    variants: makeVariants(optionName, optionValues),
    featuredImage: { url: img(imageId), altText: title, width: 800, height: 800 },
    images: [{ url: img(imageId), altText: title, width: 800, height: 800 }],
    seo: { title, description },
    tags,
    updatedAt: new Date().toISOString(),
  };
}

export const productRecords: MockProductRecord[] = [
  record("p-1", "ceramic-brake-pads", "Ceramic Brake Pads",
    "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.",
    "1486262715619-67b85e0b08d3", "Axle", ["Front", "Rear"]),
  record("p-2", "drilled-rotors", "Drilled & Slotted Rotors",
    "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.",
    "1492144534655-ae79c964c9d7", "Size", ["12 in", "13 in"]),
  record("p-3", "performance-air-filter", "Performance Air Filter",
    "Washable and reusable high-flow air filter. Increases airflow for better throttle response.",
    "1489824904134-891ab64532f1", "Fitment", ["Universal", "Direct-Fit"]),
  record("p-4", "iridium-spark-plugs", "Iridium Spark Plugs (Set of 4)",
    "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.",
    "1517524008697-84bbe3c3fd98", "Heat Range", ["6", "7", "8"]),
  record("p-5", "coilover-kit", "Adjustable Coilover Kit",
    "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.",
    "1494976388531-d1058494cdd8", "Fitment", ["Front & Rear Set"]),
  record("p-6", "sway-bar-end-links", "Sway Bar End Links",
    "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.",
    "1504215680853-026ed2a45def", "Position", ["Front", "Rear"]),
  record("p-7", "led-headlight-bulbs", "LED Headlight Bulbs (Pair)",
    "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.",
    "1605559424843-9e4c228bf1c2", "Bulb Size", ["H11", "9005", "9006"]),
  record("p-8", "smoked-tail-lights", "Smoked Tail Light Covers",
    "UV-resistant smoked tail light covers for a sleek custom appearance.",
    "1609521263047-f8f205293f24", "Fitment", ["Universal"]),
  record("p-9", "cat-back-exhaust", "Cat-Back Exhaust System",
    "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.",
    "1552519507-da3b142c6e3d", "Tip Style", ["Polished", "Burnt Titanium"]),
  record("p-10", "exhaust-tip-clamp-on", "Clamp-On Exhaust Tip",
    'Universal stainless steel clamp-on exhaust tip. Fits 2.5" to 3" pipes.',
    "1549399542-7e3f8b79c341", "Finish", ["Chrome", "Black"]),
  record("p-11", "short-ram-intake", "Short Ram Intake Kit",
    "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.",
    "1606577924006-27d39b132ae2", "Pipe Diameter", ["2.5 in", "3 in"]),
  record("p-12", "wheel-spacers", "Wheel Spacers (Pair)",
    "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.",
    "1562911791-c7a97b729ec5", "Thickness", ["15mm", "20mm", "25mm"]),
];
