import type { LocaleContext, SlotManifest } from "@commerce/shared-types";
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { LinkLocalizationStage } from "./link-localization.stage";

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

const mockSlots: SlotManifest[] = [
  {
    id: "slot-1",
    rendererKey: "page.home",
    priority: "critical",
    stream: "blocking",
    dataMode: "inline",
    inlineProps: { path: "/products" },
    revalidateTags: ["home"],
    staleAfterSeconds: 300,
  },
];

class MockPersonalizationStage {
  getPersonalizedSlots() {
    return mockSlots;
  }
}

class MockLinkLocalization {
  normalizePathFields(input: any, _locale: LocaleContext) {
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
}

class MockMetrics {
  recordError() {}
}

class MockLogger {
  warn() {}
}

describe("LinkLocalizationStage", () => {
  test("normalizes content and slot paths", () => {
    const stage = new LinkLocalizationStage(
      new MockLinkLocalization() as any,
      new MockMetrics() as any,
      new MockPersonalizationStage() as any,
    );
    (stage as any).logger = new MockLogger();

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.content = [{ type: "home", blocks: [] }];

    stage.execute(ctx);

    assert.ok(ctx.localizationAudit);
    assert.equal(ctx.localizationAudit.language, "en");
    assert.equal(ctx.localizationAudit.nonCompliantLinkCount, 0);
    const normalizedSlots = stage.getNormalizedSlots(ctx);
    assert.equal(normalizedSlots.length, 1);
  });

  test("logs violations when links are non-compliant", () => {
    class NonCompliantLinkLocalization {
      normalizePathFields(input: any, _locale: LocaleContext) {
        return {
          value: input,
          audit: {
            language: "en" as const,
            defaultLanguage: "en" as const,
            nonCompliantLinkCount: 3,
            normalizedLinkCount: 3,
            samplePaths: ["/bad-path-1", "/bad-path-2"],
          },
        };
      }

      assertPrefixPolicy() {
        return {
          compliant: false,
          expectedPrefix: "en",
          actualPrefix: undefined,
        };
      }

      getDomainDefaultLanguage() {
        return "en" as const;
      }
    }

    let recordedError = false;
    class MockMetricsWithTracking {
      recordError() {
        recordedError = true;
      }
    }

    const stage = new LinkLocalizationStage(
      new NonCompliantLinkLocalization() as any,
      new MockMetricsWithTracking() as any,
      new MockPersonalizationStage() as any,
    );
    (stage as any).logger = new MockLogger();

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-2",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.content = [];

    stage.execute(ctx);

    assert.ok(recordedError, "Should record error for violations");
    assert.ok(
      ctx.localizationAudit && ctx.localizationAudit.nonCompliantLinkCount >= 3,
      "Should have at least 3 non-compliant links",
    );
  });

  test("throws if route is missing", () => {
    const stage = new LinkLocalizationStage(
      new MockLinkLocalization() as any,
      new MockMetrics() as any,
      new MockPersonalizationStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-3",
    });

    assert.throws(() => stage.execute(ctx), /requires localeContext and route/);
  });

  test("throws if localeContext is missing", () => {
    const stage = new LinkLocalizationStage(
      new MockLinkLocalization() as any,
      new MockMetrics() as any,
      new MockPersonalizationStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-4",
    });
    ctx.route = mockRoute;

    assert.throws(() => stage.execute(ctx), /requires localeContext and route/);
  });
});
