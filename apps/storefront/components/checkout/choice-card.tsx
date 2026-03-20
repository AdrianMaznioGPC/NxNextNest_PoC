"use client";

import clsx from "clsx";
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
    <div role="radiogroup" className="space-y-3">
      {typeof children === "object" && Array.isArray(children)
        ? children.map((child) => {
            if (!child?.props?.value) return child;
            return (
              <ChoiceCardItemWrapper
                key={child.props.value}
                itemValue={child.props.value}
                selectedValue={value}
                onSelect={onValueChange}
              >
                {child.props.children}
              </ChoiceCardItemWrapper>
            );
          })
        : children}
    </div>
  );
}

interface ChoiceCardItemWrapperProps {
  itemValue: string;
  selectedValue: string;
  onSelect: (value: string) => void;
  children: ReactNode;
}

function ChoiceCardItemWrapper({
  itemValue,
  selectedValue,
  onSelect,
  children,
}: ChoiceCardItemWrapperProps) {
  const isSelected = itemValue === selectedValue;

  return (
    <label
      className={clsx(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-card-border hover:border-card-border-hover",
      )}
    >
      <input
        type="radio"
        name={`choice-${itemValue}`}
        value={itemValue}
        checked={isSelected}
        onChange={() => onSelect(itemValue)}
        className="h-4 w-4 accent-primary"
      />
      <div className="flex-1">{children}</div>
    </label>
  );
}

interface ChoiceCardItemProps {
  value: string;
  children: ReactNode;
}

/** Marker component — rendered by ChoiceCardGroup */
export function ChoiceCardItem({ children }: ChoiceCardItemProps) {
  return <>{children}</>;
}
