"use client";

import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@commerce/ui";
import {
  ChoiceCardGroup,
  ChoiceCardItem,
} from "components/choice-card/choice-card";
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
    <FieldSet className="w-full">
      <FieldLegend variant="label">{title}</FieldLegend>
      <ChoiceCardGroup value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <ChoiceCardItem key={option.id} value={option.id}>
            <FieldTitle>{option.label}</FieldTitle>
            <FieldDescription>{option.description}</FieldDescription>
          </ChoiceCardItem>
        ))}
      </ChoiceCardGroup>
    </FieldSet>
  );
}
