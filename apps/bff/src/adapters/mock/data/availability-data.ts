export type MockAvailabilityRecord = {
  productId: string;
  availableForSale: boolean;
  variantAvailability: Record<string, boolean>;
};

const frAvailability: MockAvailabilityRecord[] = [
  {
    productId: "p-1",
    availableForSale: true,
    variantAvailability: { "var-front-0": true, "var-rear-1": true },
  },
  {
    productId: "p-2",
    availableForSale: true,
    variantAvailability: { "var-12-in-0": true, "var-13-in-1": true },
  },
  {
    productId: "p-3",
    availableForSale: true,
    variantAvailability: { "var-universal-0": true, "var-direct-fit-1": true },
  },
  {
    productId: "p-4",
    availableForSale: true,
    variantAvailability: { "var-6-0": true, "var-7-1": true, "var-8-2": true },
  },
  {
    productId: "p-5",
    availableForSale: true,
    variantAvailability: { "var-front-&-rear-set-0": true },
  },
  {
    productId: "p-6",
    availableForSale: true,
    variantAvailability: { "var-front-0": true, "var-rear-1": true },
  },
  {
    productId: "p-7",
    availableForSale: true,
    variantAvailability: {
      "var-h11-0": true,
      "var-9005-1": true,
      "var-9006-2": true,
    },
  },
  {
    productId: "p-8",
    availableForSale: true,
    variantAvailability: { "var-universal-0": true },
  },
  {
    productId: "p-9",
    availableForSale: true,
    variantAvailability: {
      "var-polished-0": true,
      "var-burnt-titanium-1": true,
    },
  },
  {
    productId: "p-10",
    availableForSale: true,
    variantAvailability: { "var-chrome-0": true, "var-black-1": true },
  },
  {
    productId: "p-11",
    availableForSale: true,
    variantAvailability: { "var-2.5-in-0": true, "var-3-in-1": true },
  },
  {
    productId: "p-12",
    availableForSale: true,
    variantAvailability: {
      "var-15mm-0": true,
      "var-20mm-1": true,
      "var-25mm-2": true,
    },
  },
];

const ieAvailability: MockAvailabilityRecord[] = [
  {
    productId: "p-1",
    availableForSale: true,
    variantAvailability: { "var-front-0": true, "var-rear-1": true },
  },
  {
    productId: "p-2",
    availableForSale: true,
    variantAvailability: { "var-12-in-0": true, "var-13-in-1": true },
  },
  {
    productId: "p-3",
    availableForSale: true,
    variantAvailability: { "var-universal-0": true, "var-direct-fit-1": true },
  },
  {
    productId: "p-4",
    availableForSale: true,
    variantAvailability: { "var-6-0": true, "var-7-1": true, "var-8-2": false },
  },
  {
    productId: "p-5",
    availableForSale: true,
    variantAvailability: { "var-front-&-rear-set-0": true },
  },
  {
    productId: "p-6",
    availableForSale: true,
    variantAvailability: { "var-front-0": true, "var-rear-1": true },
  },
  {
    productId: "p-7",
    availableForSale: true,
    variantAvailability: {
      "var-h11-0": true,
      "var-9005-1": true,
      "var-9006-2": true,
    },
  },
  {
    productId: "p-8",
    availableForSale: true,
    variantAvailability: { "var-universal-0": true },
  },
  {
    productId: "p-9",
    availableForSale: true,
    variantAvailability: {
      "var-polished-0": true,
      "var-burnt-titanium-1": false,
    },
  },
  {
    productId: "p-10",
    availableForSale: true,
    variantAvailability: { "var-chrome-0": true, "var-black-1": true },
  },
  {
    productId: "p-11",
    availableForSale: false,
    variantAvailability: { "var-2.5-in-0": false, "var-3-in-1": false },
  },
  {
    productId: "p-12",
    availableForSale: true,
    variantAvailability: {
      "var-15mm-0": true,
      "var-20mm-1": true,
      "var-25mm-2": true,
    },
  },
];

export const availabilityByStore: Record<string, MockAvailabilityRecord[]> = {
  fr: frAvailability,
  ie: ieAvailability,
};
