import { defaultStoreCode, stores } from "@commerce/store-config";
import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

export default getRequestConfig(async () => {
  const h = await headers();
  const storeCode = h.get("x-store-code") ?? defaultStoreCode;
  const locale = stores[storeCode]?.language ?? "en";

  const messages = (await import(`../messages/${locale}.json`)).default;

  return { locale, messages };
});
