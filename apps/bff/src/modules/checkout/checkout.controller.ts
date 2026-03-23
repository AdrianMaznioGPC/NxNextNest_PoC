import type { CheckoutConfig, OrderConfirmation } from "@commerce/shared-types";
import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import type { CheckoutPort } from "../../ports/checkout.port";
import { CHECKOUT_PORT } from "../../ports/checkout.port";
import type { OrderPort } from "../../ports/order.port";
import { ORDER_PORT } from "../../ports/order.port";
import { ExperienceProfileService } from "../experience/experience-profile.service";
import { I18nService } from "../i18n/i18n.service";
import {
  localeContextFromQuery,
  normalizeQuery,
} from "../i18n/locale-query.utils";
import { PlaceOrderDto } from "./checkout.dto";

@Controller("checkout")
export class CheckoutController {
  constructor(
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
    @Inject(ORDER_PORT) private readonly order: OrderPort,
    private readonly i18n: I18nService,
    private readonly experienceProfiles: ExperienceProfileService,
  ) {}

  @Get("config")
  getConfig(
    @Query() query?: Record<string, string | string[] | undefined>,
  ): Promise<CheckoutConfig> {
    const localeContext = this.i18n.resolveLocaleContext(
      localeContextFromQuery(normalizeQuery(query)),
    );
    const storeContext =
      this.experienceProfiles.resolveStoreContext(localeContext);
    return this.checkout.getCheckoutConfig(storeContext.storeKey);
  }

  @Post("orders")
  placeOrder(@Body() body: PlaceOrderDto): Promise<OrderConfirmation> {
    return this.order.placeOrder(body);
  }

  @Get("orders/:orderId")
  async getOrder(
    @Param("orderId") orderId: string,
  ): Promise<OrderConfirmation> {
    const order = await this.order.getOrder(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    return order;
  }
}
