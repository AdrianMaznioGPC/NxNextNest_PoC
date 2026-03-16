import { GridTileImage } from "components/grid/tile";
import type { FeaturedProductsBlock } from "lib/types";
import { productUrl } from "lib/utils";
import Link from "next/link";
import { registerBlockRenderer } from "../block-registry";

function FeaturedProducts({ block }: { block: FeaturedProductsBlock }) {
  if (!block.products.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{block.heading}</h2>
      <div className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 md:grid-cols-3">
        {block.products.map((product) => (
          <Link
            key={product.handle}
            href={productUrl(product)}
            className="relative aspect-square"
          >
            <GridTileImage
              src={product.featuredImage.url}
              fill
              alt={product.title}
              sizes="(min-width: 768px) 33vw, 100vw"
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                position: "bottom",
              }}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

registerBlockRenderer("featured-products", FeaturedProducts);
export default FeaturedProducts;
