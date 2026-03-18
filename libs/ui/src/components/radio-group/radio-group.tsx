"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const RadioGroupRoot = forwardRef<
  ComponentRef<typeof BaseRadioGroup>,
  ComponentPropsWithoutRef<typeof BaseRadioGroup>
>(({ className, ...props }, ref) => (
  <BaseRadioGroup
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroupRoot.displayName = "RadioGroupRoot";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const RadioGroupItem = forwardRef<
  ComponentRef<typeof BaseRadio.Root>,
  ComponentPropsWithoutRef<typeof BaseRadio.Root>
>(({ className, ...props }, ref) => (
  <BaseRadio.Root
    ref={ref}
    className={cn(
      "aspect-square h-4 w-4 rounded-full border border-input text-primary shadow-sm",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <BaseRadio.Indicator
      className="flex items-center justify-center"
    >
      <svg
        className="h-2 w-2 fill-primary"
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="4" cy="4" r="4" />
      </svg>
    </BaseRadio.Indicator>
  </BaseRadio.Root>
));
RadioGroupItem.displayName = "RadioGroupItem";
