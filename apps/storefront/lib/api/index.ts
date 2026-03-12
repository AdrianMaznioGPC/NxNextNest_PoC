import { HIDDEN_PRODUCT_TAG, TAGS } from "lib/constants";
import type { Cart, CartItem, Collection, Menu, Page, Product } from "lib/types";
import {
  createEmptyCart,
  getProductsForCollection,
  mockCollections,
  mockMenus,
  mockPages,
  mockProducts,
} from "./mock-data";
import { cookies } from "next/headers";
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from "next/cache";

// ---------------------------------------------------------------------------
// Future BFF integration point
// const BFF_BASE_URL = process.env.BFF_URL || 'http://localhost:4000';
// All functions below can be swapped to fetch from the BFF.
// ---------------------------------------------------------------------------

// In-memory cart store (mock). Keyed by cartId.
const cartStore = new Map<string, Cart>();

// -- Products ----------------------------------------------------------------

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  let products = mockProducts.filter(
    (p) => !p.tags.includes(HIDDEN_PRODUCT_TAG),
  );

  if (query) {
    const q = query.toLowerCase();
    products = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (sortKey === "PRICE") {
    products.sort(
      (a, b) =>
        parseFloat(a.priceRange.minVariantPrice.amount) -
        parseFloat(b.priceRange.minVariantPrice.amount),
    );
  } else if (sortKey === "CREATED_AT" || sortKey === "CREATED") {
    products.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
  } else if (sortKey === "BEST_SELLING") {
    // Mock: keep original order (best-selling placeholder)
  }

  if (reverse) {
    products.reverse();
  }

  return products;
}

export async function getProduct(
  handle: string,
): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  return mockProducts.find((p) => p.handle === handle);
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  // Return other products as recommendations (exclude the current one)
  return mockProducts
    .filter((p) => p.id !== productId && !p.tags.includes(HIDDEN_PRODUCT_TAG))
    .slice(0, 4);
}

// -- Collections -------------------------------------------------------------

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return mockCollections;
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return mockCollections.find((c) => c.handle === handle);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  let products = getProductsForCollection(collection);

  if (sortKey === "PRICE") {
    products.sort(
      (a, b) =>
        parseFloat(a.priceRange.minVariantPrice.amount) -
        parseFloat(b.priceRange.minVariantPrice.amount),
    );
  } else if (sortKey === "CREATED_AT" || sortKey === "CREATED") {
    products.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
  }

  if (reverse) {
    products.reverse();
  }

  return products;
}

// -- Menu --------------------------------------------------------------------

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  return mockMenus[handle] ?? [];
}

// -- Pages -------------------------------------------------------------------

export async function getPage(handle: string): Promise<Page> {
  const page = mockPages.find((p) => p.handle === handle);
  if (!page) {
    throw new Error(`Page not found: ${handle}`);
  }
  return page;
}

export async function getPages(): Promise<Page[]> {
  return mockPages;
}

// -- Cart --------------------------------------------------------------------

export async function createCart(): Promise<Cart> {
  const cart = createEmptyCart();
  cartStore.set(cart.id!, cart);
  return cart;
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;
  if (!cartId) return undefined;
  return cartStore.get(cartId);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const cart = cartStore.get(cartId) ?? createEmptyCart();

  for (const line of lines) {
    const existing = cart.lines.find(
      (l) => l.merchandise.id === line.merchandiseId,
    );

    if (existing) {
      existing.quantity += line.quantity;
      existing.cost.totalAmount.amount = (
        parseFloat(existing.cost.totalAmount.amount) /
        (existing.quantity - line.quantity) *
        existing.quantity
      ).toFixed(2);
    } else {
      // Find the product & variant from mock data
      const variant = mockProducts
        .flatMap((p) => p.variants.map((v) => ({ variant: v, product: p })))
        .find((pv) => pv.variant.id === line.merchandiseId);

      if (variant) {
        const newItem: CartItem = {
          id: `line-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          quantity: line.quantity,
          cost: {
            totalAmount: {
              amount: (
                parseFloat(variant.variant.price.amount) * line.quantity
              ).toFixed(2),
              currencyCode: variant.variant.price.currencyCode,
            },
          },
          merchandise: {
            id: variant.variant.id,
            title: variant.variant.title,
            selectedOptions: variant.variant.selectedOptions,
            product: {
              id: variant.product.id,
              handle: variant.product.handle,
              title: variant.product.title,
              featuredImage: variant.product.featuredImage,
            },
          },
        };
        cart.lines.push(newItem);
      }
    }
  }

  recalculateCart(cart);
  cartStore.set(cartId, cart);
  return cart;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const cart = cartStore.get(cartId) ?? createEmptyCart();

  cart.lines = cart.lines.filter((l) => !lineIds.includes(l.id!));

  recalculateCart(cart);
  cartStore.set(cartId, cart);
  return cart;
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value!;
  const cart = cartStore.get(cartId) ?? createEmptyCart();

  for (const line of lines) {
    const existing = cart.lines.find((l) => l.id === line.id);
    if (existing) {
      const unitPrice =
        parseFloat(existing.cost.totalAmount.amount) / existing.quantity;
      existing.quantity = line.quantity;
      existing.cost.totalAmount.amount = (unitPrice * line.quantity).toFixed(2);
    }
  }

  // Remove zero-quantity items
  cart.lines = cart.lines.filter((l) => l.quantity > 0);

  recalculateCart(cart);
  cartStore.set(cartId, cart);
  return cart;
}

function recalculateCart(cart: Cart): void {
  cart.totalQuantity = cart.lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalAmount = cart.lines.reduce(
    (sum, l) => sum + parseFloat(l.cost.totalAmount.amount),
    0,
  );
  const currencyCode =
    cart.lines[0]?.cost.totalAmount.currencyCode ?? "USD";
  cart.cost = {
    subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
    totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
    totalTaxAmount: { amount: "0.00", currencyCode },
  };
}
