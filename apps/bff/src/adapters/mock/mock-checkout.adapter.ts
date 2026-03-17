import type { CheckoutConfig } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import type { CheckoutPort } from "../../ports/checkout.port";
import { CUSTOMER_PORT, CustomerPort } from "../../ports/customer.port";
import { StoreContext } from "../../store";
import {
  addressSchemas,
  billingAddressSchemas,
  deliveryOptionsByStore,
  paymentOptionsByStore,
} from "./data/checkout-data";
import { getStoreData } from "./data/store-data";

@Injectable()
export class MockCheckoutAdapter implements CheckoutPort {
  constructor(
    private readonly store: StoreContext,
    @Inject(CUSTOMER_PORT) private readonly customer: CustomerPort,
  ) {}

  async getCheckoutConfig(): Promise<CheckoutConfig> {
    const code = this.store.storeCode;
    const customerId = this.store.customerId;

    const savedAddresses = customerId
      ? await this.customer.getAddresses(customerId)
      : [];

    return {
      addressSchema: getStoreData(addressSchemas, code),
      billingAddressSchema: getStoreData(billingAddressSchemas, code),
      deliveryOptions: getStoreData(deliveryOptionsByStore, code),
      paymentOptions: getStoreData(paymentOptionsByStore, code),
      savedAddresses,
    };
  }
}
