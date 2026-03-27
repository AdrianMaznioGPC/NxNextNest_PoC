import type { SortOption } from "@commerce/shared-types";
import Container from "components/layout/container";
import { FilterSidebar } from "components/layout/filter-sidebar";
import { ListingToolbar } from "components/layout/listing-toolbar";
import { ProductListing } from "components/layout/product-listing";
import type { SlotRenderer } from "../../../slot-types";

const CLEARANCE_SORT_OPTIONS: SortOption[] = [
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
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  },
  {
    title: "Newest",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
];

const SearchProductsClearanceSlot: SlotRenderer<"page.search-products"> = ({
  products,
  sortOptions = CLEARANCE_SORT_OPTIONS,
  filterGroups,
}) => {
  return (
    <Container className="pb-8">
      {/* Clearance banner */}
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
        <p className="text-sm font-medium text-red-900">
          Clearance Sale - Limited Stock
        </p>
      </div>

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
          No clearance products available.
        </p>
      )}
    </Container>
  );
};

export default SearchProductsClearanceSlot;
