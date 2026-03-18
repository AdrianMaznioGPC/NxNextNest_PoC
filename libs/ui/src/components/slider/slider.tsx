"use client";

import { Slider as BaseSlider } from "@base-ui/react/slider";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const SliderRoot = forwardRef<
  ComponentRef<typeof BaseSlider.Root>,
  ComponentPropsWithoutRef<typeof BaseSlider.Root>
>(({ className, ...props }, ref) => (
  <BaseSlider.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  />
));
SliderRoot.displayName = "SliderRoot";

/* ── Track ────────────────────────────────────────────────────────────── */

export const SliderTrack = forwardRef<
  ComponentRef<typeof BaseSlider.Track>,
  ComponentPropsWithoutRef<typeof BaseSlider.Track>
>(({ className, ...props }, ref) => (
  <BaseSlider.Track
    ref={ref}
    className={cn(
      "relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
SliderTrack.displayName = "SliderTrack";

/* ── Indicator (filled range) ────────────────────────────────────────── */

export const SliderIndicator = forwardRef<
  ComponentRef<typeof BaseSlider.Indicator>,
  ComponentPropsWithoutRef<typeof BaseSlider.Indicator>
>(({ className, ...props }, ref) => (
  <BaseSlider.Indicator
    ref={ref}
    className={cn("absolute h-full bg-primary", className)}
    {...props}
  />
));
SliderIndicator.displayName = "SliderIndicator";

/* ── Thumb ────────────────────────────────────────────────────────────── */

export const SliderThumb = forwardRef<
  ComponentRef<typeof BaseSlider.Thumb>,
  ComponentPropsWithoutRef<typeof BaseSlider.Thumb>
>(({ className, ...props }, ref) => (
  <BaseSlider.Thumb
    ref={ref}
    className={cn(
      "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow-sm transition-colors",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
SliderThumb.displayName = "SliderThumb";
