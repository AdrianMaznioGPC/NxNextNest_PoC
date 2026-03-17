import { Injectable } from "@nestjs/common";
import { I18nService } from "../../i18n/i18n.service";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class CartPageAssembler implements PageAssembler {
  readonly routeKind = "cart" as const;

  constructor(private readonly i18n: I18nService) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult> {
    const locale = ctx.localeContext.locale;
    return {
      assemblerKey: "cart.v1",
      seo: {
        title: this.i18n.t(locale, "page.cartTitle"),
        description: this.i18n.t(locale, "page.cartDescription"),
        robots: {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        },
      },
      content: [
        {
          type: "cart-page",
          title: this.i18n.t(locale, "page.cartTitle"),
          description: this.i18n.t(locale, "page.cartDescription"),
        },
      ],
      revalidateTags: ["cart"],
    };
  }
}
