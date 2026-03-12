import type { Product } from "lib/types";

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
    featuredImage: { url: img(imageId), altText: title, width: 800, height: 800 },
    images: [{ url: img(imageId), altText: title, width: 800, height: 800 }],
    seo: { title, description },
    tags,
    updatedAt: new Date().toISOString(),
  };
}

// Verified Unsplash IDs (all return 200)
export const mockProducts: Product[] = [
  // --- Brakes ---
  product("p-1", "ceramic-brake-pads", "Ceramic Brake Pads", "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.", "1486262715619-67b85e0b08d3", "89.99", "Axle", ["Front", "Rear"]),
  product("p-2", "drilled-rotors", "Drilled & Slotted Rotors", "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.", "1492144534655-ae79c964c9d7", "149.99", "Size", ["12 in", "13 in"]),

  // --- Engine ---
  product("p-3", "performance-air-filter", "Performance Air Filter", "Washable and reusable high-flow air filter. Increases airflow for better throttle response.", "1489824904134-891ab64532f1", "54.99", "Fitment", ["Universal", "Direct-Fit"]),
  product("p-4", "iridium-spark-plugs", "Iridium Spark Plugs (Set of 4)", "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.", "1517524008697-84bbe3c3fd98", "39.99", "Heat Range", ["6", "7", "8"]),

  // --- Suspension ---
  product("p-5", "coilover-kit", "Adjustable Coilover Kit", "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.", "1494976388531-d1058494cdd8", "899.99", "Fitment", ["Front & Rear Set"]),
  product("p-6", "sway-bar-end-links", "Sway Bar End Links", "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.", "1504215680853-026ed2a45def", "64.99", "Position", ["Front", "Rear"]),

  // --- Lighting ---
  product("p-7", "led-headlight-bulbs", "LED Headlight Bulbs (Pair)", "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.", "1605559424843-9e4c228bf1c2", "79.99", "Bulb Size", ["H11", "9005", "9006"]),
  product("p-8", "smoked-tail-lights", "Smoked Tail Light Covers", "UV-resistant smoked tail light covers for a sleek custom appearance.", "1609521263047-f8f205293f24", "44.99", "Fitment", ["Universal"]),

  // --- Exhaust ---
  product("p-9", "cat-back-exhaust", "Cat-Back Exhaust System", "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.", "1552519507-da3b142c6e3d", "649.99", "Tip Style", ["Polished", "Burnt Titanium"]),
  product("p-10", "exhaust-tip-clamp-on", "Clamp-On Exhaust Tip", "Universal stainless steel clamp-on exhaust tip. Fits 2.5\" to 3\" pipes.", "1549399542-7e3f8b79c341", "29.99", "Finish", ["Chrome", "Black"]),

  // --- Homepage hidden collections ---
  product("p-11", "short-ram-intake", "Short Ram Intake Kit", "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.", "1606577924006-27d39b132ae2", "129.99", "Pipe Diameter", ["2.5 in", "3 in"]),
  product("p-12", "wheel-spacers", "Wheel Spacers (Pair)", "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.", "1562911791-c7a97b729ec5", "74.99", "Thickness", ["15mm", "20mm", "25mm"]),
];
