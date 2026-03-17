import { Module } from "@nestjs/common";
import { LinkLocalizationPolicyService } from "./link-localization-policy.service";
import { SlugMapperService } from "./slug-mapper.service";
import { SlugService } from "./slug.service";

@Module({
  providers: [SlugMapperService, SlugService, LinkLocalizationPolicyService],
  exports: [SlugMapperService, SlugService, LinkLocalizationPolicyService],
})
export class SlugModule {}
