"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

/* ── Root ─────────────────────────────────────────────────────────────── */

export const AvatarRoot = forwardRef<
  ComponentRef<typeof BaseAvatar.Root>,
  ComponentPropsWithoutRef<typeof BaseAvatar.Root>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
    {...props}
  />
));
AvatarRoot.displayName = "AvatarRoot";

/* ── Image ────────────────────────────────────────────────────────────── */

export const AvatarImage = forwardRef<
  ComponentRef<typeof BaseAvatar.Image>,
  ComponentPropsWithoutRef<typeof BaseAvatar.Image>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

/* ── Fallback ─────────────────────────────────────────────────────────── */

export const AvatarFallback = forwardRef<
  ComponentRef<typeof BaseAvatar.Fallback>,
  ComponentPropsWithoutRef<typeof BaseAvatar.Fallback>
>(({ className, ...props }, ref) => (
  <BaseAvatar.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
