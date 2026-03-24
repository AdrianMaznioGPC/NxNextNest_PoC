import { Module } from "@nestjs/common";
import { ExperienceModule } from "../experience/experience.module";
import { I18nModule } from "../i18n/i18n.module";
import { MerchandisingModule } from "../merchandising/merchandising.module";
import { SlugModule } from "../slug/slug.module";
import { SystemModule } from "../system/system.module";
import { CartPageAssembler } from "./assemblers/cart-page.assembler";
import { CategoryDetailPageAssembler } from "./assemblers/category-detail-page.assembler";
import { CategoryListPageAssembler } from "./assemblers/category-list-page.assembler";
import { CheckoutPageAssembler } from "./assemblers/checkout-page.assembler";
import { ContentPageAssembler } from "./assemblers/content-page.assembler";
import { HomePageAssembler } from "./assemblers/home-page.assembler";
import { PageAssemblerRegistry } from "./assemblers/page-assembler.registry";
import { ProductDetailPageAssembler } from "./assemblers/product-detail-page.assembler";
import { SearchPageAssembler } from "./assemblers/search-page.assembler";
import { BootstrapOrchestratorService } from "./bootstrap-orchestrator.service";
import { PageDataController } from "./page-data.controller";
import { PageDataService } from "./page-data.service";
import { RouteMatcherFactory } from "./routing/route-matcher.factory";
import { RouteRecognitionService } from "./routing/route-recognition.service";
import { SlugIndexService } from "./routing/slug-index.service";
import { SlotDataService } from "./slot-data.service";
import { SlotPlannerService } from "./slot-planner.service";

@Module({
  imports: [
    SlugModule,
    I18nModule,
    SystemModule,
    ExperienceModule,
    MerchandisingModule,
  ],
  controllers: [PageDataController],
  providers: [
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
    CheckoutPageAssembler,
    ProductDetailPageAssembler,
    SearchPageAssembler,
    ContentPageAssembler,
    SlotPlannerService,
    SlotDataService,
  ],
  exports: [
    PageDataService,
    BootstrapOrchestratorService,
    RouteRecognitionService,
    RouteMatcherFactory,
    SlugIndexService,
  ],
})
export class PageDataModule {}
