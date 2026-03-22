import type {
  LocaleContext,
  PageContentNode,
  PageSeo,
} from "@commerce/shared-types";
import type { ResolvedRouteDescriptor, RouteKind } from "../routing/route-rule.types";
import type { ResolvedMerchandisingProfile } from "../../merchandising/merchandising-profile.types";
import type { ResolvedExperienceProfile } from "../../experience/experience-profile.types";

export type PageAssemblyContext = {
  route: ResolvedRouteDescriptor;
  query: Record<string, string | undefined>;
  localeContext: LocaleContext;
  merchandising: Pick<
    ResolvedMerchandisingProfile,
    "mode" | "profileId" | "defaultSortSlug"
  >;
  experience: Pick<
    ResolvedExperienceProfile,
    "experienceProfileId" | "homeHero" | "signals" | "slotRules"
  >;
  cookieHeader?: string;
};

export type PageAssemblyResult = {
  assemblerKey: string;
  seo: PageSeo;
  content: PageContentNode[];
  revalidateTags: string[];
};

export interface PageAssembler {
  readonly routeKind: Exclude<RouteKind, "unknown">;
  assemble(ctx: PageAssemblyContext): Promise<PageAssemblyResult | null>;
}
