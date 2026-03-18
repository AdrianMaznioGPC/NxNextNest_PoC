"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const PopoverRoot = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverPortal = BasePopover.Portal;
export const PopoverClose = BasePopover.Close;

/* ── Positioner ──────────────────────────────────────────────────────── */

export const PopoverPositioner = forwardRef<
  ComponentRef<typeof BasePopover.Positioner>,
  ComponentPropsWithoutRef<typeof BasePopover.Positioner>
>(({ className, ...props }, ref) => (
  <BasePopover.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={6}
    {...props}
  />
));
PopoverPositioner.displayName = "PopoverPositioner";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const PopoverPopup = forwardRef<
  ComponentRef<typeof BasePopover.Popup>,
  ComponentPropsWithoutRef<typeof BasePopover.Popup>
>(({ className, ...props }, ref) => (
  <BasePopover.Popup
    ref={ref}
    className={cn(
      "w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
      "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
      "transition-all duration-150",
      className,
    )}
    {...props}
  />
));
PopoverPopup.displayName = "PopoverPopup";

/* ── Backdrop ────────────────────────────────────────────────────────── */

export const PopoverBackdrop = forwardRef<
  ComponentRef<typeof BasePopover.Backdrop>,
  ComponentPropsWithoutRef<typeof BasePopover.Backdrop>
>(({ className, ...props }, ref) => (
  <BasePopover.Backdrop
    ref={ref}
    className={cn("fixed inset-0 z-40", className)}
    {...props}
  />
));
PopoverBackdrop.displayName = "PopoverBackdrop";

/* ── Title & Description ─────────────────────────────────────────────── */

export const PopoverTitle = forwardRef<
  ComponentRef<typeof BasePopover.Title>,
  ComponentPropsWithoutRef<typeof BasePopover.Title>
>(({ className, ...props }, ref) => (
  <BasePopover.Title
    ref={ref}
    className={cn("text-sm font-semibold text-foreground", className)}
    {...props}
  />
));
PopoverTitle.displayName = "PopoverTitle";

export const PopoverDescription = forwardRef<
  ComponentRef<typeof BasePopover.Description>,
  ComponentPropsWithoutRef<typeof BasePopover.Description>
>(({ className, ...props }, ref) => (
  <BasePopover.Description
    ref={ref}
    className={cn("mt-1 text-sm text-muted-foreground", className)}
    {...props}
  />
));
PopoverDescription.displayName = "PopoverDescription";

/* ── Arrow ───────────────────────────────────────────────────────────── */

export const PopoverArrow = forwardRef<
  ComponentRef<typeof BasePopover.Arrow>,
  ComponentPropsWithoutRef<typeof BasePopover.Arrow>
>(({ className, ...props }, ref) => (
  <BasePopover.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
      className,
    )}
    {...props}
  >
    <svg width="12" height="6" viewBox="0 0 12 6" className="fill-popover">
      <path d="M0 6L6 0L12 6" />
    </svg>
  </BasePopover.Arrow>
));
PopoverArrow.displayName = "PopoverArrow";
