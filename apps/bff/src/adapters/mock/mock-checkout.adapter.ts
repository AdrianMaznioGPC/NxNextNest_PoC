import type { CheckoutConfig } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { RAW_CUSTOMER_PORT } from "../../modules/system/system.module";
import type { CheckoutPort } from "../../ports/checkout.port";
import type { CustomerPort } from "../../ports/customer.port";
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
    @Inject(RAW_CUSTOMER_PORT) private readonly customer: CustomerPort,
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

  async getCheckoutRedirectUrl(cartId: string): Promise<string> {
    // Mock implementation — in production this would return a payment provider URL
    return `/checkout?cartId=${cartId}`;
  }
}
