import type { CmsRawBannerItem } from "../../../ports/cms.port";
import { registerBlockResolver } from "../block-resolver-registry";

export type CmsRawBannerGrid = {
  type: "banner-grid";
  id: string;
  columns: number;
  banners: CmsRawBannerItem[];
};

registerBlockResolver("banner-grid", async (raw: CmsRawBannerGrid) => ({
  type: "banner-grid" as const,
  id: raw.id,
  columns: raw.columns,
  banners: raw.banners,
}));
