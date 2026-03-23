import type { Cart, LocaleContext } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { randomUUID } from "node:crypto";
import {
  CART_LOCALIZATION_PORT,
  type CartLocalizationPort,
} from "../../ports/cart-localization.port";
import { CART_PORT, CartPort } from "../../ports/cart.port";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
import { SlugService } from "../slug/slug.service";
import { CartSessionService } from "./cart-session.service";

@Controller("cart")
export class CartController {
  constructor(
    @Inject(CART_PORT) private readonly cart: CartPort,
    @Inject(CART_LOCALIZATION_PORT)
    private readonly cartLocalization: CartLocalizationPort,
    private readonly i18n: I18nService,
    private readonly slug: SlugService,
    private readonly session: CartSessionService,
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
    const existingCartId = this.session.readCartId(cookieHeader);
    if (existingCartId) {
      const existing = await this.cart.getCart(existingCartId);
      if (existing) {
        this.session.logCartEvent(
          requestId,
          "create_or_get_current",
          true,
          false,
          false,
        );
        return this.localizeCart(existing, localeContext);
      }
    }

    const createdCart = await this.cart.createCart();
    if (!createdCart.id) {
      throw new Error("Cart ID missing for created cart");
    }
    this.session.setCartCookie(response, createdCart.id);
    this.session.logCartEvent(
      requestId,
      "create_or_get_current",
      false,
      true,
      true,
    );
    return this.localizeCart(createdCart, localeContext);
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
    const cartId = this.session.readCartId(cookieHeader);
    if (!cartId) {
      this.session.logCartEvent(requestId, "get_current", false, false, false);
      response?.status(204);
      return undefined;
    }
    const cart = await this.cart.getCart(cartId);
    if (!cart) {
      this.session.clearCartCookie(response);
      this.session.logCartEvent(requestId, "get_current", true, false, false);
      response?.status(204);
      return undefined;
    }
    this.session.logCartEvent(requestId, "get_current", true, false, false);
    return this.localizeCart(cart, localeContext);
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
    const { cartId, cookieIssued, cartCreated } =
      await this.session.getOrCreateCartId(cookieHeader, response);
    const cart = await this.cart.addToCart(cartId, normalizedLines);
    this.session.logCartEvent(
      requestId,
      "add_to_current",
      this.session.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return this.localizeCart(cart, localeContext);
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
    const { cartId, cookieIssued, cartCreated } =
      await this.session.getOrCreateCartId(cookieHeader, response);
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
    this.session.logCartEvent(
      requestId,
      "remove_from_current",
      this.session.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return this.localizeCart(cart, localeContext);
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
    const { cartId, cookieIssued, cartCreated } =
      await this.session.getOrCreateCartId(cookieHeader, response);
    const current = await this.cart.getCart(cartId);
    const lineIdByMerchandise = new Map<string, string>();
    for (const line of current?.lines ?? []) {
      if (line.id) {
        lineIdByMerchandise.set(line.merchandise.id, line.id);
      }
    }

    const updateLines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[] = [];
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
        this.session.setCartCookie(response, cart.id);
      }
    }
    this.session.logCartEvent(
      requestId,
      "update_current",
      this.session.readCartId(cookieHeader) !== undefined,
      cartCreated,
      cookieIssued,
    );
    return this.localizeCart(cart, localeContext);
  }

  @Delete("current")
  clearCurrentCart(@Res({ passthrough: true }) response?: FastifyReply) {
    this.session.clearCartCookie(response);
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
    return cart ? this.localizeCart(cart, localeContext) : undefined;
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
    return this.localizeCart(cart, localeContext);
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
    return this.localizeCart(cart, localeContext);
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
    return this.localizeCart(cart, localeContext);
  }

  private localizeCart(cart: Cart, localeContext: LocaleContext): Cart {
    return {
      ...cart,
      lines: cart.lines.map((line) => {
        const localized = this.cartLocalization.localizeCartLineMerchandise(
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
            title: localized.merchandiseTitle,
            selectedOptions: localized.selectedOptions,
            product: {
              ...line.merchandise.product,
              title: localized.productTitle,
              path: this.slug.buildProductPath(
                localeContext,
                line.merchandise.product.handle,
              ),
            },
          },
        };
      }),
    };
  }
}
