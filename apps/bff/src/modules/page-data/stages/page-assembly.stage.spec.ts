import type { LocaleContext } from "@commerce/shared-types";
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { PageAssemblyStage } from "./page-assembly.stage";

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
  cartUxMode: "drawer" as const,
  signals: {},
  slotRules: [],
  storeFlagIconSrc: "/flags/us.svg",
  storeFlagIconLabel: "US Store",
  themeKey: "default",
  themeRevision: "v1",
  themeTokenPack: "theme-default",
  language: "en",
  defaultLanguage: "en",
  supportedLanguages: ["en"],
  cartPath: "/cart",
  openCartOnAdd: false,
  layoutKey: "default",
};

const mockMerchandising = {
  mode: "default" as const,
  profileId: "default",
  defaultSortSlug: undefined,
};

const mockAssemblyResult = {
  assemblerKey: "home",
  seo: { title: "Home", description: "Home page" },
  content: [],
  revalidateTags: ["home"],
};

class MockAssemblerRegistry {
  getAssembler() {
    return {
      assemble: async () => mockAssemblyResult,
    };
  }
}

class MockResilience {
  async execute(_key: string, task: () => any) {
    return task();
  }
}

class MockBudget {
  getBudgetMs() {
    return 5000;
  }
}

class MockMetrics {
  recordError() {}
}

class MockI18n {
  t() {
    return "Not Found";
  }
  getTranslationVersion() {
    return "v1";
  }
}

class MockLogger {
  debug() {}
  warn() {}
  error() {}
}

describe("PageAssemblyStage", () => {
  test("assembles page successfully", async () => {
    const stage = new PageAssemblyStage(
      new MockAssemblerRegistry() as any,
      new MockResilience() as any,
      new MockBudget() as any,
      new MockMetrics() as any,
      new MockI18n() as any,
    );
    (stage as any).logger = new MockLogger();

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.experience = mockExperience as any;
    ctx.merchandising = mockMerchandising as any;
    ctx.status = 200; // Must be set before assembly stage

    await stage.execute(ctx);

    assert.equal(ctx.status, 200);
    assert.equal(ctx.seo?.title, "Home");
    assert.equal(ctx.assemblerKey, "home");
    // withLanguageScopedTags only adds lang scope for products/collections/pages/menus
    assert.deepEqual(ctx.revalidateTags, ["home"]);
  });

  test("creates 404 when assembler returns null and stops processing", async () => {
    class NullAssemblerRegistry {
      getAssembler() {
        return {
          assemble: async () => null,
        };
      }
    }

    const stage = new PageAssemblyStage(
      new NullAssemblerRegistry() as any,
      new MockResilience() as any,
      new MockBudget() as any,
      new MockMetrics() as any,
      new MockI18n() as any,
    );
    (stage as any).logger = new MockLogger();

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-3",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.experience = mockExperience as any;
    ctx.merchandising = mockMerchandising as any;
    ctx.status = 200; // Must be set before assembly stage

    await stage.execute(ctx);

    assert.equal(ctx.status, 404);
    assert.equal(ctx.shouldStopProcessing(), true);
  });

  test("blocks cart route and stops processing", async () => {
    const stage = new PageAssemblyStage(
      new MockAssemblerRegistry() as any,
      new MockResilience() as any,
      new MockBudget() as any,
      new MockMetrics() as any,
      new MockI18n() as any,
    );
    (stage as any).logger = new MockLogger();

    const ctx = new BootstrapContext({
      requestedPath: "/cart",
      query: {},
      requestId: "test-cart",
    });
    ctx.route = { ...mockRoute, routeKind: "cart" };
    ctx.localeContext = localeContext;
    ctx.experience = { ...mockExperience, cartUxMode: "drawer" } as any;
    ctx.merchandising = mockMerchandising as any;
    ctx.status = 200;

    await stage.execute(ctx);

    assert.equal(ctx.status, 404);
    assert.equal(ctx.shouldStopProcessing(), true);
  });

  test("skips when status is not 200", async () => {
    const stage = new PageAssemblyStage(
      new MockAssemblerRegistry() as any,
      new MockResilience() as any,
      new MockBudget() as any,
      new MockMetrics() as any,
      new MockI18n() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-4",
    });
    ctx.status = 404;

    // Should not throw or do anything
    await stage.execute(ctx);
    assert.equal(ctx.status, 404);
  });
});
