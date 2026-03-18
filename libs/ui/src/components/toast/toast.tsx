import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* ── Toast container (wraps <Toaster /> output) ──────────────────────── */

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant matching the toast type. */
  variant?: "default" | "success" | "error" | "warning" | "info";
}

const variantClasses = {
  default:
    "border-border bg-background text-foreground",
  success:
    "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
  error:
    "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/20",
  warning:
    "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
  info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
} as const;

/**
 * Styled toast container. Use as a building block with any toast library
 * (sonner, react-hot-toast, etc.) or standalone.
 *
 * @example
 * ```tsx
 * <Toast variant="success">
 *   <ToastTitle>Order placed!</ToastTitle>
 *   <ToastDescription>Your order #1234 has been confirmed.</ToastDescription>
 * </Toast>
 * ```
 */
export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  ),
);
Toast.displayName = "Toast";

/* ── Title ───────────────────────────────────────────────────────────── */

export const ToastTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

/* ── Description ─────────────────────────────────────────────────────── */

export const ToastDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";
