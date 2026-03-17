import type { Page, PageSeo, Product, SortOption } from "@commerce/shared-types";
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

export function buildSortOptions(locale: string, i18n: I18nService): SortOption[] {
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

