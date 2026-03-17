export type MockVariantStockInfo = {
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
};

export type MockAvailabilityRecord = {
  productId: string;
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
  variantAvailability: Record<string, MockVariantStockInfo>;
};

const inStock: MockVariantStockInfo = {
  purchasable: true,
  stockStatus: "in_stock",
  stockMessage: "In Stock",
};

const outOfStock: MockVariantStockInfo = {
  purchasable: false,
  stockStatus: "out_of_stock",
  stockMessage: "Out of Stock",
};

const lowStock: MockVariantStockInfo = {
  purchasable: true,
  stockStatus: "low_stock",
  stockMessage: "Almost Gone — Only 3 Left!",
};

const preorder: MockVariantStockInfo = {
  purchasable: true,
  stockStatus: "preorder",
  stockMessage: "Pre-order — Ships in 2 Weeks",
};

const frAvailability: MockAvailabilityRecord[] = [
  {
    productId: "p-1",
    ...inStock,
    variantAvailability: { "var-front-0": inStock, "var-rear-1": inStock },
  },
  {
    productId: "p-2",
    ...inStock,
    variantAvailability: { "var-12-in-0": inStock, "var-13-in-1": inStock },
  },
  {
    productId: "p-3",
    ...inStock,
    variantAvailability: {
      "var-universal-0": inStock,
      "var-direct-fit-1": inStock,
    },
  },
  {
    productId: "p-4",
    ...inStock,
    variantAvailability: {
      "var-6-0": inStock,
      "var-7-1": inStock,
      "var-8-2": lowStock,
    },
  },
  {
    productId: "p-5",
    ...preorder,
    variantAvailability: { "var-front-&-rear-set-0": preorder },
  },
  {
    productId: "p-6",
    ...inStock,
    variantAvailability: { "var-front-0": inStock, "var-rear-1": inStock },
  },
  {
    productId: "p-7",
    ...inStock,
    variantAvailability: {
      "var-h11-0": inStock,
      "var-9005-1": inStock,
      "var-9006-2": inStock,
    },
  },
  {
    productId: "p-8",
    ...inStock,
    variantAvailability: { "var-universal-0": inStock },
  },
  {
    productId: "p-9",
    ...inStock,
    variantAvailability: {
      "var-polished-0": inStock,
      "var-burnt-titanium-1": inStock,
    },
  },
  {
    productId: "p-10",
    ...inStock,
    variantAvailability: { "var-chrome-0": inStock, "var-black-1": lowStock },
  },
  {
    productId: "p-11",
    ...inStock,
    variantAvailability: { "var-2.5-in-0": inStock, "var-3-in-1": inStock },
  },
  {
    productId: "p-12",
    ...inStock,
    variantAvailability: {
      "var-15mm-0": inStock,
      "var-20mm-1": inStock,
      "var-25mm-2": inStock,
    },
  },
  {
    productId: "p-13",
    ...inStock,
    variantAvailability: {
      "var-snap-in-0": inStock,
      "var-clamp-in-1": inStock,
    },
  },
];

const ieAvailability: MockAvailabilityRecord[] = [
  {
    productId: "p-1",
    ...inStock,
    variantAvailability: { "var-front-0": inStock, "var-rear-1": inStock },
  },
  {
    productId: "p-2",
    ...inStock,
    variantAvailability: { "var-12-in-0": inStock, "var-13-in-1": inStock },
  },
  {
    productId: "p-3",
    ...inStock,
    variantAvailability: {
      "var-universal-0": inStock,
      "var-direct-fit-1": inStock,
    },
  },
  {
    productId: "p-4",
    ...inStock,
    variantAvailability: {
      "var-6-0": inStock,
      "var-7-1": inStock,
      "var-8-2": outOfStock,
    },
  },
  {
    productId: "p-5",
    ...inStock,
    variantAvailability: { "var-front-&-rear-set-0": inStock },
  },
  {
    productId: "p-6",
    ...inStock,
    variantAvailability: { "var-front-0": inStock, "var-rear-1": inStock },
  },
  {
    productId: "p-7",
    ...inStock,
    variantAvailability: {
      "var-h11-0": inStock,
      "var-9005-1": inStock,
      "var-9006-2": inStock,
    },
  },
  {
    productId: "p-8",
    ...inStock,
    variantAvailability: { "var-universal-0": inStock },
  },
  {
    productId: "p-9",
    ...inStock,
    variantAvailability: {
      "var-polished-0": inStock,
      "var-burnt-titanium-1": outOfStock,
    },
  },
  {
    productId: "p-10",
    ...inStock,
    variantAvailability: { "var-chrome-0": inStock, "var-black-1": inStock },
  },
  {
    productId: "p-11",
    purchasable: false,
    stockStatus: "out_of_stock",
    stockMessage: "Out of Stock",
    variantAvailability: {
      "var-2.5-in-0": outOfStock,
      "var-3-in-1": outOfStock,
    },
  },
  {
    productId: "p-12",
    ...inStock,
    variantAvailability: {
      "var-15mm-0": inStock,
      "var-20mm-1": inStock,
      "var-25mm-2": inStock,
    },
  },
  {
    productId: "p-13",
    ...inStock,
    variantAvailability: {
      "var-snap-in-0": inStock,
      "var-clamp-in-1": inStock,
    },
  },
];

export const availabilityByStore: Record<string, MockAvailabilityRecord[]> = {
  fr: frAvailability,
  ie: ieAvailability,
};
