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
import { MockSearchAdapter } from "../mock/mock-search.adapter";
import { SpringProductAdapter } from "./spring-product.adapter";

/**
 * Hybrid backend module that uses Spring Boot API for products
 * while keeping all other ports on mock adapters.
 *
 * Activate with: BFF_BACKEND=spring
 */
const providers = [
  StoreContext,
  MockAddressStore,
  MockCartStore,
  // Product port → Spring Boot API (PostgreSQL)
  { provide: RAW_PRODUCT_PORT, useClass: SpringProductAdapter },
  // All other ports → mock adapters (unchanged)
  { provide: RAW_AVAILABILITY_PORT, useClass: MockAvailabilityAdapter },
  { provide: RAW_CHECKOUT_PORT, useClass: MockCheckoutAdapter },
  { provide: RAW_CART_PORT, useClass: MockCartAdapter },
  { provide: RAW_CMS_PORT, useClass: MockCmsAdapter },
  { provide: RAW_COLLECTION_PORT, useClass: MockCollectionAdapter },
  { provide: RAW_CUSTOMER_PORT, useClass: MockCustomerAdapter },
  { provide: RAW_MENU_PORT, useClass: MockMenuAdapter },
  { provide: RAW_NAVIGATION_PORT, useClass: MockNavigationAdapter },
  { provide: RAW_ORDER_PORT, useClass: MockOrderAdapter },
  { provide: RAW_PAGE_PORT, useClass: MockPageAdapter },
  { provide: RAW_PRICING_PORT, useClass: MockPricingAdapter },
  { provide: RAW_SEARCH_PORT, useClass: MockSearchAdapter },
];

@Module({
  providers,
  exports: [...providers],
})
export class SpringBackendModule {}
