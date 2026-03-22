import type { Cart, LocaleContext, Money } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { localizeCartLineMerchandise } from "../../../adapters/mock/mock-commerce-localization";
import { CART_PORT, type CartPort } from "../../../ports/cart.port";
import { CHECKOUT_PORT, type CheckoutPort } from "../../../ports/checkout.port";
import { ExperienceProfileService } from "../../experience/experience-profile.service";
import { I18nService } from "../../i18n/i18n.service";
import { SlugService } from "../../slug/slug.service";
import { getCartCookieConfig, readCookie } from "../../cart/cart-cookie.config";
import type {
  PageAssembler,
  PageAssemblyContext,
  PageAssemblyResult,
} from "./page-assembler.interface";

@Injectable()
export class CheckoutPageAssembler implements PageAssembler {
  readonly routeKind = "checkout" as const;
  private readonly cartCookie = getCartCookieConfig();

  constructor(
    @Inject(CART_PORT) private readonly cart: CartPort,
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
    private readonly experienceProfiles: ExperienceProfileService,
  ) {}

  async assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult | null> {
    const cart = await this.getCurrentCart(ctx.cookieHeader, ctx.localeContext);
    if (!cart || cart.lines.length === 0) {
      return null;
    }

    const storeContext = this.experienceProfiles.resolveStoreContext(ctx.localeContext);
    const config = await this.checkout.getCheckoutConfig(storeContext.storeKey);
    const title =
      config.flowType === "express"
        ? this.i18n.t(ctx.localeContext.locale, "checkout.expressTitle")
        : this.i18n.t(ctx.localeContext.locale, "checkout.title");
    const initialShippingCost =
      config.deliveryOptions[0]?.price ?? fallbackMoney(cart.cost.totalAmount.currencyCode);

    return {
      assemblerKey: "checkout.v1",
      seo: {
        title,
        description: title,
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
          type: "checkout-page",
          title,
          cart,
          config,
          initialShippingCost,
        },
      ],
      revalidateTags: ["cart", `checkout:${storeContext.storeKey}`],
    };
  }

  private async getCurrentCart(
    cookieHeader: string | undefined,
    localeContext: LocaleContext,
  ): Promise<Cart | undefined> {
    const cartId = readCookie(cookieHeader, this.cartCookie.name);
    if (!cartId) {
      return undefined;
    }

    const cart = await this.cart.getCart(cartId);
    if (!cart) {
      return undefined;
    }

    return localizeCart(cart, localeContext, this.slug);
  }
}

function localizeCart(cart: Cart, localeContext: LocaleContext, slug: SlugService): Cart {
  return {
    ...cart,
    lines: cart.lines.map((line) => {
      const localized = localizeCartLineMerchandise(
        {
          productHandle: line.merchandise.product.handle,
          productTitle: line.merchandise.product.title,
          merchandiseId: line.merchandise.id,
          merchandiseTitle: line.merchandise.title,
          selectedOptions: line.merchandise.selectedOptions,
        },
        localeContext,
      );

      return {
        ...line,
        merchandise: {
          ...line.merchandise,
          title: localized.value.merchandiseTitle,
          selectedOptions: localized.value.selectedOptions,
          product: {
            ...line.merchandise.product,
            title: localized.value.productTitle,
            path: slug.buildProductPath(localeContext, line.merchandise.product.handle),
          },
        },
      };
    }),
  };
}

function fallbackMoney(currencyCode: string | undefined): Money {
  return {
    amount: "0.00",
    currencyCode: currencyCode ?? "USD",
  };
}
