import { Logger, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ChaosBackendModule } from "./adapters/chaos/chaos-backend.module";
import { MockBackendModule } from "./adapters/mock/mock-backend.module";
import { SpringBackendModule } from "./adapters/spring/spring-backend.module";
import { CartController } from "./modules/cart/cart.controller";
import { CheckoutController } from "./modules/checkout/checkout.controller";
import { CatalogDomainService } from "./modules/collection/catalog-domain.service";
import { AddressBookController } from "./modules/customer/address-book.controller";
import { NavigationDomainService } from "./modules/menu/navigation-domain.service";
import { ContentDomainService } from "./modules/page-data/content-domain.service";
import { PageDataController } from "./modules/page-data/page-data.controller";
import { PageDataService } from "./modules/page-data/page-data.service";
import { ProductDomainService } from "./modules/product/product-domain.service";
import { SystemModule } from "./modules/system/system.module";
import { StoreInterceptor } from "./store";

const logger = new Logger("AppModule");
const backendMode = process.env.BFF_BACKEND ?? "mock";
const backendModule =
  backendMode === "spring"
    ? SpringBackendModule
    : backendMode === "chaos"
      ? ChaosBackendModule
      : MockBackendModule;

if (backendMode === "chaos") {
  logger.warn("CHAOS BACKEND ACTIVE — not for production use");
} else if (backendMode === "spring") {
  logger.log("Using Spring Boot backend for products");
}

@Module({
  imports: [SystemModule.forRoot(backendModule)],
  controllers: [
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
