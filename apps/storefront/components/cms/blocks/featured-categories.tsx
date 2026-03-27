import CategoryCard from "components/layout/category-card";
import type { FeaturedCategoriesBlock } from "lib/types";

export default function FeaturedCategories({
  block,
}: {
  block: FeaturedCategoriesBlock;
}) {
  if (!block.categories.length) return null;

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{block.heading}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {block.categories.map((collection) => (
          <CategoryCard key={collection.handle} collection={collection} />
        ))}
      </div>
    </section>
  );
}
