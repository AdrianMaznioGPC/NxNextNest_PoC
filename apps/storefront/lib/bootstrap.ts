import type { PageBootstrapModel } from "lib/types";
import { cache } from "react";
import { getPageBootstrap } from "./api";
import {
  getRequestLocaleContext,
  getRequestPathAndQuery,
} from "./i18n/request-context";

export const getRequestBootstrap = cache(
  async (): Promise<PageBootstrapModel> => {
    const localeContext = await getRequestLocaleContext();
    const { path, query } = await getRequestPathAndQuery();
    return getPageBootstrap(path, query, localeContext);
  },
);
