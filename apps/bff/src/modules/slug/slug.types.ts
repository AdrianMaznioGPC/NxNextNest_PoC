import type { LocaleContext } from "@commerce/shared-types";

export type RouteKind =
  | "home"
  | "search"
  | "cart"
  | "checkout"
  | "category-list"
  | "category-detail"
  | "product-detail"
  | "content-page";

export type ResolvedIncomingRoute = {
  kind: RouteKind | "unknown";
  requestedPath: string;
  resolvedPath: string;
  canonicalPath: string;
  localeContext: LocaleContext;
  status: 200 | 301 | 404;
  redirectTo?: string;
  productHandle?: string;
  categoryKey?: string;
  pageHandle?: string;
};

export type StaticRoutes = {
  home: string;
  search: string;
  categoryList: string;
  cart: string;
  checkout: string;
};

export type StaticRouteSegments = {
  search: string;
  product: string;
  categories: string;
  cart: string;
  checkout: string;
};
