import type { SlotManifest, SlotOverlayRule } from "@commerce/shared-types";

/**
 * Apply slot overlay rules to a list of slot manifests.
 * This is the shared algorithm used by both Experience and Merchandising overlays.
 */
export function applySlotOverlay(
  slots: SlotManifest[],
  rules: SlotOverlayRule[],
  extraRevalidateTags: string[],
): SlotManifest[] {
  const rulesByRenderer = new Map(
    rules.map((rule) => [rule.rendererKey, rule]),
  );

  const nextSlots: SlotManifest[] = [];
  for (const slot of slots) {
    const rule = rulesByRenderer.get(slot.rendererKey);
    if (rule?.include === false) {
      continue;
    }

    const presentation = {
      ...slot.presentation,
      variantKey:
        rule?.variantKey ?? slot.presentation?.variantKey ?? "default",
      layoutKey: rule?.layoutKey ?? slot.presentation?.layoutKey,
      density: rule?.density ?? slot.presentation?.density,
      flags: mergeFlags(slot.presentation?.flags, rule?.flags),
    };

    const nextSlotRef = slot.slotRef
      ? {
          ...slot.slotRef,
          query: dedupeQuery({
            ...slot.slotRef.query,
            variantKey: presentation.variantKey,
            layoutKey: presentation.layoutKey,
            density: presentation.density,
          }),
        }
      : undefined;

    nextSlots.push({
      ...slot,
      presentation,
      slotRef: nextSlotRef,
      revalidateTags: dedupe([...slot.revalidateTags, ...extraRevalidateTags]),
    });
  }

  return nextSlots;
}

export function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

export function dedupeQuery(
  input: Record<string, string | undefined>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}

function mergeFlags(
  slotFlags?: Record<string, boolean>,
  ruleFlags?: Record<string, boolean>,
): Record<string, boolean> | undefined {
  if (!slotFlags && !ruleFlags) {
    return undefined;
  }

  return {
    ...(slotFlags ?? {}),
    ...(ruleFlags ?? {}),
  };
}
