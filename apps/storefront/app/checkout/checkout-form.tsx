"use client";

import type {
  AddressFormSchema,
  Cart,
  CheckoutConfig,
  Money,
  SavedAddress,
} from "lib/types";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { OrderSummary } from "./order-summary";
import { AddressSection } from "./sections/address-section";
import { DeliverySection } from "./sections/delivery-section";
import { PaymentSection } from "./sections/payment-section";

interface CheckoutFormProps {
  cart: Cart;
  config: CheckoutConfig;
}

function buildInitialValues(schema: AddressFormSchema): Record<string, string> {
  const values: Record<string, string> = {};
  for (const row of schema.rows) {
    for (const field of row) {
      values[field.name] = "";
    }
  }
  return values;
}

export default function CheckoutForm({ cart, config }: CheckoutFormProps) {
  const t = useTranslations("checkout");

  const hasSavedAddresses = config.savedAddresses.length > 0;

  // Pre-select the default shipping address if available
  const defaultShipping = config.savedAddresses.find(
    (a) => a.isDefaultShipping,
  );

  const [selectedShippingAddressId, setSelectedShippingAddressId] = useState<
    string | null
  >(defaultShipping?.id ?? null);

  const [addressValues, setAddressValues] = useState<Record<string, string>>(
    () => defaultShipping?.values ?? buildInitialValues(config.addressSchema),
  );

  const handleSelectShippingAddress = useCallback(
    (address: SavedAddress | null) => {
      if (address) {
        setSelectedShippingAddressId(address.id);
        setAddressValues(address.values);
      } else {
        setSelectedShippingAddressId(null);
        setAddressValues(buildInitialValues(config.addressSchema));
      }
    },
    [config.addressSchema],
  );

  // Pre-select the default billing address if available
  const defaultBilling = config.savedAddresses.find((a) => a.isDefaultBilling);

  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    string | null
  >(defaultBilling?.id ?? null);

  const [useDifferentBilling, setUseDifferentBilling] = useState(false);
  const [billingValues, setBillingValues] = useState<Record<string, string>>(
    () =>
      defaultBilling?.values ?? buildInitialValues(config.billingAddressSchema),
  );

  const handleSelectBillingAddress = useCallback(
    (address: SavedAddress | null) => {
      if (address) {
        setSelectedBillingAddressId(address.id);
        setBillingValues(address.values);
      } else {
        setSelectedBillingAddressId(null);
        setBillingValues(buildInitialValues(config.billingAddressSchema));
      }
    },
    [config.billingAddressSchema],
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
    setSelectedShippingAddressId(null);
    setAddressValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleBillingChange(fieldName: string, value: string) {
    setSelectedBillingAddressId(null);
    setBillingValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: integrate with order placement API
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-8 lg:col-span-7">
        <AddressSection
          title={t("shippingAddress")}
          idPrefix="shipping"
          schema={config.addressSchema}
          values={addressValues}
          onChange={handleAddressChange}
          savedAddresses={hasSavedAddresses ? config.savedAddresses : undefined}
          selectedAddressId={selectedShippingAddressId}
          onSelectSavedAddress={
            hasSavedAddresses ? handleSelectShippingAddress : undefined
          }
        />

        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={useDifferentBilling}
            onChange={(e) => setUseDifferentBilling(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-blue-600"
          />
          {t("useDifferentBillingAddress")}
        </label>

        {useDifferentBilling && (
          <AddressSection
            title={t("billingAddress")}
            idPrefix="billing"
            schema={config.billingAddressSchema}
            values={billingValues}
            onChange={handleBillingChange}
            savedAddresses={
              hasSavedAddresses ? config.savedAddresses : undefined
            }
            selectedAddressId={selectedBillingAddressId}
            onSelectSavedAddress={
              hasSavedAddresses ? handleSelectBillingAddress : undefined
            }
          />
        )}

        <DeliverySection
          title={t("deliveryMethod")}
          options={config.deliveryOptions}
          selected={selectedDelivery}
          onSelect={setSelectedDelivery}
        />

        <PaymentSection
          title={t("paymentMethod")}
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
