"use client";

import { CardPicker, CardPickerItem } from "components/card-picker/card-picker";
import { ScrollContainer } from "components/scroll-container";
import type { SavedAddress } from "lib/types";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("checkout");

  if (addresses.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t("savedAddresses")}
      </p>
      <ScrollContainer>
        <CardPicker
          value={selectedId ?? ""}
          onValueChange={(val) =>
            onSelect(addresses.find((a) => a.id === val)!)
          }
        >
          {addresses.map((address) => (
            <CardPickerItem key={address.id} value={address.id}>
              <span className="text-sm font-medium text-black dark:text-white">
                {address.label}
              </span>
              <span className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                {formatSummary(address.values)}
              </span>
              {(address.isDefaultShipping || address.isDefaultBilling) && (
                <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-blue-600">
                  {address.isDefaultShipping && address.isDefaultBilling
                    ? t("defaultShippingAndBilling")
                    : address.isDefaultShipping
                      ? t("defaultShipping")
                      : t("defaultBilling")}
                </span>
              )}
            </CardPickerItem>
          ))}
        </CardPicker>
      </ScrollContainer>

      <button
        type="button"
        onClick={() => onSelect(null)}
        className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {t("useADifferentAddress")}
      </button>
    </div>
  );
}
