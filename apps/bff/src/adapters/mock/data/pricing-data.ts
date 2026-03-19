import type { Money } from "@commerce/shared-types";

export type MockPricingRecord = {
  productId: string;
  basePrice: Money;
  variantPrices: Record<string, Money>;
};

const eur = (amount: string): Money => ({ amount, currencyCode: "EUR" });

const frPricing: MockPricingRecord[] = [
  {
    productId: "p-1",
    basePrice: eur("82.99"),
    variantPrices: {
      "p-1-var-front-0": eur("82.99"),
      "p-1-var-rear-1": eur("82.99"),
    },
  },
  {
    productId: "p-2",
    basePrice: eur("139.99"),
    variantPrices: {
      "p-2-var-12-in-0": eur("139.99"),
      "p-2-var-13-in-1": eur("149.99"),
    },
  },
  {
    productId: "p-3",
    basePrice: eur("49.99"),
    variantPrices: {
      "p-3-var-universal-0": eur("49.99"),
      "p-3-var-direct-fit-1": eur("54.99"),
    },
  },
  {
    productId: "p-4",
    basePrice: eur("36.99"),
    variantPrices: {
      "p-4-var-6-0": eur("36.99"),
      "p-4-var-7-1": eur("36.99"),
      "p-4-var-8-2": eur("36.99"),
    },
  },
  {
    productId: "p-5",
    basePrice: eur("849.99"),
    variantPrices: { "p-5-var-front-&-rear-set-0": eur("849.99") },
  },
  {
    productId: "p-6",
    basePrice: eur("59.99"),
    variantPrices: {
      "p-6-var-front-0": eur("59.99"),
      "p-6-var-rear-1": eur("59.99"),
    },
  },
  {
    productId: "p-7",
    basePrice: eur("74.99"),
    variantPrices: {
      "p-7-var-h11-0": eur("74.99"),
      "p-7-var-9005-1": eur("74.99"),
      "p-7-var-9006-2": eur("74.99"),
    },
  },
  {
    productId: "p-8",
    basePrice: eur("41.99"),
    variantPrices: { "p-8-var-universal-0": eur("41.99") },
  },
  {
    productId: "p-9",
    basePrice: eur("619.99"),
    variantPrices: {
      "p-9-var-polished-0": eur("619.99"),
      "p-9-var-burnt-titanium-1": eur("669.99"),
    },
  },
  {
    productId: "p-10",
    basePrice: eur("27.99"),
    variantPrices: {
      "p-10-var-chrome-0": eur("27.99"),
      "p-10-var-black-1": eur("32.99"),
    },
  },
  {
    productId: "p-11",
    basePrice: eur("119.99"),
    variantPrices: {
      "p-11-var-2.5-in-0": eur("119.99"),
      "p-11-var-3-in-1": eur("129.99"),
    },
  },
  {
    productId: "p-12",
    basePrice: eur("69.99"),
    variantPrices: {
      "p-12-var-15mm-0": eur("69.99"),
      "p-12-var-20mm-1": eur("74.99"),
      "p-12-var-25mm-2": eur("79.99"),
    },
  },
  {
    productId: "p-13",
    basePrice: eur("45.99"),
    variantPrices: {
      "p-13-var-snap-in-0": eur("45.99"),
      "p-13-var-clamp-in-1": eur("49.99"),
    },
  },
];

const iePricing: MockPricingRecord[] = [
  {
    productId: "p-1",
    basePrice: eur("89.99"),
    variantPrices: {
      "p-1-var-front-0": eur("89.99"),
      "p-1-var-rear-1": eur("89.99"),
    },
  },
  {
    productId: "p-2",
    basePrice: eur("155.99"),
    variantPrices: {
      "p-2-var-12-in-0": eur("155.99"),
      "p-2-var-13-in-1": eur("165.99"),
    },
  },
  {
    productId: "p-3",
    basePrice: eur("57.99"),
    variantPrices: {
      "p-3-var-universal-0": eur("57.99"),
      "p-3-var-direct-fit-1": eur("62.99"),
    },
  },
  {
    productId: "p-4",
    basePrice: eur("42.99"),
    variantPrices: {
      "p-4-var-6-0": eur("42.99"),
      "p-4-var-7-1": eur("42.99"),
      "p-4-var-8-2": eur("42.99"),
    },
  },
  {
    productId: "p-5",
    basePrice: eur("929.99"),
    variantPrices: { "p-5-var-front-&-rear-set-0": eur("929.99") },
  },
  {
    productId: "p-6",
    basePrice: eur("69.99"),
    variantPrices: {
      "p-6-var-front-0": eur("69.99"),
      "p-6-var-rear-1": eur("69.99"),
    },
  },
  {
    productId: "p-7",
    basePrice: eur("84.99"),
    variantPrices: {
      "p-7-var-h11-0": eur("84.99"),
      "p-7-var-9005-1": eur("84.99"),
      "p-7-var-9006-2": eur("84.99"),
    },
  },
  {
    productId: "p-8",
    basePrice: eur("47.99"),
    variantPrices: { "p-8-var-universal-0": eur("47.99") },
  },
  {
    productId: "p-9",
    basePrice: eur("679.99"),
    variantPrices: {
      "p-9-var-polished-0": eur("679.99"),
      "p-9-var-burnt-titanium-1": eur("729.99"),
    },
  },
  {
    productId: "p-10",
    basePrice: eur("32.99"),
    variantPrices: {
      "p-10-var-chrome-0": eur("32.99"),
      "p-10-var-black-1": eur("37.99"),
    },
  },
  {
    productId: "p-11",
    basePrice: eur("139.99"),
    variantPrices: {
      "p-11-var-2.5-in-0": eur("139.99"),
      "p-11-var-3-in-1": eur("149.99"),
    },
  },
  {
    productId: "p-12",
    basePrice: eur("79.99"),
    variantPrices: {
      "p-12-var-15mm-0": eur("79.99"),
      "p-12-var-20mm-1": eur("84.99"),
      "p-12-var-25mm-2": eur("89.99"),
    },
  },
  {
    productId: "p-13",
    basePrice: eur("52.99"),
    variantPrices: {
      "p-13-var-snap-in-0": eur("52.99"),
      "p-13-var-clamp-in-1": eur("57.99"),
    },
  },
];

export const pricingByStore: Record<string, MockPricingRecord[]> = {
  fr: frPricing,
  ie: iePricing,
};
