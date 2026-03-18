"use client";

import { Field as BaseField } from "@base-ui/react/field";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const FieldRoot = forwardRef<
  ComponentRef<typeof BaseField.Root>,
  ComponentPropsWithoutRef<typeof BaseField.Root>
>(({ className, ...props }, ref) => (
  <BaseField.Root
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
));
FieldRoot.displayName = "FieldRoot";

/* ── Label ────────────────────────────────────────────────────────────── */

export const FieldLabel = forwardRef<
  ComponentRef<typeof BaseField.Label>,
  ComponentPropsWithoutRef<typeof BaseField.Label>
>(({ className, ...props }, ref) => (
  <BaseField.Label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none text-foreground",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className,
    )}
    {...props}
  />
));
FieldLabel.displayName = "FieldLabel";

/* ── Description ─────────────────────────────────────────────────────── */

export const FieldDescription = forwardRef<
  ComponentRef<typeof BaseField.Description>,
  ComponentPropsWithoutRef<typeof BaseField.Description>
>(({ className, ...props }, ref) => (
  <BaseField.Description
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
FieldDescription.displayName = "FieldDescription";

/* ── Error ────────────────────────────────────────────────────────────── */

export const FieldError = forwardRef<
  ComponentRef<typeof BaseField.Error>,
  ComponentPropsWithoutRef<typeof BaseField.Error>
>(({ className, ...props }, ref) => (
  <BaseField.Error
    ref={ref}
    className={cn("text-xs font-medium text-destructive", className)}
    {...props}
  />
));
FieldError.displayName = "FieldError";

/* ── Control (wraps the input element) ───────────────────────────────── */

export const FieldControl = BaseField.Control;
