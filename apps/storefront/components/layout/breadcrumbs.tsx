import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { Breadcrumb } from "lib/types";
import Link from "next/link";

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  if (!items.length) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-neutral-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />}
              {isLast ? (
                <span className="text-black">{item.title}</span>
              ) : (
                <Link
                  href={item.path}
                  className="hover:text-black hover:underline"
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
