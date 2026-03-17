import { CartProvider } from "components/cart/cart-context";
import { CartUxProvider } from "components/cart/cart-ux-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getRequestBootstrap } from "lib/bootstrap";
import { getCart, getDomainConfig, getLayoutData } from "lib/api";
import { MessagesProvider } from "lib/i18n/messages-context";
import {
  getRequestLocaleContext,
  getRequestStoreContext,
} from "lib/i18n/request-context";
import { resolveThemeTokenPack } from "lib/theme/token-pack-registry";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const localeContext = await getRequestLocaleContext();
  const storeContext = await getRequestStoreContext();
  const bootstrap = await getRequestBootstrap();
  const messages = bootstrap.shell.messages;

  // Don't await the fetches, pass the Promises down
  const cart = getCart(localeContext);
  const layoutData = getLayoutData(localeContext);
  const domainConfig = getDomainConfig();
  const theme = resolveThemeTokenPack({
    themeKey: storeContext.themeKey,
    themeTokenPack: storeContext.themeTokenPack,
    themeRevision: storeContext.themeRevision,
  });

  return (
    <html lang={localeContext.language} className={GeistSans.variable}>
      <head>
        <link rel="stylesheet" href={theme.stylesheetHref} />
      </head>
      <body
        data-theme-key={theme.themeKey}
        data-theme-token-pack={theme.themeTokenPack}
        className="bg-muted-surface text-foreground selection:bg-selection selection:text-selection-foreground"
      >
        <MessagesProvider messages={messages}>
          <CartUxProvider
            value={{
              mode: storeContext.cartUxMode,
              cartPath: storeContext.cartPath,
              openCartOnAdd: storeContext.openCartOnAdd,
            }}
          >
            <CartProvider cartPromise={cart}>
              <Navbar
                layoutDataPromise={layoutData}
                domainConfigPromise={domainConfig}
                storeContext={storeContext}
                currentRegion={localeContext.region}
              />
              <main className="min-h-screen">
                {children}
                <Toaster closeButton />
              </main>
              <Footer
                layoutDataPromise={layoutData}
                localeContext={localeContext}
                storeContext={storeContext}
              />
            </CartProvider>
          </CartUxProvider>
        </MessagesProvider>
      </body>
    </html>
  );
}
