import type { ViewMode } from "components/layout/view-toggle";
import type { ListingProduct } from "lib/types";
import ProductCard from "./product-card";
import ProductCardHorizontal from "./product-card-horizontal";

interface ProductListingProps {
  products: ListingProduct[];
  view: ViewMode;
}

export default function ProductListing({
  products,
  view,
}: ProductListingProps) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCardHorizontal key={product.variantId} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.variantId} product={product} />
      ))}
    </div>
  );
}
