import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { COLLECTION_PORT, CollectionPort } from "../../ports/collection.port";

@Controller("collections")
export class CollectionController {
  constructor(
    @Inject(COLLECTION_PORT) private readonly collections: CollectionPort,
  ) {}

  @Get()
  getCollections() {
    return this.collections.getCollections();
  }

  @Get(":handle")
  getCollection(@Param("handle") handle: string) {
    return this.collections.getCollection(handle);
  }

  @Get(":handle/products")
  getCollectionProducts(
    @Param("handle") handle: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    return this.collections.getCollectionProducts({
      collection: handle,
      sortKey,
      reverse: reverse === "true",
    });
  }
}
