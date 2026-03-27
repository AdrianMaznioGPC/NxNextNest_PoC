import type { CheckoutConfig } from "./checkout.types";
import type { CmsBlock } from "./cms.types";
import type {
  Breadcrumb,
  Cart,
  Collection,
  Money,
  Page,
  Product,
} from "./commerce.types";
import type { FilterGroup } from "./listing.types";
import type { LinkLocalizationAudit, LocaleContext } from "./locale.types";
import type {
  MerchandisingMode,
  MerchandisingSortSlug,
  StoreContext,
} from "./store.types";

export type SortOption = {
  title: string;
  slug: string | null;
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE";
  reverse: boolean;
};

export type PageSeo = {
  title: string;
  description: string;
  robots?: {
    index?: boolean;
    follow?: boolean;
    googleBot?: {
      index?: boolean;
      follow?: boolean;
    };
  };
  openGraph?: {
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    images?: {
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }[];
  };
  jsonLd?: Record<string, unknown>;
};

export type ResolvedPageStatus = 200 | 301 | 404;

export type ResolvedPageSchemaVersion = 1 | 2;

export type SlotPriority = "critical" | "deferred";

export type SlotStreamMode = "blocking" | "deferred";

export type SlotDataMode = "inline" | "reference";

export type ExperienceRendererKey =
  | "page.home"
  | "page.category-list"
  | "page.category-subcollections"
  | "page.category-products"
  | "page.product-detail"
  | "page.pdp-main"
  | "page.pdp-recommendations"
  | "page.pdp-reviews"
  | "page.pdp-faq"
  | "page.search-summary"
  | "page.search-products"
  | "page.search-results"
  | "page.content-page"
  | "page.cart"
  | "page.checkout-header"
  | "page.checkout-main"
  | "page.checkout-summary";

export type SlotOverlayRule = {
  rendererKey: ExperienceRendererKey;
  include?: boolean;
  variantKey?: string;
  layoutKey?: string;
  density?: "compact" | "comfortable";
  flags?: Record<string, boolean>;
};

export type SlotReference = {
  endpoint: string;
  query: Record<string, string>;
  ttlSeconds: number;
};

export type SlotPresentation = {
  variantKey: string;
  layoutKey?: string;
  density?: "compact" | "comfortable";
  flags?: Record<string, boolean>;
};

export type ResolvedPageSlot = {
  id: string;
  rendererKey: ExperienceRendererKey;
  props: Record<string, unknown>;
  priority?: SlotPriority;
  cacheTags?: string[];
};

export type SlotManifest = {
  id: string;
  rendererKey: ExperienceRendererKey;
  priority: SlotPriority;
  stream: SlotStreamMode;
  dataMode: SlotDataMode;
  presentation?: SlotPresentation;
  inlineProps?: Record<string, unknown>;
  slotRef?: SlotReference;
  revalidateTags: string[];
  staleAfterSeconds: number;
  fallbackKey?: string;
};

export type SlotPayloadModel = {
  slotId: string;
  rendererKey: ExperienceRendererKey;
  props: Record<string, unknown>;
  presentation?: SlotPresentation;
  revalidateTags: string[];
  staleAfterSeconds: number;
  slotVersion: string;
  requestId?: string;
  timings?: {
    totalMs: number;
  };
};

export type PageContentNode =
  | {
      type: "home";
      blocks: CmsBlock[];
      containerClassName?: string;
    }
  | {
      type: "category-list";
      title: string;
      collections: Collection[];
      containerClassName?: string;
    }
  | {
      type: "category-subcollections";
      breadcrumbs: Breadcrumb[];
      title: string;
      description: string;
      subcollections: Collection[];
      containerClassName?: string;
    }
  | {
      type: "category-products";
      breadcrumbs: Breadcrumb[];
      title: string;
      description: string;
      products: Product[];
      sortOptions: SortOption[];
      filterGroups?: FilterGroup[];
      containerClassName?: string;
    }
  | {
      type: "product-detail";
      product: Product;
      breadcrumbs: Breadcrumb[];
      recommendations: Product[];
      containerClassName?: string;
    }
  | {
      type: "search-results";
      query: string;
      summaryText?: string;
      products: Product[];
      sortOptions: SortOption[];
      filterGroups?: FilterGroup[];
      containerClassName?: string;
    }
  | {
      type: "content-page";
      page: Page;
      containerClassName?: string;
    }
  | {
      type: "cart-page";
      title: string;
      description?: string;
      containerClassName?: string;
    }
  | {
      type: "checkout-page";
      title: string;
      subtitle?: string;
      cart: Cart;
      config: CheckoutConfig;
      initialShippingCost: Money;
      containerClassName?: string;
    };

export type ResolvedPageModel = {
  schemaVersion: ResolvedPageSchemaVersion;
  path: string;
  status: ResolvedPageStatus;
  routeKind?:
    | "home"
    | "search"
    | "category-list"
    | "category-detail"
    | "product-detail"
    | "content-page"
    | "cart"
    | "checkout";
  requestedPath?: string;
  resolvedPath?: string;
  canonicalPath?: string;
  localeContext?: LocaleContext;
  seo: PageSeo;
  content?: PageContentNode[];
  slots?: ResolvedPageSlot[];
  revalidateTags: string[];
  canonicalUrl?: string;
  alternates?: Record<string, string>;
  translationVersion?: string;
  redirectTo?: string;
  matchedRuleId?: string;
  assemblerKey?: string;
  assemblyVersion?: string;
  requestId?: string;
  timings?: {
    routeMs: number;
    assemblyMs: number;
    totalMs: number;
  };
  cacheHints?: {
    maxAgeSeconds: number;
    staleWhileRevalidateSeconds: number;
  };
  translationSource?: "bff-bootstrap";
  localizationAudit?: LinkLocalizationAudit;
  merchandisingApplied?: {
    mode: MerchandisingMode;
    defaultSortSlug?: MerchandisingSortSlug;
  };
};

export type PageBootstrapModel = {
  page: Omit<ResolvedPageModel, "content" | "slots" | "revalidateTags">;
  shell: {
    namespaces: string[];
    messages: Record<string, Record<string, string>>;
    experience: {
      storeKey: string;
      experienceProfileId: string;
      storeFlagIconSrc: StoreContext["storeFlagIconSrc"];
      storeFlagIconLabel: StoreContext["storeFlagIconLabel"];
      themeKey: string;
      themeRevision: string;
      themeTokenPack?: StoreContext["themeTokenPack"];
      language: StoreContext["language"];
      defaultLanguage: StoreContext["defaultLanguage"];
      supportedLanguages: StoreContext["supportedLanguages"];
      cartUxMode: StoreContext["cartUxMode"];
      cartPath: StoreContext["cartPath"];
      openCartOnAdd: StoreContext["openCartOnAdd"];
      merchandisingMode: MerchandisingMode;
      merchandisingProfileId: string;
      layoutKey: string;
    };
  };
  slots: SlotManifest[];
};
