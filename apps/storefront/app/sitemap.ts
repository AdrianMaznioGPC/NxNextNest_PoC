import { getSitemapData, getStoreCode } from "lib/api";
import { baseUrl } from "lib/utils";
import { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const storeCode = await getStoreCode();
  const { entries } = await getSitemapData(storeCode, baseUrl);

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified,
  }));
}
