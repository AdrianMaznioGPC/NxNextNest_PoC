import { Injectable } from "@nestjs/common";
import type { CmsRawBlock } from "../../ports/cms.port";
import type { ResolvedExperienceSignals } from "./experience-profile.types";

/**
 * Applies block overrides to raw CMS blocks before they are resolved.
 *
 * This is a generic applicator with zero block-type knowledge — it matches
 * overrides by `blockType` and shallow-merges `fields` onto the raw block.
 * The existing block resolvers then handle fetching full data for any
 * swapped handles.
 */
@Injectable()
export class BlockOverlayService {
  apply(
    rawBlocks: CmsRawBlock[],
    signals: ResolvedExperienceSignals,
  ): CmsRawBlock[] {
    if (signals.blockOverrides.length === 0) {
      return rawBlocks;
    }

    const overridesByType = new Map(
      signals.blockOverrides.map((o) => [o.blockType, o]),
    );

    const existingTypes = new Set<string>(rawBlocks.map((b) => b.type));
    const result: CmsRawBlock[] = [];

    // Apply overrides to existing blocks
    for (const block of rawBlocks) {
      const override = overridesByType.get(block.type);
      if (override) {
        result.push({ ...block, ...override.fields } as CmsRawBlock);
      } else {
        result.push(block);
      }
    }

    // Inject new blocks that don't exist in the base
    for (const override of signals.blockOverrides) {
      if (!existingTypes.has(override.blockType)) {
        const newBlock = {
          type: override.blockType as CmsRawBlock["type"],
          id: `override-${override.blockType}`,
          ...override.fields,
        } as CmsRawBlock;
        result.unshift(newBlock); // Add to beginning so effects render first
      }
    }

    return result;
  }
}
