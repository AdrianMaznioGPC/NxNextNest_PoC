"use client";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import Link from "next/link";
import { useState } from "react";

export function MegaMenu({ items }: { items: MegaMenuItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative" onMouseLeave={() => setActiveIndex(null)}>
      {/* Category sidebar triggers */}
      <ul className="flex gap-6 text-sm font-medium">
        {items.map((item, i) => (
          <li key={item.path} onMouseEnter={() => setActiveIndex(i)}>
            <Link
              href={item.path}
              prefetch={true}
              className="flex items-center gap-1 py-2 text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
            >
              {item.title}
              {item.children?.length ? (
                <ChevronRightIcon className="h-3 w-3" />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>

      {/* Dropdown panel */}
      {activeIndex !== null && items[activeIndex]?.children?.length ? (
        <div
          className="absolute left-0 top-full z-50 w-full min-w-[32rem] rounded-b-lg border border-t-0 border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          onMouseLeave={() => setActiveIndex(null)}
        >
          <div className="grid grid-cols-3 gap-6 p-6">
            {items[activeIndex]!.children!.map((child) => (
              <div key={child.path}>
                <Link
                  href={child.path}
                  prefetch={true}
                  className="text-sm font-semibold text-neutral-900 hover:underline dark:text-white"
                >
                  {child.title}
                </Link>
                {/* Third-level children, if present */}
                {child.children?.length ? (
                  <ul className="mt-2 space-y-1">
                    {child.children.map((grandchild) => (
                      <li key={grandchild.path}>
                        <Link
                          href={grandchild.path}
                          prefetch={true}
                          className="text-sm text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white"
                        >
                          {grandchild.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>

          {/* View all link */}
          <div className="border-t border-neutral-200 px-6 py-3 dark:border-neutral-700">
            <Link
              href={items[activeIndex]!.path}
              prefetch={true}
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              View all {items[activeIndex]!.title}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
