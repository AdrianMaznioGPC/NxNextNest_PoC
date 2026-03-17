import { registerBlockResolver } from "../block-resolver-registry";
import { bannerGridResolver } from "./banner-grid.block";
import { cmsBannerResolver } from "./cms-banner.block";
import { featuredCategoryResolver } from "./featured-category.block";
import { featuredProductsResolver } from "./featured-products.block";
import { heroBannerResolver } from "./hero-banner.block";
import { homepageHeroResolver } from "./homepage-hero.block";
import { productCarouselResolver } from "./product-carousel.block";
import { richTextResolver } from "./rich-text.block";
import { socialProofResolver } from "./social-proof.block";

export function registerAllBlockResolvers(): void {
  registerBlockResolver("banner-grid", bannerGridResolver);
  registerBlockResolver("cms-banner", cmsBannerResolver);
  registerBlockResolver("featured-category", featuredCategoryResolver);
  registerBlockResolver("featured-products", featuredProductsResolver);
  registerBlockResolver("hero-banner", heroBannerResolver);
  registerBlockResolver("homepage-hero", homepageHeroResolver);
  registerBlockResolver("product-carousel", productCarouselResolver);
  registerBlockResolver("rich-text", richTextResolver);
  registerBlockResolver("social-proof", socialProofResolver);
}
