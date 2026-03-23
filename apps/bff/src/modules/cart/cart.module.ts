import { Module } from "@nestjs/common";
import { I18nModule } from "../i18n/i18n.module";
import { SlugModule } from "../slug/slug.module";
import { CartSessionService } from "./cart-session.service";
import { CartController } from "./cart.controller";

/**
 * CartModule depends on CART_PORT and CART_LOCALIZATION_PORT which are
 * provided globally by the commerce adapter module (e.g. MockCommerceModule)
 * registered at the AppModule level.
 */
@Module({
  imports: [SlugModule, I18nModule],
  controllers: [CartController],
  providers: [CartSessionService],
})
export class CartModule {}
