import { getCollections, getPages, getProducts } from "lib/api";
import { getRequestLocaleContext } from "lib/i18n/request-context";
import { baseUrl } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeContext = await getRequestLocaleContext();
  const siteBaseUrl =
    localeContext.domain.startsWith("localhost") ||
    localeContext.domain.startsWith("127.0.0.1")
      ? baseUrl
      : `https://${localeContext.domain}`;
  const routesMap = [""].map((route) => ({
    url: `${siteBaseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const collectionsPromise = getCollections(localeContext).then((collections) =>
    collections.map((collection) => ({
      url: `${siteBaseUrl}${collection.path}`,
      lastModified: collection.updatedAt,
    })),
  );

  const productsPromise = getProducts({}, localeContext).then((products) =>
    products.map((product) => ({
      url: `${siteBaseUrl}${product.path}`,
      lastModified: product.updatedAt,
    })),
  );

  const pagesPromise = getPages(localeContext).then((pages) =>
    pages.map((page) => ({
      url: `${siteBaseUrl}${page.path}`,
      lastModified: page.updatedAt,
    })),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
