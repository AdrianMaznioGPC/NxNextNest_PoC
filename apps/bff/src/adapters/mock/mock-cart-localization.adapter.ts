import type { LocaleContext } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type {
  CartLineMerchandiseInput,
  CartLineMerchandiseOutput,
  CartLocalizationPort,
} from "../../ports/cart-localization.port";
import { localizeCartLineMerchandise } from "./mock-commerce-localization";

@Injectable()
export class MockCartLocalizationAdapter implements CartLocalizationPort {
  localizeCartLineMerchandise(
    input: CartLineMerchandiseInput,
    localeContext?: LocaleContext,
  ): CartLineMerchandiseOutput {
    const result = localizeCartLineMerchandise(input, localeContext);
    return result.value;
  }
}
