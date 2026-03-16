import type { GlobalLayoutData } from "@commerce/shared-types";
import { Inject, Injectable } from "@nestjs/common";
import { NAVIGATION_PORT, type NavigationPort } from "../../ports/navigation.port";

@Injectable()
export class NavigationDomainService {
  constructor(
    @Inject(NAVIGATION_PORT) private readonly navigation: NavigationPort,
  ) {}

  async getLayoutData(): Promise<GlobalLayoutData> {
    const [megaMenu, featuredLinks] = await Promise.all([
      this.navigation.getMegaMenu(),
      this.navigation.getFeaturedLinks(),
    ]);

    return { megaMenu, featuredLinks };
  }
}
