import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface PriceProps extends HTMLAttributes<HTMLParagraphElement> {
  /** Numeric amount as a string (e.g. "29.99"). */
  amount: string;
  /** ISO 4217 currency code (e.g. "USD", "EUR"). */
  currencyCode: string;
  /** Optional class applied to the currency code suffix. */
  currencyCodeClassName?: string;
}

/**
 * Formatted price display using `Intl.NumberFormat`.
 *
 * @example
 * ```tsx
 * <Price amount="49.99" currencyCode="EUR" />
 * ```
 */
export const Price = forwardRef<HTMLParagraphElement, PriceProps>(
  ({ amount, currencyCode = "USD", currencyCodeClassName, className, ...props }, ref) => {
    const formatted = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount));

    return (
      <p
        ref={ref}
        suppressHydrationWarning
        className={className}
        {...props}
      >
        {formatted}
        <span className={cn("ml-1 inline", currencyCodeClassName)}>
          {currencyCode}
        </span>
      </p>
    );
  },
);
Price.displayName = "Price";
