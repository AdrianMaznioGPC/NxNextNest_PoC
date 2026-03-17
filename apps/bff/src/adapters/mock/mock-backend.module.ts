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
} from "../../modules/system/system.module";
import { StoreContext } from "../../store";
import { MockAddressStore } from "./mock-address-store";
import { MockAvailabilityAdapter } from "./mock-availability.adapter";
import { MockCartStore } from "./mock-cart-store";
import { MockCartAdapter } from "./mock-cart.adapter";
import { MockCheckoutAdapter } from "./mock-checkout.adapter";
import { MockCmsAdapter } from "./mock-cms.adapter";
import { MockCollectionAdapter } from "./mock-collection.adapter";
import { MockCustomerAdapter } from "./mock-customer.adapter";
import { MockMenuAdapter } from "./mock-menu.adapter";
import { MockNavigationAdapter } from "./mock-navigation.adapter";
import { MockOrderAdapter } from "./mock-order.adapter";
import { MockPageAdapter } from "./mock-page.adapter";
import { MockPricingAdapter } from "./mock-pricing.adapter";
import { MockProductAdapter } from "./mock-product.adapter";

const providers = [
  StoreContext,
  MockAddressStore,
  MockCartStore,
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
  { provide: RAW_PRODUCT_PORT, useClass: MockProductAdapter },
];

@Module({
  providers,
  exports: [...providers],
})
export class MockBackendModule {}
