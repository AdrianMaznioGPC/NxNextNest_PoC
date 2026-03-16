import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getSearchPageData, getStoreCode } from "lib/api";
import { defaultSort, sorting } from "lib/constants";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const storeCode = await getStoreCode();
  const { products, totalResults } = await getSearchPageData(storeCode, {
    query: searchValue,
    sortKey,
    reverse,
  });
  const resultsText = totalResults > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {totalResults === 0
            ? "There are no products that match "
            : `Showing ${totalResults} ${resultsText} for `}
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
