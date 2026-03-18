"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Re-export structural parts ──────────────────────────────────────── */

export const TooltipRoot = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;
export const TooltipPortal = BaseTooltip.Portal;

/* ── Positioner ──────────────────────────────────────────────────────── */

export const TooltipPositioner = forwardRef<
  ComponentRef<typeof BaseTooltip.Positioner>,
  ComponentPropsWithoutRef<typeof BaseTooltip.Positioner>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={6}
    {...props}
  />
));
TooltipPositioner.displayName = "TooltipPositioner";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const TooltipPopup = forwardRef<
  ComponentRef<typeof BaseTooltip.Popup>,
  ComponentPropsWithoutRef<typeof BaseTooltip.Popup>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Popup
    ref={ref}
    className={cn(
      "rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
      className,
    )}
    {...props}
  />
));
TooltipPopup.displayName = "TooltipPopup";

/* ── Arrow ───────────────────────────────────────────────────────────── */

export const TooltipArrow = forwardRef<
  ComponentRef<typeof BaseTooltip.Arrow>,
  ComponentPropsWithoutRef<typeof BaseTooltip.Arrow>
>(({ className, ...props }, ref) => (
  <BaseTooltip.Arrow
    ref={ref}
    className={cn(
      "data-[side=bottom]:top-[-6px] data-[side=left]:right-[-6px] data-[side=right]:left-[-6px] data-[side=top]:bottom-[-6px]",
      className,
    )}
    {...props}
  >
    <svg width="12" height="6" viewBox="0 0 12 6" className="fill-foreground">
      <path d="M0 6L6 0L12 6" />
    </svg>
  </BaseTooltip.Arrow>
));
TooltipArrow.displayName = "TooltipArrow";
