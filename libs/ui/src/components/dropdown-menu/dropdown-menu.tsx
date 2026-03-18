"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const DropdownMenuRoot = BaseMenu.Root;
export const DropdownMenuPortal = BaseMenu.Portal;
export const DropdownMenuGroup = BaseMenu.Group;
export const DropdownMenuGroupLabel = BaseMenu.GroupLabel;
export const DropdownMenuRadioGroup = BaseMenu.RadioGroup;

/* ── Trigger ─────────────────────────────────────────────────────────── */

export const DropdownMenuTrigger = BaseMenu.Trigger;

/* ── Positioner ──────────────────────────────────────────────────────── */

export const DropdownMenuPositioner = forwardRef<
  ComponentRef<typeof BaseMenu.Positioner>,
  ComponentPropsWithoutRef<typeof BaseMenu.Positioner>
>(({ className, ...props }, ref) => (
  <BaseMenu.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={4}
    {...props}
  />
));
DropdownMenuPositioner.displayName = "DropdownMenuPositioner";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const DropdownMenuPopup = forwardRef<
  ComponentRef<typeof BaseMenu.Popup>,
  ComponentPropsWithoutRef<typeof BaseMenu.Popup>
>(({ className, ...props }, ref) => (
  <BaseMenu.Popup
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
DropdownMenuPopup.displayName = "DropdownMenuPopup";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const DropdownMenuItem = forwardRef<
  ComponentRef<typeof BaseMenu.Item>,
  ComponentPropsWithoutRef<typeof BaseMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseMenu.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ── Separator ────────────────────────────────────────────────────────── */

export const DropdownMenuSeparator = forwardRef<
  ComponentRef<typeof BaseMenu.Separator>,
  ComponentPropsWithoutRef<typeof BaseMenu.Separator>
>(({ className, ...props }, ref) => (
  <BaseMenu.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/* ── RadioItem ────────────────────────────────────────────────────────── */

export const DropdownMenuRadioItem = forwardRef<
  ComponentRef<typeof BaseMenu.RadioItem>,
  ComponentPropsWithoutRef<typeof BaseMenu.RadioItem>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.RadioItem
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <BaseMenu.RadioItemIndicator>
        <svg
          className="h-2 w-2 fill-current"
          viewBox="0 0 8 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
      </BaseMenu.RadioItemIndicator>
    </span>
    {children}
  </BaseMenu.RadioItem>
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

/* ── CheckboxItem ─────────────────────────────────────────────────────── */

export const DropdownMenuCheckboxItem = forwardRef<
  ComponentRef<typeof BaseMenu.CheckboxItem>,
  ComponentPropsWithoutRef<typeof BaseMenu.CheckboxItem>
>(({ className, children, ...props }, ref) => (
  <BaseMenu.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <BaseMenu.CheckboxItemIndicator>
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
      </BaseMenu.CheckboxItemIndicator>
    </span>
    {children}
  </BaseMenu.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
