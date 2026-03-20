"use client";

import Price from "components/price";
import { useT } from "lib/i18n/messages-context";
import type { CheckoutConfig, Money } from "lib/types";

interface ReviewStepProps {
  addressValues: Record<string, string>;
  billingValues: Record<string, string>;
  useDifferentBilling: boolean;
  selectedDeliveryId: string;
  selectedPaymentId: string;
  config: CheckoutConfig;
  shippingCost: Money;
  onEditStep: (step: number) => void;
}

function formatAddress(values: Record<string, string>): string {
  const parts = [
    [values.firstName, values.lastName].filter(Boolean).join(" "),
    values.address,
    values.apartment,
    [values.postalCode, values.city].filter(Boolean).join(" "),
    values.state,
    values.country,
  ].filter(Boolean);
  return parts.join(", ");
}

function ReviewCard({
  title,
  editLabel,
  onEdit,
  children,
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-card-border p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-link hover:text-link-hover"
        >
          {editLabel}
        </button>
      </div>
      {children}
    </div>
  );
}

export function ReviewStep({
  addressValues,
  billingValues,
  useDifferentBilling,
  selectedDeliveryId,
  selectedPaymentId,
  config,
  shippingCost,
  onEditStep,
}: ReviewStepProps) {
  const t = useT("checkout");

  const deliveryOption = config.deliveryOptions.find(
    (o) => o.id === selectedDeliveryId,
  );
  const paymentOption = config.paymentOptions.find(
    (o) => o.id === selectedPaymentId,
  );

  return (
    <div className="space-y-4">
      {/* Shipping address */}
      <ReviewCard
        title={t("shippingAddress")}
        editLabel={t("edit")}
        onEdit={() => onEditStep(0)}
      >
        <p className="text-sm text-muted">
          {formatAddress(addressValues)}
        </p>
      </ReviewCard>

      {/* Billing address */}
      {useDifferentBilling && (
        <ReviewCard
          title={t("billingAddress")}
          editLabel={t("edit")}
          onEdit={() => onEditStep(0)}
        >
          <p className="text-sm text-muted">
            {formatAddress(billingValues)}
          </p>
        </ReviewCard>
      )}

      {/* Delivery */}
      {deliveryOption && (
        <ReviewCard
          title={t("deliveryMethod")}
          editLabel={t("edit")}
          onEdit={() => onEditStep(1)}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{deliveryOption.label}</p>
              <p className="text-xs text-muted">
                {deliveryOption.description}
              </p>
            </div>
            <Price
              className="text-sm font-medium"
              amount={shippingCost.amount}
              currencyCode={shippingCost.currencyCode}
            />
          </div>
        </ReviewCard>
      )}

      {/* Payment */}
      {paymentOption && (
        <ReviewCard
          title={t("paymentMethod")}
          editLabel={t("edit")}
          onEdit={() => onEditStep(1)}
        >
          <p className="text-sm font-medium">{paymentOption.label}</p>
          <p className="text-xs text-muted">
            {paymentOption.description}
          </p>
        </ReviewCard>
      )}
    </div>
  );
}
