import { Injectable } from "@nestjs/common";
import type { RouteKind } from "../routing/route-rule.types";
import { CategoryDetailPageAssembler } from "./category-detail-page.assembler";
import { CategoryListPageAssembler } from "./category-list-page.assembler";
import { CartPageAssembler } from "./cart-page.assembler";
import { ContentPageAssembler } from "./content-page.assembler";
import { HomePageAssembler } from "./home-page.assembler";
import type { PageAssembler } from "./page-assembler.interface";
import { ProductDetailPageAssembler } from "./product-detail-page.assembler";
import { SearchPageAssembler } from "./search-page.assembler";

@Injectable()
export class PageAssemblerRegistry {
  private readonly byRouteKind: Record<string, PageAssembler>;

  constructor(
    home: HomePageAssembler,
    categoryList: CategoryListPageAssembler,
    categoryDetail: CategoryDetailPageAssembler,
    cart: CartPageAssembler,
    productDetail: ProductDetailPageAssembler,
    search: SearchPageAssembler,
    content: ContentPageAssembler,
  ) {
    this.byRouteKind = {
      [home.routeKind]: home,
      [categoryList.routeKind]: categoryList,
      [categoryDetail.routeKind]: categoryDetail,
      [cart.routeKind]: cart,
      [productDetail.routeKind]: productDetail,
      [search.routeKind]: search,
      [content.routeKind]: content,
    };
  }

  getAssembler(routeKind: RouteKind): PageAssembler | undefined {
    if (routeKind === "unknown") return undefined;
    return this.byRouteKind[routeKind];
  }
}
