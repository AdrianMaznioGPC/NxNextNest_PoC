import type { Image } from "./commerce.types";

export type MegaMenuItem = {
  title: string;
  path: string;
  image?: Image;
  children?: MegaMenuItem[];
};

export type FeaturedLink = {
  title: string;
  path: string;
};
