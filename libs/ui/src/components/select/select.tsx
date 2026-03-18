"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const SelectRoot = BaseSelect.Root;
export const SelectPortal = BaseSelect.Portal;
export const SelectValue = BaseSelect.Value;
export const SelectGroup = BaseSelect.Group;
export const SelectGroupLabel = BaseSelect.GroupLabel;

/* ── Trigger ─────────────────────────────────────────────────────────── */

export const SelectTrigger = forwardRef<
  ComponentRef<typeof BaseSelect.Trigger>,
  ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2",
      "text-sm text-foreground shadow-sm",
      "placeholder:text-muted-foreground",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <BaseSelect.Icon className="ml-2 h-4 w-4 shrink-0 opacity-50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </BaseSelect.Icon>
  </BaseSelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

/* ── Popup (dropdown) ────────────────────────────────────────────────── */

export const SelectPopup = forwardRef<
  ComponentRef<typeof BaseSelect.Popup>,
  ComponentPropsWithoutRef<typeof BaseSelect.Popup>
>(({ className, ...props }, ref) => (
  <BaseSelect.Popup
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
      className,
    )}
    {...props}
  />
));
SelectPopup.displayName = "SelectPopup";

/* ── Positioner ──────────────────────────────────────────────────────── */

export const SelectPositioner = forwardRef<
  ComponentRef<typeof BaseSelect.Positioner>,
  ComponentPropsWithoutRef<typeof BaseSelect.Positioner>
>(({ className, ...props }, ref) => (
  <BaseSelect.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={4}
    {...props}
  />
));
SelectPositioner.displayName = "SelectPositioner";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const SelectItem = forwardRef<
  ComponentRef<typeof BaseSelect.Item>,
  ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    <BaseSelect.ItemIndicator className="ml-auto">
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
    </BaseSelect.ItemIndicator>
  </BaseSelect.Item>
));
SelectItem.displayName = "SelectItem";
