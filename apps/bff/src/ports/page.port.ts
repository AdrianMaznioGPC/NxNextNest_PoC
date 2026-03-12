import type { Page } from "@commerce/shared-types";

export interface PagePort {
  getPage(handle: string): Promise<Page | undefined>;

  getPages(): Promise<Page[]>;
}

export const PAGE_PORT = Symbol("PAGE_PORT");
