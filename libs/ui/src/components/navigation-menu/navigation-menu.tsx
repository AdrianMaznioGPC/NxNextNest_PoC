"use client";

import { NavigationMenu as BaseNav } from "@base-ui/react/navigation-menu";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const NavigationMenuRoot = forwardRef<
  ComponentRef<typeof BaseNav.Root>,
  ComponentPropsWithoutRef<typeof BaseNav.Root>
>(({ className, ...props }, ref) => (
  <BaseNav.Root
    ref={ref}
    className={cn("relative z-10 flex items-center", className)}
    {...props}
  />
));
NavigationMenuRoot.displayName = "NavigationMenuRoot";

/* ── List ─────────────────────────────────────────────────────────────── */

export const NavigationMenuList = forwardRef<
  ComponentRef<typeof BaseNav.List>,
  ComponentPropsWithoutRef<typeof BaseNav.List>
>(({ className, ...props }, ref) => (
  <BaseNav.List
    ref={ref}
    className={cn(
      "group flex flex-1 list-none items-center justify-center gap-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenuList";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const NavigationMenuItem = BaseNav.Item;

/* ── Trigger ─────────────────────────────────────────────────────────── */

export const NavigationMenuTrigger = forwardRef<
  ComponentRef<typeof BaseNav.Trigger>,
  ComponentPropsWithoutRef<typeof BaseNav.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseNav.Trigger
    ref={ref}
    className={cn(
      "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      "disabled:pointer-events-none disabled:opacity-50",
      "data-[popup-open]:bg-accent/50",
      className,
    )}
    {...props}
  >
    {children}
    <svg
      className="relative ml-1 h-3 w-3 transition-transform duration-200 group-data-[popup-open]:rotate-180"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </BaseNav.Trigger>
));
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

/* ── Link (non-expandable item) ──────────────────────────────────────── */

export const NavigationMenuLink = forwardRef<
  ComponentRef<typeof BaseNav.Link>,
  ComponentPropsWithoutRef<typeof BaseNav.Link>
>(({ className, ...props }, ref) => (
  <BaseNav.Link
    ref={ref}
    className={cn(
      "inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
NavigationMenuLink.displayName = "NavigationMenuLink";

/* ── Portal ───────────────────────────────────────────────────────────── */

export const NavigationMenuPortal = BaseNav.Portal;

/* ── Positioner ──────────────────────────────────────────────────────── */

export const NavigationMenuPositioner = forwardRef<
  ComponentRef<typeof BaseNav.Positioner>,
  ComponentPropsWithoutRef<typeof BaseNav.Positioner>
>(({ className, ...props }, ref) => (
  <BaseNav.Positioner
    ref={ref}
    className={cn("z-50", className)}
    sideOffset={6}
    {...props}
  />
));
NavigationMenuPositioner.displayName = "NavigationMenuPositioner";

/* ── Popup ───────────────────────────────────────────────────────────── */

export const NavigationMenuPopup = forwardRef<
  ComponentRef<typeof BaseNav.Popup>,
  ComponentPropsWithoutRef<typeof BaseNav.Popup>
>(({ className, ...props }, ref) => (
  <BaseNav.Popup
    ref={ref}
    className={cn(
      "w-full rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-lg md:w-auto",
      "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
      "transition-opacity duration-150",
      className,
    )}
    {...props}
  />
));
NavigationMenuPopup.displayName = "NavigationMenuPopup";

/* ── Viewport ────────────────────────────────────────────────────────── */

export const NavigationMenuViewport = BaseNav.Viewport;
