import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MockBackendModule } from "./adapters/mock/mock-backend.module";
import { AppController } from "./app.controller";
import { CartController } from "./modules/cart/cart.controller";
import { CheckoutController } from "./modules/checkout/checkout.controller";
import { CatalogDomainService } from "./modules/collection/catalog-domain.service";
import { AddressBookController } from "./modules/customer/address-book.controller";
import { NavigationDomainService } from "./modules/menu/navigation-domain.service";
import { ContentDomainService } from "./modules/page-data/content-domain.service";
import { PageDataController } from "./modules/page-data/page-data.controller";
import { PageDataService } from "./modules/page-data/page-data.service";
import { ProductDomainService } from "./modules/product/product-domain.service";
import { StoreInterceptor } from "./store";

@Module({
  imports: [MockBackendModule],
  controllers: [
    AppController,
    CartController,
    CheckoutController,
    AddressBookController,
    PageDataController,
  ],
  providers: [
    ProductDomainService,
    CatalogDomainService,
    ContentDomainService,
    NavigationDomainService,
    PageDataService,
    {
      provide: APP_INTERCEPTOR,
      useClass: StoreInterceptor,
    },
  ],
})
export class AppModule {}
