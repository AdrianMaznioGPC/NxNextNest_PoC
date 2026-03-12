import type { FeaturedLink, MegaMenuItem } from "@commerce/shared-types";

export interface NavigationPort {
  getMegaMenu(): Promise<MegaMenuItem[]>;
  getFeaturedLinks(): Promise<FeaturedLink[]>;
}

export const NAVIGATION_PORT = Symbol("NAVIGATION_PORT");
