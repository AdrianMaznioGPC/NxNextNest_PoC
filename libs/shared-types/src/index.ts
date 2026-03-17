export type Maybe<T> = T | null;

export type Cart = {
  id: string | undefined;
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
  id: string;
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  path: string;
  updatedAt: string;
  image?: Image;
  parentId?: string;
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
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type BaseProductVariant = {
  id: string;
  title: string;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export type BaseProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  variants: BaseProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ProductVariant = BaseProductVariant & {
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
  price?: Money;
};

export type Product = Omit<BaseProduct, "variants"> & {
  purchasable: boolean;
  stockStatus: string;
  stockMessage: string;
  priceRange: {
    maxVariantPrice?: Money;
    minVariantPrice?: Money;
  };
  variants: ProductVariant[];
  breadcrumbs?: Breadcrumb[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
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

export type CmsBannerItem = {
  heading: string;
  subheading?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  image: Image;
  overlayOpacity?: number;
};

export type CmsBannerBlock = CmsBlockBase<"cms-banner"> & CmsBannerItem;

export type BannerGridBlock = CmsBlockBase<"banner-grid"> & {
  columns: number;
  banners: CmsBannerItem[];
};

export type FeaturedCategoryBlock = CmsBlockBase<"featured-category"> & {
  heading: string;
  collections: Collection[];
};

export type Testimonial = {
  quote: string;
  author: string;
  rating: number;
  avatar?: Image;
};

export type SocialProofBlock = CmsBlockBase<"social-proof"> & {
  heading: string;
  testimonials: Testimonial[];
};

export type UspItem = {
  icons: Image[];
};

export type HomepageHeroBlock = CmsBlockBase<"homepage-hero"> & {
  megaMenu: MegaMenuItem[];
  mainBanner: CmsBannerItem;
  usps: UspItem[];
  smallBanners: CmsBannerItem[];
};

export type CmsBlock =
  | HeroBannerBlock
  | HomepageHeroBlock
  | FeaturedProductsBlock
  | ProductCarouselBlock
  | RichTextBlock
  | CmsBannerBlock
  | BannerGridBlock
  | FeaturedCategoryBlock
  | SocialProofBlock;

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
  canonicalSlug: string;
  breadcrumbs: Breadcrumb[];
  subcollections?: Collection[];
  products?: Product[];
  sortOptions?: SortOption[];
};

export type ProductPageData = {
  product: Product;
  canonicalSlug: string;
  breadcrumbs: Breadcrumb[];
  recommendations: Product[];
};

export type SortOption = {
  slug: string;
  labelKey: string;
  sortKey: string;
  reverse: boolean;
  isDefault?: boolean;
};

export type SearchPageData = {
  query: string;
  products: Product[];
  totalResults: number;
  sortOptions: SortOption[];
};

export type GlobalLayoutData = {
  megaMenu: MegaMenuItem[];
  featuredLinks: FeaturedLink[];
};

// -- Checkout types ----------------------------------------------------------

export type AddressFieldOption = {
  value: string;
  labelKey: string;
};

export type AddressFieldValidation = {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

export type AddressFieldConfig = {
  name: string;
  labelKey: string;
  type: "text" | "email" | "tel" | "select";
  autoComplete?: string;
  required: boolean;
  options?: AddressFieldOption[];
  colSpan?: 1 | 2 | 3;
  validation?: AddressFieldValidation;
};

export type AddressFormSchema = {
  rows: AddressFieldConfig[][];
};

export type DeliveryOption = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  price: Money;
};

export type PaymentOption = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon?: string;
};

export type SavedAddress = {
  id: string;
  label: string;
  values: Record<string, string>;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
};

export type CheckoutConfig = {
  addressSchema: AddressFormSchema;
  billingAddressSchema: AddressFormSchema;
  deliveryOptions: DeliveryOption[];
  paymentOptions: PaymentOption[];
  savedAddresses: SavedAddress[];
};

// -- Sitemap types -----------------------------------------------------------

export type SitemapEntry = {
  url: string;
  lastModified: string;
};

export type SitemapPageData = {
  entries: SitemapEntry[];
};

// -- Error types -------------------------------------------------------------

export type BffErrorResponse = {
  statusCode: number;
  errorCode: string;
  message: string;
  details?: Record<string, unknown>;
};
