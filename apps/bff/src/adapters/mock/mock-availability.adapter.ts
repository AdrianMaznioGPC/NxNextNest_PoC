import { Injectable } from "@nestjs/common";
import type {
  AvailabilityPort,
  ProductAvailability,
} from "../../ports/availability.port";
import { availabilityRecords } from "./data/availability-data";

@Injectable()
export class MockAvailabilityAdapter implements AvailabilityPort {
  async getAvailability(
    productId: string,
  ): Promise<ProductAvailability | undefined> {
    const record = availabilityRecords.find((r) => r.productId === productId);
    if (!record) return undefined;

    return {
      productId: record.productId,
      availableForSale: record.availableForSale,
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
