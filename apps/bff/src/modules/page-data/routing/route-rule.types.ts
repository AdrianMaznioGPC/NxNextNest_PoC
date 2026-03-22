import type { LocaleContext } from "@commerce/shared-types";

export type RouteKind =
  | "home"
  | "search"
  | "cart"
  | "checkout"
  | "category-list"
  | "category-detail"
  | "product-detail"
  | "content-page"
  | "unknown";

export type RouteRuleId =
  | "home"
  | "search"
  | "cart"
  | "checkout"
  | "product-detail"
  | "category-list"
  | "category-detail"
  | "content-page"
  | "unknown";

export type ResolvedRouteDescriptor = {
  routeKind: RouteKind;
  requestedPath: string;
  resolvedPath: string;
  canonicalPath: string;
  status: 200 | 301 | 404;
  redirectTo?: string;
  refs: {
    productHandle?: string;
    categoryKey?: string;
    pageHandle?: string;
  };
  matchedRuleId: RouteRuleId;
  localeContext: LocaleContext;
};
