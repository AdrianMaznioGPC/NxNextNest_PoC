import { Module } from "@nestjs/common";
import { PageDataModule } from "../page-data/page-data.module";
import { SlugModule } from "../slug/slug.module";
import { I18nModule } from "./i18n.module";
import { SwitchUrlController } from "./switch-url.controller";
import { SwitchUrlService } from "./switch-url.service";

/**
 * SwitchUrlModule is separate from I18nModule because SwitchUrlService
 * cross-cuts I18n, PageData, and Slug concerns. Placing it in I18nModule
 * would create a hidden circular dependency (PageDataModule → I18nModule → PageDataModule).
 */
@Module({
  imports: [I18nModule, PageDataModule, SlugModule],
  controllers: [SwitchUrlController],
  providers: [SwitchUrlService],
  exports: [SwitchUrlService],
})
export class SwitchUrlModule {}
