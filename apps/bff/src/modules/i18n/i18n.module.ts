import { Module } from "@nestjs/common";
import { I18nController } from "./i18n.controller";
import { I18nService } from "./i18n.service";
import { SwitchUrlService } from "./switch-url.service";

@Module({
  controllers: [I18nController],
  providers: [I18nService, SwitchUrlService],
  exports: [I18nService, SwitchUrlService],
})
export class I18nModule {}
