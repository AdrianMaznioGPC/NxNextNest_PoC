"use client";

import { useT } from "lib/i18n/messages-context";

interface ConfirmationMessagesProps {
  orderNumber?: string;
  section?: string;
}

export function ConfirmationMessages({
  orderNumber,
  section,
}: ConfirmationMessagesProps) {
  const t = useT("orderConfirmation");

  // Header section (title + thank you + order number)
  if (orderNumber && !section) {
    return (
      <>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="mt-2 text-muted">
          {t("thankYou")}
        </p>
        <p className="mt-1 text-sm text-muted">
          {t("orderNumber").replace("{orderNumber}", orderNumber)}
        </p>
      </>
    );
  }

  // Individual label sections
  switch (section) {
    case "items":
      return <h2 className="text-sm font-semibold">{t("items")}</h2>;
    case "subtotalLabel":
      return <span>{t("subtotal")}</span>;
    case "shippingLabel":
      return <span>{t("shipping")}</span>;
    case "taxesLabel":
      return <span>{t("taxes")}</span>;
    case "totalLabel":
      return <span>{t("total")}</span>;
    case "deliveryMethodLabel":
      return <p className="text-sm text-muted">{t("deliveryMethod")}</p>;
    case "paymentMethodLabel":
      return <p className="text-sm text-muted">{t("paymentMethod")}</p>;
    case "continueShopping":
      return <>{t("continueShopping")}</>;
    default:
      return null;
  }
}
