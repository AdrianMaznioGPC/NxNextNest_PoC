import type { Breadcrumb, Collection, Product } from "./commerce.types";
import type { CmsBlock } from "./cms.types";
import type { FeaturedLink, MegaMenuItem } from "./navigation.types";

export type HomePageData = {
  blocks: CmsBlock[];
};

export type CategoryListPageData = {
  collections: Collection[];
};

export type CategoryPageData = {
  collection: Collection;
  breadcrumbs: Breadcrumb[];
  subcollections?: Collection[];
  products?: Product[];
};

export type ProductPageData = {
  product: Product;
  breadcrumbs: Breadcrumb[];
  recommendations: Product[];
};

export type SearchPageData = {
  query: string;
  products: Product[];
  totalResults: number;
};

export type GlobalLayoutData = {
  megaMenu: MegaMenuItem[];
  featuredLinks: FeaturedLink[];
  routes: {
    home: string;
    search: string;
    categoryList: string;
    cart: string;
    checkout: string;
  };
};
