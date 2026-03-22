import { Module } from "@nestjs/common";
import { MockBackendModule } from "../../adapters/mock/mock-backend.module";
import { I18nService } from "../i18n/i18n.service";
import { SlugModule } from "../slug/slug.module";
import { MarketingOverlayService } from "./marketing-overlay.service";
import { ExperienceProfileService } from "./experience-profile.service";
import { ExperienceResolverService } from "./experience-resolver.service";
import { ExperienceSignalsService } from "./experience-signals.service";
import { ExperienceValidatorService } from "./experience-validator.service";

@Module({
  imports: [SlugModule, MockBackendModule],
  providers: [
    I18nService,
    MarketingOverlayService,
    ExperienceProfileService,
    ExperienceResolverService,
    ExperienceSignalsService,
    ExperienceValidatorService,
  ],
  exports: [ExperienceProfileService, ExperienceResolverService],
})
export class ExperienceModule {}
