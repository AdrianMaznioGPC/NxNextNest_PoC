import assert from "node:assert/strict";
import { describe, test } from "node:test";
import type { SlotManifest } from "@commerce/shared-types";
import { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import { PersonalizationStage } from "./personalization.stage";

const mockExperience = {
  storeKey: "us-store",
  experienceProfileId: "default",
};

const mockMerchandising = {
  mode: "default" as const,
  profileId: "default",
};

const mockSlots: SlotManifest[] = [
  {
    id: "slot-1",
    rendererKey: "page.home",
    priority: "critical",
    stream: "blocking",
    dataMode: "inline",
    inlineProps: {},
    revalidateTags: ["home"],
    staleAfterSeconds: 300,
  },
];

class MockSlotPlanningStage {
  getPlannedSlots() {
    return mockSlots;
  }
}

class MockExperienceResolver {
  applyToSlots(slots: SlotManifest[]) {
    return slots.map((slot) => ({
      ...slot,
      presentation: { variantKey: "experience-variant" },
    }));
  }
}

class MockMerchandisingResolver {
  applyToSlots(slots: SlotManifest[]) {
    return slots.map((slot) => ({
      ...slot,
      presentation: {
        ...slot.presentation,
        density: "compact" as const,
      },
    }));
  }
}

describe("PersonalizationStage", () => {
  test("applies experience and merchandising overlays", () => {
    const stage = new PersonalizationStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockSlotPlanningStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-1",
    });
    ctx.experience = mockExperience as any;
    ctx.merchandising = mockMerchandising as any;
    ctx.status = 200;

    stage.execute(ctx);

    const personalizedSlots = stage.getPersonalizedSlots(ctx);
    assert.equal(personalizedSlots.length, 1);
    assert.equal(
      personalizedSlots[0]?.presentation?.variantKey,
      "experience-variant",
    );
    assert.equal(personalizedSlots[0]?.presentation?.density, "compact");
  });

  test("returns empty slots for 404", () => {
    const stage = new PersonalizationStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockSlotPlanningStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/invalid",
      query: {},
      requestId: "test-2",
    });
    ctx.experience = mockExperience as any;
    ctx.merchandising = mockMerchandising as any;
    ctx.status = 404;

    stage.execute(ctx);

    const personalizedSlots = stage.getPersonalizedSlots(ctx);
    assert.deepEqual(personalizedSlots, []);
  });

  test("throws if experience is missing", () => {
    const stage = new PersonalizationStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockSlotPlanningStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-3",
    });
    ctx.merchandising = mockMerchandising as any;

    assert.throws(
      () => stage.execute(ctx),
      /requires experience and merchandising/,
    );
  });

  test("throws if merchandising is missing", () => {
    const stage = new PersonalizationStage(
      new MockExperienceResolver() as any,
      new MockMerchandisingResolver() as any,
      new MockSlotPlanningStage() as any,
    );

    const ctx = new BootstrapContext({
      requestedPath: "/",
      query: {},
      requestId: "test-4",
    });
    ctx.experience = mockExperience as any;

    assert.throws(
      () => stage.execute(ctx),
      /requires experience and merchandising/,
    );
  });
});
