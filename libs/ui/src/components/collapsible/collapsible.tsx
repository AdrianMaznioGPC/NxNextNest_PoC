"use client";

import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const CollapsibleRoot = forwardRef<
  ComponentRef<typeof BaseCollapsible.Root>,
  ComponentPropsWithoutRef<typeof BaseCollapsible.Root>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Root
    ref={ref}
    className={cn("w-full", className)}
    {...props}
  />
));
CollapsibleRoot.displayName = "CollapsibleRoot";

/* ── Trigger ─────────────────────────────────────────────────────────── */

export const CollapsibleTrigger = forwardRef<
  ComponentRef<typeof BaseCollapsible.Trigger>,
  ComponentPropsWithoutRef<typeof BaseCollapsible.Trigger>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between text-sm font-medium text-foreground transition-colors",
      "hover:text-foreground/80",
      "[&>svg]:transition-transform [&>svg]:duration-200",
      "data-[panel-open]:[&>svg]:rotate-180",
      className,
    )}
    {...props}
  />
));
CollapsibleTrigger.displayName = "CollapsibleTrigger";

/* ── Panel ────────────────────────────────────────────────────────────── */

export const CollapsiblePanel = forwardRef<
  ComponentRef<typeof BaseCollapsible.Panel>,
  ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(({ className, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn(
      "overflow-hidden text-sm",
      "h-[var(--collapsible-panel-height)] transition-[height] duration-200 ease-out",
      "data-[ending-style]:h-0 data-[starting-style]:h-0",
      className,
    )}
    {...props}
  />
));
CollapsiblePanel.displayName = "CollapsiblePanel";
