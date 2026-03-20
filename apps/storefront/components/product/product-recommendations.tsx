import { ProductCarousel } from "components/carousel";
import type { ListingProduct } from "lib/types";

interface ProductRecommendationsProps {
  products: ListingProduct[];
  heading: string;
}

export default function ProductRecommendations({
  products,
  heading,
}: ProductRecommendationsProps) {
  if (!products.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">{heading}</h2>
      <ProductCarousel products={products} />
    </div>
  );
}
