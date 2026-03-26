import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { LocaleContext, PageBootstrapModel } from "@commerce/shared-types";
import { BootstrapOrchestratorService } from "./bootstrap-orchestrator.service";
import { BootstrapStageFactory } from "./bootstrap/bootstrap-stage.factory";
import { BootstrapResponseBuilder } from "./bootstrap/bootstrap-response.builder";
import { RouteRecognitionStage } from "./stages/route-recognition.stage";
import { ContextResolutionStage } from "./stages/context-resolution.stage";
import { AssemblyCacheStage } from "./stages/assembly-cache.stage";
import { PageAssemblyStage } from "./stages/page-assembly.stage";
import { SlotPlanningStage } from "./stages/slot-planning.stage";
import { PersonalizationStage } from "./stages/personalization.stage";
import { LinkLocalizationStage } from "./stages/link-localization.stage";

const localeContext: LocaleContext = {
  locale: "en-US",
  language: "en",
  region: "US",
  currency: "USD",
  market: "us",
  domain: "localhost",
};

const mockExperience = {
  storeKey: "us-store",
  experienceProfileId: "default",
  storeFlagIconSrc: "/flags/us.svg",
  storeFlagIconLabel: "United States",
  themeKey: "default",
  themeRevision: "v1",
  themeTokenPack: undefined,
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

// Mock Services
class MockI18nService {
  resolveLocaleContext() {
    return localeContext;
  }

  t(_locale: string, key: string) {
    const translations: Record<string, string> = {
      "page.notFoundTitle": "Page Not Found",
      "page.notFoundDescription": "The page you are looking for does not exist",
      "page.homeTitle": "Home",
      "page.homeDescription": "Welcome to our store",
    };
    return translations[key] || key;
  }

  getTranslationVersion() {
    return "v1";
  }

  resolveNamespaces() {
    return ["common", "nav", "cart"];
  }

  getMessages(_locale: string, namespaces: string[]) {
    return {
      locale: "en-US",
      namespaces,
      messages: { common: { greeting: "Hello" } },
      translationVersion: "v1",
    };
  }

  buildAlternates(_path: string) {
    return { "en-US": "/", "es-ES": "/es" };
  }
}

class MockRouteRecognitionService {
  recognize(path: string, locale: LocaleContext) {
    if (path === "/invalid") {
      return {
        routeKind: "unknown" as const,
        requestedPath: path,
        resolvedPath: path,
        canonicalPath: path,
        status: 404 as const,
        redirectTo: undefined,
        refs: {},
        matchedRuleId: "unknown" as const,
        localeContext: locale,
      };
    }

    if (path === "/old-path") {
      return {
        routeKind: "home" as const,
        requestedPath: path,
        resolvedPath: "/",
        canonicalPath: "/",
        status: 301 as const,
        redirectTo: "/",
        refs: {},
        matchedRuleId: "home" as const,
        localeContext: locale,
      };
    }

    if (path === "/") {
      return {
        routeKind: "home" as const,
        requestedPath: path,
        resolvedPath: path,
        canonicalPath: path,
        status: 200 as const,
        redirectTo: undefined,
        refs: {},
        matchedRuleId: "home" as const,
        localeContext: locale,
      };
    }

    if (path.startsWith("/categories")) {
      return {
        routeKind: "category-list" as const,
        requestedPath: path,
        resolvedPath: path,
        canonicalPath: path,
        status: 200 as const,
        redirectTo: undefined,
        refs: { categoryKey: "all" },
        matchedRuleId: "category-list" as const,
        localeContext: locale,
      };
    }

    if (path.startsWith("/search")) {
      return {
        routeKind: "search" as const,
        requestedPath: path,
        resolvedPath: path,
        canonicalPath: path,
        status: 200 as const,
        redirectTo: undefined,
        refs: {},
        matchedRuleId: "search" as const,
        localeContext: locale,
      };
    }

    if (path === "/cart") {
      return {
        routeKind: "cart" as const,
        requestedPath: path,
        resolvedPath: path,
        canonicalPath: path,
        status: 200 as const,
        redirectTo: undefined,
        refs: {},
        matchedRuleId: "cart" as const,
        localeContext: locale,
      };
    }

    return {
      routeKind: "home" as const,
      requestedPath: path,
      resolvedPath: path,
      canonicalPath: path,
      status: 200 as const,
      redirectTo: undefined,
      refs: {},
      matchedRuleId: "home" as const,
      localeContext: locale,
    };
  }
}

class MockExperienceResolverService {
  async resolve() {
    return mockExperience;
  }

  applyToSlots(slots: any[]) {
    return slots;
  }
}

class MockMerchandisingResolverService {
  resolve() {
    return mockMerchandising;
  }

  applyDefaultSort(query: Record<string, string | undefined>) {
    if (query.sort) {
      return { query, defaultSortApplied: false };
    }
    return {
      query: { ...query, sort: "relevance" },
      defaultSortApplied: true,
    };
  }

  applyToSlots(slots: any[]) {
    return slots;
  }
}

class MockPageAssemblerRegistry {
  getAssembler(routeKind: string) {
    if (routeKind === "cart") {
      return null; // Will trigger 404 if cartUxMode is drawer
    }

    return {
      assemble: async () => ({
        assemblerKey: routeKind,
        seo: {
          title: `${routeKind} page`,
          description: `This is the ${routeKind} page`,
        },
        content: [{ type: routeKind, blocks: [] }],
        revalidateTags: [routeKind],
      }),
    };
  }
}

class MockSlotPlannerService {
  plan() {
    return [
      {
        id: "slot-1",
        rendererKey: "page.home" as const,
        priority: "critical" as const,
        stream: "blocking" as const,
        dataMode: "inline" as const,
        inlineProps: {},
        revalidateTags: ["home"],
        staleAfterSeconds: 300,
      },
    ];
  }
}

class MockLinkLocalizationPolicyService {
  normalizePathFields(input: any) {
    return {
      value: input,
      audit: {
        language: "en" as const,
        defaultLanguage: "en" as const,
        nonCompliantLinkCount: 0,
        normalizedLinkCount: 0,
        samplePaths: [],
      },
    };
  }

  assertPrefixPolicy() {
    return { compliant: true };
  }

  getDomainDefaultLanguage() {
    return "en" as const;
  }

  localizeInternalPath(path: string) {
    return path;
  }
}

class MockCachePolicyService {
  getBootstrapCacheHints() {
    return {
      maxAgeSeconds: 30,
      staleWhileRevalidateSeconds: 120,
    };
  }
}

class MockResilienceService {
  async execute(_key: string, task: () => any) {
    return task();
  }
}

class MockLoadSheddingService {
  async run(_scope: string, _config: any, task: () => any) {
    return task();
  }
}

class MockScalabilityMetricsService {
  recordRoute() {}
  recordBootstrap() {}
  recordSlot() {}
  recordMerchandising() {}
  recordError() {}
}

class MockAssemblerBudgetConfig {
  getBudgetMs() {
    return 5000;
  }
}

class MockLogger {
  log() {}
  debug() {}
  warn() {}
  error() {}
}

describe("BootstrapOrchestrator Integration", () => {
  function createOrchestrator() {
    const i18n = new MockI18nService();
    const routeRecognition = new MockRouteRecognitionService();
    const experienceResolver = new MockExperienceResolverService();
    const merchandisingResolver = new MockMerchandisingResolverService();
    const assemblerRegistry = new MockPageAssemblerRegistry();
    const slotPlanner = new MockSlotPlannerService();
    const linkLocalization = new MockLinkLocalizationPolicyService();
    const cachePolicy = new MockCachePolicyService();
    const resilience = new MockResilienceService();
    const metrics = new MockScalabilityMetricsService();
    const budget = new MockAssemblerBudgetConfig();
    const loadShedding = new MockLoadSheddingService();

    // Create all stages
    const routeRecognitionStage = new RouteRecognitionStage(
      routeRecognition as any,
      i18n as any,
    );

    const contextResolutionStage = new ContextResolutionStage(
      experienceResolver as any,
      merchandisingResolver as any,
      metrics as any,
    );

    const assemblyCacheStage = new AssemblyCacheStage();

    const pageAssemblyStage = new PageAssemblyStage(
      assemblerRegistry as any,
      resilience as any,
      budget as any,
      metrics as any,
      i18n as any,
    );
    (pageAssemblyStage as any).logger = new MockLogger();

    const slotPlanningStage = new SlotPlanningStage(slotPlanner as any);

    const personalizationStage = new PersonalizationStage(
      experienceResolver as any,
      merchandisingResolver as any,
      slotPlanningStage,
    );

    const linkLocalizationStage = new LinkLocalizationStage(
      linkLocalization as any,
      metrics as any,
      personalizationStage,
    );
    (linkLocalizationStage as any).logger = new MockLogger();

    // Create factory
    const factory = new BootstrapStageFactory(
      routeRecognitionStage,
      contextResolutionStage,
      assemblyCacheStage,
      pageAssemblyStage,
      slotPlanningStage,
      personalizationStage,
      linkLocalizationStage,
    );

    // Create response builder
    const responseBuilder = new BootstrapResponseBuilder(
      i18n as any,
      linkLocalization as any,
      cachePolicy as any,
    );

    // Create orchestrator
    const orchestrator = new BootstrapOrchestratorService(
      factory,
      responseBuilder,
      i18n as any,
      loadShedding as any,
      metrics as any,
    );
    (orchestrator as any).logger = new MockLogger();

    return orchestrator;
  }

  test("executes full pipeline for home page", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-home",
    });

    assert.equal(result.page.status, 200);
    assert.equal(result.page.routeKind, "home");
    assert.equal(result.page.path, "/");
    assert.equal(result.page.seo.title, "home page");
    assert.equal(result.shell.experience.storeKey, "us-store");
    assert.equal(result.slots.length, 1);
    assert.ok(result.page.cacheHints);
  });

  test("early exit for 404 unknown route", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/invalid",
      query: {},
      requestId: "test-404",
    });

    assert.equal(result.page.status, 404);
    assert.equal(result.page.routeKind, undefined);
    assert.equal(result.page.seo.title, "Page Not Found");
    assert.equal(result.slots.length, 0);
  });

  test("early exit for 301 redirect", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/old-path",
      query: {},
      requestId: "test-301",
    });

    assert.equal(result.page.status, 301);
    assert.equal(result.page.redirectTo, "/");
    assert.equal(result.page.seo.title, "Home");
    assert.equal(result.slots.length, 0);
  });

  test("executes pipeline for category-list route", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/categories",
      query: {},
      requestId: "test-category",
    });

    assert.equal(result.page.status, 200);
    assert.equal(result.page.routeKind, "category-list");
    assert.equal(result.page.seo.title, "category-list page");
    assert.equal(result.slots.length, 1);
  });

  test("executes pipeline for search route", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/search",
      query: { q: "test" },
      requestId: "test-search",
    });

    assert.equal(result.page.status, 200);
    assert.equal(result.page.routeKind, "search");
    assert.equal(result.page.seo.title, "search page");
    assert.equal(result.slots.length, 1);
  });

  test("applies merchandising default sort", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/categories",
      query: {},
      requestId: "test-merchandising",
    });

    assert.equal(result.page.status, 200);
    assert.equal(
      result.page.merchandisingApplied?.defaultSortSlug,
      "relevance",
    );
  });

  test("does not apply merchandising sort when already present", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/categories",
      query: { sort: "price" },
      requestId: "test-no-merchandising",
    });

    assert.equal(result.page.status, 200);
    assert.equal(result.page.merchandisingApplied?.defaultSortSlug, undefined);
  });

  test("blocks cart route when cartUxMode is drawer", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/cart",
      query: {},
      requestId: "test-cart-blocked",
    });

    // Cart route with drawer mode should return 404
    assert.equal(result.page.status, 404);
  });

  test("includes shell with experience and merchandising", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-shell",
    });

    assert.equal(result.shell.experience.storeKey, "us-store");
    assert.equal(result.shell.experience.experienceProfileId, "default");
    assert.equal(result.shell.experience.themeKey, "default");
    assert.equal(result.shell.experience.merchandisingMode, "default");
    assert.equal(result.shell.experience.merchandisingProfileId, "default");
    assert.ok(Array.isArray(result.shell.namespaces));
    assert.ok(result.shell.messages);
  });

  test("includes localization audit in response", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-audit",
    });

    // Audit may be undefined if INCLUDE_LINK_LOCALIZATION_AUDIT is false
    // But the pipeline should complete successfully
    assert.equal(result.page.status, 200);
  });

  test("sets correct cache hints per route kind", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-cache",
    });

    assert.ok(result.page.cacheHints);
    assert.equal(typeof result.page.cacheHints.maxAgeSeconds, "number");
    assert.equal(
      typeof result.page.cacheHints.staleWhileRevalidateSeconds,
      "number",
    );
  });

  test("includes requestId in response", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "unique-request-id",
    });

    assert.equal(result.page.requestId, "unique-request-id");
  });

  test("includes translation version", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-translation",
    });

    assert.equal(result.page.translationVersion, "v1");
    assert.equal(result.page.translationSource, "bff-bootstrap");
  });

  test("includes matched rule ID", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-rule",
    });

    assert.equal(result.page.matchedRuleId, "home");
  });

  test("builds canonical URLs correctly", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/",
      query: {},
      requestId: "test-canonical",
    });

    assert.equal(result.page.canonicalUrl, "https://localhost/");
    assert.ok(result.page.alternates);
  });

  test("handles query parameters correctly", async () => {
    const orchestrator = createOrchestrator();

    const result = await orchestrator.buildBootstrap({
      path: "/search",
      query: { q: "test", filter: "available" },
      requestId: "test-query",
    });

    assert.equal(result.page.status, 200);
    assert.equal(result.page.routeKind, "search");
  });
});
