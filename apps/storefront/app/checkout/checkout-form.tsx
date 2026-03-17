"use client";

import type { Cart, CheckoutConfig, Money } from "lib/types";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { OrderSummary } from "./order-summary";
import { AddressSection } from "./sections/address-section";
import { DeliverySection } from "./sections/delivery-section";
import { PaymentSection } from "./sections/payment-section";

interface CheckoutFormProps {
  cart: Cart;
  config: CheckoutConfig;
}

function buildInitialAddressValues(
  config: CheckoutConfig,
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const row of config.addressSchema.rows) {
    for (const field of row) {
      values[field.name] = "";
    }
  }
  return values;
}

export default function CheckoutForm({ cart, config }: CheckoutFormProps) {
  const t = useTranslations("checkout");

  const [addressValues, setAddressValues] = useState<Record<string, string>>(
    () => buildInitialAddressValues(config),
  );

  const [selectedDelivery, setSelectedDelivery] = useState(
    config.deliveryOptions[0]!.id,
  );
  const [selectedPayment, setSelectedPayment] = useState(
    config.paymentOptions[0]!.id,
  );

  const shippingCost: Money = useMemo(() => {
    const option = config.deliveryOptions.find(
      (o) => o.id === selectedDelivery,
    );
    return option?.price ?? { amount: "0", currencyCode: "EUR" };
  }, [config.deliveryOptions, selectedDelivery]);

  function handleAddressChange(fieldName: string, value: string) {
    setAddressValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrate with order placement API
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-7">
        <AddressSection
          schema={config.addressSchema}
          values={addressValues}
          onChange={handleAddressChange}
        />

        <DeliverySection
          options={config.deliveryOptions}
          selected={selectedDelivery}
          onSelect={setSelectedDelivery}
        />

        <PaymentSection
          options={config.paymentOptions}
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />

        <button
          type="submit"
          className="w-full rounded-full bg-blue-600 p-4 text-center text-sm font-medium text-white opacity-90 hover:opacity-100"
        >
          {t("placeOrder")}
        </button>
      </form>

      <div className="mt-8 lg:col-span-5 lg:mt-0">
        <OrderSummary cart={cart} shippingCost={shippingCost} />
      </div>
    </div>
  );
}
