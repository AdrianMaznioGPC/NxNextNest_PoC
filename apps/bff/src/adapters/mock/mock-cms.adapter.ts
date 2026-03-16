import { Injectable } from "@nestjs/common";
import type { CmsPort, CmsRawPage } from "../../ports/cms.port";
import { StoreContext } from "../../store";

const sharedUsps = [
  {
    icons: [
      {
        url: "https://cdn-icons-png.flaticon.com/64/6491/6491490.png",
        altText: "Trusted shop",
        width: 32,
        height: 32,
      },
      {
        url: "https://cdn-icons-png.flaticon.com/64/5968/5968528.png",
        altText: "Verified",
        width: 32,
        height: 32,
      },
    ],
  },
  {
    icons: [
      {
        url: "https://cdn-icons-png.flaticon.com/64/349/349221.png",
        altText: "Visa",
        width: 32,
        height: 32,
      },
      {
        url: "https://cdn-icons-png.flaticon.com/64/349/349228.png",
        altText: "Mastercard",
        width: 32,
        height: 32,
      },
      {
        url: "https://cdn-icons-png.flaticon.com/64/174/174861.png",
        altText: "PayPal",
        width: 32,
        height: 32,
      },
    ],
  },
  {
    icons: [
      {
        url: "https://cdn-icons-png.flaticon.com/64/2203/2203124.png",
        altText: "Fast delivery",
        width: 32,
        height: 32,
      },
      {
        url: "https://cdn-icons-png.flaticon.com/64/609/609361.png",
        altText: "UPS",
        width: 32,
        height: 32,
      },
    ],
  },
];

const sharedImages = {
  heroBanner: {
    url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop",
    altText: "Sale banner",
    width: 1200,
    height: 400,
  },
  brakes: {
    url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=250&fit=crop",
    altText: "Brake pads",
    width: 400,
    height: 250,
  },
  exhaust: {
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop",
    altText: "Exhaust systems",
    width: 400,
    height: 250,
  },
  suspension: {
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    altText: "Suspension kits",
    width: 400,
    height: 250,
  },
  freeShipping: {
    url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=400&fit=crop",
    altText: "Free shipping banner",
    width: 1200,
    height: 400,
  },
  brakesGrid: {
    url: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
    altText: "Brake upgrades",
    width: 600,
    height: 400,
  },
  exhaustGrid: {
    url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&h=400&fit=crop",
    altText: "Exhaust systems",
    width: 600,
    height: 400,
  },
};

const frPages: CmsRawPage[] = [
  {
    slug: "home",
    blocks: [
      {
        type: "homepage-hero",
        id: "block-1",
        mainBanner: {
          heading: "Soldes d'\u00e9t\u00e9",
          subheading:
            "Jusqu'\u00e0 40% de r\u00e9duction sur les pi\u00e8ces performance",
          ctaLabel: "Acheter",
          ctaUrl: "/categories",
          image: sharedImages.heroBanner,
        },
        usps: sharedUsps,
        smallBanners: [
          {
            heading: "Plaquettes de frein",
            ctaLabel: "Voir les freins",
            ctaUrl: "/categories/freins/c/cat-brakes",
            image: sharedImages.brakes,
          },
          {
            heading: "Syst\u00e8mes d'\u00e9chappement",
            ctaLabel: "Voir l'\u00e9chappement",
            ctaUrl: "/categories/echappement/c/cat-exhaust",
            image: sharedImages.exhaust,
          },
          {
            heading: "Kits de suspension",
            ctaLabel: "Voir la suspension",
            ctaUrl: "/categories/suspension/c/cat-suspension",
            image: sharedImages.suspension,
          },
        ],
      },
      {
        type: "featured-products",
        id: "block-2",
        heading: "Nos coups de c\u0153ur",
        productHandles: [
          "plaquettes-de-frein-en-ceramique",
          "kit-combines-filetes-reglables",
          "ligne-d-echappement-cat-back",
        ],
      },
      {
        type: "product-carousel",
        id: "block-3",
        heading: "Nouveaut\u00e9s",
        collectionHandle: "hidden-homepage-carousel",
      },
      {
        type: "cms-banner",
        id: "block-4",
        heading: "Livraison gratuite d\u00e8s 99\u20ac",
        subheading:
          "Offre limit\u00e9e \u2014 am\u00e9liorez votre v\u00e9hicule d\u00e8s aujourd'hui",
        ctaLabel: "Parcourir les pi\u00e8ces",
        ctaUrl: "/categories",
        image: sharedImages.freeShipping,
      },
      {
        type: "banner-grid",
        id: "block-5",
        columns: 2,
        banners: [
          {
            heading: "Am\u00e9lioration freinage",
            ctaLabel: "Voir les freins",
            ctaUrl: "/categories/freins/c/cat-brakes",
            image: sharedImages.brakesGrid,
          },
          {
            heading: "Syst\u00e8mes d'\u00e9chappement",
            ctaLabel: "Voir l'\u00e9chappement",
            ctaUrl: "/categories/echappement/c/cat-exhaust",
            image: sharedImages.exhaustGrid,
          },
        ],
      },
      {
        type: "featured-category",
        id: "block-6",
        heading: "Acheter par cat\u00e9gorie",
        collectionHandles: [
          "cat-brakes",
          "cat-engine",
          "cat-suspension",
          "cat-lighting",
          "cat-exhaust",
        ],
      },
      {
        type: "social-proof",
        id: "block-7",
        heading: "Ce que disent nos clients",
        testimonials: [
          {
            quote:
              "Les meilleures plaquettes c\u00e9ramique que j'ai utilis\u00e9es. Z\u00e9ro poussi\u00e8re et ultra silencieuses.",
            author: "Michel R.",
            rating: 5,
          },
          {
            quote:
              "Le kit combin\u00e9s filet\u00e9s a compl\u00e8tement transform\u00e9 la tenue de route de ma voiture.",
            author: "Sophie T.",
            rating: 5,
          },
          {
            quote:
              "Livraison rapide et pi\u00e8ces de grande qualit\u00e9. Je recommanderai sans h\u00e9siter.",
            author: "Jacques K.",
            rating: 4,
          },
        ],
      },
    ],
  },
];

const iePages: CmsRawPage[] = [
  {
    slug: "home",
    blocks: [
      {
        type: "homepage-hero",
        id: "block-1",
        mainBanner: {
          heading: "Summer Sale",
          subheading: "Up to 40% off performance parts",
          ctaLabel: "Shop Now",
          ctaUrl: "/categories",
          image: sharedImages.heroBanner,
        },
        usps: sharedUsps,
        smallBanners: [
          {
            heading: "Brake Pads",
            ctaLabel: "Shop Brakes",
            ctaUrl: "/categories/brakes/c/cat-brakes",
            image: sharedImages.brakes,
          },
          {
            heading: "Exhaust Systems",
            ctaLabel: "Shop Exhaust",
            ctaUrl: "/categories/exhaust/c/cat-exhaust",
            image: sharedImages.exhaust,
          },
          {
            heading: "Suspension Kits",
            ctaLabel: "Shop Suspension",
            ctaUrl: "/categories/suspension/c/cat-suspension",
            image: sharedImages.suspension,
          },
        ],
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
        heading: "Free Shipping on Orders Over \u20ac99",
        subheading: "Limited time offer \u2014 upgrade your ride today",
        ctaLabel: "Browse Parts",
        ctaUrl: "/categories",
        image: sharedImages.freeShipping,
      },
      {
        type: "banner-grid",
        id: "block-5",
        columns: 2,
        banners: [
          {
            heading: "Brake Upgrades",
            ctaLabel: "Shop Brakes",
            ctaUrl: "/categories/brakes/c/cat-brakes",
            image: sharedImages.brakesGrid,
          },
          {
            heading: "Exhaust Systems",
            ctaLabel: "Shop Exhaust",
            ctaUrl: "/categories/exhaust/c/cat-exhaust",
            image: sharedImages.exhaustGrid,
          },
        ],
      },
      {
        type: "featured-category",
        id: "block-6",
        heading: "Shop by Category",
        collectionHandles: [
          "cat-brakes",
          "cat-engine",
          "cat-suspension",
          "cat-lighting",
          "cat-exhaust",
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

const pagesByStore: Record<string, CmsRawPage[]> = {
  fr: frPages,
  ie: iePages,
};

@Injectable()
export class MockCmsAdapter implements CmsPort {
  constructor(private readonly storeCtx: StoreContext) {}

  async getPage(slug: string): Promise<CmsRawPage | undefined> {
    const pages = pagesByStore[this.storeCtx.storeCode] ?? pagesByStore["fr"]!;
    return pages.find((p) => p.slug === slug);
  }
}
