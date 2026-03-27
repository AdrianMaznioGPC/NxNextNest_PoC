import type { SortOption } from "@commerce/shared-types";
import Container from "components/layout/container";
import { FilterSidebar } from "components/layout/filter-sidebar";
import { ListingToolbar } from "components/layout/listing-toolbar";
import { ProductListing } from "components/layout/product-listing";
import type { SlotRenderer } from "../../../slot-types";

const SEARCH_SORT_OPTIONS: SortOption[] = [
  { title: "Relevance", slug: null, sortKey: "RELEVANCE", reverse: false },
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  {
    title: "Price: Low to High",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "Price: High to Low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
  {
    title: "Newest",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
];

const SearchProductsListSlot: SlotRenderer<"page.search-products"> = ({
  products,
  sortOptions = SEARCH_SORT_OPTIONS,
  filterGroups,
}) => {
  return (
    <Container className="pb-8">
      {products.length > 0 ? (
        <div className="flex gap-6">
          <FilterSidebar filterGroups={filterGroups} />
          <div className="flex-1">
            <ListingToolbar
              sortOptions={sortOptions}
              resultsCount={products.length}
              showViewToggle={true}
              layoutKey="list"
            />
            <ProductListing products={products} defaultView="list" />
          </div>
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-neutral-700">
          No products found.
        </p>
      )}
    </Container>
  );
};

export default SearchProductsListSlot;
