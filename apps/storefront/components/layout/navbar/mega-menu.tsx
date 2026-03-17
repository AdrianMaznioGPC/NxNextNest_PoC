"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export function MegaMenu({ items }: { items: MegaMenuItem[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActiveDebounced = useCallback((index: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => setActiveIndex(index), 200);
  }, []);

  const cancelDebounce = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  }, []);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  // On homepage the sidebar in the hero block serves as the mega menu
  if (pathname === "/") {
    return null;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        cancelDebounce();
        setOpen(false);
        setActiveIndex(null);
      }}
    >
      {/* Trigger */}
      <button
        className="flex w-56 items-center gap-2 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:text-black dark:text-neutral-300 dark:hover:text-white"
        aria-expanded={open}
      >
        <Bars3Icon className="h-4 w-4" />
        {t("browseProducts")}
      </button>

      {/* Dropdown */}
      {open ? (
        <div className="absolute left-0 top-full z-50 flex rounded-b-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {/* Left panel: category list */}
          <ul className="w-56 border-r border-neutral-200 py-2 dark:border-neutral-700">
            {items.map((item, i) => (
              <li key={item.path} onMouseEnter={() => setActiveDebounced(i)}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                    activeIndex === i
                      ? "bg-neutral-100 font-medium text-black dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
                  }`}
                >
                  {item.title}
                  {item.children?.length ? (
                    <span className="text-neutral-400">›</span>
                  ) : null}
                </Link>
              </li>
            ))}

            {/* View all */}
            <li className="border-t border-neutral-200 pt-2 dark:border-neutral-700">
              <Link
                href="/categories"
                prefetch={true}
                className="block px-4 py-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("viewAllCategories")}
              </Link>
            </li>
          </ul>

          {/* Right panel: subcategories for hovered category */}
          {activeItem?.children?.length ? (
            <div className="w-80 p-6" onMouseEnter={cancelDebounce}>
              <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-white">
                {activeItem.title}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {activeItem.children.map((child) => (
                  <Link
                    key={child.path}
                    href={child.path}
                    prefetch={true}
                    className="py-1.5 text-sm text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  >
                    {child.title}
                  </Link>
                ))}
              </div>
              <Link
                href={activeItem.path}
                prefetch={true}
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {t("viewAll", { category: activeItem.title })}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
