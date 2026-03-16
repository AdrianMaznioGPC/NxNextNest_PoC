import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Breadcrumb } from "lib/types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (!items.length) return null;

  const t = await getTranslations("accessibility");

  return (
    <nav aria-label={t("breadcrumb")} className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />}
              {isLast ? (
                <span className="text-black dark:text-white">{item.title}</span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-black hover:underline dark:hover:text-white"
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
