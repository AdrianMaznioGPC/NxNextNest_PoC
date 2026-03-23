import type { FeaturedCategoriesBlock } from "lib/types";
import CategoryCard from "components/layout/category-card";
import { registerBlockRenderer } from "../block-registry";

function FeaturedCategories({ block }: { block: FeaturedCategoriesBlock }) {
  if (!block.categories.length) return null;

  return (
    <section className="py-8">
      <h2 className="mb-4 px-4 text-2xl font-bold">{block.heading}</h2>
      <div className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 md:grid-cols-3">
        {block.categories.map((collection) => (
          <CategoryCard key={collection.handle} collection={collection} />
        ))}
      </div>
    </section>
  );
}

registerBlockRenderer("featured-categories", FeaturedCategories);
export default FeaturedCategories;
