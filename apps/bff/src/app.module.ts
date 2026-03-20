import { Module } from "@nestjs/common";
import { MockBackendModule } from "./adapters/mock/mock-backend.module";
import { AppController } from "./app.controller";
import { CartController } from "./modules/cart/cart.controller";
import { CheckoutController } from "./modules/checkout/checkout.controller";
import { CollectionController } from "./modules/collection/collection.controller";
import { AddressBookController } from "./modules/customer/address-book.controller";
import { ExperienceProfileService } from "./modules/experience/experience-profile.service";
import { ExperienceResolverService } from "./modules/experience/experience-resolver.service";
import { ExperienceValidatorService } from "./modules/experience/experience-validator.service";
import { I18nController } from "./modules/i18n/i18n.controller";
import { I18nService } from "./modules/i18n/i18n.service";
import { SwitchUrlService } from "./modules/i18n/switch-url.service";
import { MenuController } from "./modules/menu/menu.controller";
import { MerchandisingModule } from "./modules/merchandising/merchandising.module";
import { CartPageAssembler } from "./modules/page-data/assemblers/cart-page.assembler";
import { CategoryDetailPageAssembler } from "./modules/page-data/assemblers/category-detail-page.assembler";
import { CategoryListPageAssembler } from "./modules/page-data/assemblers/category-list-page.assembler";
import { ContentPageAssembler } from "./modules/page-data/assemblers/content-page.assembler";
import { HomePageAssembler } from "./modules/page-data/assemblers/home-page.assembler";
import { PageAssemblerRegistry } from "./modules/page-data/assemblers/page-assembler.registry";
import { ProductDetailPageAssembler } from "./modules/page-data/assemblers/product-detail-page.assembler";
import { SearchPageAssembler } from "./modules/page-data/assemblers/search-page.assembler";
import { BootstrapOrchestratorService } from "./modules/page-data/bootstrap-orchestrator.service";
import { PageDataController } from "./modules/page-data/page-data.controller";
import { PageDataService } from "./modules/page-data/page-data.service";
import { RouteMatcherFactory } from "./modules/page-data/routing/route-matcher.factory";
import { RouteRecognitionService } from "./modules/page-data/routing/route-recognition.service";
import { SlugIndexService } from "./modules/page-data/routing/slug-index.service";
import { SlotDataService } from "./modules/page-data/slot-data.service";
import { SlotPlannerService } from "./modules/page-data/slot-planner.service";
import { PageController } from "./modules/page/page.controller";
import { ProductController } from "./modules/product/product.controller";
import { SlugModule } from "./modules/slug/slug.module";
import { CachePolicyService } from "./modules/system/cache-policy.service";
import { LoadSheddingService } from "./modules/system/load-shedding.service";
import { ResilienceService } from "./modules/system/resilience.service";
import { ScalabilityMetricsService } from "./modules/system/scalability-metrics.service";

@Module({
  imports: [MockBackendModule, SlugModule, MerchandisingModule],
  controllers: [
    AppController,
    ProductController,
    CollectionController,
    CartController,
    I18nController,
    PageController,
    MenuController,
    PageDataController,
    CheckoutController,
    AddressBookController,
  ],
  providers: [
    I18nService,
    SwitchUrlService,
    ExperienceProfileService,
    ExperienceResolverService,
    ExperienceValidatorService,
    PageDataService,
    BootstrapOrchestratorService,
    RouteRecognitionService,
    RouteMatcherFactory,
    SlugIndexService,
    PageAssemblerRegistry,
    HomePageAssembler,
    CategoryListPageAssembler,
    CategoryDetailPageAssembler,
    CartPageAssembler,
    ProductDetailPageAssembler,
    SearchPageAssembler,
    ContentPageAssembler,
    SlotPlannerService,
    SlotDataService,
    CachePolicyService,
    LoadSheddingService,
    ResilienceService,
    ScalabilityMetricsService,
  ],
})
export class AppModule {}
