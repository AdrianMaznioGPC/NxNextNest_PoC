import { GridTileImage } from "components/grid/tile";
import type { ProductCarouselBlock } from "lib/types";
import { productUrl } from "lib/utils";
import Link from "next/link";

function ProductCarousel({ block }: { block: ProductCarouselBlock }) {
  if (!block.products.length) return null;

  // Duplicate products so the carousel loops on wide screens
  const carouselProducts = [
    ...block.products,
    ...block.products,
    ...block.products,
  ];

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{block.heading}</h2>
      <div className="w-full overflow-x-auto pb-6 pt-1">
        <ul className="flex animate-carousel gap-4">
          {carouselProducts.map((product, i) => (
            <li
              key={`${product.handle}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link
                href={productUrl(product)}
                className="relative h-full w-full"
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount: product.priceRange.maxVariantPrice?.amount,
                    currencyCode:
                      product.priceRange.maxVariantPrice?.currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default ProductCarousel;
