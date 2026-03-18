"use client";

import { Meter as BaseMeter } from "@base-ui/react/meter";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const MeterRoot = forwardRef<
  ComponentRef<typeof BaseMeter.Root>,
  ComponentPropsWithoutRef<typeof BaseMeter.Root>
>(({ className, ...props }, ref) => (
  <BaseMeter.Root
    ref={ref}
    className={cn("relative w-full", className)}
    {...props}
  />
));
MeterRoot.displayName = "MeterRoot";

/* ── Track ────────────────────────────────────────────────────────────── */

export const MeterTrack = forwardRef<
  ComponentRef<typeof BaseMeter.Track>,
  ComponentPropsWithoutRef<typeof BaseMeter.Track>
>(({ className, ...props }, ref) => (
  <BaseMeter.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
MeterTrack.displayName = "MeterTrack";

/* ── Indicator ───────────────────────────────────────────────────────── */

export const MeterIndicator = forwardRef<
  ComponentRef<typeof BaseMeter.Indicator>,
  ComponentPropsWithoutRef<typeof BaseMeter.Indicator>
>(({ className, ...props }, ref) => (
  <BaseMeter.Indicator
    ref={ref}
    className={cn(
      "h-full rounded-full bg-primary transition-all duration-300 ease-in-out",
      className,
    )}
    {...props}
  />
));
MeterIndicator.displayName = "MeterIndicator";
