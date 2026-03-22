import { Inject, Injectable } from "@nestjs/common";
import { MARKETING_DIRECTIVE_PORT } from "../../ports/marketing-directive.port";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import type { MarketingDirective } from "./marketing-directive.types";
import type {
  MockCampaignKey,
  MockCustomerProfile,
  ResolvedExperienceSignals,
} from "./experience-profile.types";

@Injectable()
export class ExperienceSignalsService {
  constructor(
    @Inject(MARKETING_DIRECTIVE_PORT)
    private readonly marketingDirectives: MarketingDirectiveProvider,
  ) {}

  async resolve(params: {
    storeKey: string;
    routeKind?: string;
    query?: Record<string, string | undefined>;
    cookieHeader?: string;
  }): Promise<ResolvedExperienceSignals> {
    const query = params.query ?? {};
    const customerProfile = this.parseCustomerProfile(query.customerProfile);
    const campaignKey = this.parseCampaignKey(query.campaign);
    const directives = await this.marketingDirectives.getDirectives({
      storeKey: params.storeKey,
      routeKind: params.routeKind,
      customerProfile,
      campaignKey,
      query,
      cookieHeader: params.cookieHeader,
    });

    const sources = new Set<ResolvedExperienceSignals["sources"][number]>();
    if (customerProfile !== "guest" || campaignKey !== "default") {
      sources.add("mock-query");
    }
    if (directives.length > 0) {
      sources.add("marketing-provider");
    }
    if (sources.size === 0) {
      sources.add("default");
    }

    const ordered = directives.sort((a, b) => b.priority - a.priority);

    return {
      customerProfile,
      campaignKey,
      isReturningCustomer:
        customerProfile === "returning" || customerProfile === "vip",
      funnelMode:
        ordered.find((directive) => directive.funnelMode)?.funnelMode ??
        "default",
      heroOverride: ordered.find((directive) => directive.heroOverride)
        ?.heroOverride,
      promotedCategories: dedupe(
        ordered.flatMap((directive) => directive.promotedCategories ?? []),
      ),
      promotedProducts: dedupe(
        ordered.flatMap((directive) => directive.promotedProducts ?? []),
      ),
      audienceTags: dedupe(
        ordered.flatMap((directive) => directive.audienceTags ?? []),
      ),
      checkoutPreference:
        ordered.find((directive) => directive.checkoutPreference)
          ?.checkoutPreference ?? "default",
      slotFlagsByRenderer: ordered.reduce<
        ResolvedExperienceSignals["slotFlagsByRenderer"]
      >((acc, directive) => mergeSlotFlags(acc, directive), {}),
      activeMarketingDirectiveIds: ordered.map((directive) => directive.id),
      sources: [...sources],
    };
  }

  private parseCustomerProfile(
    input: string | undefined,
  ): MockCustomerProfile {
    switch (input) {
      case "first-time":
      case "returning":
      case "vip":
      case "guest":
        return input;
      default:
        return "guest";
    }
  }

  private parseCampaignKey(input: string | undefined): MockCampaignKey {
    switch (input) {
      case "paid-social-discovery":
      case "email-reorder":
      case "vip-reengagement":
      case "default":
        return input;
      default:
        return "default";
    }
  }
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function mergeSlotFlags(
  current: ResolvedExperienceSignals["slotFlagsByRenderer"],
  directive: MarketingDirective,
) {
  for (const [rendererKey, flags] of Object.entries(directive.slotFlags ?? {})) {
    current[rendererKey as keyof typeof current] = {
      ...(current[rendererKey as keyof typeof current] ?? {}),
      ...flags,
    };
  }
  return current;
}
