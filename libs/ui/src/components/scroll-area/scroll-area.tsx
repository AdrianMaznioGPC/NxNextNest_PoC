"use client";

import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const ScrollAreaRoot = forwardRef<
  ComponentRef<typeof BaseScrollArea.Root>,
  ComponentPropsWithoutRef<typeof BaseScrollArea.Root>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  />
));
ScrollAreaRoot.displayName = "ScrollAreaRoot";

/* ── Viewport ────────────────────────────────────────────────────────── */

export const ScrollAreaViewport = forwardRef<
  ComponentRef<typeof BaseScrollArea.Viewport>,
  ComponentPropsWithoutRef<typeof BaseScrollArea.Viewport>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Viewport
    ref={ref}
    className={cn("h-full w-full overscroll-contain", className)}
    {...props}
  />
));
ScrollAreaViewport.displayName = "ScrollAreaViewport";

/* ── Scrollbar ───────────────────────────────────────────────────────── */

export interface ScrollAreaScrollbarProps
  extends ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar> {
  orientation?: "vertical" | "horizontal";
}

export const ScrollAreaScrollbar = forwardRef<
  ComponentRef<typeof BaseScrollArea.Scrollbar>,
  ScrollAreaScrollbarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <BaseScrollArea.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-opacity duration-150",
      "data-[hovering]:opacity-100 opacity-0",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-px",
      orientation === "horizontal" &&
        "h-2.5 w-full flex-col border-t border-t-transparent p-px",
      className,
    )}
    {...props}
  />
));
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

/* ── Thumb ────────────────────────────────────────────────────────────── */

export const ScrollAreaThumb = forwardRef<
  ComponentRef<typeof BaseScrollArea.Thumb>,
  ComponentPropsWithoutRef<typeof BaseScrollArea.Thumb>
>(({ className, ...props }, ref) => (
  <BaseScrollArea.Thumb
    ref={ref}
    className={cn("relative flex-1 rounded-full bg-border", className)}
    {...props}
  />
));
ScrollAreaThumb.displayName = "ScrollAreaThumb";

/* ── Corner ───────────────────────────────────────────────────────────── */

export const ScrollAreaCorner = BaseScrollArea.Corner;
