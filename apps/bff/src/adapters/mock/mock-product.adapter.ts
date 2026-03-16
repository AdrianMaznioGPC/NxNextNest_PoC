import type { Product } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ProductPort } from "../../ports/product.port";
import { availabilityRecords } from "./data/availability-data";
import { buildProductBreadcrumbs } from "./data/catalog-data";
import { getPricingRecord } from "./data/pricing-data";
import { type MockProductRecord, productRecords } from "./data/product-data";

function assembleProduct(record: MockProductRecord): Product {
  const pricing = getPricingRecord(record.id);
  const availability = availabilityRecords.find(
    (a) => a.productId === record.id,
  );
  const breadcrumbs = buildProductBreadcrumbs(record.id);

  const basePrice = pricing?.basePrice ?? {
    amount: "0.00",
    currencyCode: "USD",
  };
  const variantPrices = pricing?.variantPrices ?? {};
  const allPrices = Object.values(variantPrices);
  const amounts = allPrices.map((p) => parseFloat(p.amount));

  return {
    ...record,
    availableForSale: availability?.availableForSale ?? true,
    priceRange: {
      minVariantPrice: amounts.length
        ? {
            amount: Math.min(...amounts).toFixed(2),
            currencyCode: basePrice.currencyCode,
          }
        : basePrice,
      maxVariantPrice: amounts.length
        ? {
            amount: Math.max(...amounts).toFixed(2),
            currencyCode: basePrice.currencyCode,
          }
        : basePrice,
    },
    variants: record.variants.map((v) => ({
      ...v,
      availableForSale: availability?.variantAvailability[v.id] ?? true,
      price: variantPrices[v.id] ?? basePrice,
    })),
    breadcrumbs,
  };
}

@Injectable()
export class MockProductAdapter implements ProductPort {
  async getProducts(params: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  }): Promise<Product[]> {
    let result = productRecords.map(assembleProduct);

    if (params.query) {
      const q = params.query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (params.sortKey === "PRICE") {
      result.sort(
        (a, b) =>
          parseFloat(a.priceRange.minVariantPrice.amount) -
          parseFloat(b.priceRange.minVariantPrice.amount),
      );
    } else if (
      params.sortKey === "CREATED_AT" ||
      params.sortKey === "CREATED"
    ) {
      result.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      );
    }

    if (params.reverse) {
      result.reverse();
    }

    return result;
  }

  async getProduct(handle: string): Promise<Product | undefined> {
    const record = productRecords.find((p) => p.handle === handle);
    return record ? assembleProduct(record) : undefined;
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    return productRecords
      .filter((p) => p.id !== productId)
      .slice(0, 4)
      .map(assembleProduct);
  }
}
