import { Injectable } from "@nestjs/common";
import type {
  AvailabilityPort,
  ProductAvailability,
} from "../../ports/availability.port";
import { StoreContext } from "../../store";
import {
  type MockAvailabilityRecord,
  availabilityByStore,
} from "./data/availability-data";
import { getStoreData } from "./data/store-data";

@Injectable()
export class MockAvailabilityAdapter implements AvailabilityPort {
  constructor(private readonly storeCtx: StoreContext) {}

  private get records(): MockAvailabilityRecord[] {
    return getStoreData(availabilityByStore, this.storeCtx.storeCode);
  }

  async getAvailability(
    productId: string,
  ): Promise<ProductAvailability | undefined> {
    const record = this.records.find((r) => r.productId === productId);
    if (!record) return undefined;

    return {
      productId: record.productId,
      purchasable: record.purchasable,
      stockStatus: record.stockStatus,
      stockMessage: record.stockMessage,
      variantAvailability: new Map(Object.entries(record.variantAvailability)),
    };
  }

  async getAvailabilityBatch(
    productIds: string[],
  ): Promise<Map<string, ProductAvailability>> {
    const result = new Map<string, ProductAvailability>();
    for (const id of productIds) {
      const availability = await this.getAvailability(id);
      if (availability) result.set(id, availability);
    }
    return result;
  }
}
