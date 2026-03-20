"use client";

import clsx from "clsx";
import { useT } from "lib/i18n/messages-context";
import type { SavedAddress } from "lib/types";

interface AddressPickerProps {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (address: SavedAddress | null) => void;
}

function formatSummary(values: Record<string, string>): string {
  const parts = [
    values.address,
    [values.postalCode, values.city].filter(Boolean).join(" "),
  ].filter(Boolean);
  return parts.join(", ");
}

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
}: AddressPickerProps) {
  const t = useT("checkout");

  if (addresses.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-muted">
        {t("savedAddresses")}
      </p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {addresses.map((address) => (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address)}
            className={clsx(
              "flex min-w-[160px] max-w-[220px] shrink-0 flex-col rounded-lg border p-3 text-left transition-colors",
              selectedId === address.id
                ? "border-primary bg-primary/10"
                : "border-card-border hover:border-card-border-hover",
            )}
          >
            <span className="text-sm font-medium">{address.label}</span>
            <span className="mt-1 line-clamp-2 text-xs text-muted">
              {formatSummary(address.values)}
            </span>
            {(address.isDefaultShipping || address.isDefaultBilling) && (
              <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-primary">
                {address.isDefaultShipping && address.isDefaultBilling
                  ? t("defaultShippingAndBilling")
                  : address.isDefaultShipping
                    ? t("defaultShipping")
                    : t("defaultBilling")}
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onSelect(null)}
        className="mt-2 text-sm font-medium text-link hover:text-link-hover"
      >
        {t("useADifferentAddress")}
      </button>
    </div>
  );
}
