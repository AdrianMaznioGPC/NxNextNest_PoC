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

  @Get("by-path/*")
  getCollectionByPath(
    @Param("*") path: string,
    @Query("sortKey") sortKey?: string,
    @Query("reverse") reverse?: string,
  ) {
    const segments = path.split("/").filter(Boolean);

    // If path ends with /products, return products for that collection
    if (segments.at(-1) === "products") {
      const collection = segments.slice(0, -1).join("/");
      return this.collections.getCollectionProducts({
        collection,
        sortKey,
        reverse: reverse === "true",
      });
    }

    return this.collections.getCollectionByPath(segments);
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

  @Get(":handle")
  getCollection(@Param("handle") handle: string) {
    return this.collections.getCollection(handle);
  }
}
