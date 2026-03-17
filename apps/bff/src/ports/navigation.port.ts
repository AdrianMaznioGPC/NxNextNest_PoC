import type {
  FeaturedLink,
  LocaleContext,
  MegaMenuItem,
} from "@commerce/shared-types";

export interface NavigationPort {
  getMegaMenu(localeContext?: LocaleContext): Promise<MegaMenuItem[]>;
  getFeaturedLinks(localeContext?: LocaleContext): Promise<FeaturedLink[]>;
}

export const NAVIGATION_PORT = Symbol("NAVIGATION_PORT");
