import CategoryHeader from "components/layout/category-header";
import FilterSidebar from "components/layout/filter-sidebar";
import Pagination from "components/layout/pagination";
import type { ViewMode } from "components/layout/view-toggle";
import ProductListing from "components/product/product-listing";
import { getSearchPageData, getStoreCode } from "lib/api";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    page: pageParam,
    filters: filtersParam,
    view: viewParam,
  } = searchParams as { [key: string]: string };

  const view: ViewMode = viewParam === "list" ? "list" : "grid";

  const storeCode = await getStoreCode();
  const page = pageParam ? parseInt(pageParam, 10) : undefined;

  let activeFilters: Record<string, string[]> | undefined;
  if (filtersParam) {
    try {
      activeFilters = JSON.parse(filtersParam);
    } catch {
      /* ignore */
    }
  }

  const data = await getSearchPageData(storeCode, {
    query: searchValue,
    sort,
    page,
    filters: activeFilters,
  });

  const { products, sortOptions, pagination, filters } = data;
  const t = await getTranslations("search");
  const tFilters = await getTranslations("filters");
  const tCategories = await getTranslations("categories");

  const resultSummary = searchValue
    ? pagination.totalResults === 0
      ? `${t("noResults")}"${searchValue}"`
      : `${t("showingResults", { count: pagination.totalResults })}"${searchValue}"`
    : undefined;

  const productCountLabel = tCategories("productCount", {
    count: pagination.totalResults,
  });

  return (
    <div className="text-black dark:text-white">
      {/* Search summary */}
      {resultSummary && (
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
          {resultSummary}
        </p>
      )}

      {products.length > 0 && (
        <>
          <CategoryHeader
            title={t("title")}
            pagination={pagination}
            sortOptions={sortOptions}
            filters={filters}
            activeFilters={activeFilters}
            sortLabel={t("sortBy")}
            filterLabel={tFilters("title")}
            productCountLabel={productCountLabel}
            view={view}
          />

          <div className="flex gap-8">
            {/* Sidebar — desktop only */}
            {filters && filters.length > 0 && (
              <div className="hidden w-[240px] shrink-0 lg:block">
                <Suspense fallback={null}>
                  <FilterSidebar
                    filters={filters}
                    activeFilters={activeFilters}
                  />
                </Suspense>
              </div>
            )}

            {/* Product listing */}
            <div className="min-w-0 flex-1">
              <ProductListing products={products} view={view} />
              <Suspense fallback={null}>
                <Pagination pagination={pagination} />
              </Suspense>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
