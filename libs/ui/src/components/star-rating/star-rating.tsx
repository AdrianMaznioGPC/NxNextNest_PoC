import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface StarRatingProps extends HTMLAttributes<HTMLDivElement> {
  /** Rating value (0–5). Supports whole numbers. */
  rating: number;
  /** Total number of stars to render. */
  max?: number;
  /** Size of each star character. */
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-sm gap-0.5",
  md: "text-base gap-0.5",
  lg: "text-lg gap-1",
} as const;

/**
 * Star rating display for product reviews and testimonials.
 *
 * @example
 * ```tsx
 * <StarRating rating={4} />
 * <StarRating rating={3} max={5} size="lg" />
 * ```
 */
export const StarRating = forwardRef<HTMLDivElement, StarRatingProps>(
  ({ rating, max = 5, size = "md", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex", sizeClasses[size], className)}
        role="img"
        aria-label={`${rating} out of ${max} stars`}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => (
          <span
            key={i}
            className={
              i < rating
                ? "text-yellow-400"
                : "text-neutral-300 dark:text-neutral-600"
            }
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
    );
  },
);
StarRating.displayName = "StarRating";
