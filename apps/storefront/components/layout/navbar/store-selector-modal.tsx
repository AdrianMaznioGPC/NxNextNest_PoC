"use client";

import type { LanguageCode, SwitchUrlResponse } from "lib/types";
import { useEffect, useMemo, useState } from "react";
import type { RegionOption } from "./store-selector-options";
import { LANGUAGE_LABELS } from "./store-selector-options";

type StoreSelectorModalProps = {
  open: boolean;
  onClose: () => void;
  currentRegion: string;
  currentLanguage: LanguageCode;
  supportedLanguages: LanguageCode[];
  regions: RegionOption[];
};

export default function StoreSelectorModal({
  open,
  onClose,
  currentRegion,
  currentLanguage,
  supportedLanguages,
  regions,
}: StoreSelectorModalProps) {
  const [selectedRegion, setSelectedRegion] = useState(currentRegion);
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSelectedRegion(currentRegion);
    setSelectedLanguage(currentLanguage);
    setError(null);
  }, [open, currentRegion, currentLanguage]);

  const hasChanged =
    selectedRegion !== currentRegion || selectedLanguage !== currentLanguage;
  const regionOptions = useMemo(
    () => regions.filter((item) => item.regionCode),
    [regions],
  );

  const onContinue = async () => {
    if (!hasChanged || isSubmitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const query = Object.fromEntries(
        new URLSearchParams(window.location.search).entries(),
      );
      const response = await fetch("/api/i18n/switch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: window.location.pathname,
          query,
          targetRegion: selectedRegion,
          targetLanguage: selectedLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Switch request failed (${response.status})`);
      }

      const payload = (await response.json()) as SwitchUrlResponse;
      if (!payload.targetUrl) {
        throw new Error("Switch response did not include a target URL");
      }
      window.location.assign(payload.targetUrl);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to switch store preferences.",
      );
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="store-selector-title"
        className="w-full max-w-xl rounded-lg border border-border bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="store-selector-title" className="text-xl font-semibold">
            Region and language
          </h2>
          <button
            type="button"
            className="rounded-control border border-border px-3 py-1 text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Region
            </h3>
            <ul className="space-y-2">
              {regionOptions.map((region) => (
                <li key={region.regionCode}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="region"
                      value={region.regionCode}
                      checked={selectedRegion === region.regionCode}
                      onChange={() => setSelectedRegion(region.regionCode)}
                    />
                    <span>{region.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Language
            </h3>
            <ul className="space-y-2">
              {supportedLanguages.map((language) => (
                <li key={language}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="language"
                      value={language}
                      checked={selectedLanguage === language}
                      onChange={() => setSelectedLanguage(language)}
                    />
                    <span>{LANGUAGE_LABELS[language]}</span>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="status">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-control border border-border px-4 py-2 text-sm"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            disabled={!hasChanged || isSubmitting}
            className="rounded-control bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Switching..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
