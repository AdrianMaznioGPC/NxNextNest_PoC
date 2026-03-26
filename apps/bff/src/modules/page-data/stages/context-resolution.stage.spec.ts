import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { LocaleContext } from "@commerce/shared-types";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { ContextResolutionStage } from "./context-resolution.stage";

const localeContext: LocaleContext = {
  locale: "en-US",
  language: "en",
  region: "US",
  currency: "USD",
  market: "us",
  domain: "localhost",
};

const mockRoute = {
  routeKind: "home" as const,
  requestedPath: "/",
  resolvedPath: "/",
  canonicalPath: "/",
  status: 200 as const,
  refs: {},
  matchedRuleId: "home" as const,
  localeContext,
};

const mockExperience = {
  storeKey: "us-store",
  experienceProfileId: "default",
  storeFlagIconSrc: "/flags/us.svg",
  storeFlagIconLabel: "United States",
  themeKey: "default",
  themeRevision: "v1",
  language: "en" as const,
  defaultLanguage: "en" as const,
  supportedLanguages: ["en" as const],
  cartUxMode: "drawer" as const,
  cartPath: "/cart",
  openCartOnAdd: true,
  layoutKey: "default",
  slotRules: [],
  signals: {
    customerProfile: "guest",
    campaignKey: "default",
    funnelMode: "standard" as const,
    blockOverrides: [],
    audienceTags: [],
    checkoutPreference: "standard" as const,
    slotFlagsByRenderer: {},
    activeMarketingDirectiveIds: [],
    sources: [],
  },
};

const mockMerchandising = {
  profileId: "default",
  mode: "default" as const,
  defaultSortSlug: "relevance" as const,
  slotRules: [],
};

class MockExperienceResolver {
  async resolve() {
    return mockExperience;
  }
}

class MockMerchandisingResolver {
  resolve() {
    return mockMerchandising;
  }

  applyDefaultSort(query: Record<string, string | undefined>) {
    return {
      query: { ...query, sort: "relevance" },
      defaultSortApplied: true,
    };
  }
}

class MockMetrics {
  recordMerchandising() {}
}

describe("ContextResolutionStage", () => {
  test("resolves experience and merchandising profiles", async () => {
    const stage = new ContextResolutionStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockMetrics() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;

    await stage.execute(ctx);

    assert.equal(ctx.experience?.storeKey, "us-store");
    assert.equal(ctx.merchandising?.profileId, "default");
    assert.equal(ctx.defaultSortApplied, true);
    assert.equal(ctx.query.sort, "relevance");
  });

  test("throws if route is missing", async () => {
    const stage = new ContextResolutionStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockMetrics() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-2",
    });
    ctx.localeContext = localeContext;

    await assert.rejects(
      async () => stage.execute(ctx),
      /requires route and localeContext/,
    );
  });

  test("throws if localeContext is missing", async () => {
    const stage = new ContextResolutionStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockMetrics() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-3",
    });
    ctx.route = mockRoute;

    await assert.rejects(
      async () => stage.execute(ctx),
      /requires route and localeContext/,
    );
  });
});
