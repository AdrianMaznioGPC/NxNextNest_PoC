import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export interface GridProps extends HTMLAttributes<HTMLUListElement> {
  /** Number of columns at different breakpoints. */
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * Responsive grid layout for product listings, category cards, etc.
 *
 * @example
 * ```tsx
 * <Grid columns={3}>
 *   <GridItem>…</GridItem>
 *   <GridItem>…</GridItem>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLUListElement, GridProps>(
  ({ className, columns, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "grid grid-flow-row gap-4",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-3",
          columns === 4 && "grid-cols-4",
          columns === 5 && "grid-cols-5",
          columns === 6 && "grid-cols-6",
          className,
        )}
        {...props}
      >
        {children}
      </ul>
    );
  },
);
Grid.displayName = "Grid";

export interface GridItemProps extends HTMLAttributes<HTMLLIElement> {}

/**
 * Individual grid cell. Defaults to square aspect ratio with fade-in transition.
 *
 * @example
 * ```tsx
 * <GridItem className="col-span-2">…</GridItem>
 * ```
 */
export const GridItem = forwardRef<HTMLLIElement, GridItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("aspect-square transition-opacity", className)}
        {...props}
      >
        {children}
      </li>
    );
  },
);
GridItem.displayName = "GridItem";
