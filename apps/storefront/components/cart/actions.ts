"use server";

import { getCart } from "lib/api";
import { getRequestLocaleContext } from "lib/i18n/request-context";
import { redirect } from "next/navigation";

export async function redirectToCheckout() {
  const localeContext = await getRequestLocaleContext();
  const cart = await getCart(localeContext);
  if (!cart?.checkoutUrl) {
    redirect("/");
  }
  redirect(cart.checkoutUrl);
}
