"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const AlertDialogRoot = BaseAlertDialog.Root;
export const AlertDialogTrigger = BaseAlertDialog.Trigger;
export const AlertDialogClose = BaseAlertDialog.Close;
export const AlertDialogPortal = BaseAlertDialog.Portal;

/* ── Backdrop ────────────────────────────────────────────────────────── */

export const AlertDialogBackdrop = forwardRef<
  ComponentRef<typeof BaseAlertDialog.Backdrop>,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Portal>
    <BaseAlertDialog.Backdrop
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "transition-opacity duration-200",
        className,
      )}
      {...props}
    />
  </BaseAlertDialog.Portal>
));
AlertDialogBackdrop.displayName = "AlertDialogBackdrop";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const AlertDialogPopup = forwardRef<
  ComponentRef<typeof BaseAlertDialog.Popup>,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Popup>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Portal>
    <BaseAlertDialog.Popup
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-lg border border-border bg-background p-6 shadow-lg",
        "data-[starting-style]:opacity-0 data-[starting-style]:scale-95",
        "data-[ending-style]:opacity-0 data-[ending-style]:scale-95",
        "transition-all duration-200",
        className,
      )}
      {...props}
    />
  </BaseAlertDialog.Portal>
));
AlertDialogPopup.displayName = "AlertDialogPopup";

/* ── Title ───────────────────────────────────────────────────────────── */

export const AlertDialogTitle = forwardRef<
  ComponentRef<typeof BaseAlertDialog.Title>,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
AlertDialogTitle.displayName = "AlertDialogTitle";

/* ── Description ─────────────────────────────────────────────────────── */

export const AlertDialogDescription = forwardRef<
  ComponentRef<typeof BaseAlertDialog.Description>,
  ComponentPropsWithoutRef<typeof BaseAlertDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseAlertDialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = "AlertDialogDescription";
