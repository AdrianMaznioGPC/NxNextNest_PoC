"use client";

import { cn, RadioGroup, RadioGroupItem } from "@commerce/ui";
import type { ReactNode } from "react";

interface CardPickerProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function CardPicker({
  value,
  onValueChange,
  children,
  className,
}: CardPickerProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className={cn("flex gap-3", className)}
    >
      {children}
    </RadioGroup>
  );
}

interface CardPickerItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function CardPickerItem({
  value,
  children,
  className,
}: CardPickerItemProps) {
  return (
    <RadioGroupItem
      value={value}
      hideIndicator
      className={cn(
        "flex min-w-[140px] max-w-[220px] shrink-0 cursor-pointer flex-col rounded-lg border p-3 text-left transition-colors sm:min-w-[180px]",
        "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700",
        "data-checked:border-blue-600 data-checked:bg-blue-50 dark:data-checked:bg-blue-950",
        className,
      )}
    >
      {children}
    </RadioGroupItem>
  );
}
