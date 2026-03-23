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
];
