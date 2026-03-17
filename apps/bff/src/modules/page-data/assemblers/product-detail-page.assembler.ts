import { Injectable } from "@nestjs/common";
import { PageDataService } from "../page-data.service";
import { buildProductSeo } from "./page-assembler.utils";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class ProductDetailPageAssembler implements PageAssembler {
  readonly routeKind = "product-detail" as const;

  constructor(private readonly pageData: PageDataService) {}

  async assemble(
    ctx: PageAssemblyContext,
  ): Promise<PageAssemblyResult | null> {
    const productHandle = ctx.route.refs.productHandle;
    if (!productHandle) return null;

    const payload = await this.pageData.getProductPage(
      productHandle,
      ctx.localeContext,
    );
    if (!payload) return null;

    return {
      assemblerKey: "product-detail.v1",
      seo: buildProductSeo(payload.product),
      content: [
        {
          type: "product-detail",
          product: payload.product,
          breadcrumbs: payload.breadcrumbs,
          recommendations: payload.recommendations,
        },
      ],
      revalidateTags: ["products"],
    };
  }
}

