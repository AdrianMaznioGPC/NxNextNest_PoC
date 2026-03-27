import Breadcrumbs from "./breadcrumbs";
import type { ListingPageHeaderProps } from "./listing-page-header.types";

/**
 * ListingPageHeader - Unified header component for listing pages
 *
 * Encapsulates the standard header pattern used across:
 * - Category product pages (PLP)
 * - Search results pages
 * - Category list pages
 * - All listing page variants
 *
 * Prevents code duplication and ensures consistent structure:
 * - Breadcrumbs for navigation context
 * - Page title (h1, 3xl, font-bold, text-black)
 * - Optional description or summaryText (text-neutral-500)
 * - Optional children slot for banners/alerts
 *
 * @example
 * <ListingPageHeader
 *   breadcrumbs={[
 *     { title: "Home", path: "/" },
 *     { title: "Brakes", path: "/categories/brakes" }
 *   ]}
 *   title="Brake Pads"
 *   description="High-quality brake pads for all vehicles"
 * />
 *
 * @example With summary text (dynamic content)
 * <ListingPageHeader
 *   breadcrumbs={breadcrumbs}
 *   title="Search Results"
 *   summaryText="Found 42 results for 'brake pads'"
 * />
 *
 * @example With banner
 * <ListingPageHeader
 *   breadcrumbs={breadcrumbs}
 *   title="Clearance Items"
 *   description="Limited time offers"
 * >
 *   <div className="rounded bg-red-100 p-4">
 *     <p>Flash sale ends in 2 hours!</p>
 *   </div>
 * </ListingPageHeader>
 */
export function ListingPageHeader({
  breadcrumbs,
  title,
  description,
  summaryText,
  children,
}: ListingPageHeaderProps) {
  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        {summaryText ? (
          <p className="mt-2 text-neutral-500">{summaryText}</p>
        ) : description ? (
          <p className="mt-2 text-neutral-500">{description}</p>
        ) : null}
      </div>
      {children}
    </>
  );
}
