"use client";

import Price from "components/price";
import { DeliverySection } from "components/checkout/sections/delivery-section";
import { useT } from "lib/i18n/messages-context";
import type { DeliveryOption } from "lib/types";
import { useState } from "react";
import { ExpressSummaryCard } from "./express-summary-card";

interface ExpressDeliveryCardProps {
  options: DeliveryOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ExpressDeliveryCard({
  options,
  selectedId,
  onSelect,
}: ExpressDeliveryCardProps) {
  const t = useT("checkout");
  const [expanded, setExpanded] = useState(false);

  const selected = options.find((o) => o.id === selectedId);

  function handleSelect(id: string) {
    onSelect(id);
    setExpanded(false);
  }

  const summary = selected ? (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium">{selected.label}</p>
        <p className="text-xs text-muted">{selected.description}</p>
      </div>
      <Price
        className="text-sm font-medium"
        amount={selected.price.amount}
        currencyCode={selected.price.currencyCode}
      />
    </div>
  ) : null;

  return (
    <ExpressSummaryCard
      title={t("deliveryMethod")}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      summary={summary}
    >
      <DeliverySection
        title=""
        options={options}
        selected={selectedId}
        onSelect={handleSelect}
      />
    </ExpressSummaryCard>
  );
}
