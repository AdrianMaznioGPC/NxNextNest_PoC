import type { SwitchUrlRequest } from "@commerce/shared-types";
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { SwitchUrlService } from "./switch-url.service";

@Controller("i18n")
export class SwitchUrlController {
  constructor(private readonly switchUrl: SwitchUrlService) {}

  @Post("switch-url")
  async switchUrlForRegionAndLanguage(@Body() payload: SwitchUrlRequest) {
    if (!payload?.path) {
      throw new BadRequestException("Field 'path' is required");
    }
    if (!payload?.sourceHost) {
      throw new BadRequestException("Field 'sourceHost' is required");
    }
    if (!payload?.targetRegion) {
      throw new BadRequestException("Field 'targetRegion' is required");
    }
    if (!payload?.targetLanguage) {
      throw new BadRequestException("Field 'targetLanguage' is required");
    }

    return this.switchUrl.resolveTargetUrl(payload);
  }
}
