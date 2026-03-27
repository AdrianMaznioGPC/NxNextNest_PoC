import type { SortOption } from "@commerce/shared-types";
import { SortDropdown } from "./sort-dropdown";
import { ViewToggle } from "./view-toggle";

type ListingToolbarProps = {
  sortOptions: SortOption[];
  layoutKey?: string;
  showViewToggle?: boolean;
  resultsCount?: number;
};

export function ListingToolbar({
  sortOptions,
  layoutKey,
  showViewToggle = true,
  resultsCount,
}: ListingToolbarProps) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
      <div className="text-sm text-neutral-600">
        {resultsCount !== undefined && (
          <span>
            {resultsCount} {resultsCount === 1 ? "product" : "products"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <SortDropdown options={sortOptions} />
        {showViewToggle && (
          <ViewToggle defaultView={layoutKey === "list" ? "list" : "grid"} />
        )}
      </div>
    </div>
  );
}
