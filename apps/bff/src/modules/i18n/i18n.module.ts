import { Module } from "@nestjs/common";
import { SlugModule } from "../slug/slug.module";
import { I18nController } from "./i18n.controller";
import { I18nService } from "./i18n.service";

@Module({
  imports: [SlugModule],
  controllers: [I18nController],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
