import { Injectable } from "@nestjs/common";
import type { CmsPort, CmsRawPage } from "../../ports/cms.port";

const mockPages: CmsRawPage[] = [
  {
    slug: "home",
    blocks: [
      {
        type: "hero-banner",
        id: "block-1",
        heading: "Summer Sale",
        subheading: "Up to 40% off performance parts",
        ctaLabel: "Shop Now",
        ctaUrl: "/categories",
        image: {
          url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop",
          altText: "Summer sale banner",
          width: 1200,
          height: 400,
        },
      },
      {
        type: "featured-products",
        id: "block-2",
        heading: "Top Picks",
        productHandles: [
          "ceramic-brake-pads",
          "coilover-kit",
          "cat-back-exhaust",
        ],
      },
      {
        type: "product-carousel",
        id: "block-3",
        heading: "New Arrivals",
        collectionHandle: "hidden-homepage-carousel",
      },
      {
        type: "cms-banner",
        id: "block-4",
        heading: "Free Shipping on Orders Over $99",
        subheading: "Limited time offer \u2014 upgrade your ride today",
        ctaLabel: "Browse Parts",
        ctaUrl: "/categories",
        image: {
          url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=400&fit=crop",
          altText: "Free shipping banner",
          width: 1200,
          height: 400,
        },
      },
      {
        type: "banner-grid",
        id: "block-5",
        columns: 2,
        banners: [
          {
            heading: "Brake Upgrades",
            ctaLabel: "Shop Brakes",
            ctaUrl: "/categories/brakes",
            image: {
              url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              altText: "Brake upgrades",
              width: 600,
              height: 400,
            },
          },
          {
            heading: "Exhaust Systems",
            ctaLabel: "Shop Exhaust",
            ctaUrl: "/categories/exhaust",
            image: {
              url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
              altText: "Exhaust systems",
              width: 600,
              height: 400,
            },
          },
        ],
      },
      {
        type: "featured-category",
        id: "block-6",
        heading: "Shop by Category",
        collectionHandles: [
          "brakes",
          "engine",
          "suspension",
          "lighting",
          "exhaust",
        ],
      },
      {
        type: "social-proof",
        id: "block-7",
        heading: "What Our Customers Say",
        testimonials: [
          {
            quote:
              "Best ceramic brake pads I've ever used. Zero dust and whisper quiet.",
            author: "Mike R.",
            rating: 5,
          },
          {
            quote:
              "The coilover kit completely transformed my car's handling. Worth every penny.",
            author: "Sarah T.",
            rating: 5,
          },
          {
            quote:
              "Fast shipping and great quality parts. Will definitely order again.",
            author: "James K.",
            rating: 4,
          },
        ],
      },
    ],
  },
];

@Injectable()
export class MockCmsAdapter implements CmsPort {
  async getPage(slug: string): Promise<CmsRawPage | undefined> {
    return mockPages.find((p) => p.slug === slug);
  }
}
