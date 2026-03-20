"use client";

import { AddressForm } from "components/checkout/address/address-form";
import { AddressPicker } from "components/checkout/address/address-picker";
import { useT } from "lib/i18n/messages-context";
import type { AddressFormSchema, SavedAddress } from "lib/types";

interface AddressSectionProps {
  title: string;
  idPrefix: string;
  schema: AddressFormSchema;
  values: Record<string, string>;
  onChange: (fieldName: string, value: string) => void;
  savedAddresses?: SavedAddress[];
  selectedAddressId?: string | null;
  onSelectSavedAddress?: (address: SavedAddress | null) => void;
  saveAddress?: boolean;
  onSaveAddressChange?: (save: boolean) => void;
}

export function AddressSection({
  title,
  idPrefix,
  schema,
  values,
  onChange,
  savedAddresses,
  selectedAddressId,
  onSelectSavedAddress,
  saveAddress,
  onSaveAddressChange,
}: AddressSectionProps) {
  const t = useT("checkout");
  const hasPicker =
    savedAddresses && savedAddresses.length > 0 && onSelectSavedAddress;
  const showPicker = hasPicker && selectedAddressId !== null;
  const showForm = !hasPicker || selectedAddressId === null;

  function handleUseSavedAddress() {
    if (!savedAddresses || !onSelectSavedAddress) return;
    const fallback =
      savedAddresses.find((a) => a.isDefaultShipping) ?? savedAddresses[0];
    if (fallback) onSelectSavedAddress(fallback);
  }

  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 text-lg font-semibold">{title}</legend>

      {showPicker && (
        <AddressPicker
          addresses={savedAddresses}
          selectedId={selectedAddressId ?? null}
          onSelect={onSelectSavedAddress}
        />
      )}

      {showForm && (
        <>
          {hasPicker && (
            <button
              type="button"
              onClick={handleUseSavedAddress}
              className="mb-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              {t("useSavedAddress")}
            </button>
          )}

          <AddressForm
            idPrefix={idPrefix}
            schema={schema}
            values={values}
            onChange={onChange}
            saveAddress={saveAddress}
            onSaveAddressChange={onSaveAddressChange}
          />
        </>
      )}
    </fieldset>
  );
}
