import CategoryCard from "components/layout/category-card";
import { getCategoryListPageData, getStoreCode } from "lib/api";
import { getTranslations } from "next-intl/server";

export default async function CategoriesPage() {
  const storeCode = await getStoreCode();
  const { collections } = await getCategoryListPageData(storeCode);
  const t = await getTranslations("categories");

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-black dark:text-white">
        {t("allCategories")}
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CategoryCard key={collection.handle} collection={collection} />
        ))}
      </div>
    </>
  );
}
