import type { Collection } from "@commerce/shared-types";
import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import {
  COLLECTION_PORT,
  type CollectionPort,
  type CollectionProductsResult,
} from "../../ports/collection.port";
import { CatalogDomainService } from "./catalog-domain.service";

@Controller("collections")
export class CollectionController {
  constructor(
    private readonly catalogDomain: CatalogDomainService,
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
  ) {}

  @Get()
  getCollections(): Promise<Collection[]> {
    return this.catalogDomain.getCollections();
  }

  @Get("by-path/*")
  getCollectionByPath(
    @Param("*") path: string,
  ): Promise<Collection | undefined> {
    const segments = path.split("/").filter(Boolean);
    return this.catalogDomain.getCollectionByPath(segments);
  }

  @Get(":id/products")
  getCollectionProducts(
    @Param("id") id: string,
    @Query("sort") sort?: string,
    @Query("page") page?: string,
    @Query("pageSize") pageSize?: string,
  ): Promise<CollectionProductsResult> {
    return this.collections.getCollectionProducts({
      collectionId: id,
      sort,
      page: page ? parseInt(page, 10) : undefined,
      pageSize: pageSize ? parseInt(pageSize, 10) : undefined,
    });
  }

  @Get(":handle")
  getCollection(
    @Param("handle") handle: string,
  ): Promise<Collection | undefined> {
    return this.catalogDomain.getCollection(handle);
  }
}
