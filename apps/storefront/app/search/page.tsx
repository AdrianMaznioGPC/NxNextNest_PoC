import Grid from "components/grid";
import Pagination from "components/layout/pagination";
import ProductGridItems from "components/layout/product-grid-items";
import FilterList from "components/layout/search/filter";
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
  } = searchParams as { [key: string]: string };

  const storeCode = await getStoreCode();
  const page = pageParam ? parseInt(pageParam, 10) : undefined;
  const data = await getSearchPageData(storeCode, {
    query: searchValue,
    sort,
    page,
  });

  const { products, sortOptions, pagination } = data;
  const t = await getTranslations("search");

  return (
    <div className="flex flex-col gap-8 text-black md:flex-row dark:text-white">
      <div className="min-h-screen w-full">
        {searchValue ? (
          <p className="mb-4">
            {pagination.totalResults === 0
              ? t("noResults")
              : t("showingResults", { count: pagination.totalResults })}
            <span className="font-bold">&quot;{searchValue}&quot;</span>
          </p>
        ) : null}
        {products.length > 0 ? (
          <>
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={products} />
            </Grid>
            <Suspense fallback={null}>
              <Pagination pagination={pagination} />
            </Suspense>
          </>
        ) : null}
      </div>
      <div className="flex-none md:w-[125px]">
        <FilterList list={sortOptions} title={t("sortBy")} />
      </div>
    </div>
  );
}
