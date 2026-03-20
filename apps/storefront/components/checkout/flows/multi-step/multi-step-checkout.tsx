"use client";

import { OrderSummary } from "components/checkout/order-summary";
import { AddressSection } from "components/checkout/sections/address-section";
import { DeliverySection } from "components/checkout/sections/delivery-section";
import { PaymentSection } from "components/checkout/sections/payment-section";
import { useT } from "lib/i18n/messages-context";
import type {
  AddressFormSchema,
  Cart,
  CheckoutConfig,
  Money,
  SavedAddress,
} from "lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  placeOrderAction,
  saveNewAddress,
} from "../../../../app/checkout/actions";
import { ReviewStep } from "./review-step";
import { StepIndicator } from "./step-indicator";
import { StepNavigation } from "./step-navigation";

const TOTAL_STEPS = 3;

interface MultiStepCheckoutProps {
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

export function MultiStepCheckout({ cart, config }: MultiStepCheckoutProps) {
  const t = useT("checkout");
  const router = useRouter();

  // -- Step management -------------------------------------------------------

  const [currentStep, setCurrentStep] = useState(0);

  const hasSavedAddresses = config.savedAddresses.length > 0;

  // -- Shipping address state ------------------------------------------------

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

  // -- Billing address state -------------------------------------------------

  const defaultBilling = config.savedAddresses.find((a) => a.isDefaultBilling);

  const [selectedBillingAddressId, setSelectedBillingAddressId] = useState<
    string | null
  >(defaultBilling?.id ?? null);

  const [useDifferentBilling, setUseDifferentBilling] = useState(false);

  const [billingValues, setBillingValues] = useState<Record<string, string>>(
    () =>
      defaultBilling?.values ??
      buildInitialValues(config.billingAddressSchema),
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

  // -- Save address toggles --------------------------------------------------

  const [saveShippingAddress, setSaveShippingAddress] = useState(false);
  const [saveBillingAddress, setSaveBillingAddress] = useState(false);

  // -- Delivery & payment state ----------------------------------------------

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
    return option?.price ?? { amount: "0", currencyCode: "USD" };
  }, [config.deliveryOptions, selectedDelivery]);

  // -- Field change handlers -------------------------------------------------

  function handleAddressChange(fieldName: string, value: string) {
    setSelectedShippingAddressId(null);
    setAddressValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  function handleBillingChange(fieldName: string, value: string) {
    setSelectedBillingAddressId(null);
    setBillingValues((prev) => ({ ...prev, [fieldName]: value }));
  }

  // -- Validation ------------------------------------------------------------

  function validateAddressStep(): boolean {
    // If a saved address is selected, it's valid
    if (selectedShippingAddressId !== null) {
      if (useDifferentBilling && selectedBillingAddressId === null) {
        return validateSchemaValues(config.billingAddressSchema, billingValues);
      }
      return true;
    }

    // Validate manually entered shipping address
    if (!validateSchemaValues(config.addressSchema, addressValues)) {
      return false;
    }

    // Validate billing if different
    if (useDifferentBilling && selectedBillingAddressId === null) {
      return validateSchemaValues(config.billingAddressSchema, billingValues);
    }

    return true;
  }

  function validateSchemaValues(
    schema: AddressFormSchema,
    values: Record<string, string>,
  ): boolean {
    for (const row of schema.rows) {
      for (const field of row) {
        if (field.required && !values[field.name]?.trim()) {
          return false;
        }
      }
    }
    return true;
  }

  // -- Navigation ------------------------------------------------------------

  function handleNext() {
    if (currentStep === 0 && !validateAddressStep()) {
      return; // Stay on address step if invalid
    }
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  function handleStepClick(step: number) {
    // Only allow clicking on completed steps
    if (step < currentStep) {
      setCurrentStep(step);
    }
  }

  // -- Submit ----------------------------------------------------------------

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setOrderError(null);

    try {
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

  // -- Render ----------------------------------------------------------------

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      <div className="min-w-0 lg:col-span-7">
        <StepIndicator
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Step 0: Address */}
        {currentStep === 0 && (
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

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={useDifferentBilling}
                onChange={(e) => setUseDifferentBilling(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
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
        )}

        {/* Step 1: Shipping & Payment */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <DeliverySection
              title={t("deliveryMethod")}
              options={config.deliveryOptions}
              selected={selectedDelivery}
              onSelect={setSelectedDelivery}
            />

            <hr className="border-border" />

            <PaymentSection
              title={t("paymentMethod")}
              options={config.paymentOptions}
              selected={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>
        )}

        {/* Step 2: Review */}
        {currentStep === 2 && (
          <div>
            <ReviewStep
              addressValues={addressValues}
              billingValues={billingValues}
              useDifferentBilling={useDifferentBilling}
              selectedDeliveryId={selectedDelivery}
              selectedPaymentId={selectedPayment}
              config={config}
              shippingCost={shippingCost}
              onEditStep={setCurrentStep}
            />

            {orderError && (
              <p className="mt-4 text-sm font-medium text-red-600">
                {orderError}
              </p>
            )}
          </div>
        )}

        <StepNavigation
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Order summary sidebar */}
      <div className="mt-8 lg:col-span-5 lg:mt-0">
        <OrderSummary cart={cart} shippingCost={shippingCost} />
      </div>
    </div>
  );
}
