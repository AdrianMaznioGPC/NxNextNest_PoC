import type {
  MarketingDirective,
  MarketingDirectiveRequest,
} from "./marketing-directive.types";

/** Checks whether a directive matches the given request context. */
export function matchesDirective(
  directive: MarketingDirective,
  input: MarketingDirectiveRequest,
): boolean {
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
