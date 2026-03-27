export type ListingContainerSkeletonProps = {
  showFilters?: boolean;
  showViewToggle?: boolean;
};

/**
 * ListingContainerSkeleton - Loading state for product listing pages
 *
 * Provides skeleton UI while listing data is being fetched.
 * Maintains the same layout structure as ListingContainer.
 *
 * Can be used:
 * - As a standalone loading component in loading.tsx files
 * - Via the isLoading prop on ListingContainer
 *
 * @example
 * // In app/search/loading.tsx
 * import { ListingContainerSkeleton } from "components/layout/listing-container-skeleton";
 *
 * export default function SearchLoading() {
 *   return (
 *     <Container className="pb-8">
 *       <ListingContainerSkeleton />
 *     </Container>
 *   );
 * }
 */
export function ListingContainerSkeleton({
  showFilters = true,
  showViewToggle = true,
}: {
  showFilters?: boolean;
  showViewToggle?: boolean;
}) {
  return (
    <div className="flex gap-6">
      {showFilters && <FilterSidebarSkeleton />}
      <div className="flex-1">
        <ListingToolbarSkeleton showViewToggle={showViewToggle} />
        <ProductListingSkeleton />
      </div>
    </div>
  );
}

function FilterSidebarSkeleton() {
  return (
    <aside className="hidden w-64 flex-none border-r border-neutral-200 pr-6 lg:block">
      <div className="mb-4 h-7 w-20 animate-pulse rounded bg-muted-surface" />
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border-b border-neutral-100 pb-4">
            <div className="mb-3 h-5 w-24 animate-pulse rounded bg-muted-surface" />
            <div className="space-y-2">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded border border-neutral-300 bg-muted-surface" />
                  <div className="h-4 w-32 animate-pulse rounded bg-muted-surface" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

function ListingToolbarSkeleton({
  showViewToggle,
}: {
  showViewToggle: boolean;
}) {
  return (
    <div className="mb-6 flex items-center justify-between border-b border-neutral-200 pb-4">
      <div className="h-5 w-24 animate-pulse rounded bg-muted-surface" />
      <div className="flex items-center gap-3">
        <div className="h-9 w-32 animate-pulse rounded-md border border-neutral-300 bg-muted-surface" />
        {showViewToggle && (
          <div className="h-9 w-20 animate-pulse rounded-md border border-neutral-300 bg-muted-surface" />
        )}
      </div>
    </div>
  );
}

function ProductListingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white"
        >
          <div className="aspect-square animate-pulse bg-muted-surface" />
          <div className="p-4">
            <div className="mb-2 h-5 w-3/4 animate-pulse rounded bg-muted-surface" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}
