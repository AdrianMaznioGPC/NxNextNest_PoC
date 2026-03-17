"use client";

import {
  RadioCard,
  RadioCardDescription,
  RadioCardGroup,
  RadioCardLabel,
} from "@commerce/ui";
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
      <RadioCardGroup name="payment" value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <RadioCard key={option.id} value={option.id}>
            <RadioCardLabel>{option.label}</RadioCardLabel>
            <RadioCardDescription>{option.description}</RadioCardDescription>
          </RadioCard>
        ))}
      </RadioCardGroup>
    </fieldset>
  );
}
