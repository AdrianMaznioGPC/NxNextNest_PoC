import CategoryCard from "components/layout/category-card";
import { getCategoryListPageData } from "lib/api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Categories",
  description: "Browse all product categories.",
};

export default async function CategoriesPage() {
  const { collections } = await getCategoryListPageData();

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-black dark:text-white">
        All Categories
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CategoryCard key={collection.handle} collection={collection} />
        ))}
      </div>
    </>
  );
}
