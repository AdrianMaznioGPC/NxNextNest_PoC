import type { SavedAddress } from "@commerce/shared-types";

export interface CustomerPort {
  getAddresses(customerId: string): Promise<SavedAddress[]>;
  createAddress(
    customerId: string,
    address: Omit<SavedAddress, "id">,
  ): Promise<SavedAddress>;
}

export const CUSTOMER_PORT = Symbol("CUSTOMER_PORT");
