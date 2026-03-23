import type { Image, Money } from "./commerce.types";

export type CheckoutFlowType = "single-page" | "multi-step" | "express";

export type AddressFieldValidation = {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

export type AddressFieldOption = {
  label: string;
  value: string;
};

export type AddressFieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  autoComplete?: string;
  required: boolean;
  colSpan?: number;
  options?: AddressFieldOption[];
  validation?: AddressFieldValidation;
};

export type AddressFormSchema = {
  rows: AddressFieldConfig[][];
};

export type SavedAddress = {
  id: string;
  label: string;
  values: Record<string, string>;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type DeliveryOption = {
  id: string;
  label: string;
  description: string;
  price: Money;
};

export type PaymentOption = {
  id: string;
  label: string;
  description: string;
};

export type CheckoutConfig = {
  flowType: CheckoutFlowType;
  addressSchema: AddressFormSchema;
  billingAddressSchema: AddressFormSchema;
  savedAddresses: SavedAddress[];
  deliveryOptions: DeliveryOption[];
  paymentOptions: PaymentOption[];
};

export type PlaceOrderRequest = {
  cartId: string;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  deliveryOptionId: string;
  paymentOptionId: string;
};

export type OrderLineItem = {
  title: string;
  variantTitle: string;
  quantity: number;
  image: Image;
  totalPrice: Money;
};

export type OrderConfirmation = {
  orderId: string;
  orderNumber: string;
  lines: OrderLineItem[];
  cost: {
    subtotalAmount: Money;
    shippingAmount: Money;
    taxAmount: Money;
    totalAmount: Money;
  };
  deliveryOption: { label: string; description: string };
  paymentOption: { label: string; description: string };
};
