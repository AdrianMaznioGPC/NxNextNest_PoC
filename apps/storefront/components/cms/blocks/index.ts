import { registerBlockRenderer } from "../block-registry";
import BannerGrid from "./banner-grid";
import CmsBanner from "./cms-banner";
import FeaturedCategory from "./featured-category";
import FeaturedProducts from "./featured-products";
import HeroBanner from "./hero-banner";
import HomepageHero from "./homepage-hero";
import ProductCarousel from "./product-carousel";
import RichText from "./rich-text";
import SocialProof from "./social-proof";

export function registerAllBlockRenderers(): void {
  registerBlockRenderer("banner-grid", BannerGrid);
  registerBlockRenderer("cms-banner", CmsBanner);
  registerBlockRenderer("featured-category", FeaturedCategory);
  registerBlockRenderer("featured-products", FeaturedProducts);
  registerBlockRenderer("hero-banner", HeroBanner);
  registerBlockRenderer("homepage-hero", HomepageHero);
  registerBlockRenderer("product-carousel", ProductCarousel);
  registerBlockRenderer("rich-text", RichText);
  registerBlockRenderer("social-proof", SocialProof);
}
