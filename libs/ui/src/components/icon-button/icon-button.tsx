import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-md border transition-colors",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 w-8 [&_svg]:h-3.5 [&_svg]:w-3.5",
        md: "h-9 w-9 [&_svg]:h-4 [&_svg]:w-4",
        lg: "h-11 w-11 [&_svg]:h-5 [&_svg]:w-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

/**
 * Square button sized for a single icon. Use with an `aria-label`.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Close" size="lg">
 *   <XMarkIcon />
 * </IconButton>
 * <IconButton variant="ghost" aria-label="Menu">
 *   <Bars3Icon />
 * </IconButton>
 * ```
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
IconButton.displayName = "IconButton";
