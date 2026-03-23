import { Module } from "@nestjs/common";
import { MockCommerceModule } from "../../adapters/mock/mock-commerce.module";
import { I18nService } from "../i18n/i18n.service";
import { SlugModule } from "../slug/slug.module";
import { BlockOverlayService } from "./block-overlay.service";
import { ExperienceProfileService } from "./experience-profile.service";
import { ExperienceResolverService } from "./experience-resolver.service";
import { ExperienceSignalsService } from "./experience-signals.service";
import { ExperienceValidatorService } from "./experience-validator.service";
import { MarketingOverlayService } from "./marketing-overlay.service";

@Module({
  imports: [SlugModule, MockCommerceModule],
  providers: [
    I18nService,
    BlockOverlayService,
    MarketingOverlayService,
    ExperienceProfileService,
    ExperienceResolverService,
    ExperienceSignalsService,
    ExperienceValidatorService,
  ],
  exports: [
    BlockOverlayService,
    ExperienceProfileService,
    ExperienceResolverService,
  ],
})
export class ExperienceModule {}
