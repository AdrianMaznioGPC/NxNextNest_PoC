"use client";

import { AddressForm } from "components/checkout/address/address-form";
import { AddressPicker } from "components/checkout/address/address-picker";
import { useT } from "lib/i18n/messages-context";
import type { AddressFormSchema, SavedAddress } from "lib/types";
import { useState } from "react";
import { ExpressSummaryCard } from "./express-summary-card";

interface ExpressAddressCardProps {
  values: Record<string, string>;
  schema: AddressFormSchema;
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelectSavedAddress: (address: SavedAddress | null) => void;
  onChange: (fieldName: string, value: string) => void;
}

function formatAddress(values: Record<string, string>): string {
  const parts = [
    [values.firstName, values.lastName].filter(Boolean).join(" "),
    values.address,
    values.apartment,
    [values.postalCode, values.city].filter(Boolean).join(" "),
    values.state,
    values.country,
  ].filter(Boolean);
  return parts.join(", ");
}

export function ExpressAddressCard({
  values,
  schema,
  savedAddresses,
  selectedAddressId,
  onSelectSavedAddress,
  onChange,
}: ExpressAddressCardProps) {
  const t = useT("checkout");
  const [expanded, setExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  function handleSelectAddress(address: SavedAddress | null) {
    if (address) {
      onSelectSavedAddress(address);
      setExpanded(false);
      setShowForm(false);
    } else {
      setShowForm(true);
    }
  }

  const summary = <p className="text-sm text-muted">{formatAddress(values)}</p>;

  return (
    <ExpressSummaryCard
      title={t("shippingTo")}
      expanded={expanded}
      onToggle={() => {
        setExpanded(!expanded);
        if (expanded) setShowForm(false);
      }}
      summary={summary}
    >
      <div className="space-y-4">
        <AddressPicker
          addresses={savedAddresses}
          selectedId={selectedAddressId}
          onSelect={handleSelectAddress}
        />

        {showForm && (
          <AddressForm
            idPrefix="express-shipping"
            schema={schema}
            values={values}
            onChange={onChange}
          />
        )}
      </div>
    </ExpressSummaryCard>
  );
}
