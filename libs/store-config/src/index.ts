export type StoreConfig = {
  storeCode: string;
  locale: string;
  currency: string;
  currencySymbol: string;
  language: string;
  siteName: string;
  label: string;
  flag: string;
  domain: string;
};

export const stores: Record<string, StoreConfig> = {
  fr: {
    storeCode: "fr",
    locale: "fr-FR",
    currency: "EUR",
    currencySymbol: "\u20ac",
    language: "fr",
    siteName: "Winparts France",
    label: "France",
    flag: "\ud83c\uddeb\ud83c\uddf7",
    domain: "winparts.fr.localhost",
  },
  ie: {
    storeCode: "ie",
    locale: "en-IE",
    currency: "EUR",
    currencySymbol: "\u20ac",
    language: "en",
    siteName: "Winparts Ireland",
    label: "Ireland",
    flag: "\ud83c\uddee\ud83c\uddea",
    domain: "winparts.ie.localhost",
  },
};

export const defaultStoreCode = "fr";

export function resolveStoreFromHostname(
  hostname: string,
): StoreConfig | undefined {
  return Object.values(stores).find((s) => hostname.includes(s.domain));
}
