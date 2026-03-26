import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { LocaleContext } from "@commerce/shared-types";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { SlotPlanningStage } from "./slot-planning.stage";

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

const mockSlots = [
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

class MockSlotPlanner {
  plan() {
    return mockSlots;
  }
}

describe("SlotPlanningStage", () => {
  test("plans slots for 200 response", () => {
    const slotPlanner = new MockSlotPlanner();
    const stage = new SlotPlanningStage(slotPlanner as any);

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.route = mockRoute;
    ctx.localeContext = localeContext;
    ctx.status = 200;
    ctx.seo = { title: "Home", description: "Home page" };
    ctx.content = [];
    ctx.revalidateTags = ["home"];
    ctx.assemblerKey = "home";
    ctx.assemblyVersion = "v1";
    ctx.translationVersion = "v1";
    ctx.matchedRuleId = "home";

    stage.execute(ctx);

    const plannedSlots = stage.getPlannedSlots(ctx);
    assert.equal(plannedSlots.length, 1);
    assert.equal(plannedSlots[0]?.id, "slot-1");
  });

  test("returns empty slots for 404", () => {
    const slotPlanner = new MockSlotPlanner();
    const stage = new SlotPlanningStage(slotPlanner as any);

    const ctx = new BootstrapContext({
      requestedPath: "/invalid",
      query: {},
      requestId: "test-2",
    });
    ctx.route = { ...mockRoute, status: 404 };
    ctx.localeContext = localeContext;
    ctx.status = 404;

    stage.execute(ctx);

    const plannedSlots = stage.getPlannedSlots(ctx);
    assert.deepEqual(plannedSlots, []);
  });

  test("throws if route is missing", () => {
    const slotPlanner = new MockSlotPlanner();
    const stage = new SlotPlanningStage(slotPlanner as any);

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-3",
    });

    assert.throws(() => stage.execute(ctx), /requires route and localeContext/);
  });

  test("throws if localeContext is missing", () => {
    const slotPlanner = new MockSlotPlanner();
    const stage = new SlotPlanningStage(slotPlanner as any);

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-4",
    });
    ctx.route = mockRoute;

    assert.throws(() => stage.execute(ctx), /requires route and localeContext/);
  });
});
