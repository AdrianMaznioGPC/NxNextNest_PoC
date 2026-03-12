import type { Cart, Collection, Menu, Page, Product } from "lib/types";

const placeholderImage = (label: string, size = 800) =>
  `https://placehold.co/${size}x${size}/e2e8f0/475569?text=${encodeURIComponent(label)}`;

function makeVariants(
  prices: { amount: string; currencyCode?: string }[],
  optionName: string,
  optionValues: string[],
) {
  return optionValues.map((value, i) => ({
    id: `var-${value.toLowerCase().replace(/\s/g, "-")}-${i}`,
    title: value,
    availableForSale: true,
    selectedOptions: [{ name: optionName, value }],
    price: {
      amount: prices[i]?.amount ?? prices[0]!.amount,
      currencyCode: prices[i]?.currencyCode ?? "USD",
    },
  }));
}

export const mockProducts: Product[] = [
  {
    id: "product-1",
    handle: "classic-leather-jacket",
    availableForSale: true,
    title: "Classic Leather Jacket",
    description:
      "A timeless leather jacket crafted from premium full-grain leather. Features a clean silhouette with minimal hardware.",
    descriptionHtml:
      "<p>A timeless leather jacket crafted from premium full-grain leather. Features a clean silhouette with minimal hardware.</p>",
    options: [
      { id: "opt-1", name: "Size", values: ["S", "M", "L", "XL"] },
    ],
    priceRange: {
      maxVariantPrice: { amount: "299.00", currencyCode: "USD" },
      minVariantPrice: { amount: "299.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "299.00" }],
      "Size",
      ["S", "M", "L", "XL"],
    ),
    featuredImage: {
      url: placeholderImage("Leather+Jacket"),
      altText: "Classic Leather Jacket",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Leather+Jacket"),
        altText: "Classic Leather Jacket - Front",
        width: 800,
        height: 800,
      },
      {
        url: placeholderImage("Leather+Jacket+Back"),
        altText: "Classic Leather Jacket - Back",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Classic Leather Jacket",
      description: "A timeless leather jacket crafted from premium full-grain leather.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "product-2",
    handle: "minimalist-watch",
    availableForSale: true,
    title: "Minimalist Watch",
    description:
      "A clean, modern watch with a Swiss quartz movement and sapphire crystal glass.",
    descriptionHtml:
      "<p>A clean, modern watch with a Swiss quartz movement and sapphire crystal glass.</p>",
    options: [
      { id: "opt-2", name: "Color", values: ["Silver", "Gold", "Black"] },
    ],
    priceRange: {
      maxVariantPrice: { amount: "199.00", currencyCode: "USD" },
      minVariantPrice: { amount: "179.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "179.00" }, { amount: "199.00" }, { amount: "189.00" }],
      "Color",
      ["Silver", "Gold", "Black"],
    ),
    featuredImage: {
      url: placeholderImage("Watch"),
      altText: "Minimalist Watch",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Watch"),
        altText: "Minimalist Watch",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Minimalist Watch",
      description: "A clean, modern watch with Swiss quartz movement.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "product-3",
    handle: "canvas-tote-bag",
    availableForSale: true,
    title: "Canvas Tote Bag",
    description:
      "Durable organic cotton canvas tote. Spacious interior with an inner pocket for essentials.",
    descriptionHtml:
      "<p>Durable organic cotton canvas tote. Spacious interior with an inner pocket for essentials.</p>",
    options: [
      {
        id: "opt-3",
        name: "Color",
        values: ["Natural", "Navy", "Olive"],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: "49.00", currencyCode: "USD" },
      minVariantPrice: { amount: "49.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "49.00" }],
      "Color",
      ["Natural", "Navy", "Olive"],
    ),
    featuredImage: {
      url: placeholderImage("Tote+Bag"),
      altText: "Canvas Tote Bag",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Tote+Bag"),
        altText: "Canvas Tote Bag",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Canvas Tote Bag",
      description: "Durable organic cotton canvas tote bag.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "product-4",
    handle: "merino-wool-sweater",
    availableForSale: true,
    title: "Merino Wool Sweater",
    description:
      "Lightweight merino wool crew-neck sweater. Naturally temperature-regulating and breathable.",
    descriptionHtml:
      "<p>Lightweight merino wool crew-neck sweater. Naturally temperature-regulating and breathable.</p>",
    options: [
      { id: "opt-4", name: "Size", values: ["S", "M", "L", "XL"] },
    ],
    priceRange: {
      maxVariantPrice: { amount: "129.00", currencyCode: "USD" },
      minVariantPrice: { amount: "129.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "129.00" }],
      "Size",
      ["S", "M", "L", "XL"],
    ),
    featuredImage: {
      url: placeholderImage("Sweater"),
      altText: "Merino Wool Sweater",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Sweater"),
        altText: "Merino Wool Sweater - Front",
        width: 800,
        height: 800,
      },
      {
        url: placeholderImage("Sweater+Back"),
        altText: "Merino Wool Sweater - Back",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Merino Wool Sweater",
      description: "Lightweight merino wool crew-neck sweater.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "product-5",
    handle: "running-sneakers",
    availableForSale: true,
    title: "Running Sneakers",
    description:
      "Lightweight performance running shoes with responsive cushioning and breathable mesh upper.",
    descriptionHtml:
      "<p>Lightweight performance running shoes with responsive cushioning and breathable mesh upper.</p>",
    options: [
      { id: "opt-5", name: "Size", values: ["8", "9", "10", "11", "12"] },
    ],
    priceRange: {
      maxVariantPrice: { amount: "149.00", currencyCode: "USD" },
      minVariantPrice: { amount: "149.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "149.00" }],
      "Size",
      ["8", "9", "10", "11", "12"],
    ),
    featuredImage: {
      url: placeholderImage("Sneakers"),
      altText: "Running Sneakers",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Sneakers"),
        altText: "Running Sneakers",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Running Sneakers",
      description: "Lightweight performance running shoes.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "product-6",
    handle: "sunglasses-aviator",
    availableForSale: false,
    title: "Aviator Sunglasses",
    description:
      "Classic aviator sunglasses with polarized lenses and titanium frame.",
    descriptionHtml:
      "<p>Classic aviator sunglasses with polarized lenses and titanium frame.</p>",
    options: [
      { id: "opt-6", name: "Color", values: ["Gold", "Silver"] },
    ],
    priceRange: {
      maxVariantPrice: { amount: "159.00", currencyCode: "USD" },
      minVariantPrice: { amount: "149.00", currencyCode: "USD" },
    },
    variants: makeVariants(
      [{ amount: "149.00" }, { amount: "159.00" }],
      "Color",
      ["Gold", "Silver"],
    ),
    featuredImage: {
      url: placeholderImage("Sunglasses"),
      altText: "Aviator Sunglasses",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: placeholderImage("Sunglasses"),
        altText: "Aviator Sunglasses",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "Aviator Sunglasses",
      description: "Classic aviator sunglasses with polarized lenses.",
    },
    tags: [],
    updatedAt: new Date().toISOString(),
  },
];

export const mockCollections: Collection[] = [
  {
    handle: "",
    title: "All",
    description: "All products",
    seo: { title: "All", description: "All products" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "apparel",
    title: "Apparel",
    description: "Clothing and accessories",
    seo: { title: "Apparel", description: "Clothing and accessories" },
    path: "/search/apparel",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "accessories",
    title: "Accessories",
    description: "Watches, bags, sunglasses and more",
    seo: {
      title: "Accessories",
      description: "Watches, bags, sunglasses and more",
    },
    path: "/search/accessories",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "footwear",
    title: "Footwear",
    description: "Shoes and sneakers",
    seo: { title: "Footwear", description: "Shoes and sneakers" },
    path: "/search/footwear",
    updatedAt: new Date().toISOString(),
  },
];

// Map collection handles to product IDs for filtering
const collectionProductMap: Record<string, string[]> = {
  "": mockProducts.map((p) => p.id), // "All"
  apparel: ["product-1", "product-4"],
  accessories: ["product-2", "product-3", "product-6"],
  footwear: ["product-5"],
  "hidden-homepage-featured-items": [
    "product-1",
    "product-2",
    "product-3",
  ],
  "hidden-homepage-carousel": [
    "product-4",
    "product-5",
    "product-6",
    "product-1",
    "product-2",
  ],
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
    { title: "Apparel", path: "/search/apparel" },
    { title: "Accessories", path: "/search/accessories" },
    { title: "Footwear", path: "/search/footwear" },
  ],
  "next-js-frontend-footer-menu": [
    { title: "Home", path: "/" },
    { title: "About", path: "/about" },
    { title: "Terms & Conditions", path: "/terms-and-conditions" },
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "FAQ", path: "/faq" },
  ],
};

export const mockPages: Page[] = [
  {
    id: "page-1",
    title: "About",
    handle: "about",
    body: "<p>We are a modern commerce company committed to quality products and great customer experiences.</p><p>Founded in 2024, we curate the best products from around the world.</p>",
    bodySummary:
      "We are a modern commerce company committed to quality products.",
    seo: {
      title: "About Us",
      description:
        "Learn about our company and mission.",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-2",
    title: "Terms & Conditions",
    handle: "terms-and-conditions",
    body: "<p>These are the terms and conditions for using our store. By using this website you agree to these terms.</p><h2>General</h2><p>All products are subject to availability.</p>",
    bodySummary: "Terms and conditions for using our store.",
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
    body: "<p>Your privacy is important to us. This privacy policy explains how we collect, use, and protect your personal information.</p>",
    bodySummary: "Our privacy policy.",
    seo: {
      title: "Privacy Policy",
      description: "Read our privacy policy.",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "page-4",
    title: "FAQ",
    handle: "faq",
    body: "<h2>Frequently Asked Questions</h2><h3>How long does shipping take?</h3><p>Standard shipping takes 5-7 business days.</p><h3>What is your return policy?</h3><p>We accept returns within 30 days of purchase.</p>",
    bodySummary: "Frequently asked questions.",
    seo: {
      title: "FAQ",
      description: "Frequently asked questions about our store.",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: new Date().toISOString(),
  },
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
