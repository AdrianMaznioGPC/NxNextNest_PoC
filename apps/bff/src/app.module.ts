import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { MockBackendModule } from "./adapters/mock/mock-backend.module";
import { ProductController } from "./modules/product/product.controller";
import { CollectionController } from "./modules/collection/collection.controller";
import { CartController } from "./modules/cart/cart.controller";
import { PageController } from "./modules/page/page.controller";
import { MenuController } from "./modules/menu/menu.controller";

@Module({
  imports: [MockBackendModule],
  controllers: [
    AppController,
    ProductController,
    CollectionController,
    CartController,
    PageController,
    MenuController,
  ],
})
export class AppModule {}
