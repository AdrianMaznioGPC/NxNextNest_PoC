"use client";

import { MultiStepCheckout } from "components/checkout/flows/multi-step/multi-step-checkout";
import { SinglePageCheckout } from "components/checkout/flows/single-page/single-page-checkout";
import { useT } from "lib/i18n/messages-context";
import type { Cart, CheckoutConfig } from "lib/types";

interface CheckoutOrchestratorProps {
  cart: Cart;
  config: CheckoutConfig;
}

export function CheckoutOrchestrator({
  cart,
  config,
}: CheckoutOrchestratorProps) {
  const t = useT("checkout");

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      {renderFlow(config, cart)}
    </>
  );
}

function renderFlow(config: CheckoutConfig, cart: Cart) {
  switch (config.flowType) {
    case "single-page":
      return <SinglePageCheckout config={config} cart={cart} />;
    case "multi-step":
      return <MultiStepCheckout config={config} cart={cart} />;
    // Future flow types:
    // case "express":
    //   return <ExpressCheckout config={config} cart={cart} />;
    default:
      return <SinglePageCheckout config={config} cart={cart} />;
  }
}
