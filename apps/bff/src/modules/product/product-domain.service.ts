import type {
  BaseProduct,
  Breadcrumb,
  Money,
  Product,
  ProductPageData,
  SearchPageData,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  AVAILABILITY_PORT,
  type AvailabilityPort,
  type ProductAvailability,
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

const ZERO: Money = { amount: "0.00", currencyCode: "USD" };

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
    const products = await this.getProducts({ query, sortKey, reverse });

    return {
      query: query ?? "",
      products,
      totalResults: products.length,
    };
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
  const variantAvail = avail?.variantAvailability ?? new Map();
  const allAmounts = [...variantPrices.values()].map((p) =>
    parseFloat(p.amount),
  );

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
    availableForSale: avail?.availableForSale ?? true,
    priceRange: {
      minVariantPrice: allAmounts.length
        ? {
            amount: Math.min(...allAmounts).toFixed(2),
            currencyCode:
              pricing?.minVariantPrice.currencyCode ?? ZERO.currencyCode,
          }
        : ZERO,
      maxVariantPrice: allAmounts.length
        ? {
            amount: Math.max(...allAmounts).toFixed(2),
            currencyCode:
              pricing?.maxVariantPrice.currencyCode ?? ZERO.currencyCode,
          }
        : ZERO,
    },
    variants: base.variants.map((v) => ({
      ...v,
      availableForSale: variantAvail.get(v.id) ?? true,
      price: variantPrices.get(v.id) ?? ZERO,
    })),
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
        parseFloat(a.priceRange.minVariantPrice.amount) -
        parseFloat(b.priceRange.minVariantPrice.amount),
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
