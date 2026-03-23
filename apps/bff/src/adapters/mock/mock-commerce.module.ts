import { Global, Module } from "@nestjs/common";
import { CART_LOCALIZATION_PORT } from "../../ports/cart-localization.port";
import { CART_PORT } from "../../ports/cart.port";
import { CHECKOUT_PORT } from "../../ports/checkout.port";
import { CMS_PORT } from "../../ports/cms.port";
import { COLLECTION_PORT } from "../../ports/collection.port";
import { CONTENT_SUPPLEMENT_PORT } from "../../ports/content-supplement.port";
import { CUSTOMER_PORT } from "../../ports/customer.port";
import { I18N_CONFIG_PORT } from "../../ports/i18n-config.port";
import { MENU_PORT } from "../../ports/menu.port";
import { NAVIGATION_PORT } from "../../ports/navigation.port";
import { ORDER_PORT } from "../../ports/order.port";
import { PAGE_PORT } from "../../ports/page.port";
import { PRODUCT_PORT } from "../../ports/product.port";
import { SLUG_CATALOG_PORT } from "../../ports/slug-catalog.port";
import { MockCartLocalizationAdapter } from "./mock-cart-localization.adapter";
import { MockCartAdapter } from "./mock-cart.adapter";
import { MockCheckoutAdapter } from "./mock-checkout.adapter";
import { MockCmsAdapter } from "./mock-cms.adapter";
import { MockCollectionAdapter } from "./mock-collection.adapter";
import { MockContentSupplementAdapter } from "./mock-content-supplement.adapter";
import { MockCustomerAdapter } from "./mock-customer.adapter";
import { MockI18nConfigAdapter } from "./mock-i18n-config.adapter";
import { MockMenuAdapter } from "./mock-menu.adapter";
import { MockNavigationAdapter } from "./mock-navigation.adapter";
import { MockOrderAdapter } from "./mock-order.adapter";
import { MockPageAdapter } from "./mock-page.adapter";
import { MockProductAdapter } from "./mock-product.adapter";
import { MockSlugCatalogAdapter } from "./mock-slug-catalog.adapter";

const providers = [
  { provide: PRODUCT_PORT, useClass: MockProductAdapter },
  { provide: COLLECTION_PORT, useClass: MockCollectionAdapter },
  { provide: CART_PORT, useClass: MockCartAdapter },
  { provide: PAGE_PORT, useClass: MockPageAdapter },
  { provide: MENU_PORT, useClass: MockMenuAdapter },
  { provide: CMS_PORT, useClass: MockCmsAdapter },
  { provide: NAVIGATION_PORT, useClass: MockNavigationAdapter },
  { provide: CUSTOMER_PORT, useClass: MockCustomerAdapter },
  { provide: CHECKOUT_PORT, useClass: MockCheckoutAdapter },
  { provide: ORDER_PORT, useClass: MockOrderAdapter },
  { provide: I18N_CONFIG_PORT, useClass: MockI18nConfigAdapter },
  { provide: SLUG_CATALOG_PORT, useClass: MockSlugCatalogAdapter },
  { provide: CART_LOCALIZATION_PORT, useClass: MockCartLocalizationAdapter },
  { provide: CONTENT_SUPPLEMENT_PORT, useClass: MockContentSupplementAdapter },
];

@Global()
@Module({
  providers,
  exports: providers,
})
export class MockCommerceModule {}
