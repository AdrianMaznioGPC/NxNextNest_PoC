import type { Money } from "@commerce/shared-types";

export type MockPricingRecord = {
  productId: string;
  basePrice: Money;
  variantPrices: Record<string, Money>;
};

const usd = (amount: string): Money => ({ amount, currencyCode: "USD" });

export const pricingRecords: MockPricingRecord[] = [
  { productId: "p-1",  basePrice: usd("89.99"),  variantPrices: { "var-front-0": usd("89.99"),  "var-rear-1": usd("89.99") } },
  { productId: "p-2",  basePrice: usd("149.99"), variantPrices: { "var-12-in-0": usd("149.99"), "var-13-in-1": usd("159.99") } },
  { productId: "p-3",  basePrice: usd("54.99"),  variantPrices: { "var-universal-0": usd("54.99"),  "var-direct-fit-1": usd("59.99") } },
  { productId: "p-4",  basePrice: usd("39.99"),  variantPrices: { "var-6-0": usd("39.99"),  "var-7-1": usd("39.99"),  "var-8-2": usd("39.99") } },
  { productId: "p-5",  basePrice: usd("899.99"), variantPrices: { "var-front-&-rear-set-0": usd("899.99") } },
  { productId: "p-6",  basePrice: usd("64.99"),  variantPrices: { "var-front-0": usd("64.99"),  "var-rear-1": usd("64.99") } },
  { productId: "p-7",  basePrice: usd("79.99"),  variantPrices: { "var-h11-0": usd("79.99"),  "var-9005-1": usd("79.99"),  "var-9006-2": usd("79.99") } },
  { productId: "p-8",  basePrice: usd("44.99"),  variantPrices: { "var-universal-0": usd("44.99") } },
  { productId: "p-9",  basePrice: usd("649.99"), variantPrices: { "var-polished-0": usd("649.99"), "var-burnt-titanium-1": usd("699.99") } },
  { productId: "p-10", basePrice: usd("29.99"),  variantPrices: { "var-chrome-0": usd("29.99"),  "var-black-1": usd("34.99") } },
  { productId: "p-11", basePrice: usd("129.99"), variantPrices: { "var-2.5-in-0": usd("129.99"), "var-3-in-1": usd("139.99") } },
  { productId: "p-12", basePrice: usd("74.99"),  variantPrices: { "var-15mm-0": usd("74.99"),  "var-20mm-1": usd("79.99"),  "var-25mm-2": usd("84.99") } },
];

export function getPricingRecord(productId: string): MockPricingRecord | undefined {
  return pricingRecords.find((r) => r.productId === productId);
}

export function getVariantPrice(variantId: string): Money | undefined {
  for (const record of pricingRecords) {
    const price = record.variantPrices[variantId];
    if (price) return price;
  }
  return undefined;
}
