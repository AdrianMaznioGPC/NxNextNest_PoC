import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Animated placeholder for loading states.
 * Renders a pulsing block that inherits its dimensions from className or parent layout.
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-48" />
 * <Skeleton className="h-64 w-full rounded-lg" />
 * <Skeleton className="h-8 w-8 rounded-full" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800",
        className,
      )}
      {...props}
    />
  ),
);
Skeleton.displayName = "Skeleton";
