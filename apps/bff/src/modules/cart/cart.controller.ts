import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import type { Cart, LocaleContext } from "@commerce/shared-types";
import { randomUUID } from "node:crypto";
import type { FastifyReply } from "fastify";
import { localizeCartLineMerchandise } from "../../adapters/mock/mock-commerce-localization";
import { CART_PORT, CartPort } from "../../ports/cart.port";
import { I18nService } from "../i18n/i18n.service";
import { SlugService } from "../slug/slug.service";
import {
  getCartCookieConfig,
  readCookie,
  serializeCartCookie,
  serializeExpiredCartCookie,
} from "./cart-cookie.config";

@Controller("cart")
export class CartController {
  private readonly logger = new Logger(CartController.name);
  private readonly cartCookie = getCartCookieConfig();

  constructor(
    @Inject(CART_PORT) private readonly cart: CartPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
  ) {}

  @Post()
  createCart() {
    return this.cart.createCart();
  }

  @Post("current")
  async createOrGetCurrentCart(
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const requestId = incomingRequestId || randomUUID();
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const existingCartId = this.readCartId(cookieHeader);
    if (existingCartId) {
      const existing = await this.cart.getCart(existingCartId);
      if (existing) {
        this.logCartEvent(requestId, "create_or_get_current", true, false, false);
        return localizeCart(existing, localeContext, this.slug);
      }
    }

    const createdCart = await this.cart.createCart();
    if (!createdCart.id) {
      throw new Error("Cart ID missing for created cart");
    }
    this.setCartCookie(response, createdCart.id);
    this.logCartEvent(requestId, "create_or_get_current", false, true, true);
    return localizeCart(createdCart, localeContext, this.slug);
  }

  @Get("current")
  async getCurrentCart(
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const requestId = incomingRequestId || randomUUID();
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const cartId = this.readCartId(cookieHeader);
    if (!cartId) {
      this.logCartEvent(requestId, "get_current", false, false, false);
      response?.status(204);
      return undefined;
    }
    const cart = await this.cart.getCart(cartId);
    if (!cart) {
      this.clearCartCookie(response);
      this.logCartEvent(requestId, "get_current", true, false, false);
      response?.status(204);
      return undefined;
    }
    this.logCartEvent(requestId, "get_current", true, false, false);
    return localizeCart(cart, localeContext, this.slug);
  }

  @Post("current/lines")
  async addToCurrentCart(
    @Body() body: { lines?: { merchandiseId: string; quantity: number }[] },
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const requestId = incomingRequestId || randomUUID();
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const normalizedLines = body?.lines ?? [];
    const { cartId, cookieIssued, cartCreated } = await this.getOrCreateCartId(
      cookieHeader,
      response,
    );
    const cart = await this.cart.addToCart(cartId, normalizedLines);
    this.logCartEvent(
      requestId,
      "add_to_current",
      this.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return localizeCart(cart, localeContext, this.slug);
  }

  @Delete("current/lines")
  async removeFromCurrentCart(
    @Body() body: { lineIds?: string[]; merchandiseIds?: string[] },
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const requestId = incomingRequestId || randomUUID();
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const { cartId, cookieIssued, cartCreated } = await this.getOrCreateCartId(
      cookieHeader,
      response,
    );
    const current = await this.cart.getCart(cartId);
    const lineIds = new Set<string>(body?.lineIds ?? []);
    const merchandiseIds = new Set(body?.merchandiseIds ?? []);
    if (current && merchandiseIds.size > 0) {
      for (const line of current.lines) {
        if (line.id && merchandiseIds.has(line.merchandise.id)) {
          lineIds.add(line.id);
        }
      }
    }

    const cart = await this.cart.removeFromCart(cartId, [...lineIds]);
    this.logCartEvent(
      requestId,
      "remove_from_current",
      this.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return localizeCart(cart, localeContext, this.slug);
  }

  @Patch("current/lines")
  async updateCurrentCart(
    @Body()
    body: {
      lines?: { id?: string; merchandiseId: string; quantity: number }[];
    },
    @Headers("cookie") cookieHeader?: string,
    @Headers("x-request-id") incomingRequestId?: string,
    @Query() query?: Record<string, string | string[] | undefined>,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const requestId = incomingRequestId || randomUUID();
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const normalizedLines = body?.lines ?? [];
    const { cartId, cookieIssued, cartCreated } = await this.getOrCreateCartId(
      cookieHeader,
      response,
    );
    const current = await this.cart.getCart(cartId);
    const lineIdByMerchandise = new Map<string, string>();
    for (const line of current?.lines ?? []) {
      if (line.id) {
        lineIdByMerchandise.set(line.merchandise.id, line.id);
      }
    }

    const updateLines: { id: string; merchandiseId: string; quantity: number }[] = [];
    const addLines: { merchandiseId: string; quantity: number }[] = [];
    for (const line of normalizedLines) {
      const resolvedLineId =
        line.id ?? lineIdByMerchandise.get(line.merchandiseId);
      if (resolvedLineId) {
        updateLines.push({
          id: resolvedLineId,
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
        });
        continue;
      }
      if (line.quantity > 0) {
        addLines.push({
          merchandiseId: line.merchandiseId,
          quantity: line.quantity,
        });
      }
    }

    let cart = current;
    if (updateLines.length > 0) {
      cart = await this.cart.updateCart(cartId, updateLines);
    }
    if (addLines.length > 0) {
      cart = await this.cart.addToCart(cartId, addLines);
    }
    if (!cart) {
      cart = await this.cart.getCart(cartId);
    }
    if (!cart) {
      cart = await this.cart.createCart();
      if (cart.id && cart.id !== cartId) {
        this.setCartCookie(response, cart.id);
      }
    }
    this.logCartEvent(
      requestId,
      "update_current",
      this.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return localizeCart(cart, localeContext, this.slug);
  }

  @Delete("current")
  clearCurrentCart(@Res({ passthrough: true }) response?: FastifyReply) {
    this.clearCartCookie(response);
    return { cleared: true };
  }

  @Get(":id")
  async getCart(
    @Param("id") id: string,
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const cart = await this.cart.getCart(id);
    return cart ? localizeCart(cart, localeContext, this.slug) : undefined;
  }

  @Post(":id/lines")
  async addToCart(
    @Param("id") id: string,
    @Body() body: { lines: { merchandiseId: string; quantity: number }[] },
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const cart = await this.cart.addToCart(id, body.lines);
    return localizeCart(cart, localeContext, this.slug);
  }

  @Delete(":id/lines")
  async removeFromCart(
    @Param("id") id: string,
    @Body() body: { lineIds: string[] },
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const cart = await this.cart.removeFromCart(id, body.lineIds);
    return localizeCart(cart, localeContext, this.slug);
  }

  @Patch(":id/lines")
  async updateCart(
    @Param("id") id: string,
    @Body()
    body: {
      lines: { id: string; merchandiseId: string; quantity: number }[];
    },
    @Query() query?: Record<string, string | string[] | undefined>,
  ) {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const cart = await this.cart.updateCart(id, body.lines);
    return localizeCart(cart, localeContext, this.slug);
  }

  private readCartId(cookieHeader: string | undefined): string | undefined {
    return readCookie(cookieHeader, this.cartCookie.name);
  }

  private clearCartCookie(response?: FastifyReply) {
    response?.header("Set-Cookie", serializeExpiredCartCookie(this.cartCookie));
  }

  private setCartCookie(response: FastifyReply | undefined, cartId: string) {
    response?.header("Set-Cookie", serializeCartCookie(this.cartCookie, cartId));
  }

  private async getOrCreateCartId(
    cookieHeader: string | undefined,
    response?: FastifyReply,
  ): Promise<{ cartId: string; cookieIssued: boolean; cartCreated: boolean }> {
    const existingCartId = this.readCartId(cookieHeader);
    if (existingCartId) {
      const existing = await this.cart.getCart(existingCartId);
      if (existing) {
        return { cartId: existingCartId, cookieIssued: false, cartCreated: false };
      }
    }

    const created = await this.cart.createCart();
    if (!created.id) {
      throw new Error("Cart ID missing for created cart");
    }
    this.setCartCookie(response, created.id);
    return { cartId: created.id, cookieIssued: true, cartCreated: true };
  }

  private logCartEvent(
    requestId: string,
    action: string,
    cartCookiePresent: boolean,
    cartCreated: boolean,
    cookieIssued: boolean,
  ) {
    this.logger.log(
      JSON.stringify({
        requestId,
        action,
        cartCookiePresent,
        cartCreated,
        cookieIssued,
      }),
    );
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

function normalizeQuery(
  query: Record<string, string | string[] | undefined> = {},
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(query)) {
    normalized[key] = Array.isArray(value) ? value[0] : value;
  }
  return normalized;
}

function localeContextFromQuery(query: Record<string, string | undefined>) {
  const partial: Partial<LocaleContext> = {
    locale: query.locale,
    language: normalizeLanguage(query.language),
    region: query.region,
    currency: query.currency,
    market: query.market,
    domain: query.domain,
  };

  const hasAnyValue = Object.values(partial).some(Boolean);
  return hasAnyValue ? partial : undefined;
}

function normalizeLanguage(input?: string): LocaleContext["language"] | undefined {
  if (
    input === "en" ||
    input === "es" ||
    input === "nl" ||
    input === "fr"
  ) {
    return input;
  }
  return undefined;
}
