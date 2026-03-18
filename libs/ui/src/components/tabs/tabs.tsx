"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const TabsRoot = forwardRef<
  ComponentRef<typeof BaseTabs.Root>,
  ComponentPropsWithoutRef<typeof BaseTabs.Root>
>(({ className, ...props }, ref) => (
  <BaseTabs.Root ref={ref} className={cn("w-full", className)} {...props} />
));
TabsRoot.displayName = "TabsRoot";

/* ── List ─────────────────────────────────────────────────────────────── */

export const TabsList = forwardRef<
  ComponentRef<typeof BaseTabs.List>,
  ComponentPropsWithoutRef<typeof BaseTabs.List>
>(({ className, ...props }, ref) => (
  <BaseTabs.List
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/* ── Tab (trigger) ───────────────────────────────────────────────────── */

export const TabsTrigger = forwardRef<
  ComponentRef<typeof BaseTabs.Tab>,
  ComponentPropsWithoutRef<typeof BaseTabs.Tab>
>(({ className, ...props }, ref) => (
  <BaseTabs.Tab
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[selected]:bg-background data-[selected]:text-foreground data-[selected]:shadow-sm",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

/* ── Panel (content) ─────────────────────────────────────────────────── */

export const TabsPanel = forwardRef<
  ComponentRef<typeof BaseTabs.Panel>,
  ComponentPropsWithoutRef<typeof BaseTabs.Panel>
>(({ className, ...props }, ref) => (
  <BaseTabs.Panel
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));
TabsPanel.displayName = "TabsPanel";

/* ── Indicator ───────────────────────────────────────────────────────── */

export const TabsIndicator = forwardRef<
  ComponentRef<typeof BaseTabs.Indicator>,
  ComponentPropsWithoutRef<typeof BaseTabs.Indicator>
>(({ className, ...props }, ref) => (
  <BaseTabs.Indicator
    ref={ref}
    className={cn(
      "absolute bottom-0 h-0.5 bg-primary transition-all duration-200",
      className,
    )}
    {...props}
  />
));
TabsIndicator.displayName = "TabsIndicator";
