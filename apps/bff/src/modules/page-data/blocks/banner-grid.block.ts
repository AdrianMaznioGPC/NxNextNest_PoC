import type { CmsRawBannerGrid } from "../../../ports/cms.types";
import type { BlockResolver } from "../block-resolver-registry";

export const bannerGridResolver: BlockResolver<CmsRawBannerGrid> = async (
  raw,
) => ({
  type: "banner-grid" as const,
  id: raw.id,
  columns: raw.columns,
  banners: raw.banners,
});
