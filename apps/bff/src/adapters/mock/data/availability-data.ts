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
    variantAvailability: {
      "p-1-var-front-0": inStock,
      "p-1-var-rear-1": inStock,
    },
  },
  {
    productId: "p-2",
    ...inStock,
    variantAvailability: {
      "p-2-var-12-in-0": inStock,
      "p-2-var-13-in-1": inStock,
    },
  },
  {
    productId: "p-3",
    ...inStock,
    variantAvailability: {
      "p-3-var-universal-0": inStock,
      "p-3-var-direct-fit-1": inStock,
    },
  },
  {
    productId: "p-4",
    ...inStock,
    variantAvailability: {
      "p-4-var-6-0": inStock,
      "p-4-var-7-1": inStock,
      "p-4-var-8-2": lowStock,
    },
  },
  {
    productId: "p-5",
    ...preorder,
    variantAvailability: { "p-5-var-front-&-rear-set-0": preorder },
  },
  {
    productId: "p-6",
    ...inStock,
    variantAvailability: {
      "p-6-var-front-0": inStock,
      "p-6-var-rear-1": inStock,
    },
  },
  {
    productId: "p-7",
    ...inStock,
    variantAvailability: {
      "p-7-var-h11-0": inStock,
      "p-7-var-9005-1": inStock,
      "p-7-var-9006-2": inStock,
    },
  },
  {
    productId: "p-8",
    ...inStock,
    variantAvailability: { "p-8-var-universal-0": inStock },
  },
  {
    productId: "p-9",
    ...inStock,
    variantAvailability: {
      "p-9-var-polished-0": inStock,
      "p-9-var-burnt-titanium-1": inStock,
    },
  },
  {
    productId: "p-10",
    ...inStock,
    variantAvailability: {
      "p-10-var-chrome-0": inStock,
      "p-10-var-black-1": lowStock,
    },
  },
  {
    productId: "p-11",
    ...inStock,
    variantAvailability: {
      "p-11-var-2.5-in-0": inStock,
      "p-11-var-3-in-1": inStock,
    },
  },
  {
    productId: "p-12",
    ...inStock,
    variantAvailability: {
      "p-12-var-15mm-0": inStock,
      "p-12-var-20mm-1": inStock,
      "p-12-var-25mm-2": inStock,
    },
  },
  {
    productId: "p-13",
    ...inStock,
    variantAvailability: {
      "p-13-var-snap-in-0": inStock,
      "p-13-var-clamp-in-1": inStock,
    },
  },
];

const ieAvailability: MockAvailabilityRecord[] = [
  {
    productId: "p-1",
    ...inStock,
    variantAvailability: {
      "p-1-var-front-0": inStock,
      "p-1-var-rear-1": inStock,
    },
  },
  {
    productId: "p-2",
    ...inStock,
    variantAvailability: {
      "p-2-var-12-in-0": inStock,
      "p-2-var-13-in-1": inStock,
    },
  },
  {
    productId: "p-3",
    ...inStock,
    variantAvailability: {
      "p-3-var-universal-0": inStock,
      "p-3-var-direct-fit-1": inStock,
    },
  },
  {
    productId: "p-4",
    ...inStock,
    variantAvailability: {
      "p-4-var-6-0": inStock,
      "p-4-var-7-1": inStock,
      "p-4-var-8-2": outOfStock,
    },
  },
  {
    productId: "p-5",
    ...inStock,
    variantAvailability: { "p-5-var-front-&-rear-set-0": inStock },
  },
  {
    productId: "p-6",
    ...inStock,
    variantAvailability: {
      "p-6-var-front-0": inStock,
      "p-6-var-rear-1": inStock,
    },
  },
  {
    productId: "p-7",
    ...inStock,
    variantAvailability: {
      "p-7-var-h11-0": inStock,
      "p-7-var-9005-1": inStock,
      "p-7-var-9006-2": inStock,
    },
  },
  {
    productId: "p-8",
    ...inStock,
    variantAvailability: { "p-8-var-universal-0": inStock },
  },
  {
    productId: "p-9",
    ...inStock,
    variantAvailability: {
      "p-9-var-polished-0": inStock,
      "p-9-var-burnt-titanium-1": outOfStock,
    },
  },
  {
    productId: "p-10",
    ...inStock,
    variantAvailability: {
      "p-10-var-chrome-0": inStock,
      "p-10-var-black-1": inStock,
    },
  },
  {
    productId: "p-11",
    purchasable: false,
    stockStatus: "out_of_stock",
    stockMessage: "Out of Stock",
    variantAvailability: {
      "p-11-var-2.5-in-0": outOfStock,
      "p-11-var-3-in-1": outOfStock,
    },
  },
  {
    productId: "p-12",
    ...inStock,
    variantAvailability: {
      "p-12-var-15mm-0": inStock,
      "p-12-var-20mm-1": inStock,
      "p-12-var-25mm-2": inStock,
    },
  },
  {
    productId: "p-13",
    ...inStock,
    variantAvailability: {
      "p-13-var-snap-in-0": inStock,
      "p-13-var-clamp-in-1": inStock,
    },
  },
];

export const availabilityByStore: Record<string, MockAvailabilityRecord[]> = {
  fr: frAvailability,
  ie: ieAvailability,
};
