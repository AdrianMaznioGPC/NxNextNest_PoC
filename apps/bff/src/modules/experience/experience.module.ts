import { Module } from "@nestjs/common";
import { I18nService } from "../i18n/i18n.service";
import { SlugModule } from "../slug/slug.module";
import { ExperienceProfileService } from "./experience-profile.service";
import { ExperienceResolverService } from "./experience-resolver.service";
import { ExperienceValidatorService } from "./experience-validator.service";

@Module({
  imports: [SlugModule],
  providers: [
    I18nService,
    ExperienceProfileService,
    ExperienceResolverService,
    ExperienceValidatorService,
  ],
  exports: [ExperienceProfileService, ExperienceResolverService],
})
export class ExperienceModule {}
