import { Global, Module, type DynamicModule, type Type } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import {
  AVAILABILITY_PORT,
  type AvailabilityPort,
} from "../../ports/availability.port";
import { CART_PORT, type CartPort } from "../../ports/cart.port";
import { CHECKOUT_PORT, type CheckoutPort } from "../../ports/checkout.port";
import { CMS_PORT, type CmsPort } from "../../ports/cms.port";
import {
  COLLECTION_PORT,
  type CollectionPort,
} from "../../ports/collection.port";
import { CUSTOMER_PORT, type CustomerPort } from "../../ports/customer.port";
import { MENU_PORT, type MenuPort } from "../../ports/menu.port";
import {
  NAVIGATION_PORT,
  type NavigationPort,
} from "../../ports/navigation.port";
import { ORDER_PORT, type OrderPort } from "../../ports/order.port";
import { PAGE_PORT, type PagePort } from "../../ports/page.port";
import { PRICING_PORT, type PricingPort } from "../../ports/pricing.port";
import { PRODUCT_PORT, type ProductPort } from "../../ports/product.port";
import { CachePolicyInterceptor } from "./cache-policy.interceptor";
import { CachePolicyService } from "./cache-policy.service";
import { HealthController } from "./health.controller";
import { LoadSheddingGuard } from "./load-shedding.guard";
import { MetricsService } from "./metrics.service";
import { RequestLoggerInterceptor } from "./request-logger.interceptor";
import {
  AVAILABILITY_POLICY,
  CART_POLICY,
  CHECKOUT_POLICY,
  CMS_POLICY,
  COLLECTION_POLICY,
  CUSTOMER_POLICY,
  MENU_POLICY,
  NAVIGATION_POLICY,
  ORDER_POLICY,
  PAGE_POLICY,
  PRICING_POLICY,
  PRODUCT_POLICY,
} from "./resilience.policies";
import { ResilienceService } from "./resilience.service";
import { createResilientPort } from "./resilient-port.factory";

// -- Raw port tokens ---------------------------------------------------------
// The mock (or real) backend module provides adapters under these tokens.
// SystemModule re-provides each public port token with a resilient proxy.

export const RAW_AVAILABILITY_PORT = Symbol("RAW_AVAILABILITY_PORT");
export const RAW_CART_PORT = Symbol("RAW_CART_PORT");
export const RAW_CHECKOUT_PORT = Symbol("RAW_CHECKOUT_PORT");
export const RAW_CMS_PORT = Symbol("RAW_CMS_PORT");
export const RAW_COLLECTION_PORT = Symbol("RAW_COLLECTION_PORT");
export const RAW_CUSTOMER_PORT = Symbol("RAW_CUSTOMER_PORT");
export const RAW_MENU_PORT = Symbol("RAW_MENU_PORT");
export const RAW_NAVIGATION_PORT = Symbol("RAW_NAVIGATION_PORT");
export const RAW_ORDER_PORT = Symbol("RAW_ORDER_PORT");
export const RAW_PAGE_PORT = Symbol("RAW_PAGE_PORT");
export const RAW_PRICING_PORT = Symbol("RAW_PRICING_PORT");
export const RAW_PRODUCT_PORT = Symbol("RAW_PRODUCT_PORT");

@Global()
@Module({})
export class SystemModule {
  static forRoot(backendModule: Type): DynamicModule {
    return {
      module: SystemModule,
      global: true,
      imports: [backendModule],
      controllers: [HealthController],
      providers: [
        ResilienceService,
        CachePolicyService,
        MetricsService,
        LoadSheddingGuard,
        {
          provide: APP_GUARD,
          useExisting: LoadSheddingGuard,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CachePolicyInterceptor,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: RequestLoggerInterceptor,
        },

        // -- Resilient port proxies -----------------------------------------------
        // Each factory takes the raw adapter + ResilienceService and returns a proxy.
        // Domain services inject the standard port token and get resilience for free.

        {
          provide: PRICING_PORT,
          useFactory: (raw: PricingPort, r: ResilienceService) =>
            createResilientPort(raw, r, "pricing", PRICING_POLICY, {
              getPricing: undefined,
              getPricingBatch: () => new Map(),
            }),
          inject: [RAW_PRICING_PORT, ResilienceService],
        },
        {
          provide: AVAILABILITY_PORT,
          useFactory: (raw: AvailabilityPort, r: ResilienceService) =>
            createResilientPort(raw, r, "availability", AVAILABILITY_POLICY, {
              getAvailability: undefined,
              getAvailabilityBatch: () => new Map(),
            }),
          inject: [RAW_AVAILABILITY_PORT, ResilienceService],
        },
        {
          provide: PRODUCT_PORT,
          useFactory: (raw: ProductPort, r: ResilienceService) =>
            createResilientPort(raw, r, "product", PRODUCT_POLICY),
          inject: [RAW_PRODUCT_PORT, ResilienceService],
        },
        {
          provide: COLLECTION_PORT,
          useFactory: (raw: CollectionPort, r: ResilienceService) =>
            createResilientPort(raw, r, "collection", COLLECTION_POLICY),
          inject: [RAW_COLLECTION_PORT, ResilienceService],
        },
        {
          provide: CMS_PORT,
          useFactory: (raw: CmsPort, r: ResilienceService) =>
            createResilientPort(raw, r, "cms", CMS_POLICY),
          inject: [RAW_CMS_PORT, ResilienceService],
        },
        {
          provide: NAVIGATION_PORT,
          useFactory: (raw: NavigationPort, r: ResilienceService) =>
            createResilientPort(raw, r, "navigation", NAVIGATION_POLICY),
          inject: [RAW_NAVIGATION_PORT, ResilienceService],
        },
        {
          provide: MENU_PORT,
          useFactory: (raw: MenuPort, r: ResilienceService) =>
            createResilientPort(raw, r, "menu", MENU_POLICY),
          inject: [RAW_MENU_PORT, ResilienceService],
        },
        {
          provide: PAGE_PORT,
          useFactory: (raw: PagePort, r: ResilienceService) =>
            createResilientPort(raw, r, "page", PAGE_POLICY),
          inject: [RAW_PAGE_PORT, ResilienceService],
        },
        {
          provide: CUSTOMER_PORT,
          useFactory: (raw: CustomerPort, r: ResilienceService) =>
            createResilientPort(raw, r, "customer", CUSTOMER_POLICY),
          inject: [RAW_CUSTOMER_PORT, ResilienceService],
        },
        {
          provide: CART_PORT,
          useFactory: (raw: CartPort, r: ResilienceService) =>
            createResilientPort(raw, r, "cart", CART_POLICY),
          inject: [RAW_CART_PORT, ResilienceService],
        },
        {
          provide: CHECKOUT_PORT,
          useFactory: (raw: CheckoutPort, r: ResilienceService) =>
            createResilientPort(raw, r, "checkout", CHECKOUT_POLICY),
          inject: [RAW_CHECKOUT_PORT, ResilienceService],
        },
        {
          provide: ORDER_PORT,
          useFactory: (raw: OrderPort, r: ResilienceService) =>
            createResilientPort(raw, r, "order", ORDER_POLICY),
          inject: [RAW_ORDER_PORT, ResilienceService],
        },
      ],
      exports: [
        backendModule,
        ResilienceService,
        CachePolicyService,
        MetricsService,
        LoadSheddingGuard,
        // Re-export all public port tokens so consumers get the resilient versions
        PRICING_PORT,
        AVAILABILITY_PORT,
        PRODUCT_PORT,
        COLLECTION_PORT,
        CMS_PORT,
        NAVIGATION_PORT,
        MENU_PORT,
        PAGE_PORT,
        CUSTOMER_PORT,
        CART_PORT,
        CHECKOUT_PORT,
        ORDER_PORT,
      ],
    };
  }
}
