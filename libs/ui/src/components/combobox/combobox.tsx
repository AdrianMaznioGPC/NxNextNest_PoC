"use client";

import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const ComboboxRoot = BaseCombobox.Root;
export const ComboboxPortal = BaseCombobox.Portal;
export const ComboboxGroup = BaseCombobox.Group;
export const ComboboxGroupLabel = BaseCombobox.GroupLabel;
export const ComboboxValue = BaseCombobox.Value;
export const ComboboxEmpty = BaseCombobox.Empty;

/* ── Input ────────────────────────────────────────────────────────────── */

export const ComboboxInput = forwardRef<
  ComponentRef<typeof BaseCombobox.Input>,
  ComponentPropsWithoutRef<typeof BaseCombobox.Input>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Input
    ref={ref}
    className={cn(
      "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1",
      "text-sm text-foreground placeholder:text-muted-foreground",
      "shadow-sm transition-colors",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ComboboxInput.displayName = "ComboboxInput";

/* ── Trigger (optional dropdown arrow) ───────────────────────────────── */

export const ComboboxTrigger = BaseCombobox.Trigger;

/* ── Positioner ──────────────────────────────────────────────────────── */

export const ComboboxPositioner = forwardRef<
  ComponentRef<typeof BaseCombobox.Positioner>,
  ComponentPropsWithoutRef<typeof BaseCombobox.Positioner>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={4}
    {...props}
  />
));
ComboboxPositioner.displayName = "ComboboxPositioner";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const ComboboxPopup = forwardRef<
  ComponentRef<typeof BaseCombobox.Popup>,
  ComponentPropsWithoutRef<typeof BaseCombobox.Popup>
>(({ className, ...props }, ref) => (
  <BaseCombobox.Popup
    ref={ref}
    className={cn(
      "z-50 max-h-[300px] min-w-[8rem] overflow-auto rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
      className,
    )}
    {...props}
  />
));
ComboboxPopup.displayName = "ComboboxPopup";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const ComboboxItem = forwardRef<
  ComponentRef<typeof BaseCombobox.Item>,
  ComponentPropsWithoutRef<typeof BaseCombobox.Item>
>(({ className, children, ...props }, ref) => (
  <BaseCombobox.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <BaseCombobox.ItemIndicator className="ml-auto">
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </BaseCombobox.ItemIndicator>
  </BaseCombobox.Item>
));
ComboboxItem.displayName = "ComboboxItem";
