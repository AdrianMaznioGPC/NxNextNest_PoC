import type { CheckoutConfig } from "@commerce/shared-types";
import { Controller, Get, Inject } from "@nestjs/common";
import { CHECKOUT_PORT, CheckoutPort } from "../../ports/checkout.port";

@Controller("checkout")
export class CheckoutController {
  constructor(
    @Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort,
  ) {}

  @Get("config")
  getConfig(): Promise<CheckoutConfig> {
    return this.checkout.getCheckoutConfig();
  }
}
