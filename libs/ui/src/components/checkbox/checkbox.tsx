"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {}

/**
 * Accessible checkbox styled with design tokens.
 *
 * @example
 * ```tsx
 * <Checkbox id="terms" />
 * <label htmlFor="terms">Accept terms</label>
 * ```
 */
export const Checkbox = forwardRef<
  ComponentRef<typeof BaseCheckbox.Root>,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <BaseCheckbox.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-input shadow-sm",
      "transition-colors duration-150",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      "data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground",
      className,
    )}
    {...props}
  >
    <BaseCheckbox.Indicator className="flex items-center justify-center">
      <svg
        className="h-3.5 w-3.5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </BaseCheckbox.Indicator>
  </BaseCheckbox.Root>
));
Checkbox.displayName = "Checkbox";
