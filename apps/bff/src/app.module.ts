import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MockBackendModule } from "./adapters/mock/mock-backend.module";
import { AppController } from "./app.controller";
import { CartController } from "./modules/cart/cart.controller";
import { CatalogDomainService } from "./modules/collection/catalog-domain.service";
import { CollectionController } from "./modules/collection/collection.controller";
import { MenuController } from "./modules/menu/menu.controller";
import { NavigationDomainService } from "./modules/menu/navigation-domain.service";
import { ContentDomainService } from "./modules/page-data/content-domain.service";
import { PageDataController } from "./modules/page-data/page-data.controller";
import { PageDataService } from "./modules/page-data/page-data.service";
import { PageController } from "./modules/page/page.controller";
import { ProductDomainService } from "./modules/product/product-domain.service";
import { ProductController } from "./modules/product/product.controller";
import { StoreContext, StoreInterceptor } from "./store";

@Module({
  imports: [MockBackendModule],
  controllers: [
    AppController,
    ProductController,
    CollectionController,
    CartController,
    PageController,
    MenuController,
    PageDataController,
  ],
  providers: [
    ProductDomainService,
    CatalogDomainService,
    ContentDomainService,
    NavigationDomainService,
    PageDataService,
    StoreContext,
    {
      provide: APP_INTERCEPTOR,
      useClass: StoreInterceptor,
    },
  ],
})
export class AppModule {}
