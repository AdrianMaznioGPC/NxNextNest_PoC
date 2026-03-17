import type {
  BaseProduct,
  Breadcrumb,
  Product,
  ProductPageData,
  SitemapEntry,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import {
  AVAILABILITY_PORT,
  type AvailabilityPort,
} from "../../ports/availability.port";
import { PRICING_PORT, type PricingPort } from "../../ports/pricing.port";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";
import { mapToProduct } from "./product-enrichment";

@Injectable()
export class ProductDomainService {
  constructor(
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(PRICING_PORT) private readonly pricing: PricingPort,
    @Inject(AVAILABILITY_PORT) private readonly availability: AvailabilityPort,
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
