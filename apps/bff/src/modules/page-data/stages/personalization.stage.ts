import type { SlotManifest } from "@commerce/shared-types";
import { Injectable } from "@nestjs/common";
import { ExperienceResolverService } from "../../experience/experience-resolver.service";
import { MerchandisingResolverService } from "../../merchandising/merchandising-resolver.service";
import type { BootstrapContext } from "../bootstrap/bootstrap-context.model";
import type { BootstrapStage } from "../bootstrap/bootstrap-stage.interface";
import { SlotPlanningStage } from "./slot-planning.stage";

/**
 * Stage 6: Personalization
 *
 * Responsibilities:
 * - Apply experience overlays to planned slots (experience-specific content)
 * - Apply merchandising overlays to slots (sort/filter overrides)
 * - Skip personalization for 404 responses
 * - Store final personalized slots in context
 */
@Injectable()
export class PersonalizationStage implements BootstrapStage {
  readonly name = "personalization";

  // Store personalized slots in context (temporary field)
  private personalizedSlotsMap = new WeakMap<
    BootstrapContext,
    SlotManifest[]
  >();

  constructor(
    private readonly experience: ExperienceResolverService,
    private readonly merchandising: MerchandisingResolverService,
    private readonly slotPlanningStage: SlotPlanningStage,
  ) {}

  execute(ctx: BootstrapContext): void {
    if (!ctx.experience || !ctx.merchandising) {
      throw new Error(
        "PersonalizationStage requires experience and merchandising to be set",
      );
    }

    // Skip personalization for 404 responses
    if (ctx.status === 404) {
      this.personalizedSlotsMap.set(ctx, []);
      return;
    }

    // Get planned slots from previous stage
    const plannedSlots = this.slotPlanningStage.getPlannedSlots(ctx);

    // Apply experience overlay first
    const experienceSlots = this.experience.applyToSlots(
      plannedSlots,
      ctx.experience,
    );

    // Apply merchandising overlay second
    const finalSlots = this.merchandising.applyToSlots(
      experienceSlots,
      ctx.merchandising,
    );

    // Store personalized slots for next stage
    this.personalizedSlotsMap.set(ctx, finalSlots);
  }

  /**
   * Get personalized slots from context (used by link-localization stage).
   */
  getPersonalizedSlots(ctx: BootstrapContext): SlotManifest[] {
    return this.personalizedSlotsMap.get(ctx) ?? [];
  }
}
