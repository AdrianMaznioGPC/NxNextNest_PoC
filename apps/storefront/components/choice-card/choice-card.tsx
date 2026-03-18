"use client";

import {
  Field,
  FieldContent,
  FieldLabel,
  RadioGroup,
  RadioGroupItem,
} from "@commerce/ui";
import type { ReactNode } from "react";

interface ChoiceCardGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export function ChoiceCardGroup({
  value,
  onValueChange,
  children,
}: ChoiceCardGroupProps) {
  return (
    <RadioGroup value={value} onValueChange={onValueChange}>
      {children}
    </RadioGroup>
  );
}

interface ChoiceCardItemProps {
  value: string;
  children: ReactNode;
}

export function ChoiceCardItem({ value, children }: ChoiceCardItemProps) {
  return (
    <FieldLabel htmlFor={value}>
      <Field
        orientation="horizontal"
        className="has-[>[data-slot=field-content]]:items-center"
      >
        <RadioGroupItem value={value} id={value} />
        <FieldContent>{children}</FieldContent>
      </Field>
    </FieldLabel>
  );
}
