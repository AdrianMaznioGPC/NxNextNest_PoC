"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { cn } from "../../lib/utils";

export interface SwitchProps
  extends ComponentPropsWithoutRef<typeof BaseSwitch.Root> {}

/**
 * Toggle switch for binary on/off states.
 *
 * @example
 * ```tsx
 * <Switch id="newsletter" />
 * <label htmlFor="newsletter">Subscribe to newsletter</label>
 * ```
 */
export const Switch = forwardRef<
  ComponentRef<typeof BaseSwitch.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <BaseSwitch.Root
    ref={ref}
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm",
      "transition-colors duration-200",
      "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
      "bg-input data-[checked]:bg-primary",
      className,
    )}
    {...props}
  >
    <BaseSwitch.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0",
        "transition-transform duration-200",
        "translate-x-0 data-[checked]:translate-x-4",
      )}
    />
  </BaseSwitch.Root>
));
Switch.displayName = "Switch";
