import { ProductCarousel as Carousel } from "components/carousel";
import type { ProductCarouselBlock } from "lib/types";

function ProductCarouselBlock_({ block }: { block: ProductCarouselBlock }) {
  if (!block.products.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{block.heading}</h2>
      <Carousel products={block.products} loop />
    </section>
  );
}

export default ProductCarouselBlock_;
