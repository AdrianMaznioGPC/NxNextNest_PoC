import { Module } from "@nestjs/common";
import { AVAILABILITY_PORT } from "../../ports/availability.port";
import { CART_PORT } from "../../ports/cart.port";
import { CHECKOUT_PORT } from "../../ports/checkout.port";
import { CMS_PORT } from "../../ports/cms.port";
import { COLLECTION_PORT } from "../../ports/collection.port";
import { CUSTOMER_PORT } from "../../ports/customer.port";
import { MENU_PORT } from "../../ports/menu.port";
import { NAVIGATION_PORT } from "../../ports/navigation.port";
import { ORDER_PORT } from "../../ports/order.port";
import { PAGE_PORT } from "../../ports/page.port";
import { PRICING_PORT } from "../../ports/pricing.port";
import { PRODUCT_PORT } from "../../ports/product.port";
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
  { provide: AVAILABILITY_PORT, useClass: MockAvailabilityAdapter },
  { provide: CHECKOUT_PORT, useClass: MockCheckoutAdapter },
  { provide: CART_PORT, useClass: MockCartAdapter },
  { provide: CMS_PORT, useClass: MockCmsAdapter },
  { provide: COLLECTION_PORT, useClass: MockCollectionAdapter },
  { provide: CUSTOMER_PORT, useClass: MockCustomerAdapter },
  { provide: MENU_PORT, useClass: MockMenuAdapter },
  { provide: NAVIGATION_PORT, useClass: MockNavigationAdapter },
  { provide: ORDER_PORT, useClass: MockOrderAdapter },
  { provide: PAGE_PORT, useClass: MockPageAdapter },
  { provide: PRICING_PORT, useClass: MockPricingAdapter },
  { provide: PRODUCT_PORT, useClass: MockProductAdapter },
];

@Module({
  providers,
  exports: [...providers],
})
export class MockBackendModule {}
