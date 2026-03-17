import type { FeaturedLink, MegaMenuItem } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { NavigationPort } from "../../ports/navigation.port";
import { StoreContext } from "../../store";
import { collectionsByStore } from "./data/catalog-data";
import { getStoreData } from "./data/store-data";

const featuredLinksByStore: Record<string, FeaturedLink[]> = {
  fr: [
    { title: "Toutes les pi\u00e8ces", path: "/categories" },
    { title: "Freins", path: "/categories/freins/c/cat-brakes" },
    { title: "Moteur", path: "/categories/moteur/c/cat-engine" },
    {
      title: "\u00c9chappement",
      path: "/categories/echappement/c/cat-exhaust",
    },
  ],
  ie: [
    { title: "All Parts", path: "/categories" },
    { title: "Brakes", path: "/categories/brakes/c/cat-brakes" },
    { title: "Engine", path: "/categories/engine/c/cat-engine" },
    { title: "Exhaust", path: "/categories/exhaust/c/cat-exhaust" },
  ],
};

@Injectable()
export class MockNavigationAdapter implements NavigationPort {
  constructor(private readonly storeCtx: StoreContext) {}

  async getMegaMenu(): Promise<MegaMenuItem[]> {
    const collections = getStoreData(
      collectionsByStore,
      this.storeCtx.storeCode,
    );
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
    return getStoreData(featuredLinksByStore, this.storeCtx.storeCode);
  }
}
