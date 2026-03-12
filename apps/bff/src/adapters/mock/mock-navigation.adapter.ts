import type { FeaturedLink, MegaMenuItem } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import type { NavigationPort } from "../../ports/navigation.port";
import { collections } from "./mock-data";

@Injectable()
export class MockNavigationAdapter implements NavigationPort {
  async getMegaMenu(): Promise<MegaMenuItem[]> {
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
    return [
      { title: "All Parts", path: "/categories" },
      { title: "Brakes", path: "/categories/brakes" },
      { title: "Engine", path: "/categories/engine" },
      { title: "Exhaust", path: "/categories/exhaust" },
    ];
  }
}
