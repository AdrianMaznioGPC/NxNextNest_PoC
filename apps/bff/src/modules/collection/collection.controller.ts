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
  getCollections() {
    return this.catalogDomain.getCollections();
  }

  @Get("by-path/*")
  getCollectionByPath(
    @Param("*") path: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    const segments = path.split("/").filter(Boolean);

    if (segments.at(-1) === "products") {
      const collection = segments.slice(0, -1).join("/");
      return this.productDomain.getCollectionProducts({
        collection,
        sortKey,
        reverse: reverse === "true",
      });
    }

    return this.catalogDomain.getCollectionByPath(segments);
  }

  @Get(":handle/products")
  getCollectionProducts(
    @Param("handle") handle: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    return this.productDomain.getCollectionProducts({
      collection: handle,
      sortKey,
      reverse: reverse === "true",
    });
  }

  @Get(":handle")
  getCollection(@Param("handle") handle: string) {
    return this.catalogDomain.getCollection(handle);
  }
}
