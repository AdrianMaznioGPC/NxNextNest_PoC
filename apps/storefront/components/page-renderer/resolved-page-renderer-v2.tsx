import type { SlotManifest } from "lib/types";
import { SlotBoundary } from "./slot-boundary";

export async function ResolvedPageRendererV2({
  slots,
}: {
  slots: SlotManifest[];
}) {
  const orderedSlots = [...slots]
    .map((slot, index) => ({ slot, index }))
    .sort((a, b) => {
      const pa = a.slot.priority ?? "critical";
      const pb = b.slot.priority ?? "critical";
      if (pa !== pb) {
        return pa === "critical" ? -1 : 1;
      }
      return a.index - b.index;
    })
    .map((entry) => entry.slot);

  return (
    <>
      {orderedSlots.map((slot) => (
        <SlotBoundary key={slot.id} slot={slot} />
      ))}
    </>
  );
}
