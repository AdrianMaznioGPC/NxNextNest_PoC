import { Injectable } from "@nestjs/common";
import type { PricingPort, ProductPricing } from "../../ports/pricing.port";
import { StoreContext } from "../../store";
import { type MockPricingRecord, pricingByStore } from "./data/pricing-data";
import { getStoreData } from "./data/store-data";

@Injectable()
export class MockPricingAdapter implements PricingPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get records(): MockPricingRecord[] {
    return getStoreData(pricingByStore, this.storeCtx.storeCode);
  }

  async getPricing(productId: string): Promise<ProductPricing | undefined> {
    const record = this.records.find((r) => r.productId === productId);
    if (!record) return undefined;

    const variantPrices = new Map(Object.entries(record.variantPrices));
    const amounts = [...variantPrices.values()].map((p) =>
      parseFloat(p.amount),
    );

    return {
      productId: record.productId,
      minVariantPrice: {
        amount: Math.min(...amounts).toFixed(2),
        currencyCode: record.basePrice.currencyCode,
      },
      maxVariantPrice: {
        amount: Math.max(...amounts).toFixed(2),
        currencyCode: record.basePrice.currencyCode,
      },
      variantPrices,
    };
  }

  async getPricingBatch(
    productIds: string[],
  ): Promise<Map<string, ProductPricing>> {
    const result = new Map<string, ProductPricing>();
    for (const id of productIds) {
      const pricing = await this.getPricing(id);
      if (pricing) result.set(id, pricing);
    }
    return result;
  }
}
