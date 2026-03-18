"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const ProgressRoot = forwardRef<
  ComponentRef<typeof BaseProgress.Root>,
  ComponentPropsWithoutRef<typeof BaseProgress.Root>
>(({ className, ...props }, ref) => (
  <BaseProgress.Root
    ref={ref}
    className={cn("relative w-full", className)}
    {...props}
  />
));
ProgressRoot.displayName = "ProgressRoot";

/* ── Track ────────────────────────────────────────────────────────────── */

export const ProgressTrack = forwardRef<
  ComponentRef<typeof BaseProgress.Track>,
  ComponentPropsWithoutRef<typeof BaseProgress.Track>
>(({ className, ...props }, ref) => (
  <BaseProgress.Track
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-muted",
      className,
    )}
    {...props}
  />
));
ProgressTrack.displayName = "ProgressTrack";

/* ── Indicator ───────────────────────────────────────────────────────── */

export const ProgressIndicator = forwardRef<
  ComponentRef<typeof BaseProgress.Indicator>,
  ComponentPropsWithoutRef<typeof BaseProgress.Indicator>
>(({ className, ...props }, ref) => (
  <BaseProgress.Indicator
    ref={ref}
    className={cn(
      "h-full rounded-full bg-primary transition-all duration-300 ease-in-out",
      className,
    )}
    {...props}
  />
));
ProgressIndicator.displayName = "ProgressIndicator";
