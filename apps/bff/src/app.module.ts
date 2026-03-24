import { Module } from "@nestjs/common";
import { LaunchDarklyModule } from "./adapters/launchdarkly/launchdarkly.module";
import { MockCommerceModule } from "./adapters/mock/mock-commerce.module";
import { MockDirectiveModule } from "./adapters/mock/mock-directive.module";
import { AppController } from "./app.controller";
import { CartModule } from "./modules/cart/cart.module";
import { CheckoutController } from "./modules/checkout/checkout.controller";
import { CollectionController } from "./modules/collection/collection.controller";
import { AddressBookController } from "./modules/customer/address-book.controller";
import { ExperienceModule } from "./modules/experience/experience.module";
import { I18nModule } from "./modules/i18n/i18n.module";
import { SwitchUrlModule } from "./modules/i18n/switch-url.module";
import { MenuController } from "./modules/menu/menu.controller";
import { MerchandisingModule } from "./modules/merchandising/merchandising.module";
import { PageDataModule } from "./modules/page-data/page-data.module";
import { PageController } from "./modules/page/page.controller";
import { ProductController } from "./modules/product/product.controller";
import { SlugModule } from "./modules/slug/slug.module";
import { SystemModule } from "./modules/system/system.module";

/**
 * Commerce ports are always served by MockCommerceModule.
 * The directive provider is swapped based on DIRECTIVE_PROVIDER env:
 * - "launchdarkly" → LaunchDarklyModule
 * - default → MockDirectiveModule
 */
const DirectiveModule =
  process.env.DIRECTIVE_PROVIDER === "launchdarkly"
    ? LaunchDarklyModule
    : MockDirectiveModule;

@Module({
  imports: [
    MockCommerceModule,
    DirectiveModule,
    SlugModule,
    I18nModule,
    SystemModule,
    ExperienceModule,
    MerchandisingModule,
    PageDataModule,
    CartModule,
    SwitchUrlModule,
  ],
  controllers: [
    AppController,
    ProductController,
    CollectionController,
    PageController,
    MenuController,
    CheckoutController,
    AddressBookController,
  ],
})
export class AppModule {}
