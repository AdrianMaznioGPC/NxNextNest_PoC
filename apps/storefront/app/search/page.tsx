import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getSearchPageData, getStoreCode } from "lib/api";
import { resolveSortFromSlug } from "lib/utils";
import { getTranslations } from "next-intl/server";

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };

  const storeCode = await getStoreCode();

  // First fetch without sort to get available sort options from BFF
  const initialData = await getSearchPageData(storeCode, {
    query: searchValue,
  });

  // Resolve the selected sort option using BFF-provided options
  const { sortKey, reverse } = resolveSortFromSlug(
    sort,
    initialData.sortOptions,
  );

  // Re-fetch with sort only if a non-default sort was selected
  const data =
    sortKey && sort
      ? await getSearchPageData(storeCode, {
          query: searchValue,
          sortKey,
          reverse,
        })
      : initialData;

  const { products, totalResults } = data;
  const t = await getTranslations("search");

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {totalResults === 0
            ? t("noResults")
            : t("showingResults", { count: totalResults })}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
