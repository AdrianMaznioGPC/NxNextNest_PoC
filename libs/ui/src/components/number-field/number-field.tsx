"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const NumberFieldRoot = forwardRef<
  ComponentRef<typeof BaseNumberField.Root>,
  ComponentPropsWithoutRef<typeof BaseNumberField.Root>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Root
    ref={ref}
    className={cn("flex items-center", className)}
    {...props}
  />
));
NumberFieldRoot.displayName = "NumberFieldRoot";

/* ── Group ────────────────────────────────────────────────────────────── */

export const NumberFieldGroup = forwardRef<
  ComponentRef<typeof BaseNumberField.Group>,
  ComponentPropsWithoutRef<typeof BaseNumberField.Group>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Group
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-md border border-input",
      className,
    )}
    {...props}
  />
));
NumberFieldGroup.displayName = "NumberFieldGroup";

/* ── Input ────────────────────────────────────────────────────────────── */

export const NumberFieldInput = forwardRef<
  ComponentRef<typeof BaseNumberField.Input>,
  ComponentPropsWithoutRef<typeof BaseNumberField.Input>
>(({ className, ...props }, ref) => (
  <BaseNumberField.Input
    ref={ref}
    className={cn(
      "w-12 border-x border-input bg-background py-1 text-center text-sm text-foreground",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
      className,
    )}
    {...props}
  />
));
NumberFieldInput.displayName = "NumberFieldInput";

/* ── Decrement ───────────────────────────────────────────────────────── */

export const NumberFieldDecrement = forwardRef<
  ComponentRef<typeof BaseNumberField.Decrement>,
  ComponentPropsWithoutRef<typeof BaseNumberField.Decrement>
>(({ className, children, ...props }, ref) => (
  <BaseNumberField.Decrement
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children ?? (
      <svg
        className="h-3.5 w-3.5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
      </svg>
    )}
  </BaseNumberField.Decrement>
));
NumberFieldDecrement.displayName = "NumberFieldDecrement";

/* ── Increment ───────────────────────────────────────────────────────── */

export const NumberFieldIncrement = forwardRef<
  ComponentRef<typeof BaseNumberField.Increment>,
  ComponentPropsWithoutRef<typeof BaseNumberField.Increment>
>(({ className, children, ...props }, ref) => (
  <BaseNumberField.Increment
    ref={ref}
    className={cn(
      "inline-flex h-8 w-8 items-center justify-center text-foreground transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children ?? (
      <svg
        className="h-3.5 w-3.5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    )}
  </BaseNumberField.Increment>
));
NumberFieldIncrement.displayName = "NumberFieldIncrement";
