import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";
import { Price } from "../price";

export interface LabelProps extends HTMLAttributes<HTMLDivElement> {
  /** Product or item title. */
  title: string;
  /** Price amount as a string (e.g. "29.99"). */
  amount?: string;
  /** ISO 4217 currency code (e.g. "EUR"). */
  currencyCode?: string;
  /** Vertical position of the label within its container. */
  position?: "bottom" | "center";
}

/**
 * Floating product label overlay with title and optional price badge.
 * Designed to sit inside a `position: relative` container (e.g. a product tile).
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <img src={product.image} />
 *   <Label title="Running Shoes" amount="129.99" currencyCode="EUR" />
 * </div>
 * ```
 */
export const Label = forwardRef<HTMLDivElement, LabelProps>(
  ({ title, amount, currencyCode, position = "bottom", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
          position === "center" && "lg:px-20 lg:pb-[35%]",
          className,
        )}
        {...props}
      >
        <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
          <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
            {title}
          </h3>
          {amount && currencyCode ? (
            <Price
              className="flex-none rounded-full bg-primary p-2 text-primary-foreground"
              amount={amount}
              currencyCode={currencyCode}
              currencyCodeClassName="hidden @[275px]/label:inline"
            />
          ) : null}
        </div>
      </div>
    );
  },
);
Label.displayName = "Label";
