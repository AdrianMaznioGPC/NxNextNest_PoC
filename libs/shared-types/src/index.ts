export type Maybe<T> = T | null;

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

export type CartProduct = {
  id: string;
  handle: string;
  path: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  path: string;
  updatedAt: string;
  image?: Image;
  parentHandle?: string;
  subcollections?: Collection[];
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  path: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  handle: string;
  path: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  breadcrumbs?: Breadcrumb[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type SEO = {
  title: string;
  description: string;
};

export type Breadcrumb = {
  title: string;
  path: string;
};

// -- CMS Block types ---------------------------------------------------------

export type CmsBlockBase<T extends string = string> = {
  type: T;
  id: string;
};

export type HeroBannerBlock = CmsBlockBase<"hero-banner"> & {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
};

export type FeaturedProductsBlock = CmsBlockBase<"featured-products"> & {
  heading: string;
  products: Product[];
};

export type ProductCarouselBlock = CmsBlockBase<"product-carousel"> & {
  heading: string;
  products: Product[];
};

export type RichTextBlock = CmsBlockBase<"rich-text"> & {
  html: string;
};

export type CmsBlock =
  | HeroBannerBlock
  | FeaturedProductsBlock
  | ProductCarouselBlock
  | RichTextBlock;

// -- Navigation types --------------------------------------------------------

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

// -- Page data contracts -----------------------------------------------------

export type HomePageData = {
  blocks: CmsBlock[];
};

export type CategoryListPageData = {
  collections: Collection[];
};

export type CategoryPageData = {
  collection: Collection;
  breadcrumbs: Breadcrumb[];
  subcollections?: Collection[];
  products?: Product[];
};

export type ProductPageData = {
  product: Product;
  breadcrumbs: Breadcrumb[];
  recommendations: Product[];
};

export type SearchPageData = {
  query: string;
  products: Product[];
  totalResults: number;
};

export type GlobalLayoutData = {
  megaMenu: MegaMenuItem[];
  featuredLinks: FeaturedLink[];
  routes: {
    home: string;
    search: string;
    categoryList: string;
    cart: string;
  };
};

// -- Resolved page contract ---------------------------------------------------

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

export type LocaleContext = {
  locale: string;
  language: LanguageCode;
  region: string;
  currency: string;
  market: string;
  domain: string;
};

export type LanguageCode = "en" | "es" | "nl" | "fr";

export type LinkLocalizationAudit = {
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  nonCompliantLinkCount: number;
  normalizedLinkCount?: number;
  samplePaths?: string[];
};

export type CartUxMode = "drawer" | "page";
export type MerchandisingMode = "discovery" | "conversion" | "clearance";
export type MerchandisingSortSlug =
  | "trending-desc"
  | "price-asc"
  | "price-desc"
  | "latest-desc";

export type StoreContext = {
  storeKey: string;
  experienceProfileId: string;
  storeFlagIconSrc: string;
  storeFlagIconLabel: string;
  themeKey: string;
  themeRevision: string;
  themeTokenPack?: string;
  language: LanguageCode;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  cartUxMode: CartUxMode;
  cartPath: string;
  openCartOnAdd: boolean;
};

export type I18nMessageDescriptor = {
  namespace: string;
  key: string;
  values?: Record<string, string | number | boolean>;
  fallback?: string;
};

export type DomainConfigEntry = LocaleContext & {
  host: string;
  canonical?: boolean;
  regionCode: string;
  defaultLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  storeKey: StoreContext["storeKey"];
  experienceProfileId: StoreContext["experienceProfileId"];
  storeFlagIconSrc: StoreContext["storeFlagIconSrc"];
  storeFlagIconLabel: StoreContext["storeFlagIconLabel"];
  themeKey: StoreContext["themeKey"];
  themeRevision: StoreContext["themeRevision"];
  themeTokenPack?: StoreContext["themeTokenPack"];
  cartUxMode: StoreContext["cartUxMode"];
  cartPath: StoreContext["cartPath"];
  openCartOnAdd: StoreContext["openCartOnAdd"];
};

export type DomainConfigAlias = {
  host: string;
  canonicalHost: string;
};

export type DomainConfigModel = {
  version: string;
  updatedAt: string;
  maxAgeSeconds: number;
  defaultDomain: string;
  domains: DomainConfigEntry[];
  aliases?: DomainConfigAlias[];
};

export type I18nMessagesModel = {
  locale: string;
  namespaces: string[];
  messages: Record<string, Record<string, string>>;
  translationVersion: string;
};

export type SlotStreamMode = "blocking" | "deferred";

export type SlotDataMode = "inline" | "reference";

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
  rendererKey: string;
  props: Record<string, unknown>;
  priority?: SlotPriority;
  cacheTags?: string[];
};

export type SlotManifest = {
  id: string;
  rendererKey: string;
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
  rendererKey: string;
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
    | "cart";
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

export type SwitchUrlRequest = {
  path: string;
  query?: Record<string, string | undefined>;
  sourceHost: string;
  sourceOrigin?: string;
  targetRegion: string;
  targetLanguage: LanguageCode;
};

// -- Checkout types ----------------------------------------------------------

export type CheckoutFlowType = "single-page" | "multi-step" | "express";

export type AddressFieldValidation = {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

export type AddressFieldOption = {
  label: string;
  value: string;
};

export type AddressFieldConfig = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  autoComplete?: string;
  required: boolean;
  colSpan?: number;
  options?: AddressFieldOption[];
  validation?: AddressFieldValidation;
};

export type AddressFormSchema = {
  rows: AddressFieldConfig[][];
};

export type SavedAddress = {
  id: string;
  label: string;
  values: Record<string, string>;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type DeliveryOption = {
  id: string;
  label: string;
  description: string;
  price: Money;
};

export type PaymentOption = {
  id: string;
  label: string;
  description: string;
};

export type CheckoutConfig = {
  flowType: CheckoutFlowType;
  addressSchema: AddressFormSchema;
  billingAddressSchema: AddressFormSchema;
  savedAddresses: SavedAddress[];
  deliveryOptions: DeliveryOption[];
  paymentOptions: PaymentOption[];
};

export type PlaceOrderRequest = {
  cartId: string;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  deliveryOptionId: string;
  paymentOptionId: string;
};

export type OrderLineItem = {
  title: string;
  variantTitle: string;
  quantity: number;
  image: Image;
  totalPrice: Money;
};

export type OrderConfirmation = {
  orderId: string;
  orderNumber: string;
  lines: OrderLineItem[];
  cost: {
    subtotalAmount: Money;
    shippingAmount: Money;
    taxAmount: Money;
    totalAmount: Money;
  };
  deliveryOption: { label: string; description: string };
  paymentOption: { label: string; description: string };
};

// -- URL switching types -----------------------------------------------------

export type SwitchUrlResponse = {
  targetUrl: string;
  resolved: {
    routeKind?:
      | "home"
      | "search"
      | "category-list"
      | "category-detail"
      | "product-detail"
      | "content-page"
      | "cart";
    fallbackApplied: boolean;
    reason?:
      | "translated_slug_missing"
      | "entity_unavailable_in_region"
      | "cart_disabled_in_target_store"
      | "unknown_route"
      | "target_region_unresolved";
  };
};
