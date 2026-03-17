import type { SavedAddress } from "@commerce/shared-types";

export interface CustomerPort {
  getAddresses(customerId: string): Promise<SavedAddress[]>;

  createAddress(
    customerId: string,
    address: Omit<SavedAddress, "id">,
  ): Promise<SavedAddress>;

  updateAddress(
    customerId: string,
    addressId: string,
    patch: Partial<Omit<SavedAddress, "id">>,
  ): Promise<SavedAddress | undefined>;

  deleteAddress(customerId: string, addressId: string): Promise<boolean>;

  setDefaultAddress(
    customerId: string,
    addressId: string,
    type: "shipping" | "billing",
  ): Promise<SavedAddress | undefined>;
}

export const CUSTOMER_PORT = Symbol("CUSTOMER_PORT");
