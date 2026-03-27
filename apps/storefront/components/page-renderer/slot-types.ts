import type {
  Breadcrumb,
  CheckoutHeaderSlotProps,
  CheckoutMainSlotProps,
  CheckoutSummarySlotProps,
  ExperienceRendererKey,
  PageContentNode,
  Product,
  SortOption,
} from "lib/types";
import type { ReactNode } from "react";

export type SlotRendererKey = ExperienceRendererKey;

export type SlotPropsMap = {
  "page.home": Omit<Extract<PageContentNode, { type: "home" }>, "type">;
  "page.category-list": Omit<
    Extract<PageContentNode, { type: "category-list" }>,
    "type"
  >;
  "page.category-subcollections": Omit<
    Extract<PageContentNode, { type: "category-subcollections" }>,
    "type"
  >;
  "page.category-products": Omit<
    Extract<PageContentNode, { type: "category-products" }>,
    "type"
  >;
  "page.product-detail": Omit<
    Extract<PageContentNode, { type: "product-detail" }>,
    "type"
  >;
  "page.pdp-main": {
    product: Product;
    breadcrumbs: Breadcrumb[];
    containerClassName?: string;
  };
  "page.pdp-recommendations": {
    products: Product[];
  };
  "page.pdp-reviews": {
    reviews: Array<{
      id: string;
      author: string;
      rating: number;
      title: string;
      body: string;
    }>;
  };
  "page.pdp-faq": {
    items: Array<{
      q: string;
      a: string;
    }>;
  };
  "page.search-summary": {
    query: string;
    summaryText?: string;
    sortOptions: SortOption[];
    containerClassName?: string;
  };
  "page.search-products": {
    products: Product[];
    sortOptions?: SortOption[];
    filterGroups?: import("@commerce/shared-types").FilterGroup[];
  };
  "page.search-results": Omit<
    Extract<PageContentNode, { type: "search-results" }>,
    "type"
  >;
  "page.content-page": Omit<
    Extract<PageContentNode, { type: "content-page" }>,
    "type"
  >;
  "page.cart": Omit<Extract<PageContentNode, { type: "cart-page" }>, "type">;
  "page.checkout-header": CheckoutHeaderSlotProps;
  "page.checkout-main": CheckoutMainSlotProps;
  "page.checkout-summary": CheckoutSummarySlotProps;
};

export type SlotRenderer<K extends SlotRendererKey> = (
  props: SlotPropsMap[K],
) => ReactNode;
