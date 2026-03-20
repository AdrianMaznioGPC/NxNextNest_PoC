import ProductCard from "components/product/product-card";
import type { FeaturedProductsBlock } from "lib/types";

function FeaturedProducts({ block }: { block: FeaturedProductsBlock }) {
  if (!block.products.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{block.heading}</h2>
      <div className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 sm:grid-cols-2 md:grid-cols-3">
        {block.products.map((product) => (
          <ProductCard key={product.variantId} product={product} />
        ))}
      </div>
    </section>
  );
}

export default FeaturedProducts;
