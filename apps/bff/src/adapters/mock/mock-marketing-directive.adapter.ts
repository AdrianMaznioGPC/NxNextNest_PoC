import { Injectable } from "@nestjs/common";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "../../modules/experience/marketing-directive.types";

const MOCK_MARKETING_DIRECTIVES: MarketingDirective[] = [
  {
    id: "campaign-paid-social-discovery-v1",
    campaignKey: "paid-social-discovery",
    priority: 90,
    storeKeys: ["*"],
    routeKinds: ["home"],
    customerProfiles: ["*"],
    funnelMode: "discovery",
    heroOverride: {
      heading: "Discover performance upgrades",
      subheading:
        "Explore curated parts and accessories from our latest paid social campaign.",
      ctaLabel: "Start exploring",
      ctaUrl: "/categories",
    },
    promotedCategories: ["performance", "exterior", "lighting"],
    audienceTags: ["paid-social", "discovery"],
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
    heroOverride: {
      heading: "Pick up where you left off",
      subheading:
        "Jump back into your saved cart and reorder the parts you buy most often.",
      ctaLabel: "Reorder now",
      ctaUrl: "/checkout",
    },
    promotedProducts: ["sku-brake-kit", "sku-wiper-blades"],
    audienceTags: ["email", "reorder"],
    checkoutPreference: "prefer-express",
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
    heroOverride: {
      heading: "Your VIP garage is ready",
      subheading:
        "Return to the premium parts, bundles, and shortcuts curated for our best customers.",
      ctaLabel: "View VIP picks",
      ctaUrl: "/categories",
    },
    promotedCategories: ["premium", "bundles"],
    audienceTags: ["vip", "reengagement"],
    checkoutPreference: "prefer-express",
    slotFlags: {
      "page.home": {
        reengagementMode: true,
      },
      "page.checkout-main": {
        vipJourney: true,
      },
    },
  },
];

@Injectable()
export class MockMarketingDirectiveAdapter
  implements MarketingDirectiveProvider
{
  async getDirectives(
    input: MarketingDirectiveRequest,
  ): Promise<MarketingDirective[]> {
    return MOCK_MARKETING_DIRECTIVES
      .filter((directive) => matchesDirective(directive, input))
      .sort((a, b) => b.priority - a.priority);
  }
}

function matchesDirective(
  directive: MarketingDirective,
  input: MarketingDirectiveRequest,
) {
  return (
    directive.campaignKey === input.campaignKey &&
    (directive.storeKeys.includes("*") ||
      directive.storeKeys.includes(input.storeKey)) &&
    (directive.routeKinds.includes("*") ||
      (input.routeKind
        ? directive.routeKinds.includes(input.routeKind as never)
        : false)) &&
    (!directive.customerProfiles ||
      directive.customerProfiles.includes("*") ||
      directive.customerProfiles.includes(input.customerProfile))
  );
}
