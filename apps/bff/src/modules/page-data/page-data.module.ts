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
import { BootstrapResponseBuilder } from "./bootstrap/bootstrap-response.builder";
import { BootstrapStageFactory } from "./bootstrap/bootstrap-stage.factory";
import { DefaultAssemblerBudgetConfig } from "./models/assembler-budget.config";
import { PageDataController } from "./page-data.controller";
import { PageDataService } from "./page-data.service";
import { RouteMatcherFactory } from "./routing/route-matcher.factory";
import { RouteRecognitionService } from "./routing/route-recognition.service";
import { SlugIndexService } from "./routing/slug-index.service";
import { SlotDataService } from "./slot-data.service";
import { SlotPlannerService } from "./slot-planner.service";
import { AssemblyCacheStage } from "./stages/assembly-cache.stage";
import { ContextResolutionStage } from "./stages/context-resolution.stage";
import { LinkLocalizationStage } from "./stages/link-localization.stage";
import { PageAssemblyStage } from "./stages/page-assembly.stage";
import { PersonalizationStage } from "./stages/personalization.stage";
import { RouteRecognitionStage } from "./stages/route-recognition.stage";
import { SlotPlanningStage } from "./stages/slot-planning.stage";

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
    DefaultAssemblerBudgetConfig,
    // Bootstrap stages
    RouteRecognitionStage,
    ContextResolutionStage,
    AssemblyCacheStage,
    PageAssemblyStage,
    SlotPlanningStage,
    PersonalizationStage,
    LinkLocalizationStage,
    // Bootstrap factory and builder
    BootstrapStageFactory,
    BootstrapResponseBuilder,
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
