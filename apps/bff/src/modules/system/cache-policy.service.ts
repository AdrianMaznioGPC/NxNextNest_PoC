import { Injectable } from "@nestjs/common";

export type CacheHints = {
  maxAgeSeconds: number;
  staleWhileRevalidateSeconds: number;
  visibility?: "public" | "private";
  noStore?: boolean;
};

@Injectable()
export class CachePolicyService {
  getBootstrapCacheHints(routeKind?: string, status?: number): CacheHints {
    if (status === 404) {
      return { maxAgeSeconds: 15, staleWhileRevalidateSeconds: 60 };
    }

    switch (routeKind) {
      case "home":
        return { maxAgeSeconds: 30, staleWhileRevalidateSeconds: 120 };
      case "search":
        return { maxAgeSeconds: 15, staleWhileRevalidateSeconds: 60 };
      case "cart":
        return {
          maxAgeSeconds: 0,
          staleWhileRevalidateSeconds: 0,
          visibility: "private",
          noStore: true,
        };
      case "product-detail":
        return { maxAgeSeconds: 45, staleWhileRevalidateSeconds: 180 };
      case "category-list":
      case "category-detail":
        return { maxAgeSeconds: 60, staleWhileRevalidateSeconds: 300 };
      case "content-page":
        return { maxAgeSeconds: 120, staleWhileRevalidateSeconds: 600 };
      default:
        return { maxAgeSeconds: 30, staleWhileRevalidateSeconds: 120 };
    }
  }

  getSlotCacheHints(staleAfterSeconds: number): CacheHints {
    const maxAgeSeconds = Math.min(staleAfterSeconds, 60);
    return {
      maxAgeSeconds,
      staleWhileRevalidateSeconds: staleAfterSeconds,
    };
  }

  toCacheControl(hints: CacheHints): string {
    const visibility = hints.visibility ?? "public";
    if (hints.noStore) {
      return `${visibility}, no-store`;
    }
    return `${visibility}, max-age=${hints.maxAgeSeconds}, stale-while-revalidate=${hints.staleWhileRevalidateSeconds}`;
  }
}
