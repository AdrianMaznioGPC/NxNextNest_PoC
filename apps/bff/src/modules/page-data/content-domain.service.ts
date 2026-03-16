import type { CmsBlock, HomePageData } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { CMS_PORT, type CmsPort } from "../../ports/cms.port";
import type { CollectionPort } from "../../ports/collection.port";
import { COLLECTION_PORT } from "../../ports/collection.port";
import type { NavigationPort } from "../../ports/navigation.port";
import { NAVIGATION_PORT } from "../../ports/navigation.port";
import type { ProductPort } from "../../ports/product.port";
import { PRODUCT_PORT } from "../../ports/product.port";
import { resolveBlocks } from "./block-resolver-registry";
import "./blocks";

@Injectable()
export class ContentDomainService {
  constructor(
    @Inject(CMS_PORT) private readonly cms: CmsPort,
    @Inject(PRODUCT_PORT) private readonly products: ProductPort,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
    @Inject(NAVIGATION_PORT) private readonly navigation: NavigationPort,
  ) {}

  async getHomePage(): Promise<HomePageData> {
    const cmsPage = await this.cms.getPage("home");
    const rawBlocks = cmsPage?.blocks ?? [];

    const blocks = await resolveBlocks(rawBlocks, {
      products: this.products,
      collections: this.collections,
      navigation: this.navigation,
    });

    return { blocks };
  }

  async getPageBlocks(slug: string): Promise<CmsBlock[]> {
    const cmsPage = await this.cms.getPage(slug);
    if (!cmsPage) return [];

    return resolveBlocks(cmsPage.blocks, {
      products: this.products,
      collections: this.collections,
      navigation: this.navigation,
    });
  }
}
