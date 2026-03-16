import { resolveStoreFromHostname } from "@commerce/store-config";
import { CartProvider } from "components/cart/cart-context";
import Footer from "components/layout/footer";
import { Navbar } from "components/layout/navbar";
import { GeistSans } from "geist/font/sans";
import { getCart, getLayoutData, getStoreCode } from "lib/api";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const store = resolveStoreFromHostname(h.get("host") ?? "");
  const siteName = store?.siteName ?? process.env.SITE_NAME ?? "Winparts";

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    robots: {
      follow: true,
      index: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const h = await headers();
  const store = resolveStoreFromHostname(h.get("host") ?? "");
  const lang = store?.language ?? "en";

  const storeCode = await getStoreCode();
  const cart = getCart();
  const layoutData = getLayoutData(storeCode);

  return (
    <html lang={lang} className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <CartProvider cartPromise={cart}>
          <Navbar layoutDataPromise={layoutData} />
          <main className="min-h-screen py-8">
            {children}
            <Toaster closeButton />
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
