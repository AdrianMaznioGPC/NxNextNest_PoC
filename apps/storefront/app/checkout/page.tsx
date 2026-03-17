import Container from "components/layout/container";
import { getCart, getCheckoutConfig, getStoreCode } from "lib/api";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import CheckoutForm from "./checkout-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return {
    title: t("title"),
  };
}

export default async function CheckoutPage() {
  const cart = await getCart();
  const t = await getTranslations("checkout");

  if (!cart || cart.lines.length === 0) {
    redirect("/");
  }

  const storeCode = await getStoreCode();
  const config = await getCheckoutConfig(storeCode);

  return (
    <Container>
      <h1 className="mb-8 text-3xl font-bold">{t("title")}</h1>
      <CheckoutForm cart={cart} config={config} />
    </Container>
  );
}
