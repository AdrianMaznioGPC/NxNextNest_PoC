import type { SavedAddress } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { CustomerPort } from "../../ports/customer.port";
import { MockAddressStore } from "./mock-address-store";

@Injectable()
export class MockCustomerAdapter implements CustomerPort {
  constructor(private readonly addressStore: MockAddressStore) {}

  async getAddresses(customerId: string): Promise<SavedAddress[]> {
    return this.addressStore.getAll(customerId);
  }

  async createAddress(
    customerId: string,
    address: Omit<SavedAddress, "id">,
  ): Promise<SavedAddress> {
    return this.addressStore.create(customerId, address);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    patch: Partial<Omit<SavedAddress, "id">>,
  ): Promise<SavedAddress | undefined> {
    return this.addressStore.update(customerId, addressId, patch);
  }

  async deleteAddress(customerId: string, addressId: string): Promise<boolean> {
    return this.addressStore.delete(customerId, addressId);
  }

  async setDefaultAddress(
    customerId: string,
    addressId: string,
    type: "shipping" | "billing",
  ): Promise<SavedAddress | undefined> {
    return this.addressStore.setDefault(customerId, addressId, type);
  }
}
