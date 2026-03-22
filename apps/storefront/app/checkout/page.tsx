import { getCart } from "lib/api";
import { getRequestBootstrap } from "lib/bootstrap";
import { getRequestLocaleContext } from "lib/i18n/request-context";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CheckoutPageShell } from "./checkout-page-shell";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const localeContext = await getRequestLocaleContext();
  const cart = await getCart(localeContext);

  if (!cart || cart.lines.length === 0) {
    redirect("/");
  }

  const bootstrap = await getRequestBootstrap();
  const page = bootstrap.page;

  if (!page) return notFound();
  if (page.status === 301 && page.redirectTo) {
    redirect(page.redirectTo);
  }
  if (page.status === 404) return notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {page.seo.jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(page.seo.jsonLd),
          }}
        />
      ) : null}
      <CheckoutPageShell bootstrap={bootstrap} />
    </div>
  );
}
