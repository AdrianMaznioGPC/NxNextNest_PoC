import type { CmsBlock, HomePageData } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { CMS_PORT, type CmsPort } from "../../ports/cms.port";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";
import {
  NAVIGATION_PORT,
  type NavigationPort,
} from "../../ports/navigation.port";
import { CatalogDomainService } from "../collection/catalog-domain.service";
import { ProductDomainService } from "../product/product-domain.service";
import { resolveBlocks } from "./block-resolver-registry";
import { registerAllBlockResolvers } from "./blocks";

registerAllBlockResolvers();

@Injectable()
export class ContentDomainService {
  constructor(
    @Inject(CMS_PORT) private readonly cms: CmsPort,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
    @Inject(NAVIGATION_PORT) private readonly navigation: NavigationPort,
    private readonly productDomain: ProductDomainService,
    private readonly catalogDomain: CatalogDomainService,
  ) {}

  private get resolverContext() {
    return {
      productDomain: this.productDomain,
      catalogDomain: this.catalogDomain,
      collections: this.collections,
      navigation: this.navigation,
    };
  }

  async getHomePage(): Promise<HomePageData> {
    const cmsPage = await this.cms.getPage("home");
    const rawBlocks = cmsPage?.blocks ?? [];
    const blocks = await resolveBlocks(rawBlocks, this.resolverContext);
    return { blocks };
  }

  async getPageBlocks(slug: string): Promise<CmsBlock[]> {
    const cmsPage = await this.cms.getPage(slug);
    if (!cmsPage) return [];
    return resolveBlocks(cmsPage.blocks, this.resolverContext);
  }
}
