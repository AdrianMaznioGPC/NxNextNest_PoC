import type { LocaleContext } from "@commerce/shared-types";
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { ResolvedRouteDescriptor } from "../routing/route-rule.types";
import { RouteRecognitionStage } from "./route-recognition.stage";

const localeContext: LocaleContext = {
  locale: "en-US",
  language: "en",
  region: "US",
  currency: "USD",
  market: "us",
  domain: "localhost",
};

class MockI18nService {
  resolveLocaleContext(): LocaleContext {
    return localeContext;
  }

  t(locale: string, key: string): string {
    return `${locale}:${key}`;
  }
}

class MockRouteRecognitionService {
  public lastArgs?: { path: string; localeContext: LocaleContext };
  private route: ResolvedRouteDescriptor;

  constructor(route: ResolvedRouteDescriptor) {
    this.route = route;
  }

  recognize(path: string, locale: LocaleContext): ResolvedRouteDescriptor {
    this.lastArgs = { path, localeContext: locale };
    return this.route;
  }
}

const buildRoute = (
  overrides: Partial<ResolvedRouteDescriptor>,
): ResolvedRouteDescriptor => ({
  routeKind: "home",
  requestedPath: "/",
  resolvedPath: "/",
  canonicalPath: "/",
  status: 200,
  refs: {},
  matchedRuleId: "home",
  localeContext,
  ...overrides,
});

describe("RouteRecognitionStage", () => {
  test("returns 404 for unknown routes", () => {
    const route = buildRoute({
      status: 404,
      routeKind: "unknown",
      matchedRuleId: "unknown",
    });
    const routeRecognition = new MockRouteRecognitionService(route);
    const stage = new RouteRecognitionStage(
      routeRecognition as any,
      new MockI18nService() as any,
    );
    const ctx = new BootstrapContext({
      requestedPath: "/missing",
      query: {},
      requestId: "test-404",
    });

    stage.execute(ctx);

    assert.equal(ctx.status, 404);
    assert.equal(ctx.redirectTo, undefined);
    assert.equal(ctx.seo?.title, "en-US:page.notFoundTitle");
    assert.equal(ctx.seo?.description, "en-US:page.notFoundDescription");
    assert.equal(ctx.matchedRuleId, "unknown");
    // No early return - context resolution still needs to run
    assert.equal(ctx.shouldStopProcessing(), false);
    assert.deepEqual(routeRecognition.lastArgs, {
      path: "/missing",
      localeContext,
    });
  });

  test("returns 301 for redirect routes", () => {
    const route = buildRoute({
      status: 301,
      redirectTo: "/",
      matchedRuleId: "home",
    });
    const stage = new RouteRecognitionStage(
      new MockRouteRecognitionService(route) as any,
      new MockI18nService() as any,
    );
    const ctx = new BootstrapContext({
      requestedPath: "/old-path",
      query: {},
      requestId: "test-301",
    });

    stage.execute(ctx);

    assert.equal(ctx.status, 301);
    assert.equal(ctx.redirectTo, "/");
    assert.equal(ctx.seo?.title, "en-US:page.homeTitle");
    assert.equal(ctx.seo?.description, "en-US:page.homeDescription");
    // No early return - context resolution still needs to run
    assert.equal(ctx.shouldStopProcessing(), false);
  });

  test("continues pipeline for valid routes", () => {
    const route = buildRoute({ status: 200, routeKind: "home" });
    const stage = new RouteRecognitionStage(
      new MockRouteRecognitionService(route) as any,
      new MockI18nService() as any,
    );
    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-200",
    });

    stage.execute(ctx);

    assert.equal(ctx.status, 200);
    assert.equal(ctx.shouldStopProcessing(), false);
    assert.equal(ctx.route?.routeKind, "home");
    assert.equal(ctx.localeContext?.locale, "en-US");
  });
});
