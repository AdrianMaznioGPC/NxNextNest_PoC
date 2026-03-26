import { GridTileImage } from "components/grid/tile";
import SmartLink from "components/smart-link";
import type { FeaturedProductsBlock } from "lib/types";

export default function FeaturedProducts({
  block,
}: {
  block: FeaturedProductsBlock;
}) {
  if (!block.products.length) return null;

  return (
    <section className="py-8">
      <h2 className="mb-4 px-4 text-2xl font-bold">{block.heading}</h2>
      <div className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 md:grid-cols-3">
        {block.products.map((product) => (
          <SmartLink
            key={product.handle}
            href={product.path}
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
          </SmartLink>
        ))}
      </div>
    </section>
  );
}
