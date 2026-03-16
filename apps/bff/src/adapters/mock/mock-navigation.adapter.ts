import type { FeaturedLink, MegaMenuItem } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { NavigationPort } from "../../ports/navigation.port";
import { StoreContext } from "../../store";
import { collectionsByStore } from "./data/catalog-data";

const featuredLinksByStore: Record<string, FeaturedLink[]> = {
  fr: [
    { title: "Toutes les pi\u00e8ces", path: "/categories" },
    { title: "Freins", path: "/categories/brakes" },
    { title: "Moteur", path: "/categories/engine" },
    { title: "\u00c9chappement", path: "/categories/exhaust" },
  ],
  ie: [
    { title: "All Parts", path: "/categories" },
    { title: "Brakes", path: "/categories/brakes" },
    { title: "Engine", path: "/categories/engine" },
    { title: "Exhaust", path: "/categories/exhaust" },
  ],
};

@Injectable()
export class MockNavigationAdapter implements NavigationPort {
  constructor(private readonly storeCtx: StoreContext) {}

  async getMegaMenu(): Promise<MegaMenuItem[]> {
    const collections =
      collectionsByStore[this.storeCtx.storeCode] ?? collectionsByStore["fr"]!;
    return collections.map((c) => ({
      title: c.title,
      path: c.path,
      image: c.image,
      children: c.subcollections?.map((sub) => ({
        title: sub.title,
        path: sub.path,
        image: sub.image,
      })),
    }));
  }

  async getFeaturedLinks(): Promise<FeaturedLink[]> {
    return (
      featuredLinksByStore[this.storeCtx.storeCode] ??
      featuredLinksByStore["fr"]!
    );
  }
}
