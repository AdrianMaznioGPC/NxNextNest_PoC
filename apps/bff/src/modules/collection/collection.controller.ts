import type { Collection, Product } from "@commerce/shared-types";
import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductDomainService } from "../product/product-domain.service";
import { CatalogDomainService } from "./catalog-domain.service";

@Controller("collections")
export class CollectionController {
  constructor(
    private readonly catalogDomain: CatalogDomainService,
    private readonly productDomain: ProductDomainService,
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
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ): Promise<Product[]> {
    return this.productDomain.getCollectionProducts({
      collection: id,
      sortKey,
      reverse: reverse === "true",
    });
  }

  @Get(":handle")
  getCollection(
    @Param("handle") handle: string,
  ): Promise<Collection | undefined> {
    return this.catalogDomain.getCollection(handle);
  }
}
