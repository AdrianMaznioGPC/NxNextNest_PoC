import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

/* ── Nav wrapper ─────────────────────────────────────────────────────── */

export const PaginationRoot = forwardRef<
  HTMLElement,
  HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    role="navigation"
    aria-label="Pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
));
PaginationRoot.displayName = "PaginationRoot";

/* ── Content list ────────────────────────────────────────────────────── */

export const PaginationContent = forwardRef<
  HTMLUListElement,
  HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

/* ── Item ─────────────────────────────────────────────────────────────── */

export const PaginationItem = forwardRef<
  HTMLLIElement,
  HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

/* ── Link (page number) ──────────────────────────────────────────────── */

export interface PaginationLinkProps
  extends HTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
}

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <a
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  ),
);
PaginationLink.displayName = "PaginationLink";

/* ── Previous / Next buttons ─────────────────────────────────────────── */

const arrowClasses =
  "inline-flex h-9 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50";

export const PaginationPrevious = forwardRef<
  HTMLAnchorElement,
  HTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to previous page"
    className={cn(arrowClasses, className)}
    {...props}
  >
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
    {children ?? <span>Previous</span>}
  </a>
));
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = forwardRef<
  HTMLAnchorElement,
  HTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a
    ref={ref}
    aria-label="Go to next page"
    className={cn(arrowClasses, className)}
    {...props}
  >
    {children ?? <span>Next</span>}
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  </a>
));
PaginationNext.displayName = "PaginationNext";

/* ── Ellipsis ─────────────────────────────────────────────────────────── */

export const PaginationEllipsis = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-9 w-9 items-center justify-center text-muted-foreground",
      className,
    )}
    {...props}
  >
    &hellip;
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";
