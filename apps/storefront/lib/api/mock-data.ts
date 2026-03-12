import type { Cart, Page } from "lib/types";

export {
  getProductsForCollection,
  mockCollections,
  mockMenus,
} from "./mock-collections";
export { mockProducts } from "./mock-products";

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
      description: "Learn about our company and mission.",
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
