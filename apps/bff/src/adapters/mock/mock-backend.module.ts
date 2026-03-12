import { Module } from "@nestjs/common";
import { PRODUCT_PORT } from "../../ports/product.port";
import { COLLECTION_PORT } from "../../ports/collection.port";
import { CART_PORT } from "../../ports/cart.port";
import { PAGE_PORT } from "../../ports/page.port";
import { MENU_PORT } from "../../ports/menu.port";
import { MockProductAdapter } from "./mock-product.adapter";
import { MockCollectionAdapter } from "./mock-collection.adapter";
import { MockCartAdapter } from "./mock-cart.adapter";
import { MockPageAdapter } from "./mock-page.adapter";
import { MockMenuAdapter } from "./mock-menu.adapter";

const providers = [
  { provide: PRODUCT_PORT, useClass: MockProductAdapter },
  { provide: COLLECTION_PORT, useClass: MockCollectionAdapter },
  { provide: CART_PORT, useClass: MockCartAdapter },
  { provide: PAGE_PORT, useClass: MockPageAdapter },
  { provide: MENU_PORT, useClass: MockMenuAdapter },
];

@Module({
  providers,
  exports: providers,
})
export class MockBackendModule {}
