import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { LocaleContext } from "@commerce/shared-types";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { AssemblyCacheStage } from "./assembly-cache.stage";

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
};

const mockMerchandising = {
  mode: "default" as const,
  profileId: "default",
};

describe("AssemblyCacheStage", () => {
  test("does nothing when cache is disabled", () => {
    const stage = new AssemblyCacheStage();
    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.experience = mockExperience as any;
    ctx.merchandising = mockMerchandising as any;

    stage.execute(ctx);

    // Should not stop processing since cache is disabled
    assert.equal(ctx.shouldStopProcessing(), false);
    assert.equal(ctx.status, undefined);
  });

  test("cache is disabled by default", () => {
    const stage = new AssemblyCacheStage();
    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-2",
    });

    // Should complete without error even with minimal context
    stage.execute(ctx);

    assert.equal(ctx.shouldStopProcessing(), false);
  });
});
