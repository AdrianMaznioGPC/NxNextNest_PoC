import type { Breadcrumb } from "@commerce/shared-types";
import type { ReactNode } from "react";

/**
 * Props for the ListingPageHeader component
 *
 * Renders the standard header pattern for listing pages:
 * - Breadcrumbs navigation
 * - Page title (h1)
 * - Optional description or summary text
 * - Optional children slot for banners/alerts
 */
export type ListingPageHeaderProps = {
  /**
   * Breadcrumb navigation items
   */
  breadcrumbs: Breadcrumb[];

  /**
   * Page title (rendered as h1)
   */
  title: string;

  /**
   * Optional description text (static content)
   * Rendered below title if provided
   */
  description?: string;

  /**
   * Optional summary text (dynamic content like search results)
   * Rendered below title if provided (takes precedence over description)
   */
  summaryText?: string;

  /**
   * Optional children for banners, alerts, or other header content
   * Rendered after breadcrumbs + title + description block
   */
  children?: ReactNode;
};
