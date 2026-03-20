"use client";

import {
  ChoiceCardGroup,
  ChoiceCardItem,
} from "components/checkout/choice-card";
import type { PaymentOption } from "lib/types";

interface PaymentSectionProps {
  title: string;
  options: PaymentOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function PaymentSection({
  options,
  selected,
  title,
  onSelect,
}: PaymentSectionProps) {
  return (
    <fieldset>
      <legend className="mb-4 text-lg font-semibold">{title}</legend>
      <ChoiceCardGroup value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <ChoiceCardItem key={option.id} value={option.id}>
            <p className="text-sm font-medium">{option.label}</p>
            <p className="text-xs text-muted">{option.description}</p>
          </ChoiceCardItem>
        ))}
      </ChoiceCardGroup>
    </fieldset>
  );
}
