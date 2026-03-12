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
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  handle: string;
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
