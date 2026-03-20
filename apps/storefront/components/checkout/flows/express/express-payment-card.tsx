"use client";

import { PaymentSection } from "components/checkout/sections/payment-section";
import { useT } from "lib/i18n/messages-context";
import type { PaymentOption } from "lib/types";
import { useState } from "react";
import { ExpressSummaryCard } from "./express-summary-card";

interface ExpressPaymentCardProps {
  options: PaymentOption[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ExpressPaymentCard({
  options,
  selectedId,
  onSelect,
}: ExpressPaymentCardProps) {
  const t = useT("checkout");
  const [expanded, setExpanded] = useState(false);

  const selected = options.find((o) => o.id === selectedId);

  function handleSelect(id: string) {
    onSelect(id);
    setExpanded(false);
  }

  const summary = selected ? (
    <div>
      <p className="text-sm font-medium">{selected.label}</p>
      <p className="text-xs text-muted">{selected.description}</p>
    </div>
  ) : null;

  return (
    <ExpressSummaryCard
      title={t("paymentMethod")}
      expanded={expanded}
      onToggle={() => setExpanded(!expanded)}
      summary={summary}
    >
      <PaymentSection
        title=""
        options={options}
        selected={selectedId}
        onSelect={handleSelect}
      />
    </ExpressSummaryCard>
  );
}
