import { cn } from "../../lib/utils";

export interface LoadingDotsProps {
  /** Additional class names applied to each dot. */
  className?: string;
  /** Number of dots to render. */
  count?: number;
}

const dot = "mx-[1px] inline-block h-1 w-1 animate-blink rounded-md";

/**
 * Animated loading indicator rendered as bouncing dots.
 *
 * @example
 * ```tsx
 * <LoadingDots className="bg-white" />
 * ```
 */
export function LoadingDots({ className, count = 3 }: LoadingDotsProps) {
  return (
    <span className="mx-2 inline-flex items-center" role="status">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(dot, className)}
          style={{ animationDelay: `${i * 200}ms` }}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
