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
    ],
  },
];

@Injectable()
export class MockCmsAdapter implements CmsPort {
  async getPage(slug: string): Promise<CmsRawPage | undefined> {
    return mockPages.find((p) => p.slug === slug);
  }
}
