import type { SavedAddress } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";

const MAX_ADDRESSES_PER_CUSTOMER = 10;

/**
 * Singleton in-memory address store.
 * Separated from the request-scoped MockCustomerAdapter so that
 * address state survives across requests.
 */
@Injectable()
export class MockAddressStore {
  private readonly store = new Map<string, SavedAddress[]>();

  constructor() {
    this.seed();
  }

  getAll(customerId: string): SavedAddress[] {
    return this.store.get(customerId) ?? [];
  }

  getById(customerId: string, addressId: string): SavedAddress | undefined {
    return this.getAll(customerId).find((a) => a.id === addressId);
  }

  create(
    customerId: string,
    address: Omit<SavedAddress, "id">,
  ): SavedAddress {
    const addresses = this.getAll(customerId);
    if (addresses.length >= MAX_ADDRESSES_PER_CUSTOMER) {
      throw new Error(
        `Maximum of ${MAX_ADDRESSES_PER_CUSTOMER} addresses reached`,
      );
    }

    const newAddress: SavedAddress = {
      ...address,
      id: `addr-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    };

    // If this is the first address, make it default for both
    if (addresses.length === 0) {
      newAddress.isDefaultShipping = true;
      newAddress.isDefaultBilling = true;
    }

    // Clear existing defaults if this one claims them
    if (newAddress.isDefaultShipping) {
      for (const a of addresses) a.isDefaultShipping = false;
    }
    if (newAddress.isDefaultBilling) {
      for (const a of addresses) a.isDefaultBilling = false;
    }

    addresses.push(newAddress);
    this.store.set(customerId, addresses);
    return newAddress;
  }

  update(
    customerId: string,
    addressId: string,
    patch: Partial<Omit<SavedAddress, "id">>,
  ): SavedAddress | undefined {
    const addresses = this.getAll(customerId);
    const index = addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return undefined;

    const updated = { ...addresses[index]!, ...patch, id: addressId };

    if (patch.isDefaultShipping) {
      for (const a of addresses) a.isDefaultShipping = false;
    }
    if (patch.isDefaultBilling) {
      for (const a of addresses) a.isDefaultBilling = false;
    }

    addresses[index] = updated;
    this.store.set(customerId, addresses);
    return updated;
  }

  delete(customerId: string, addressId: string): boolean {
    const addresses = this.getAll(customerId);
    const index = addresses.findIndex((a) => a.id === addressId);
    if (index === -1) return false;

    const deleted = addresses[index]!;
    addresses.splice(index, 1);

    // Reassign defaults if the deleted address was default
    if (addresses.length > 0) {
      if (deleted.isDefaultShipping && !addresses.some((a) => a.isDefaultShipping)) {
        addresses[0]!.isDefaultShipping = true;
      }
      if (deleted.isDefaultBilling && !addresses.some((a) => a.isDefaultBilling)) {
        addresses[0]!.isDefaultBilling = true;
      }
    }

    this.store.set(customerId, addresses);
    return true;
  }

  setDefault(
    customerId: string,
    addressId: string,
    type: "shipping" | "billing",
  ): SavedAddress | undefined {
    const addresses = this.getAll(customerId);
    const target = addresses.find((a) => a.id === addressId);
    if (!target) return undefined;

    const field =
      type === "shipping" ? "isDefaultShipping" : "isDefaultBilling";

    for (const a of addresses) a[field] = false;
    target[field] = true;

    this.store.set(customerId, addresses);
    return target;
  }

  private seed(): void {
    this.store.set("test-customer-1", [
      {
        id: "addr-seed-1",
        label: "Home",
        values: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@example.com",
          phone: "+33612345678",
          address: "123 Rue de Rivoli",
          postalCode: "75001",
          city: "Paris",
          country: "FR",
        },
        isDefaultShipping: true,
        isDefaultBilling: true,
      },
      {
        id: "addr-seed-2",
        label: "Office",
        values: {
          firstName: "Jean",
          lastName: "Dupont",
          email: "jean.dupont@work.com",
          phone: "+33698765432",
          address: "45 Avenue des Champs-Élysées",
          postalCode: "75008",
          city: "Paris",
          country: "FR",
        },
        isDefaultShipping: false,
        isDefaultBilling: false,
      },
    ]);
  }
}
