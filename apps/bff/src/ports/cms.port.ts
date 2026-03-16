import type { CmsRawPage } from "./cms.types";

export type { CmsRawPage } from "./cms.types";

export interface CmsPort {
  getPage(slug: string): Promise<CmsRawPage | undefined>;
}

export const CMS_PORT = Symbol("CMS_PORT");
