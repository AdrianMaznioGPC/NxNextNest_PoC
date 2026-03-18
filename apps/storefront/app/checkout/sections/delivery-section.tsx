"use client";

import {
  FieldDescription,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Price,
} from "@commerce/ui";
import {
  ChoiceCardGroup,
  ChoiceCardItem,
} from "components/choice-card/choice-card";
import type { DeliveryOption } from "lib/types";

interface DeliverySectionProps {
  title: string;
  options: DeliveryOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function DeliverySection({
  options,
  selected,
  title,
  onSelect,
}: DeliverySectionProps) {
  return (
    <FieldSet className="w-full">
      <FieldLegend variant="label">{title}</FieldLegend>
      <ChoiceCardGroup value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <ChoiceCardItem key={option.id} value={option.id}>
            <FieldTitle>{option.label}</FieldTitle>
            <FieldDescription>{option.description}</FieldDescription>
            <Price
              className="text-sm font-medium text-foreground"
              amount={option.price.amount}
              currencyCode={option.price.currencyCode}
            />
          </ChoiceCardItem>
        ))}
      </ChoiceCardGroup>
    </FieldSet>
  );
}
