"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import type { PaginationMeta } from "lib/types";
import { createUrl } from "lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  pagination: PaginationMeta;
}

function buildPageUrl(
  pathname: string,
  searchParams: URLSearchParams,
  page: number,
): string {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
  return createUrl(pathname, params);
}

/**
 * Returns the page numbers to display in the pagination bar.
 * Always shows first, last, current, and neighbours with ellipsis gaps.
 */
function getPageRange(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i]! - sorted[i - 1]! > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]!);
  }

  return result;
}

const disabledClasses =
  "flex h-10 w-10 items-center justify-center text-neutral-300 dark:text-neutral-600 cursor-not-allowed";
const enabledArrowClasses =
  "flex h-10 w-10 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white";

export default function Pagination({ pagination }: PaginationProps) {
  const { page, totalPages } = pagination;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("pagination");

  const pages = getPageRange(page, Math.max(1, totalPages));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      aria-label={t("ariaLabel")}
      className="mt-8 flex items-center justify-center gap-1"
    >
      {hasPrev ? (
        <Link
          href={buildPageUrl(pathname, searchParams, page - 1)}
          className={enabledArrowClasses}
          aria-label={t("previous")}
          prefetch={false}
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
      ) : (
        <span className={disabledClasses} aria-disabled="true">
          <ChevronLeftIcon className="h-5 w-5" />
        </span>
      )}

      {pages.map((item, idx) =>
        item === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex h-10 w-10 items-center justify-center text-neutral-400 dark:text-neutral-500"
            aria-hidden="true"
          >
            &hellip;
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium bg-black text-white dark:bg-white dark:text-black"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildPageUrl(pathname, searchParams, item)}
            prefetch={false}
            aria-label={t("goToPage", { page: item })}
            className="flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            {item}
          </Link>
        ),
      )}

      {hasNext ? (
        <Link
          href={buildPageUrl(pathname, searchParams, page + 1)}
          className={enabledArrowClasses}
          aria-label={t("next")}
          prefetch={false}
        >
          <ChevronRightIcon className="h-5 w-5" />
        </Link>
      ) : (
        <span className={disabledClasses} aria-disabled="true">
          <ChevronRightIcon className="h-5 w-5" />
        </span>
      )}
    </nav>
  );
}
