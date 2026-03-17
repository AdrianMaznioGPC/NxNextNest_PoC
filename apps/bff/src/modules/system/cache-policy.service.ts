import { Injectable } from "@nestjs/common";

export interface CacheHints {
  maxAgeSeconds: number;
  staleWhileRevalidateSeconds: number;
  visibility?: "public" | "private";
  noStore?: boolean;
}

export const CACHE_ROUTE_KIND_KEY = "cacheRouteKind";

const ROUTE_CACHE_MAP: Record<string, CacheHints> = {
  layout: { maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300 },
  home: { maxAgeSeconds: 30, staleWhileRevalidateSeconds: 120 },
  "category-list": { maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300 },
  "category-detail": { maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300 },
  "product-detail": { maxAgeSeconds: 45, staleWhileRevalidateSeconds: 180 },
  search: { maxAgeSeconds: 15, staleWhileRevalidateSeconds: 60 },
  pages: { maxAgeSeconds: 120, staleWhileRevalidateSeconds: 600 },
  menus: { maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300 },
  sitemap: { maxAgeSeconds: 300, staleWhileRevalidateSeconds: 600 },
  cart: {
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    visibility: "private",
    noStore: true,
  },
  checkout: {
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    visibility: "private",
    noStore: true,
  },
  customers: {
    maxAgeSeconds: 0,
    staleWhileRevalidateSeconds: 0,
    visibility: "private",
    noStore: true,
  },
};

const DEFAULT_HINTS: CacheHints = {
  maxAgeSeconds: 30,
  staleWhileRevalidateSeconds: 120,
};

const NOT_FOUND_HINTS: CacheHints = {
  maxAgeSeconds: 15,
  staleWhileRevalidateSeconds: 60,
};

@Injectable()
export class CachePolicyService {
  getCacheHints(routeKind: string | undefined, status: number): CacheHints {
    if (status === 404) return NOT_FOUND_HINTS;
    if (!routeKind) return DEFAULT_HINTS;
    return ROUTE_CACHE_MAP[routeKind] ?? DEFAULT_HINTS;
  }

  toCacheControlHeader(hints: CacheHints): string {
    const visibility = hints.visibility ?? "public";
    if (hints.noStore) {
      return `${visibility}, no-store`;
    }
    return `${visibility}, max-age=${hints.maxAgeSeconds}, stale-while-revalidate=${hints.staleWhileRevalidateSeconds}`;
  }
}
