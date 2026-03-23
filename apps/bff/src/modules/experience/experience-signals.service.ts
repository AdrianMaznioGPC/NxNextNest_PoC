import { Inject, Injectable } from "@nestjs/common";
import type { MarketingDirectiveProvider } from "../../ports/marketing-directive.port";
import { MARKETING_DIRECTIVE_PORT } from "../../ports/marketing-directive.port";
import type {
  CampaignKey,
  CustomerProfile,
  ResolvedExperienceSignals,
} from "./experience-profile.types";
import type {
  BlockOverride,
  MarketingDirective,
} from "./marketing-directive.types";

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

    const blockOverridesByType = new Map<string, BlockOverride>();
    for (const directive of ordered) {
      for (const override of directive.blockOverrides ?? []) {
        if (!blockOverridesByType.has(override.blockType)) {
          blockOverridesByType.set(override.blockType, override);
        }
      }
    }

    return {
      customerProfile,
      campaignKey,
      funnelMode:
        ordered.find((directive) => directive.funnelMode)?.funnelMode ??
        "default",
      blockOverrides: [...blockOverridesByType.values()],
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

  private parseCustomerProfile(input: string | undefined): CustomerProfile {
    return input?.trim() || "guest";
  }

  private parseCampaignKey(input: string | undefined): CampaignKey {
    return input?.trim() || "default";
  }
}

function dedupe(values: string[]) {
  return [...new Set(values)];
}

function mergeSlotFlags(
  current: ResolvedExperienceSignals["slotFlagsByRenderer"],
  directive: MarketingDirective,
) {
  for (const [rendererKey, flags] of Object.entries(
    directive.slotFlags ?? {},
  )) {
    current[rendererKey as keyof typeof current] = {
      ...(current[rendererKey as keyof typeof current] ?? {}),
      ...flags,
    };
  }
  return current;
}
