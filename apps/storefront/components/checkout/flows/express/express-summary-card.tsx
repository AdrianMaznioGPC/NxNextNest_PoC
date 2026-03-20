"use client";

import { useT } from "lib/i18n/messages-context";
import type { ReactNode } from "react";

interface ExpressSummaryCardProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  summary: ReactNode;
  children: ReactNode;
}

export function ExpressSummaryCard({
  title,
  expanded,
  onToggle,
  summary,
  children,
}: ExpressSummaryCardProps) {
  const t = useT("checkout");

  return (
    <div className="rounded-lg border border-card-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onToggle}
          className="text-sm font-medium text-link hover:text-link-hover"
        >
          {expanded ? t("edit") : t("change")}
        </button>
      </div>

      {!expanded && (
        <div className="border-t border-border px-4 py-3">{summary}</div>
      )}

      {expanded && (
        <div className="border-t border-border px-4 py-4">{children}</div>
      )}
    </div>
  );
}
