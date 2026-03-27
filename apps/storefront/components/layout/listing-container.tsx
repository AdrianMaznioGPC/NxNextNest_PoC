import type {
  FilterGroup,
  Product,
  SortOption,
  ViewMode,
} from "@commerce/shared-types";
import { FilterSidebar } from "./filter-sidebar";
import { ListingContainerSkeleton } from "./listing-container-skeleton";
import { ListingToolbar } from "./listing-toolbar";
import { ProductListing } from "./product-listing";

export type ListingContainerProps = {
  products: Product[];
  sortOptions: SortOption[];
  filterGroups?: FilterGroup[];
  defaultView?: ViewMode;
  layoutKey?: string;
  showViewToggle?: boolean;
  emptyMessage?: string;
  isLoading?: boolean;
};

/**
 * ListingContainer - Unified container for product listing pages
 *
 * Encapsulates the standard layout pattern:
 * - FilterSidebar (left, optional)
 * - ListingToolbar (top of main content area)
 * - ProductListing (main content area)
 *
 * Used by:
 * - Category product pages (PLP)
 * - Search results pages
 * - All listing page variants
 *
 * @example
 * <ListingContainer
 *   products={products}
 *   sortOptions={sortOptions}
 *   filterGroups={filterGroups}
 *   defaultView="grid"
 *   showViewToggle={true}
 *   isLoading={false}
 * />
 */
export function ListingContainer({
  products,
  sortOptions,
  filterGroups,
  defaultView = "grid",
  layoutKey,
  showViewToggle = true,
  emptyMessage = "No products found",
  isLoading = false,
}: ListingContainerProps) {
  if (isLoading) {
    return (
      <ListingContainerSkeleton
        showFilters={!!filterGroups?.length}
        showViewToggle={showViewToggle}
      />
    );
  }

  return (
    <div className="flex gap-6">
      <FilterSidebar filterGroups={filterGroups} />
      <div className="flex-1">
        <ListingToolbar
          sortOptions={sortOptions}
          layoutKey={layoutKey}
          showViewToggle={showViewToggle}
          resultsCount={products.length}
        />

        {!products.length ? (
          <p className="py-3 text-lg">{emptyMessage}</p>
        ) : (
          <ProductListing products={products} defaultView={defaultView} />
        )}
      </div>
    </div>
  );
}
