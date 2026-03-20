import type { SavedAddress } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { CustomerPort } from "../../ports/customer.port";

const seedAddresses: SavedAddress[] = [
  {
    id: "addr-1",
    label: "Home",
    values: {
      firstName: "Jane",
      lastName: "Doe",
      address: "123 Main Street",
      apartment: "Apt 4B",
      city: "Springfield",
      state: "IL",
      postalCode: "62701",
      country: "US",
      phone: "+1 555-123-4567",
    },
    isDefaultShipping: true,
    isDefaultBilling: true,
  },
  {
    id: "addr-2",
    label: "Office",
    values: {
      firstName: "Jane",
      lastName: "Doe",
      address: "456 Commerce Blvd",
      apartment: "Suite 200",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "US",
      phone: "+1 555-987-6543",
    },
    isDefaultShipping: false,
    isDefaultBilling: false,
  },
];

@Injectable()
export class MockCustomerAdapter implements CustomerPort {
  private readonly addresses = new Map<string, SavedAddress[]>();

  constructor() {
    this.addresses.set("mock-customer", [...seedAddresses]);
  }

  async getAddresses(customerId: string): Promise<SavedAddress[]> {
    return this.addresses.get(customerId) ?? [];
  }

  async createAddress(
    customerId: string,
    address: Omit<SavedAddress, "id">,
  ): Promise<SavedAddress> {
    const saved: SavedAddress = {
      ...address,
      id: `addr-${Date.now()}`,
    };

    const existing = this.addresses.get(customerId) ?? [];
    existing.push(saved);
    this.addresses.set(customerId, existing);

    return saved;
  }
}
