import { Separator as BaseSeparator } from "@base-ui/react/separator";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "../../lib/utils";

export interface SeparatorProps
  extends ComponentPropsWithoutRef<typeof BaseSeparator> {
  /** Visual orientation. Controls both ARIA role and styling. */
  orientation?: "horizontal" | "vertical";
}

/**
 * Visual divider between content sections.
 *
 * @example
 * ```tsx
 * <Separator />
 * <Separator orientation="vertical" className="h-6" />
 * ```
 */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <BaseSeparator
      ref={ref}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = "Separator";
