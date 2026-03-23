import { Module } from "@nestjs/common";
import { I18nModule } from "../i18n/i18n.module";
import { SlugModule } from "../slug/slug.module";
import { BlockOverlayService } from "./block-overlay.service";
import { ExperienceProfileService } from "./experience-profile.service";
import { ExperienceResolverService } from "./experience-resolver.service";
import { ExperienceSignalsService } from "./experience-signals.service";
import { ExperienceValidatorService } from "./experience-validator.service";
import { MarketingOverlayService } from "./marketing-overlay.service";

/**
 * ExperienceModule requires MARKETING_DIRECTIVE_PORT to be available in the
 * module tree (provided by either MockDirectiveModule or LaunchDarklyModule
 * at the AppModule level).
 */
@Module({
  imports: [SlugModule, I18nModule],
  providers: [
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
