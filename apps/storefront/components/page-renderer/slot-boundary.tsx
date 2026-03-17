import { getSlotPayload } from "lib/api";
import type { SlotManifest } from "lib/types";
import { Suspense } from "react";
import { SlotFallback } from "./slot-fallback";
import { loadSlotRenderer } from "./slot-renderer-registry";

export function SlotBoundary({ slot }: { slot: SlotManifest }) {
  if (slot.dataMode === "inline") {
    return <InlineSlotContent slot={slot} />;
  }

  if (!slot.slotRef) {
    console.error(`[SlotBoundary] Missing slotRef for slot \"${slot.id}\"`);
    return <SlotFallback fallbackKey={slot.fallbackKey} />;
  }

  if (slot.stream === "deferred") {
    return (
      <Suspense fallback={<SlotFallback fallbackKey={slot.fallbackKey} />}>
        <DeferredSlotContent slot={slot} />
      </Suspense>
    );
  }

  return <DeferredSlotContent slot={slot} />;
}

async function InlineSlotContent({ slot }: { slot: SlotManifest }) {
  return renderSlot(
    slot.rendererKey,
    slot.presentation?.variantKey ?? "default",
    slot.inlineProps ?? {},
    slot.id,
  );
}

async function DeferredSlotContent({ slot }: { slot: SlotManifest }) {
  if (!slot.slotRef) {
    return <SlotFallback fallbackKey={slot.fallbackKey} />;
  }

  try {
    const payload = await getSlotPayload(slot.slotRef);
    const rendererKey = payload.rendererKey || slot.rendererKey;

    if (rendererKey !== slot.rendererKey) {
      console.warn(
        `[SlotBoundary] Renderer key mismatch for slot \"${slot.id}\": expected \"${slot.rendererKey}\", got \"${rendererKey}\"`,
      );
    }

    const variantKey =
      payload.presentation?.variantKey ??
      slot.presentation?.variantKey ??
      "default";
    return renderSlot(rendererKey, variantKey, payload.props ?? {}, slot.id);
  } catch (error) {
    console.error(
      `[SlotBoundary] Failed to resolve deferred slot \"${slot.id}\"`,
      error,
    );
    return <SlotFallback fallbackKey={slot.fallbackKey} />;
  }
}

async function renderSlot(
  rendererKey: string,
  variantKey: string,
  props: Record<string, unknown>,
  slotId: string,
) {
  const SlotRenderer = await loadSlotRenderer(rendererKey, variantKey);
  if (!SlotRenderer) {
    console.warn(`[SlotBoundary] Unknown renderer key \"${rendererKey}\"`);
    return null;
  }

  return <SlotRenderer key={slotId} {...props} />;
}
