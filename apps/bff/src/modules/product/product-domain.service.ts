import type {
  BaseProduct,
  Breadcrumb,
  Product,
  ProductPageData,
  SearchPageData,
  SitemapEntry,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  AVAILABILITY_PORT,
  type AvailabilityPort,
  type ProductAvailability,
  type VariantStockInfo,
} from "../../ports/availability.port";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";
import {
  PRICING_PORT,
  type PricingPort,
  type ProductPricing,
} from "../../ports/pricing.port";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";

@Injectable()
export class ProductDomainService {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(PRICING_PORT) private readonly pricing: PricingPort,
    @Inject(AVAILABILITY_PORT) private readonly availability: AvailabilityPort,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
  ) {}

  async getProduct(handle: string): Promise<Product | undefined> {
    const base = await this.products.getProduct(handle);
    if (!base) return undefined;
    return this.enrich(base);
  }

  async getProductById(id: string): Promise<Product | undefined> {
    const base = await this.products.getProductById(id);
    if (!base) return undefined;
    return this.enrich(base);
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    const results = await Promise.all(
      ids.map((id) => this.products.getProductById(id)),
    );
    const bases = results.filter((p): p is BaseProduct => p !== undefined);
    return this.enrichBatch(bases);
  }

  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    const results = await Promise.all(
      handles.map((h) => this.products.getProduct(h)),
    );
    const bases = results.filter((p): p is BaseProduct => p !== undefined);
    return this.enrichBatch(bases);
  }

  async getProducts(params: {
    query?: string;
    sortKey?: string;
    reverse?: boolean;
  }): Promise<Product[]> {
    const bases = await this.products.getProducts({ query: params.query });
    const enriched = await this.enrichBatch(bases);
    return sortProducts(enriched, params.sortKey, params.reverse);
  }

  async getCollectionProducts(params: {
    collection: string;
    sortKey?: string;
    reverse?: boolean;
  }): Promise<Product[]> {
    const ids = await this.collections.getCollectionProductIds(
      params.collection,
    );
    if (!ids.length) return [];

    const products = await this.getProductsByIds(ids);
    return sortProducts(products, params.sortKey, params.reverse);
  }

  async getRecommendations(productId: string): Promise<Product[]> {
    const bases = await this.products.getProductRecommendations(productId);
    return this.enrichBatch(bases);
  }

  async getProductPage(
    productId: string,
  ): Promise<ProductPageData | undefined> {
    const product = await this.getProductById(productId);
    if (!product) return undefined;

    const recommendations = await this.getRecommendations(product.id);

    const breadcrumbs: Breadcrumb[] = [
      ...(product.breadcrumbs ?? []),
      {
        title: product.title,
        path: `/product/${product.handle}/p/${product.id}`,
      },
    ];

    return {
      product,
      canonicalSlug: product.handle,
      breadcrumbs,
      recommendations,
    };
  }

  async getSearchResults(
    query?: string,
    sortKey?: string,
    reverse?: boolean,
  ): Promise<SearchPageData> {
    const { SORT_OPTIONS } = await import("../page-data/sort-options");
    const products = await this.getProducts({ query, sortKey, reverse });

    return {
      query: query ?? "",
      products,
      totalResults: products.length,
      sortOptions: SORT_OPTIONS,
    };
  }

  /**
   * Checks whether the given variant IDs are purchasable
   * (have pricing data and are marked available for sale).
   * Returns the list of variant IDs that are NOT purchasable.
   */
  async getUnpurchasableVariantIds(variantIds: string[]): Promise<string[]> {
    const allProducts = await this.products.getProducts({});
    const variantToProduct = new Map<string, string>();
    for (const product of allProducts) {
      for (const variant of product.variants) {
        variantToProduct.set(variant.id, product.id);
      }
    }

    const productIds = [
      ...new Set(
        variantIds
          .map((vid) => variantToProduct.get(vid))
          .filter((pid): pid is string => pid !== undefined),
      ),
    ];

    const [pricingMap, availMap] = await Promise.all([
      this.pricing.getPricingBatch(productIds),
      this.availability.getAvailabilityBatch(productIds),
    ]);

    const unpurchasable: string[] = [];

    for (const variantId of variantIds) {
      const productId = variantToProduct.get(variantId);
      if (!productId) {
        unpurchasable.push(variantId);
        continue;
      }

      const pricing = pricingMap.get(productId);
      const avail = availMap.get(productId);

      const hasPrice = pricing?.variantPrices.has(variantId) ?? false;
      const variantStock = avail?.variantAvailability.get(variantId);
      const isPurchasable = variantStock?.purchasable ?? false;

      if (!hasPrice || !isPurchasable) {
        unpurchasable.push(variantId);
      }
    }

    return unpurchasable;
  }

  /** Returns sitemap entries for all products. */
  async getProductSitemapEntries(baseUrl: string): Promise<SitemapEntry[]> {
    const bases = await this.products.getProducts({});
    return bases.map((p) => ({
      url: `${baseUrl}/product/${p.handle}/p/${p.id}`,
      lastModified: p.updatedAt,
    }));
  }

  private async enrich(base: BaseProduct): Promise<Product> {
    const [pricing, avail, breadcrumbs] = await Promise.all([
      this.pricing.getPricing(base.id),
      this.availability.getAvailability(base.id),
      this.products.getProductBreadcrumbs(base.id),
    ]);

    return mapToProduct(base, pricing, avail, breadcrumbs);
  }

  private async enrichBatch(bases: BaseProduct[]): Promise<Product[]> {
    const ids = bases.map((b) => b.id);
    const [pricingMap, availMap, breadcrumbs] = await Promise.all([
      this.pricing.getPricingBatch(ids),
      this.availability.getAvailabilityBatch(ids),
      Promise.all(ids.map((id) => this.products.getProductBreadcrumbs(id))),
    ]);

    return bases.map((base, i) =>
      mapToProduct(
        base,
        pricingMap.get(base.id),
        availMap.get(base.id),
        breadcrumbs[i] ?? [],
      ),
    );
  }
}

// -- Pure helper functions ---------------------------------------------------

function mapToProduct(
  base: BaseProduct,
  pricing: ProductPricing | undefined,
  avail: ProductAvailability | undefined,
  breadcrumbs: Breadcrumb[],
): Product {
  const variantPrices = pricing?.variantPrices ?? new Map();
  const variantAvail =
    avail?.variantAvailability ?? new Map<string, VariantStockInfo>();
  const allAmounts = [...variantPrices.values()].map((p) =>
    parseFloat(p.amount),
  );

  // A product is only purchasable when we have BOTH pricing and availability data.
  // If either upstream is down (resilience fallback returns undefined / empty map),
  // we mark the product as unavailable rather than silently allowing a $0 purchase.
  const hasPricing = pricing !== undefined && allAmounts.length > 0;
  const hasAvailability = avail !== undefined;

  const UNAVAILABLE_STOCK_INFO: VariantStockInfo = {
    purchasable: false,
    stockStatus: "unavailable",
    stockMessage: "Currently Unavailable",
  };

  return {
    id: base.id,
    handle: base.handle,
    title: base.title,
    description: base.description,
    descriptionHtml: base.descriptionHtml,
    options: base.options,
    featuredImage: base.featuredImage,
    images: base.images,
    seo: base.seo,
    tags: base.tags,
    updatedAt: base.updatedAt,
    purchasable: hasPricing && hasAvailability ? avail.purchasable : false,
    stockStatus:
      hasPricing && hasAvailability ? avail.stockStatus : "unavailable",
    stockMessage:
      hasPricing && hasAvailability
        ? avail.stockMessage
        : "Currently Unavailable",
    priceRange: {
      minVariantPrice: hasPricing
        ? {
            amount: Math.min(...allAmounts).toFixed(2),
            currencyCode: pricing.minVariantPrice.currencyCode,
          }
        : undefined,
      maxVariantPrice: hasPricing
        ? {
            amount: Math.max(...allAmounts).toFixed(2),
            currencyCode: pricing.maxVariantPrice.currencyCode,
          }
        : undefined,
    },
    variants: base.variants.map((v) => {
      const stock = variantAvail.get(v.id);
      const variantHasPrice = variantPrices.has(v.id);
      const variantInfo: VariantStockInfo =
        hasPricing && hasAvailability && stock
          ? {
              purchasable: stock.purchasable && variantHasPrice,
              stockStatus: variantHasPrice ? stock.stockStatus : "unavailable",
              stockMessage: variantHasPrice
                ? stock.stockMessage
                : "Currently Unavailable",
            }
          : UNAVAILABLE_STOCK_INFO;

      return {
        ...v,
        purchasable: variantInfo.purchasable,
        stockStatus: variantInfo.stockStatus,
        stockMessage: variantInfo.stockMessage,
        price: variantPrices.get(v.id),
      };
    }),
    breadcrumbs,
  };
}

function sortProducts(
  products: Product[],
  sortKey?: string,
  reverse?: boolean,
): Product[] {
  const sorted = [...products];

  if (sortKey === "PRICE") {
    sorted.sort(
      (a, b) =>
        parseFloat(a.priceRange.minVariantPrice?.amount ?? "0") -
        parseFloat(b.priceRange.minVariantPrice?.amount ?? "0"),
    );
  } else if (sortKey === "CREATED_AT" || sortKey === "CREATED") {
    sorted.sort(
      (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    );
  } else if (sortKey === "BEST_SELLING") {
    // No sales data available in mock — preserve original order
    // which acts as the default "best selling" ranking.
    // Real adapters should sort by actual sales volume.
  }

  if (reverse) sorted.reverse();

  return sorted;
}
