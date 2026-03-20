import type { ListingProduct, Product } from "@commerce/shared-types";

/**
 * Flattens enriched products into variant-level listing items.
 * Each variant becomes its own ListingProduct — the unit of display
 * on category, search, and carousel listing pages.
 */
export function flattenToListingProducts(products: Product[]): ListingProduct[] {
  return products.flatMap((product) =>
    product.variants.map((variant) => ({
      variantId: variant.id,
      variantTitle: variant.title,
      selectedOptions: variant.selectedOptions,
      price: variant.price,
      purchasable: variant.purchasable,
      stockStatus: variant.stockStatus,
      stockMessage: variant.stockMessage,
      productId: product.id,
      productHandle: product.handle,
      productTitle: product.title,
      description: product.description,
      featuredImage: product.featuredImage,
      updatedAt: product.updatedAt,
    })),
  );
}
