"use client";

import { Button, Checkbox, Separator } from "@commerce/ui";
import type {
  AddressFormSchema,
  Cart,
  CheckoutConfig,
  Money,
  SavedAddress,
} from "lib/types";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { placeOrderAction, saveNewAddress } from "./actions";
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

  const [saveShippingAddress, setSaveShippingAddress] = useState(false);
  const [saveBillingAddress, setSaveBillingAddress] = useState(false);

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

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Save new addresses if the user opted in
      if (saveShippingAddress && selectedShippingAddressId === null) {
        await saveNewAddress(addressValues, t("savedShippingLabel"));
      }
      if (
        saveBillingAddress &&
        useDifferentBilling &&
        selectedBillingAddressId === null
      ) {
        await saveNewAddress(billingValues, t("savedBillingLabel"));
      }

      const billingAddr = useDifferentBilling
        ? { ...billingValues }
        : { ...addressValues };

      const confirmation = await placeOrderAction({
        cartId: cart.id!,
        shippingAddress: { ...addressValues },
        billingAddress: billingAddr,
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

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <form onSubmit={handleSubmit} className="min-w-0 space-y-8 lg:col-span-7">
        <div className="space-y-6">
          <AddressSection
            title={t("shippingAddress")}
            idPrefix="shipping"
            schema={config.addressSchema}
            values={addressValues}
            onChange={handleAddressChange}
            savedAddresses={
              hasSavedAddresses ? config.savedAddresses : undefined
            }
            selectedAddressId={selectedShippingAddressId}
            onSelectSavedAddress={
              hasSavedAddresses ? handleSelectShippingAddress : undefined
            }
            saveAddress={saveShippingAddress}
            onSaveAddressChange={setSaveShippingAddress}
          />

          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-foreground">
            <Checkbox
              checked={useDifferentBilling}
              onCheckedChange={(val) => setUseDifferentBilling(val as boolean)}
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
              saveAddress={saveBillingAddress}
              onSaveAddressChange={setSaveBillingAddress}
            />
          )}
        </div>

        <Separator />

        <DeliverySection
          title={t("deliveryMethod")}
          options={config.deliveryOptions}
          selected={selectedDelivery}
          onSelect={setSelectedDelivery}
        />

        <Separator />

        <PaymentSection
          title={t("paymentMethod")}
          options={config.paymentOptions}
          selected={selectedPayment}
          onSelect={setSelectedPayment}
        />

        <Separator />

        {orderError && (
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            {orderError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full rounded-full p-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? t("placingOrder") : t("placeOrder")}
        </Button>
      </form>

      <div className="mt-8 lg:col-span-5 lg:mt-0">
        <OrderSummary cart={cart} shippingCost={shippingCost} />
      </div>
    </div>
  );
}
