import type {
  BaseProduct,
  Breadcrumb,
  Collection,
  Money,
  Product,
  ProductPageData,
  SearchPageData,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  AVAILABILITY_PORT,
  type AvailabilityPort,
} from "../../ports/availability.port";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";
import { PRICING_PORT, type PricingPort } from "../../ports/pricing.port";
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
    const allBase = await this.products.getProducts({});
    const bases = ids
      .map((id) => allBase.find((p) => p.id === id))
      .filter((p): p is BaseProduct => p !== undefined);
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
    let enriched = await this.enrichBatch(bases);

    if (params.sortKey === "PRICE") {
      enriched.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    } else if (
      params.sortKey === "CREATED_AT" ||
      params.sortKey === "CREATED"
    ) {
      enriched.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    if (params.reverse) enriched.reverse();

    return enriched;
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

    let products = await this.getProductsByIds(ids);

    if (params.sortKey === "PRICE") {
      products.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    } else if (
      params.sortKey === "CREATED_AT" ||
      params.sortKey === "CREATED"
    ) {
      products.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    if (params.reverse) products.reverse();

    return products;
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
    const [pricing, avail] = await Promise.all([
      this.pricing.getPricing(base.id),
      this.availability.getAvailability(base.id),
    ]);

    const variantPrices = pricing?.variantPrices ?? new Map();
    const variantAvail = avail?.variantAvailability ?? new Map();
    const allAmounts = [...variantPrices.values()].map((p) =>
      parseFloat(p.amount),
    );

    const breadcrumbs = await this.buildBreadcrumbs(base.id);

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

  private async enrichBatch(bases: BaseProduct[]): Promise<Product[]> {
    const ids = bases.map((b) => b.id);
    const [pricingMap, availMap] = await Promise.all([
      this.pricing.getPricingBatch(ids),
      this.availability.getAvailabilityBatch(ids),
    ]);

    const results: Product[] = [];
    for (const base of bases) {
      const pricing = pricingMap.get(base.id);
      const avail = availMap.get(base.id);
      const variantPrices = pricing?.variantPrices ?? new Map();
      const variantAvail = avail?.variantAvailability ?? new Map();
      const allAmounts = [...variantPrices.values()].map((p) =>
        parseFloat(p.amount),
      );

      const breadcrumbs = await this.buildBreadcrumbs(base.id);

      results.push({
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
      });
    }
    return results;
  }

  private async buildBreadcrumbs(productId: string): Promise<Breadcrumb[]> {
    const allCollections = await this.collections.getCollections();
    const allIds = this.getAllCollectionIds(allCollections);

    const allMappings = await Promise.all(
      allIds.map(async (id) => ({
        id,
        productIds: await this.collections.getCollectionProductIds(id),
      })),
    );

    let bestId: string | undefined;
    for (const { id, productIds } of allMappings) {
      if (id.startsWith("hidden-")) continue;
      if (!productIds.includes(productId)) continue;
      const col = this.findCollectionById(allCollections, id);
      if (!bestId || col?.parentId) bestId = id;
    }
    if (!bestId) return [];

    const crumbs: Breadcrumb[] = [];
    const target = this.findCollectionById(allCollections, bestId);
    if (target?.parentId) {
      const parent = allCollections.find((c) => c.id === target.parentId);
      if (parent) crumbs.push({ title: parent.title, path: parent.path });
    }
    if (target) crumbs.push({ title: target.title, path: target.path });

    return crumbs;
  }

  private getAllCollectionIds(
    cols: { id: string; subcollections?: { id: string }[] }[],
  ): string[] {
    const ids: string[] = [];
    for (const c of cols) {
      ids.push(c.id);
      if (c.subcollections) {
        for (const sub of c.subcollections) {
          ids.push(sub.id);
        }
      }
    }
    return ids;
  }

  private findCollectionById(
    cols: Collection[],
    id: string,
  ): Collection | undefined {
    for (const c of cols) {
      if (c.id === id) return c;
      const sub = c.subcollections?.find((s) => s.id === id);
      if (sub) return sub;
    }
    return undefined;
  }
}
