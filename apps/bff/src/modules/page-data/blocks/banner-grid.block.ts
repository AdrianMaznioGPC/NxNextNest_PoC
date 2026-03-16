import type { CmsRawBannerGrid } from "../../../ports/cms.types";
import { registerBlockResolver } from "../block-resolver-registry";

registerBlockResolver("banner-grid", async (raw: CmsRawBannerGrid) => ({
  type: "banner-grid" as const,
  id: raw.id,
  columns: raw.columns,
  banners: raw.banners,
}));
