import type { SortOption } from "@commerce/shared-types";
import Container from "components/layout/container";
import { ListingContainer } from "components/layout/listing-container";
import type { SlotRenderer } from "../slot-types";

// Mock sort options - will be replaced with BFF data later
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

const SearchProductsSlot: SlotRenderer<"page.search-products"> = ({
  products,
  sortOptions = SEARCH_SORT_OPTIONS,
  filterGroups,
}) => {
  return (
    <Container className="pb-8">
      <ListingContainer
        products={products}
        sortOptions={sortOptions}
        filterGroups={filterGroups}
        defaultView="grid"
        showViewToggle={true}
        emptyMessage="No products found."
      />
    </Container>
  );
};

export default SearchProductsSlot;
