import type { FilterDefinition, PaginationMeta, SortOption } from "lib/types";
import { Suspense } from "react";
import MobileFilterDrawer from "./mobile-filter-drawer";
import FilterList from "./search/filter";
import ViewToggle, { type ViewMode } from "./view-toggle";

interface CategoryHeaderProps {
  title: string;
  description?: string;
  pagination?: PaginationMeta;
  sortOptions?: SortOption[];
  filters?: FilterDefinition[];
  activeFilters?: Record<string, string[]>;
  sortLabel: string;
  filterLabel: string;
  productCountLabel: string;
  view?: ViewMode;
}

export default function CategoryHeader({
  title,
  description,
  pagination,
  sortOptions,
  filters,
  activeFilters,
  sortLabel,
  filterLabel,
  productCountLabel,
  view = "grid",
}: CategoryHeaderProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white md:text-3xl">
        {title}
      </h1>
      {description && (
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}

      {/* Toolbar */}
      <div className="mt-4 flex items-center justify-between gap-4">
        {/* Left: product count + mobile filter button */}
        <div className="flex items-center gap-3">
          {pagination && (
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {productCountLabel}
            </p>
          )}

          {/* Mobile filter button */}
          {filters && filters.length > 0 && (
            <div className="lg:hidden">
              <Suspense fallback={null}>
                <MobileFilterDrawer
                  filters={filters}
                  activeFilters={activeFilters}
                  label={filterLabel}
                />
              </Suspense>
            </div>
          )}
        </div>

        {/* Right: sort + view toggle */}
        <div className="flex items-center gap-3">
          <div className="w-[200px]">
            {sortOptions && <FilterList list={sortOptions} title={sortLabel} />}
          </div>
          <Suspense fallback={null}>
            <ViewToggle activeView={view} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
