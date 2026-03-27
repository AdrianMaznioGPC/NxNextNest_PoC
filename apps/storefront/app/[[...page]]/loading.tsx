import Container from "components/layout/container";
import { ListingContainerSkeleton } from "components/layout/listing-container-skeleton";

/**
 * Loading state for dynamic pages
 *
 * This provides a skeleton UI for listing pages (search, category, etc.)
 * while the page data is being fetched.
 */
export default function DynamicPageLoading() {
  return (
    <Container className="pb-8 pt-6">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-muted-surface" />
        <div className="h-4 w-1 animate-pulse rounded bg-muted-surface" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted-surface" />
      </div>

      {/* Page title skeleton */}
      <div className="mb-8">
        <div className="mb-3 h-9 w-48 animate-pulse rounded bg-muted-surface" />
        <div className="h-5 w-96 animate-pulse rounded bg-muted-surface" />
      </div>

      {/* Listing container skeleton */}
      <ListingContainerSkeleton />
    </Container>
  );
}
