import { getMessages } from "lib/api";
import { MergedMessagesProvider } from "lib/i18n/messages-context";
import { getRequestLocaleContext } from "lib/i18n/request-context";
import type { ReactNode } from "react";

/**
 * Checkout layout augments the root layout by merging checkout-specific
 * translations into the existing MessagesProvider context. This ensures
 * `useT("checkout")` and `useT("orderConfirmation")` resolve correctly
 * while parent namespaces (common, nav, cart) remain available.
 */
export default async function CheckoutLayout({
  children,
}: {
  children: ReactNode;
}) {
  const localeContext = await getRequestLocaleContext();
  const { messages } = await getMessages(localeContext.locale, [
    "checkout",
    "orderConfirmation",
  ]);

  return (
    <MergedMessagesProvider messages={messages}>
      {children}
    </MergedMessagesProvider>
  );
}
