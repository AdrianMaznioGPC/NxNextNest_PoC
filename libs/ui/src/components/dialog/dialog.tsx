"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts as-is ────────────────────────────────── */

export const DialogRoot = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;
export const DialogPortal = BaseDialog.Portal;

/* ── Styled parts ────────────────────────────────────────────────────── */

export const DialogBackdrop = forwardRef<
  ComponentRef<typeof BaseDialog.Backdrop>,
  ComponentPropsWithoutRef<typeof BaseDialog.Backdrop>
>(({ className, ...props }, ref) => (
  <BaseDialog.Portal>
    <BaseDialog.Backdrop
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "transition-opacity duration-200",
        className,
      )}
      {...props}
    />
  </BaseDialog.Portal>
));
DialogBackdrop.displayName = "DialogBackdrop";

export const DialogPopup = forwardRef<
  ComponentRef<typeof BaseDialog.Popup>,
  ComponentPropsWithoutRef<typeof BaseDialog.Popup>
>(({ className, ...props }, ref) => (
  <BaseDialog.Portal>
    <BaseDialog.Popup
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
  </BaseDialog.Portal>
));
DialogPopup.displayName = "DialogPopup";

export const DialogTitle = forwardRef<
  ComponentRef<typeof BaseDialog.Title>,
  ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(({ className, ...props }, ref) => (
  <BaseDialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

export const DialogDescription = forwardRef<
  ComponentRef<typeof BaseDialog.Description>,
  ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(({ className, ...props }, ref) => (
  <BaseDialog.Description
    ref={ref}
    className={cn("mt-2 text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";
