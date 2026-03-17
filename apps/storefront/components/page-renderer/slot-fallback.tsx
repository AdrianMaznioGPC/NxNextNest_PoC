const FALLBACK_LABELS: Record<string, string> = {
  "slot.fallback.recommendations": "Recommendations are loading.",
  "slot.fallback.reviews": "Reviews are loading.",
  "slot.fallback.faq": "FAQ is loading.",
  "slot.fallback.searchProducts": "Search results are loading.",
};

export function SlotFallback({ fallbackKey }: { fallbackKey?: string }) {
  const label = fallbackKey ? FALLBACK_LABELS[fallbackKey] : undefined;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-sm text-neutral-600">
      {label ?? "Content is loading."}
    </div>
  );
}
