import { Module } from "@nestjs/common";
import { CART_PORT } from "../../ports/cart.port";
import { CMS_PORT } from "../../ports/cms.port";
import { COLLECTION_PORT } from "../../ports/collection.port";
import { MENU_PORT } from "../../ports/menu.port";
import { PAGE_PORT } from "../../ports/page.port";
import { PRODUCT_PORT } from "../../ports/product.port";
import { MockCartAdapter } from "./mock-cart.adapter";
import { MockCmsAdapter } from "./mock-cms.adapter";
import { MockCollectionAdapter } from "./mock-collection.adapter";
import { MockMenuAdapter } from "./mock-menu.adapter";
import { MockPageAdapter } from "./mock-page.adapter";
import { MockProductAdapter } from "./mock-product.adapter";

const providers = [
  { provide: PRODUCT_PORT, useClass: MockProductAdapter },
  { provide: COLLECTION_PORT, useClass: MockCollectionAdapter },
  { provide: CART_PORT, useClass: MockCartAdapter },
  { provide: PAGE_PORT, useClass: MockPageAdapter },
  { provide: MENU_PORT, useClass: MockMenuAdapter },
  { provide: CMS_PORT, useClass: MockCmsAdapter },
];

@Module({
  providers,
  exports: providers,
})
export class MockBackendModule {}
