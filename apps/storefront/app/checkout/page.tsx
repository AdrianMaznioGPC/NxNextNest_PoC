import { getCart, getCheckoutConfig } from "lib/api";
import {
  getRequestLocaleContext,
  getRequestStoreContext,
} from "lib/i18n/request-context";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutOrchestrator } from "./checkout-orchestrator";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const localeContext = await getRequestLocaleContext();
  const storeContext = await getRequestStoreContext();
  const cart = await getCart(localeContext);

  if (!cart || cart.lines.length === 0) {
    redirect("/");
  }

  const config = await getCheckoutConfig(storeContext.storeKey);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CheckoutOrchestrator cart={cart} config={config} />
    </div>
  );
}
