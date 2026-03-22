"use client";

import { OrderSummary } from "components/checkout/order-summary";
import { useCheckoutSlotState } from "components/checkout/checkout-slot-state";
import { useT } from "lib/i18n/messages-context";
import type {
  AddressFormSchema,
  Cart,
  CheckoutConfig,
  SavedAddress,
} from "lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  placeOrderAction,
  saveNewAddress,
} from "../../../../app/checkout/actions";
import { ExpressAddressCard } from "./express-address-card";
import { ExpressDeliveryCard } from "./express-delivery-card";
import { ExpressPaymentCard } from "./express-payment-card";

interface ExpressCheckoutProps {
  cart: Cart;
  config: CheckoutConfig;
  renderSummary?: boolean;
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

export function ExpressCheckout({
  cart,
  config,
  renderSummary = true,
}: ExpressCheckoutProps) {
  const t = useT("checkout");
  const router = useRouter();
  const { shippingCost, syncSelectedDelivery } = useCheckoutSlotState();
  const fallbackCurrency = cart.cost.totalAmount.currencyCode;

  // -- Shipping address state (pre-filled from default) --------------------

  const defaultShipping =
    config.savedAddresses.find((a) => a.isDefaultShipping) ??
    config.savedAddresses[0];

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

  // -- Delivery & payment (pre-selected defaults) --------------------------

  const [selectedDelivery, setSelectedDelivery] = useState(
    config.deliveryOptions[0]!.id,
  );
  const [selectedPayment, setSelectedPayment] = useState(
    config.paymentOptions[0]!.id,
  );

  useEffect(() => {
    const option = config.deliveryOptions.find((o) => o.id === selectedDelivery);
    syncSelectedDelivery(
      selectedDelivery,
      option?.price ?? { amount: "0.00", currencyCode: fallbackCurrency },
    );
  }, [config.deliveryOptions, fallbackCurrency, selectedDelivery, syncSelectedDelivery]);

  // -- Field change handler (for manual address entry) ---------------------

  function handleAddressChange(fieldName: string, value: string) {
    setSelectedShippingAddressId(null);
    setAddressValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  // -- Submit --------------------------------------------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Express uses shipping address as billing
      const confirmation = await placeOrderAction({
        cartId: cart.id!,
        shippingAddress: { ...addressValues },
        billingAddress: { ...addressValues },
        deliveryOptionId: selectedDelivery,
        paymentOptionId: selectedPayment,
      });

      router.push(`/checkout/confirmation?orderId=${confirmation.orderId}`);
    } catch {
      setOrderError(t("orderError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  // -- Render --------------------------------------------------------------

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div className="min-w-0 space-y-4 lg:col-span-7">
        {/* Address card */}
        <ExpressAddressCard
          values={addressValues}
          schema={config.addressSchema}
          savedAddresses={config.savedAddresses}
          selectedAddressId={selectedShippingAddressId}
          onSelectSavedAddress={handleSelectShippingAddress}
          onChange={handleAddressChange}
        />

        {/* Delivery card */}
        <ExpressDeliveryCard
          options={config.deliveryOptions}
          selectedId={selectedDelivery}
          onSelect={setSelectedDelivery}
        />

        {/* Payment card */}
        <ExpressPaymentCard
          options={config.paymentOptions}
          selectedId={selectedPayment}
          onSelect={setSelectedPayment}
        />

        {/* Error */}
        {orderError && (
          <p className="text-sm font-medium text-red-600">{orderError}</p>
        )}

        {/* Place order button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full rounded-control bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? t("placingOrder") : t("placeOrder")}
        </button>
      </div>

      {renderSummary ? (
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <OrderSummary cart={cart} shippingCost={shippingCost} />
        </div>
      ) : null}
    </div>
  );
}
