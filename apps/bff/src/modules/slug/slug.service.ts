import type {
  Breadcrumb,
  CmsBlock,
  Collection,
  FeaturedLink,
  LocaleContext,
  MegaMenuItem,
  Menu,
  Page,
  Product,
} from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { SlugMapperService } from "./slug-mapper.service";
import type { ResolvedIncomingRoute, StaticRoutes } from "./slug.types";

const TRANSLATED_SLUGS_REDIRECT_ENABLED =
  process.env.TRANSLATED_SLUGS_REDIRECT_ENABLED === "true";

@Injectable()
export class SlugService {
  constructor(private readonly mapper: SlugMapperService) {}

  resolveIncomingPath(
    localeContext: LocaleContext,
    requestedPath: string,
  ): ResolvedIncomingRoute {
    const resolved = this.mapper.resolveIncomingPath(localeContext, requestedPath);
    if (resolved.status !== 200) {
      return resolved;
    }

    const normalizedRequested = normalizePath(requestedPath);
    const shouldRedirect =
      TRANSLATED_SLUGS_REDIRECT_ENABLED &&
      localeContext.locale !== this.mapper.getDefaultLocale() &&
      normalizedRequested !== resolved.resolvedPath;

    if (!shouldRedirect) {
      return {
        ...resolved,
        requestedPath: normalizedRequested,
      };
    }

    return {
      ...resolved,
      requestedPath: normalizedRequested,
      status: 301,
      redirectTo: resolved.resolvedPath,
    };
  }

  getStaticRoutes(localeContext: LocaleContext): StaticRoutes {
    return {
      home: this.mapper.withLanguagePrefix("/", localeContext),
      search: this.mapper.withLanguagePrefix(
        this.mapper.buildSearchPath(localeContext.locale),
        localeContext,
      ),
      categoryList: this.mapper.withLanguagePrefix(
        this.mapper.buildCategoryListPath(localeContext.locale),
        localeContext,
      ),
      cart: this.mapper.withLanguagePrefix(
        this.mapper.buildCartPath(localeContext.locale),
        localeContext,
      ),
      checkout: this.mapper.withLanguagePrefix(
        this.mapper.buildCheckoutPath(localeContext.locale),
        localeContext,
      ),
    };
  }

  buildAlternates(canonicalPath: string): Record<string, string> {
    return this.mapper.buildAlternatesFromCanonicalPath(canonicalPath);
  }

  localizeProduct(product: Product, localeContext: LocaleContext): Product {
    return {
      ...product,
      path: this.buildProductPath(localeContext, product.handle),
      breadcrumbs: product.breadcrumbs
        ? this.localizeBreadcrumbs(product.breadcrumbs, localeContext)
        : product.breadcrumbs,
    };
  }

  localizeProducts(products: Product[], localeContext: LocaleContext): Product[] {
    return products.map((product) => this.localizeProduct(product, localeContext));
  }

  localizePage(page: Page, localeContext: LocaleContext): Page {
    return {
      ...page,
      path: this.buildPagePath(localeContext, page.handle),
    };
  }

  localizePages(pages: Page[], localeContext: LocaleContext): Page[] {
    return pages.map((page) => this.localizePage(page, localeContext));
  }

  localizeCollection(
    collection: Collection,
    localeContext: LocaleContext,
  ): Collection {
    return {
      ...collection,
      path: this.localizePath(collection.path, localeContext),
      subcollections: collection.subcollections?.map((sub) =>
        this.localizeCollection(sub, localeContext),
      ),
    };
  }

  localizeCollections(
    collections: Collection[],
    localeContext: LocaleContext,
  ): Collection[] {
    return collections.map((collection) =>
      this.localizeCollection(collection, localeContext),
    );
  }

  localizeBreadcrumbs(
    breadcrumbs: Breadcrumb[],
    localeContext: LocaleContext,
  ): Breadcrumb[] {
    return breadcrumbs.map((breadcrumb) => ({
      ...breadcrumb,
      path: this.localizePath(breadcrumb.path, localeContext),
    }));
  }

  localizeMenu(menu: Menu[], localeContext: LocaleContext): Menu[] {
    return menu.map((item) => ({
      ...item,
      path: this.localizePath(item.path, localeContext),
    }));
  }

  localizeMegaMenu(
    items: MegaMenuItem[],
    localeContext: LocaleContext,
  ): MegaMenuItem[] {
    return items.map((item) => ({
      ...item,
      path: this.localizePath(item.path, localeContext),
      children: item.children?.map((child) => ({
        ...child,
        path: this.localizePath(child.path, localeContext),
      })),
    }));
  }

  localizeFeaturedLinks(
    links: FeaturedLink[],
    localeContext: LocaleContext,
  ): FeaturedLink[] {
    return links.map((link) => ({
      ...link,
      path: this.localizePath(link.path, localeContext),
    }));
  }

  localizeCmsBlocks(blocks: CmsBlock[], localeContext: LocaleContext): CmsBlock[] {
    return blocks.map((block) => {
      if (block.type === "hero-banner") {
        return {
          ...block,
          ctaUrl: block.ctaUrl
            ? this.localizePath(block.ctaUrl, localeContext)
            : block.ctaUrl,
        };
      }

      if (block.type === "featured-products" || block.type === "product-carousel") {
        return {
          ...block,
          products: this.localizeProducts(block.products, localeContext),
        };
      }

      return block;
    });
  }

  localizePath(path: string, localeContext: LocaleContext): string {
    return this.mapper.localizePathFromCanonical(path, localeContext);
  }

  buildProductPath(localeContext: LocaleContext, productHandle: string): string {
    return this.mapper.withLanguagePrefix(
      this.mapper.buildProductPath(localeContext.locale, productHandle),
      localeContext,
    );
  }

  buildPagePath(localeContext: LocaleContext, pageHandle: string): string {
    return this.mapper.withLanguagePrefix(
      this.mapper.buildPagePath(localeContext.locale, pageHandle),
      localeContext,
    );
  }

  buildCategoryPath(localeContext: LocaleContext, categoryKey: string): string {
    return this.mapper.withLanguagePrefix(
      this.mapper.buildCategoryPath(localeContext.locale, categoryKey),
      localeContext,
    );
  }

  toCanonicalProductHandle(localeContext: LocaleContext, slug: string) {
    return this.mapper.toCanonicalProductHandle(localeContext.locale, slug);
  }

  toCanonicalCategoryKey(localeContext: LocaleContext, slugPath: string) {
    return this.mapper.toCanonicalCategoryKey(localeContext.locale, slugPath);
  }

  toCanonicalPageHandle(localeContext: LocaleContext, slug: string) {
    return this.mapper.toCanonicalPageHandle(localeContext.locale, slug);
  }
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized.replace(/\/+$/, "") || "/";
}
