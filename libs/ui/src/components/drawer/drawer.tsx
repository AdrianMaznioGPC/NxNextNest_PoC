"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const DrawerRoot = BaseDialog.Root;
export const DrawerTrigger = BaseDialog.Trigger;
export const DrawerClose = BaseDialog.Close;
export const DrawerPortal = BaseDialog.Portal;

/* ── Backdrop ────────────────────────────────────────────────────────── */

export const DrawerBackdrop = forwardRef<
  ComponentRef<typeof BaseDialog.Backdrop>,
  ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Portal>
    <BaseDialog.Backdrop
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "transition-opacity duration-300",
        className,
      )}
      {...props}
    />
  </BaseDialog.Portal>
));
DrawerBackdrop.displayName = "DrawerBackdrop";

/* ── Popup (the sliding panel) ───────────────────────────────────────── */

const sideClasses = {
  right: [
    "fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm",
    "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full",
  ],
  left: [
    "fixed inset-y-0 left-0 z-50 h-full w-full max-w-sm",
    "data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full",
  ],
  top: [
    "fixed inset-x-0 top-0 z-50 w-full",
    "data-[starting-style]:-translate-y-full data-[ending-style]:-translate-y-full",
  ],
  bottom: [
    "fixed inset-x-0 bottom-0 z-50 w-full",
    "data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full",
  ],
} as const;

export interface DrawerPopupProps
  extends ComponentPropsWithoutRef<typeof BaseDialog.Popup> {
  /** Edge from which the drawer slides in. */
  side?: keyof typeof sideClasses;
}

export const DrawerPopup = forwardRef<
  ComponentRef<typeof BaseDialog.Popup>,
  DrawerPopupProps
>(({ className, side = "right", ...props }, ref) => (
  <BaseDialog.Portal>
    <BaseDialog.Popup
      ref={ref}
      className={cn(
        sideClasses[side],
        "border-border bg-background p-6 shadow-xl",
        "transition-transform duration-300 ease-in-out",
        side === "right" && "border-l",
        side === "left" && "border-r",
        side === "top" && "border-b",
        side === "bottom" && "border-t",
        className,
      )}
      {...props}
    />
  </BaseDialog.Portal>
));
DrawerPopup.displayName = "DrawerPopup";

/* ── Title & Description ─────────────────────────────────────────────── */

export const DrawerTitle = forwardRef<
  ComponentRef<typeof BaseDialog.Title>,
  ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

export const DrawerDescription = forwardRef<
  ComponentRef<typeof BaseDialog.Description>,
  ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";
