import type { MarketingDirective } from "../../modules/experience/marketing-directive.types";

export const MOCK_MARKETING_DIRECTIVES: MarketingDirective[] = [
  {
    id: "campaign-paid-social-discovery-v1",
    campaignKey: "paid-social-discovery",
    priority: 90,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    audienceTags: ["paid-social", "discovery"],
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Discover performance upgrades",
          subheading:
            "Explore curated parts and accessories from our latest paid social campaign.",
          ctaLabel: "Start exploring",
          ctaUrl: "/categories",
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          categoryHandles: ["performance", "exterior", "lighting"],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        discoveryMode: true,
      },
    },
  },
  {
    id: "campaign-email-reorder-v1",
    campaignKey: "email-reorder",
    priority: 80,
    storeKeys: ["*"],
    routeKinds: ["home", "checkout"],
    customerProfiles: ["returning", "vip"],
    funnelMode: "low-friction",
    audienceTags: ["email", "reorder"],
    checkoutPreference: "prefer-express",
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Pick up where you left off",
          subheading:
            "Jump back into your saved cart and reorder the parts you buy most often.",
          ctaLabel: "Reorder now",
          ctaUrl: "/checkout",
        },
      },
      {
        blockType: "featured-products",
        fields: {
          productHandles: ["sku-brake-kit", "sku-wiper-blades"],
        },
      },
    ],
    slotFlags: {
      "page.checkout-main": {
        lowFriction: true,
      },
    },
  },
  {
    id: "campaign-vip-reengagement-v1",
    campaignKey: "vip-reengagement",
    priority: 95,
    storeKeys: ["*"],
    routeKinds: ["home", "checkout"],
    customerProfiles: ["vip"],
    funnelMode: "reengagement",
    audienceTags: ["vip", "reengagement"],
    checkoutPreference: "prefer-express",
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Your VIP garage is ready",
          subheading:
            "Return to the premium parts, bundles, and shortcuts curated for our best customers.",
          ctaLabel: "View VIP picks",
          ctaUrl: "/categories",
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          categoryHandles: ["premium", "bundles"],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        reengagementMode: true,
      },
      "page.checkout-main": {
        vipJourney: true,
      },
    },
  },
  {
    id: "campaign-black-friday-v1",
    campaignKey: "black-friday",
    priority: 100,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    audienceTags: ["black-friday", "seasonal"],
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Black Friday Blowout",
          subheading:
            "Up to 60% off brake kits, exhaust systems, and lighting upgrades.",
          ctaLabel: "Shop Black Friday deals",
          ctaUrl: "/categories",
        },
      },
      {
        blockType: "featured-products",
        fields: {
          productHandles: [
            "ceramic-brake-pads",
            "cat-back-exhaust",
            "led-headlight-bulbs",
          ],
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          categoryHandles: ["brakes", "exhaust", "lighting"],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        discoveryMode: true,
      },
    },
  },
  {
    id: "campaign-summer-sale-v1",
    campaignKey: "summer-sale",
    priority: 85,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    audienceTags: ["summer-sale", "seasonal"],
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Summer Sale",
          subheading:
            "Get ready for road trips with deals on suspension, air filters, and wheels.",
          ctaLabel: "Shop summer deals",
          ctaUrl: "/categories",
        },
      },
      {
        blockType: "featured-products",
        fields: {
          productHandles: [
            "coilover-kit",
            "performance-air-filter",
            "wheel-spacers",
          ],
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          categoryHandles: ["suspension", "engine", "lighting"],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        discoveryMode: true,
      },
    },
  },
  {
    id: "campaign-winter-2025-v1",
    campaignKey: "winter-2025",
    priority: 90,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    audienceTags: ["winter", "seasonal"],
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Winter Ready Sale",
          subheading:
            "Essential winter automotive parts - Stay safe on winter roads",
          ctaLabel: "Shop Winter Essentials",
          ctaUrl: "/categories/winter",
          image: {
            url: "https://images.unsplash.com/photo-1772470591331-37b565c516d7?w=1200&h=400&fit=crop",
            altText: "Winter road covered in snow",
            width: 1200,
            height: 400,
          },
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          heading: "Shop Winter Essentials",
          categoryHandles: [
            "winter/tires",
            "winter/accessories",
            "winter/fluids",
          ],
        },
      },
      {
        blockType: "featured-products",
        fields: {
          heading: "Top Winter Picks",
          productHandles: [
            "winter-tire-set",
            "tire-chains",
            "windshield-ice-scraper",
          ],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        winterCampaign: true,
      },
    },
  },
  {
    id: "campaign-summer-2025-v1",
    campaignKey: "summer-2025",
    priority: 90,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    audienceTags: ["summer", "seasonal"],
    blockOverrides: [
      {
        blockType: "hero-banner",
        fields: {
          heading: "Get Ready for Summer Trips",
          subheading:
            "Essential gear for road trips and adventures - Hit the road with confidence",
          ctaLabel: "Shop Summer Essentials",
          ctaUrl: "/categories/summer",
          image: {
            url: "https://images.unsplash.com/photo-1755323929316-fd9e8b8342dd?w=1200&h=400&fit=crop",
            altText: "Car loaded for summer road trip",
            width: 1200,
            height: 400,
          },
        },
      },
      {
        blockType: "featured-categories",
        fields: {
          heading: "Shop Summer Essentials",
          categoryHandles: [
            "summer/travel",
            "summer/emergency",
            "summer/detailing",
          ],
        },
      },
      {
        blockType: "featured-products",
        fields: {
          heading: "Top Summer Picks",
          productHandles: [
            "roof-cargo-box",
            "portable-power-station",
            "car-detailing-kit",
          ],
        },
      },
    ],
    slotFlags: {
      "page.home": {
        summerCampaign: true,
      },
    },
  },
];
