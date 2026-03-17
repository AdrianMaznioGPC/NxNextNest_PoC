"use client";

import {
  Price,
  RadioCard,
  RadioCardDescription,
  RadioCardGroup,
  RadioCardLabel,
} from "@commerce/ui";
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
      <RadioCardGroup name="delivery" value={selected} onValueChange={onSelect}>
        {options.map((option) => (
          <RadioCard
            key={option.id}
            value={option.id}
            className="justify-between"
          >
            <div>
              <RadioCardLabel>{option.label}</RadioCardLabel>
              <RadioCardDescription>{option.description}</RadioCardDescription>
            </div>
            <Price
              className="text-sm font-medium text-foreground"
              amount={option.price.amount}
              currencyCode={option.price.currencyCode}
            />
          </RadioCard>
        ))}
      </RadioCardGroup>
    </fieldset>
  );
}
