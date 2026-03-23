import type { LocaleContext } from "@commerce/shared-types";

export type CartLineMerchandiseInput = {
  productHandle: string;
  productTitle?: string;
  merchandiseId: string;
  merchandiseTitle: string;
  selectedOptions: { name: string; value: string }[];
};

export type CartLineMerchandiseOutput = {
  productTitle: string;
  merchandiseTitle: string;
  selectedOptions: { name: string; value: string }[];
};

export interface CartLocalizationPort {
  localizeCartLineMerchandise(
    input: CartLineMerchandiseInput,
    localeContext?: LocaleContext,
  ): CartLineMerchandiseOutput;
}

export const CART_LOCALIZATION_PORT = Symbol("CART_LOCALIZATION_PORT");
