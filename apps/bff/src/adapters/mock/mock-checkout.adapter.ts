import type {
  AddressFormSchema,
  CheckoutConfig,
  CheckoutFlowType,
} from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import type { CheckoutPort } from "../../ports/checkout.port";
import type { CustomerPort } from "../../ports/customer.port";
import { CUSTOMER_PORT } from "../../ports/customer.port";

const shippingAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        autoComplete: "given-name",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        autoComplete: "family-name",
        required: true,
      },
    ],
    [
      {
        name: "address",
        label: "Address",
        type: "text",
        autoComplete: "address-line1",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "apartment",
        label: "Apartment, suite, etc.",
        type: "text",
        autoComplete: "address-line2",
        required: false,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        label: "City",
        type: "text",
        autoComplete: "address-level2",
        required: true,
      },
      {
        name: "state",
        label: "State / Province",
        type: "text",
        autoComplete: "address-level1",
        required: true,
      },
    ],
    [
      {
        name: "postalCode",
        label: "Postal Code",
        type: "text",
        autoComplete: "postal-code",
        required: true,
        validation: { maxLength: 10 },
      },
      {
        name: "country",
        label: "Country",
        type: "select",
        autoComplete: "country",
        required: true,
        options: [
          { label: "United States", value: "US" },
          { label: "Canada", value: "CA" },
          { label: "United Kingdom", value: "GB" },
          { label: "Germany", value: "DE" },
          { label: "France", value: "FR" },
          { label: "Netherlands", value: "NL" },
          { label: "Spain", value: "ES" },
        ],
      },
    ],
    [
      {
        name: "phone",
        label: "Phone",
        type: "tel",
        autoComplete: "tel",
        required: false,
        colSpan: 2,
      },
    ],
  ],
};

const billingAddressSchema: AddressFormSchema = {
  rows: [
    [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        autoComplete: "billing given-name",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        autoComplete: "billing family-name",
        required: true,
      },
    ],
    [
      {
        name: "address",
        label: "Address",
        type: "text",
        autoComplete: "billing address-line1",
        required: true,
        colSpan: 2,
      },
    ],
    [
      {
        name: "city",
        label: "City",
        type: "text",
        autoComplete: "billing address-level2",
        required: true,
      },
      {
        name: "state",
        label: "State / Province",
        type: "text",
        autoComplete: "billing address-level1",
        required: true,
      },
    ],
    [
      {
        name: "postalCode",
        label: "Postal Code",
        type: "text",
        autoComplete: "billing postal-code",
        required: true,
        validation: { maxLength: 10 },
      },
      {
        name: "country",
        label: "Country",
        type: "select",
        autoComplete: "billing country",
        required: true,
        options: [
          { label: "United States", value: "US" },
          { label: "Canada", value: "CA" },
          { label: "United Kingdom", value: "GB" },
          { label: "Germany", value: "DE" },
          { label: "France", value: "FR" },
          { label: "Netherlands", value: "NL" },
          { label: "Spain", value: "ES" },
        ],
      },
    ],
  ],
};

@Injectable()
export class MockCheckoutAdapter implements CheckoutPort {
  constructor(@Inject(CUSTOMER_PORT) private readonly customer: CustomerPort) {}

  /**
   * Flow type is resolved per store. This allows different stores/regions
   * to use different checkout experiences without any frontend changes.
   */
  private resolveFlowType(storeKey?: string): CheckoutFlowType {
    switch (storeKey) {
      case "store-a":
        return "single-page";
      case "store-b":
        return "multi-step";
      case "store-c":
        return "multi-step";
      default:
        return "single-page";
    }
  }

  async getCheckoutConfig(storeKey?: string): Promise<CheckoutConfig> {
    const savedAddresses = await this.customer.getAddresses("mock-customer");
    const flowType = this.resolveFlowType(storeKey);

    return {
      flowType,
      addressSchema: shippingAddressSchema,
      billingAddressSchema,
      savedAddresses,
      deliveryOptions: [
        {
          id: "standard",
          label: "Standard Shipping",
          description: "5-7 business days",
          price: { amount: "5.99", currencyCode: "USD" },
        },
        {
          id: "express",
          label: "Express Shipping",
          description: "2-3 business days",
          price: { amount: "14.99", currencyCode: "USD" },
        },
        {
          id: "overnight",
          label: "Overnight Shipping",
          description: "Next business day",
          price: { amount: "29.99", currencyCode: "USD" },
        },
      ],
      paymentOptions: [
        {
          id: "credit-card",
          label: "Credit Card",
          description: "Visa, Mastercard, Amex",
        },
        {
          id: "paypal",
          label: "PayPal",
          description: "Pay with your PayPal account",
        },
        {
          id: "bank-transfer",
          label: "Bank Transfer",
          description: "Direct bank transfer",
        },
      ],
    };
  }
}
