import type { ListingProduct } from "lib/types";
import ProductCard from "./product/product-card";
import { ScrollContainer } from "./scroll-container";

interface ProductCarouselProps {
  products: ListingProduct[];
  /** When true the list loops by tripling items and auto-animates. */
  loop?: boolean;
}

export function ProductCarousel({
  products,
  loop = false,
}: ProductCarouselProps) {
  if (!products.length) return null;

  const items = loop ? [...products, ...products, ...products] : products;

  return (
    <ScrollContainer>
      <ul className={`flex gap-4${loop ? " animate-carousel" : ""}`}>
        {items.map((product, i) => (
          <li
            key={`${product.variantId}-${i}`}
            className="w-[260px] flex-none sm:w-[280px] lg:w-[300px]"
          >
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </ScrollContainer>
  );
}
