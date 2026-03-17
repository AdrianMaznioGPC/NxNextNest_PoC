"use client";

import type { LanguageCode } from "lib/types";
import { useState } from "react";
import type { RegionOption } from "./store-selector-options";
import { LANGUAGE_LABELS } from "./store-selector-options";
import StoreSelectorModal from "./store-selector-modal";

type StoreSelectorTriggerProps = {
  currentRegion: string;
  currentLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  regions: RegionOption[];
};

export default function StoreSelectorTrigger({
  currentRegion,
  currentLanguage,
  supportedLanguages,
  regions,
}: StoreSelectorTriggerProps) {
  const [open, setOpen] = useState(false);
  const currentRegionLabel =
    regions.find((region) => region.regionCode === currentRegion)?.label ??
    currentRegion;

  return (
    <>
      <button
        type="button"
        aria-label="Open store selector"
        onClick={() => setOpen(true)}
        className="rounded-control border border-border px-3 py-2 text-sm"
      >
        {currentRegionLabel} | {LANGUAGE_LABELS[currentLanguage]}
      </button>

      <StoreSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        currentRegion={currentRegion}
        currentLanguage={currentLanguage}
        supportedLanguages={supportedLanguages}
        regions={regions}
      />
    </>
  );
}
