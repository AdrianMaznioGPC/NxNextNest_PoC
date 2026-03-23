import type {
  Collection,
  LocaleContext,
  Product,
} from "@commerce/shared-types";

export interface CollectionPort {
  getCollections(localeContext?: LocaleContext): Promise<Collection[]>;

  getCollection(
    handle: string,
    localeContext?: LocaleContext,
  ): Promise<Collection | undefined>;

  getCollectionByPath(
    slugs: string[],
    localeContext?: LocaleContext,
  ): Promise<Collection | undefined>;

  getCollectionProducts(
    params: {
      collection: string;
      reverse?: boolean;
      sortKey?: string;
    },
    localeContext?: LocaleContext,
  ): Promise<Product[]>;
}

export const COLLECTION_PORT = Symbol("COLLECTION_PORT");
