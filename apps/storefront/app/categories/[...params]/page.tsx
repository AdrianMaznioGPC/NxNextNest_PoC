import Breadcrumbs from "components/layout/breadcrumbs";
import CategoryCard from "components/layout/category-card";
import CategoryHeader from "components/layout/category-header";
import FilterSidebar from "components/layout/filter-sidebar";
import Pagination from "components/layout/pagination";
import type { ViewMode } from "components/layout/view-toggle";
import ProductListing from "components/product/product-listing";
import { getCategoryPageData, getStoreCode } from "lib/api";
import { categoryUrl } from "lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ params: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

function parseCategoryParams(
  segments: string[],
): { slug: string; categoryId: string } | null {
  const cIndex = segments.indexOf("c");
  if (cIndex >= 1 && cIndex === segments.length - 2) {
    return { slug: segments[cIndex - 1]!, categoryId: segments[cIndex + 1]! };
  }
  return null;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params: segments } = await props.params;
  const parsed = parseCategoryParams(segments);
  if (!parsed) return {};

  try {
    const storeCode = await getStoreCode();
    const { collection } = await getCategoryPageData(
      storeCode,
      parsed.categoryId,
    );
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

export default async function CategoryPage(props: Props) {
  const { params: segments } = await props.params;
  const parsed = parseCategoryParams(segments);
  if (!parsed) return notFound();

  const searchParams = await props.searchParams;
  const {
    sort,
    page: pageParam,
    filters: filtersParam,
    view: viewParam,
  } = (searchParams ?? {}) as {
    [key: string]: string;
  };

  const view: ViewMode = viewParam === "list" ? "list" : "grid";

  const storeCode = await getStoreCode();
  const page = pageParam ? parseInt(pageParam, 10) : undefined;

  // Parse filters from URL
  let activeFilters: Record<string, string[]> | undefined;
  if (filtersParam) {
    try {
      activeFilters = JSON.parse(filtersParam);
    } catch {
      /* ignore malformed */
    }
  }

  let data;
  try {
    data = await getCategoryPageData(
      storeCode,
      parsed.categoryId,
      sort,
      page,
      undefined,
      activeFilters,
    );
  } catch {
    return notFound();
  }

  const {
    collection,
    canonicalSlug,
    breadcrumbs,
    subcollections,
    products,
    sortOptions,
    pagination,
    filters,
  } = data;

  const tBreadcrumbs = await getTranslations("breadcrumbs");
  const tCategories = await getTranslations("categories");
  const tSearch = await getTranslations("search");
  const tFilters = await getTranslations("filters");
  const allBreadcrumbs = [
    { title: tBreadcrumbs("home"), path: "/" },
    { title: tBreadcrumbs("categories"), path: "/categories" },
    ...breadcrumbs,
  ];

  if (parsed.slug !== canonicalSlug) {
    redirect(categoryUrl(collection));
  }

  if (subcollections && subcollections.length > 0) {
    return (
      <>
        <Breadcrumbs items={allBreadcrumbs} />
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

  const productCountLabel = tCategories("productCount", {
    count: pagination?.totalResults ?? products?.length ?? 0,
  });

  return (
    <>
      <Breadcrumbs items={allBreadcrumbs} />

      <CategoryHeader
        title={collection.title}
        description={collection.description}
        pagination={pagination}
        sortOptions={sortOptions}
        filters={filters}
        activeFilters={activeFilters}
        sortLabel={tSearch("sortBy")}
        filterLabel={tFilters("title")}
        productCountLabel={productCountLabel}
        view={view}
      />

      <div className="flex gap-8">
        {/* Sidebar — desktop only */}
        {filters && filters.length > 0 && (
          <div className="hidden w-[240px] shrink-0 lg:block">
            <Suspense fallback={null}>
              <FilterSidebar filters={filters} activeFilters={activeFilters} />
            </Suspense>
          </div>
        )}

        {/* Product grid */}
        <div className="min-w-0 flex-1">
          {!products || products.length === 0 ? (
            <p className="py-3 text-lg">{tCategories("noProducts")}</p>
          ) : (
            <>
              <ProductListing products={products} view={view} />
              {pagination && (
                <Suspense fallback={null}>
                  <Pagination pagination={pagination} />
                </Suspense>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
