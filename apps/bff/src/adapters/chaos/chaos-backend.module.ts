import { Module } from "@nestjs/common";
import {
  RAW_AVAILABILITY_PORT,
  RAW_CART_PORT,
  RAW_CHECKOUT_PORT,
  RAW_CMS_PORT,
  RAW_COLLECTION_PORT,
  RAW_CUSTOMER_PORT,
  RAW_MENU_PORT,
  RAW_NAVIGATION_PORT,
  RAW_ORDER_PORT,
  RAW_PAGE_PORT,
  RAW_PRICING_PORT,
  RAW_PRODUCT_PORT,
  RAW_SEARCH_PORT,
} from "../../modules/system/system.module";
import type { AvailabilityPort } from "../../ports/availability.port";
import type { CartPort } from "../../ports/cart.port";
import type { CheckoutPort } from "../../ports/checkout.port";
import type { CmsPort } from "../../ports/cms.port";
import type { CollectionPort } from "../../ports/collection.port";
import type { CustomerPort } from "../../ports/customer.port";
import type { MenuPort } from "../../ports/menu.port";
import type { NavigationPort } from "../../ports/navigation.port";
import type { OrderPort } from "../../ports/order.port";
import type { PagePort } from "../../ports/page.port";
import type { PricingPort } from "../../ports/pricing.port";
import type { ProductPort } from "../../ports/product.port";
import type { SearchPort } from "../../ports/search.port";
import { StoreContext } from "../../store";
import { MockAddressStore } from "../mock/mock-address-store";
import { MockAvailabilityAdapter } from "../mock/mock-availability.adapter";
import { MockCartStore } from "../mock/mock-cart-store";
import { MockCartAdapter } from "../mock/mock-cart.adapter";
import { MockCheckoutAdapter } from "../mock/mock-checkout.adapter";
import { MockCmsAdapter } from "../mock/mock-cms.adapter";
import { MockCollectionAdapter } from "../mock/mock-collection.adapter";
import { MockCustomerAdapter } from "../mock/mock-customer.adapter";
import { MockMenuAdapter } from "../mock/mock-menu.adapter";
import { MockNavigationAdapter } from "../mock/mock-navigation.adapter";
import { MockOrderAdapter } from "../mock/mock-order.adapter";
import { MockPageAdapter } from "../mock/mock-page.adapter";
import { MockPricingAdapter } from "../mock/mock-pricing.adapter";
import { MockProductAdapter } from "../mock/mock-product.adapter";
import { MockSearchAdapter } from "../mock/mock-search.adapter";
import { ChaosConfigService } from "./chaos-config.service";
import { ChaosController } from "./chaos.controller";
import { createChaosAdapter } from "./create-chaos-adapter";

// ---------------------------------------------------------------------------
// Internal tokens for unwrapped mock adapter instances.
// These are only used within this module to avoid token collisions with the
// RAW_* tokens that SystemModule expects.
// ---------------------------------------------------------------------------

const MOCK_AVAILABILITY = Symbol("MOCK_AVAILABILITY");
const MOCK_CART = Symbol("MOCK_CART");
const MOCK_CHECKOUT = Symbol("MOCK_CHECKOUT");
const MOCK_CMS = Symbol("MOCK_CMS");
const MOCK_COLLECTION = Symbol("MOCK_COLLECTION");
const MOCK_CUSTOMER = Symbol("MOCK_CUSTOMER");
const MOCK_MENU = Symbol("MOCK_MENU");
const MOCK_NAVIGATION = Symbol("MOCK_NAVIGATION");
const MOCK_ORDER = Symbol("MOCK_ORDER");
const MOCK_PAGE = Symbol("MOCK_PAGE");
const MOCK_PRICING = Symbol("MOCK_PRICING");
const MOCK_PRODUCT = Symbol("MOCK_PRODUCT");
const MOCK_SEARCH = Symbol("MOCK_SEARCH");

/**
 * A backend module that wraps all mock adapters with chaos injection.
 *
 * Provides the same RAW_* tokens that SystemModule expects, but each adapter
 * is wrapped with a Proxy that can inject latency, errors, and hangs
 * based on the ChaosConfigService configuration.
 *
 * Stack:  MockAdapter → ChaosProxy (RAW_*) → ResilienceProxy (public port)
 *
 * Selected at boot time via `BFF_BACKEND=chaos`.
 */
@Module({
  controllers: [ChaosController],
  providers: [
    // -- Shared infrastructure ------------------------------------------------
    StoreContext,
    ChaosConfigService,
    MockCartStore,
    MockAddressStore,

    // -- Unwrapped mock adapters under internal tokens ------------------------
    // Adapters with cross-port dependencies inject other MOCK_* tokens,
    // keeping internal wiring within the unwrapped layer.
    { provide: MOCK_AVAILABILITY, useClass: MockAvailabilityAdapter },
    { provide: MOCK_CMS, useClass: MockCmsAdapter },
    { provide: MOCK_CUSTOMER, useClass: MockCustomerAdapter },
    { provide: MOCK_MENU, useClass: MockMenuAdapter },
    { provide: MOCK_NAVIGATION, useClass: MockNavigationAdapter },
    { provide: MOCK_ORDER, useClass: MockOrderAdapter },
    { provide: MOCK_PAGE, useClass: MockPageAdapter },
    { provide: MOCK_PRICING, useClass: MockPricingAdapter },

    { provide: MOCK_SEARCH, useClass: MockSearchAdapter },
    { provide: MOCK_COLLECTION, useClass: MockCollectionAdapter },

    // MockProductAdapter injects RAW_COLLECTION_PORT → wire to MOCK_COLLECTION
    {
      provide: MOCK_PRODUCT,
      useFactory: (storeCtx: StoreContext, collections: CollectionPort) => {
        // Manually construct with correct internal dependency
        const adapter = new MockProductAdapter(storeCtx, collections);
        return adapter;
      },
      inject: [StoreContext, MOCK_COLLECTION],
    },

    // MockCartAdapter injects RAW_PRODUCT_PORT + RAW_PRICING_PORT
    {
      provide: MOCK_CART,
      useFactory: (
        products: ProductPort,
        pricing: PricingPort,
        storeCtx: StoreContext,
        cartStore: MockCartStore,
      ) => {
        return new MockCartAdapter(products, pricing, storeCtx, cartStore);
      },
      inject: [MOCK_PRODUCT, MOCK_PRICING, StoreContext, MockCartStore],
    },

    // MockCheckoutAdapter injects RAW_CUSTOMER_PORT
    {
      provide: MOCK_CHECKOUT,
      useFactory: (storeCtx: StoreContext, customer: CustomerPort) => {
        return new MockCheckoutAdapter(storeCtx, customer);
      },
      inject: [StoreContext, MOCK_CUSTOMER],
    },

    // -- Chaos-wrapped RAW_* tokens -------------------------------------------
    // Each factory wraps the internal mock with a chaos proxy.
    {
      provide: RAW_AVAILABILITY_PORT,
      useFactory: (mock: AvailabilityPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "availability"),
      inject: [MOCK_AVAILABILITY, ChaosConfigService],
    },
    {
      provide: RAW_CART_PORT,
      useFactory: (mock: CartPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "cart"),
      inject: [MOCK_CART, ChaosConfigService],
    },
    {
      provide: RAW_CHECKOUT_PORT,
      useFactory: (mock: CheckoutPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "checkout"),
      inject: [MOCK_CHECKOUT, ChaosConfigService],
    },
    {
      provide: RAW_CMS_PORT,
      useFactory: (mock: CmsPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "cms"),
      inject: [MOCK_CMS, ChaosConfigService],
    },
    {
      provide: RAW_COLLECTION_PORT,
      useFactory: (mock: CollectionPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "collection"),
      inject: [MOCK_COLLECTION, ChaosConfigService],
    },
    {
      provide: RAW_CUSTOMER_PORT,
      useFactory: (mock: CustomerPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "customer"),
      inject: [MOCK_CUSTOMER, ChaosConfigService],
    },
    {
      provide: RAW_MENU_PORT,
      useFactory: (mock: MenuPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "menu"),
      inject: [MOCK_MENU, ChaosConfigService],
    },
    {
      provide: RAW_NAVIGATION_PORT,
      useFactory: (mock: NavigationPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "navigation"),
      inject: [MOCK_NAVIGATION, ChaosConfigService],
    },
    {
      provide: RAW_ORDER_PORT,
      useFactory: (mock: OrderPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "order"),
      inject: [MOCK_ORDER, ChaosConfigService],
    },
    {
      provide: RAW_PAGE_PORT,
      useFactory: (mock: PagePort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "page"),
      inject: [MOCK_PAGE, ChaosConfigService],
    },
    {
      provide: RAW_PRICING_PORT,
      useFactory: (mock: PricingPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "pricing"),
      inject: [MOCK_PRICING, ChaosConfigService],
    },
    {
      provide: RAW_PRODUCT_PORT,
      useFactory: (mock: ProductPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "product"),
      inject: [MOCK_PRODUCT, ChaosConfigService],
    },
    {
      provide: RAW_SEARCH_PORT,
      useFactory: (mock: SearchPort, chaos: ChaosConfigService) =>
        createChaosAdapter(mock, chaos, "search"),
      inject: [MOCK_SEARCH, ChaosConfigService],
    },
  ],
  exports: [
    StoreContext,
    ChaosConfigService,
    RAW_AVAILABILITY_PORT,
    RAW_CART_PORT,
    RAW_CHECKOUT_PORT,
    RAW_CMS_PORT,
    RAW_COLLECTION_PORT,
    RAW_CUSTOMER_PORT,
    RAW_MENU_PORT,
    RAW_NAVIGATION_PORT,
    RAW_ORDER_PORT,
    RAW_PAGE_PORT,
    RAW_PRICING_PORT,
    RAW_PRODUCT_PORT,
    RAW_SEARCH_PORT,
  ],
})
export class ChaosBackendModule {}
