import type { BaseProduct } from "@commerce/shared-types";

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&h=800&fit=crop&q=80`;

type VariantDef = { id: string; label: string };

function record(
  id: string,
  handle: string,
  title: string,
  description: string,
  imageId: string,
  optionName: string,
  variants: VariantDef[],
  tags: string[] = [],
): BaseProduct {
  return {
    id,
    handle,
    title,
    description,
    descriptionHtml: `<p>${description}</p>`,
    options: [
      {
        id: `opt-${id}`,
        name: optionName,
        values: variants.map((v) => v.label),
      },
    ],
    variants: variants.map((v) => ({
      id: v.id,
      title: v.label,
      selectedOptions: [{ name: optionName, value: v.label }],
    })),
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

/* prettier-ignore */
const frProducts: BaseProduct[] = [
  record("p-1",  "ceramic-brake-pads",     "Plaquettes de frein en céramique",        "Plaquettes de frein céramique haute performance pour moins de poussière et de bruit. Compatible avec la plupart des berlines et SUV.",              "1486262715619-67b85e0b08d3", "Essieu",            [{ id: "var-front-0", label: "Avant" }, { id: "var-rear-1", label: "Arrière" }]),
  record("p-2",  "drilled-rotors",         "Disques de frein percés et rainurés",     "Disques de frein percés et rainurés pour une meilleure dissipation de la chaleur et une puissance de freinage accrue.",                              "1492144534655-ae79c964c9d7", "Taille",            [{ id: "var-12-in-0", label: "12 pouces" }, { id: "var-13-in-1", label: "13 pouces" }]),
  record("p-3",  "performance-air-filter", "Filtre à air performance",                "Filtre à air haute performance lavable et réutilisable. Augmente le débit d'air pour une meilleure réponse à l'accélérateur.",                     "1489824904134-891ab64532f1", "Montage",           [{ id: "var-universal-0", label: "Universel" }, { id: "var-direct-fit-1", label: "Montage direct" }]),
  record("p-4",  "iridium-spark-plugs",    "Bougies d'allumage iridium (lot de 4)",   "Bougies d'allumage à pointe iridium longue durée pour un allumage fiable et une efficacité énergétique optimale.",                                 "1517524008697-84bbe3c3fd98", "Indice thermique",  [{ id: "var-6-0", label: "6" }, { id: "var-7-1", label: "7" }, { id: "var-8-2", label: "8" }]),
  record("p-5",  "coilover-kit",           "Kit combinés filetés réglables",          "Kit de suspension combinés filetés à hauteur réglable. Amortissement réglable 32 voies pour route et circuit.",                                     "1494976388531-d1058494cdd8", "Montage",           [{ id: "var-front-&-rear-set-0", label: "Ensemble avant et arrière" }]),
  record("p-6",  "sway-bar-end-links",     "Biellettes de barre stabilisatrice",      "Biellettes de barre stabilisatrice renforcées avec silentblocs en polyuréthane pour un meilleur maintien en virage.",                               "1504215680853-026ed2a45def", "Position",          [{ id: "var-front-0", label: "Avant" }, { id: "var-rear-1", label: "Arrière" }]),
  record("p-7",  "led-headlight-bulbs",    "Ampoules LED phares (paire)",             "Ampoules LED 6000K blanc brillant pour phares. Remplacement plug-and-play avec ventilateur de refroidissement intégré.",                            "1605559424843-9e4c228bf1c2", "Taille d'ampoule", [{ id: "var-h11-0", label: "H11" }, { id: "var-9005-1", label: "9005" }, { id: "var-9006-2", label: "9006" }]),
  record("p-8",  "smoked-tail-lights",     "Caches feux arrière fumés",               "Caches feux arrière fumés résistants aux UV pour un look personnalisé et élégant.",                                                                "1609521263047-f8f205293f24", "Montage",           [{ id: "var-universal-0", label: "Universel" }]),
  record("p-9",  "cat-back-exhaust",       "Ligne d'échappement cat-back",            "Ligne d'échappement cat-back en acier inoxydable avec doubles sorties polies. Ajoute de la puissance et un son sportif.",                           "1552519507-da3b142c6e3d", "Style de sortie",   [{ id: "var-polished-0", label: "Poli" }, { id: "var-burnt-titanium-1", label: "Titane brûlé" }]),
  record("p-10", "exhaust-tip-clamp-on",   "Embout d'échappement à collier",          "Embout d'échappement universel en acier inoxydable à collier. Compatible avec les tubes de 63 à 76 mm.",                                           "1549399542-7e3f8b79c341", "Finition",          [{ id: "var-chrome-0", label: "Chrome" }, { id: "var-black-1", label: "Noir" }]),
  record("p-11", "short-ram-intake",       "Kit d'admission courte",                  "Admission courte en aluminium poli avec filtre conique haute performance. Installation facile par boulonnage.",                                     "1606577924006-27d39b132ae2", "Diamètre du tube", [{ id: "var-2.5-in-0", label: "63 mm" }, { id: "var-3-in-1", label: "76 mm" }]),
  record("p-12", "wheel-spacers",          "Élargisseurs de voie (paire)",            "Élargisseurs de voie hubcentriques pour un look agressif. Construction en aluminium T6 billet.",                                                    "1562911791-c7a97b729ec5", "Épaisseur",         [{ id: "var-15mm-0", label: "15mm" }, { id: "var-20mm-1", label: "20mm" }, { id: "var-25mm-2", label: "25mm" }]),
];

/* prettier-ignore */
const ieProducts: BaseProduct[] = [
  record("p-1",  "ceramic-brake-pads",     "Ceramic Brake Pads",           "High-performance ceramic brake pads for reduced dust and noise. Fits most sedans and SUVs.",           "1486262715619-67b85e0b08d3", "Axle",          [{ id: "var-front-0", label: "Front" }, { id: "var-rear-1", label: "Rear" }]),
  record("p-2",  "drilled-rotors",         "Drilled & Slotted Rotors",     "Cross-drilled and slotted brake rotors for improved heat dissipation and stopping power.",             "1492144534655-ae79c964c9d7", "Size",          [{ id: "var-12-in-0", label: "12 in" }, { id: "var-13-in-1", label: "13 in" }]),
  record("p-3",  "performance-air-filter", "Performance Air Filter",       "Washable and reusable high-flow air filter. Increases airflow for better throttle response.",           "1489824904134-891ab64532f1", "Fitment",       [{ id: "var-universal-0", label: "Universal" }, { id: "var-direct-fit-1", label: "Direct-Fit" }]),
  record("p-4",  "iridium-spark-plugs",    "Iridium Spark Plugs (Set of 4)", "Long-life iridium-tipped spark plugs for reliable ignition and fuel efficiency.",                     "1517524008697-84bbe3c3fd98", "Heat Range",    [{ id: "var-6-0", label: "6" }, { id: "var-7-1", label: "7" }, { id: "var-8-2", label: "8" }]),
  record("p-5",  "coilover-kit",           "Adjustable Coilover Kit",      "Full-height adjustable coilover suspension kit. 32-way damping adjustment for street or track.",       "1494976388531-d1058494cdd8", "Fitment",       [{ id: "var-front-&-rear-set-0", label: "Front & Rear Set" }]),
  record("p-6",  "sway-bar-end-links",     "Sway Bar End Links",           "Heavy-duty sway bar end links with polyurethane bushings for tighter cornering.",                      "1504215680853-026ed2a45def", "Position",      [{ id: "var-front-0", label: "Front" }, { id: "var-rear-1", label: "Rear" }]),
  record("p-7",  "led-headlight-bulbs",    "LED Headlight Bulbs (Pair)",   "6000K bright white LED headlight bulbs. Plug-and-play replacement with built-in cooling fan.",          "1605559424843-9e4c228bf1c2", "Bulb Size",     [{ id: "var-h11-0", label: "H11" }, { id: "var-9005-1", label: "9005" }, { id: "var-9006-2", label: "9006" }]),
  record("p-8",  "smoked-tail-lights",     "Smoked Tail Light Covers",     "UV-resistant smoked tail light covers for a sleek custom appearance.",                                 "1609521263047-f8f205293f24", "Fitment",       [{ id: "var-universal-0", label: "Universal" }]),
  record("p-9",  "cat-back-exhaust",       "Cat-Back Exhaust System",      "Stainless steel cat-back exhaust with dual polished tips. Adds horsepower and aggressive sound.",      "1552519507-da3b142c6e3d", "Tip Style",     [{ id: "var-polished-0", label: "Polished" }, { id: "var-burnt-titanium-1", label: "Burnt Titanium" }]),
  record("p-10", "exhaust-tip-clamp-on",   "Clamp-On Exhaust Tip",         'Universal stainless steel clamp-on exhaust tip. Fits 2.5" to 3" pipes.',                              "1549399542-7e3f8b79c341", "Finish",        [{ id: "var-chrome-0", label: "Chrome" }, { id: "var-black-1", label: "Black" }]),
  record("p-11", "short-ram-intake",       "Short Ram Intake Kit",         "Polished aluminum short ram intake with high-flow cone filter. Easy bolt-on installation.",             "1606577924006-27d39b132ae2", "Pipe Diameter", [{ id: "var-2.5-in-0", label: "2.5 in" }, { id: "var-3-in-1", label: "3 in" }]),
  record("p-12", "wheel-spacers",          "Wheel Spacers (Pair)",         "Hubcentric wheel spacers for an aggressive stance. T6 billet aluminum construction.",                  "1562911791-c7a97b729ec5", "Thickness",     [{ id: "var-15mm-0", label: "15mm" }, { id: "var-20mm-1", label: "20mm" }, { id: "var-25mm-2", label: "25mm" }]),
];

export const productsByStore: Record<string, BaseProduct[]> = {
  fr: frProducts,
  ie: ieProducts,
};
