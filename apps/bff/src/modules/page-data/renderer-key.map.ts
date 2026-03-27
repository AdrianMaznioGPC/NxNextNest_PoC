import type {
  ExperienceRendererKey,
  PageContentNode,
} from "@commerce/shared-types";

export function rendererKeyForNode(
  type: PageContentNode["type"],
): ExperienceRendererKey {
  switch (type) {
    case "home":
      return "page.home";
    case "category-summary":
      return "page.category-summary";
    case "category-list":
      return "page.category-list";
    case "category-subcollections":
      return "page.category-subcollections";
    case "category-products":
      return "page.category-products";
    case "product-detail":
      return "page.product-detail";
    case "search-results":
      return "page.search-results";
    case "content-page":
      return "page.content-page";
    case "cart-page":
      return "page.cart";
    case "checkout-page":
      return "page.checkout-main";
  }
}
