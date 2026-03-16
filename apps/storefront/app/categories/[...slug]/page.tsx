import Grid from "components/grid";
import Breadcrumbs from "components/layout/breadcrumbs";
import CategoryCard from "components/layout/category-card";
import ProductGridItems from "components/layout/product-grid-items";
import FilterList from "components/layout/search/filter";
import { getCategoryPageData, getStoreCode } from "lib/api";
import { defaultSort, sorting } from "lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const storeCode = await getStoreCode();
    const { collection } = await getCategoryPageData(storeCode, slug);
    return {
      title: collection.seo?.title || collection.title,
      description:
        collection.seo?.description ||
        collection.description ||
        `${collection.title} products`,
    };
  } catch {
    return {};
  }
}

export default async function CategorySlugPage(props: {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const { sort } = (searchParams ?? {}) as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  let data;
  try {
    const storeCode = await getStoreCode();
    data = await getCategoryPageData(storeCode, slug, sortKey, reverse);
  } catch {
    return notFound();
  }

  const { collection, breadcrumbs, subcollections, products } = data;

  // CLP — category has subcategories
  if (subcollections && subcollections.length > 0) {
    return (
      <>
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mb-8 text-3xl font-bold text-black dark:text-white">
          {collection.title}
        </h1>
        <p className="mb-8 text-neutral-500 dark:text-neutral-400">
          {collection.description}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subcollections.map((sub) => (
            <CategoryCard key={sub.handle} collection={sub} />
          ))}
        </div>
      </>
    );
  }

  // PLP — leaf category, show products
  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          {collection.title}
        </h1>
        <div className="w-[200px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
      <p className="mt-2 mb-8 text-neutral-500 dark:text-neutral-400">
        {collection.description}
      </p>
      {!products || products.length === 0 ? (
        <p className="py-3 text-lg">No products found in this category</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </>
  );
}
