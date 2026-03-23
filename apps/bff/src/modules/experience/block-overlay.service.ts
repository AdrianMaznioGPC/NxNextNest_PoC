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

    return rawBlocks.map((block) => {
      const override = overridesByType.get(block.type);
      if (!override) return block;
      return { ...block, ...override.fields } as CmsRawBlock;
    });
  }
}
