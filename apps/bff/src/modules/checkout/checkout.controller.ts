import type { CheckoutConfig } from "@commerce/shared-types";
import { Controller, Get, Inject, SetMetadata } from "@nestjs/common";
import { CHECKOUT_PORT, CheckoutPort } from "../../ports/checkout.port";
import { CACHE_ROUTE_KIND_KEY } from "../system/cache-policy.service";
import { LOAD_SHED_SCOPE_KEY } from "../system/load-shedding.config";

@Controller("checkout")
@SetMetadata(LOAD_SHED_SCOPE_KEY, "checkout")
@SetMetadata(CACHE_ROUTE_KIND_KEY, "checkout")
export class CheckoutController {
  constructor(@Inject(CHECKOUT_PORT) private readonly checkout: CheckoutPort) {}

  @Get("config")
  getConfig(): Promise<CheckoutConfig> {
    return this.checkout.getCheckoutConfig();
  }
}
