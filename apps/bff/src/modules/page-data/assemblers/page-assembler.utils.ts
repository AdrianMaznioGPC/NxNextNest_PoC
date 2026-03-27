import type {
  FilterGroup,
  Page,
  PageSeo,
  Product,
  SortOption,
} from "@commerce/shared-types";
import { I18nService } from "../../i18n/i18n.service";

const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";

export function getSorting(query: Record<string, string | undefined>): {
  sortKey?: string;
  reverse?: boolean;
} {
  const explicitSortKey = query.sortKey;
  const explicitReverse = parseBoolean(query.reverse);

  if (explicitSortKey !== undefined || explicitReverse !== undefined) {
    return {
      sortKey: explicitSortKey,
      reverse: explicitReverse,
    };
  }

  switch (query.sort) {
    case "trending-desc":
      return { sortKey: "BEST_SELLING", reverse: false };
    case "latest-desc":
      return { sortKey: "CREATED_AT", reverse: true };
    case "price-asc":
      return { sortKey: "PRICE", reverse: false };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true };
    default:
      return { sortKey: undefined, reverse: false };
  }
}

export function buildSearchSummary(
  query: string,
  totalResults: number,
  locale: string,
  i18n: I18nService,
): string | undefined {
  if (!query) return undefined;
  if (totalResults === 0) {
    return i18n.t(locale, "search.noResults", { query });
  }
  const resultsWord =
    totalResults > 1
      ? i18n.t(locale, "search.results")
      : i18n.t(locale, "search.result");
  return i18n.t(locale, "search.showing", {
    totalResults,
    resultsWord,
    query,
  });
}

export function buildSortOptions(
  locale: string,
  i18n: I18nService,
): SortOption[] {
  return [
    {
      title: i18n.t(locale, "sort.relevance"),
      slug: null,
      sortKey: "RELEVANCE",
      reverse: false,
    },
    {
      title: i18n.t(locale, "sort.trending"),
      slug: "trending-desc",
      sortKey: "BEST_SELLING",
      reverse: false,
    },
    {
      title: i18n.t(locale, "sort.latestArrivals"),
      slug: "latest-desc",
      sortKey: "CREATED_AT",
      reverse: true,
    },
    {
      title: i18n.t(locale, "sort.priceLowToHigh"),
      slug: "price-asc",
      sortKey: "PRICE",
      reverse: false,
    },
    {
      title: i18n.t(locale, "sort.priceHighToLow"),
      slug: "price-desc",
      sortKey: "PRICE",
      reverse: true,
    },
  ];
}

export function buildProductSeo(product: Product): PageSeo {
  const image = product.featuredImage;
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: image
      ? {
          images: [
            {
              url: image.url,
              width: image.width,
              height: image.height,
              alt: image.altText,
            },
          ],
        }
      : undefined,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: image?.url,
      offers: {
        "@type": "AggregateOffer",
        availability: product.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        priceCurrency: product.priceRange.minVariantPrice.currencyCode,
        highPrice: product.priceRange.maxVariantPrice.amount,
        lowPrice: product.priceRange.minVariantPrice.amount,
      },
    },
  };
}

export function buildContentPageSeo(page: Page): PageSeo {
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      type: "article",
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
    },
  };
}

function parseBoolean(raw: string | undefined): boolean | undefined {
  if (raw === undefined) return undefined;
  if (raw === "true") return true;
  if (raw === "false") return false;
  return undefined;
}

/**
 * Build filter groups for product listings
 * Generates availability and price range filters based on products
 */
export function buildFilterGroups(
  products: Product[],
  locale: string,
  i18n: I18nService,
): FilterGroup[] {
  const filters: FilterGroup[] = [];

  // Availability filter
  filters.push({
    id: "availability",
    title: i18n.t(locale, "filter.availability") || "Availability",
    type: "toggle",
    options: [
      {
        id: "in-stock",
        label: i18n.t(locale, "filter.inStock") || "In Stock",
        value: "true",
      },
    ],
  });

  // Price range filter
  // Calculate price ranges based on actual product prices
  const prices = products
    .map((p) => parseFloat(p.priceRange.maxVariantPrice.amount))
    .filter((p) => !isNaN(p));

  if (prices.length > 0) {
    const currencySymbol = getCurrencySymbol(
      products[0]?.priceRange.maxVariantPrice.currencyCode,
    );

    // Create 4 ranges dynamically
    const ranges = [
      {
        id: "p1",
        label:
          i18n.t(locale, "filter.priceUnder50") || `Under ${currencySymbol}50`,
        value: "0-50",
        count: prices.filter((p) => p < 50).length,
      },
      {
        id: "p2",
        label:
          i18n.t(locale, "filter.price50to100") ||
          `${currencySymbol}50 - ${currencySymbol}100`,
        value: "50-100",
        count: prices.filter((p) => p >= 50 && p < 100).length,
      },
      {
        id: "p3",
        label:
          i18n.t(locale, "filter.price100to200") ||
          `${currencySymbol}100 - ${currencySymbol}200`,
        value: "100-200",
        count: prices.filter((p) => p >= 100 && p < 200).length,
      },
      {
        id: "p4",
        label:
          i18n.t(locale, "filter.priceOver200") || `Over ${currencySymbol}200`,
        value: "200-",
        count: prices.filter((p) => p >= 200).length,
      },
    ];

    // Only include ranges with products
    const activeRanges = ranges.filter((r) => r.count > 0);

    if (activeRanges.length > 0) {
      filters.push({
        id: "price",
        title: i18n.t(locale, "filter.priceRange") || "Price Range",
        type: "checkbox",
        options: activeRanges,
      });
    }
  }

  return filters;
}

function getCurrencySymbol(currencyCode?: string): string {
  const symbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  return symbols[currencyCode || "USD"] || "$";
}
