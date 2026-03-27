"use client";

import { useSearchParams } from "next/navigation";
import type { Product, ViewMode } from "@commerce/shared-types";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import Image from "next/image";
import SmartLink from "components/smart-link";

type ProductListingProps = {
  products: Product[];
  defaultView?: ViewMode;
};

function ProductListView({ products }: { products: Product[] }) {
  return (
    <ul className="space-y-4">
      {products.map((product) => (
        <li
          key={product.id}
          className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
        >
          <SmartLink
            href={product.path}
            className="grid grid-cols-[96px_1fr] gap-4 p-4 sm:grid-cols-[120px_1fr]"
          >
            <div className="relative h-24 w-24 overflow-hidden rounded-md sm:h-[120px] sm:w-[120px]">
              <Image
                alt={product.featuredImage?.altText || product.title}
                src={product.featuredImage?.url || "/placeholder.png"}
                fill
                sizes="120px"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-semibold text-black">
                {product.title}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                {product.description}
              </p>
              <p className="mt-3 text-sm font-medium text-black">
                {product.priceRange.maxVariantPrice.amount}{" "}
                {product.priceRange.maxVariantPrice.currencyCode}
              </p>
            </div>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

export function ProductListing({
  products,
  defaultView = "grid",
}: ProductListingProps) {
  const searchParams = useSearchParams();
  const view = (searchParams.get("view") as ViewMode) || defaultView;

  if (view === "list") {
    return <ProductListView products={products} />;
  }

  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <ProductGridItems products={products} />
    </Grid>
  );
}
