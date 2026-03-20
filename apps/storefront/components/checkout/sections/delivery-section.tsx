"use client";

import Price from "components/price";
import {
  ChoiceCardGroup,
  ChoiceCardItem,
} from "components/checkout/choice-card";
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
    <fieldset>
      <legend className="mb-4 text-lg font-semibold">{title}</legend>
      <ChoiceCardGroup value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <ChoiceCardItem key={option.id} value={option.id}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{option.label}</p>
                <p className="text-xs text-muted">
                  {option.description}
                </p>
              </div>
              <Price
                className="text-sm font-medium"
                amount={option.price.amount}
                currencyCode={option.price.currencyCode}
              />
            </div>
          </ChoiceCardItem>
        ))}
      </ChoiceCardGroup>
    </fieldset>
  );
}
