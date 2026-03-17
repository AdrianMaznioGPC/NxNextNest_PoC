"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import SmartLink from "components/smart-link";
import { useT } from "lib/i18n/messages-context";
import type { MegaMenuItem } from "lib/types";
import { useCallback, useRef, useState } from "react";

export function MegaMenu({
  items,
  categoryListPath = "/categories",
}: {
  items: MegaMenuItem[];
  categoryListPath?: string;
}) {
  const t = useT("nav");
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
        className="flex items-center gap-2 py-3 text-sm font-semibold text-neutral-700 transition-colors hover:text-black"
        aria-expanded={open}
      >
        <Bars3Icon className="h-4 w-4" />
        {t("browseProducts")}
      </button>

      {/* Dropdown */}
      {open ? (
        <div className="absolute left-0 top-full z-50 flex rounded-b-lg border border-neutral-200 bg-white shadow-lg">
          {/* Left panel: category list */}
          <ul className="w-56 border-r border-neutral-200 py-2">
            {items.map((item, i) => (
              <li key={item.path} onMouseEnter={() => setActiveDebounced(i)}>
                <SmartLink
                  href={item.path}
                  intent="shell"
                  className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                    activeIndex === i
                      ? "bg-neutral-100 font-medium text-black"
                      : "text-neutral-600 hover:bg-neutral-50"
                  }`}
                >
                  {item.title}
                  {item.children?.length ? (
                    <span className="text-neutral-400">›</span>
                  ) : null}
                </SmartLink>
              </li>
            ))}

            {/* View all */}
            <li className="border-t border-neutral-200 pt-2">
              <SmartLink
                href={categoryListPath}
                intent="shell"
                className="block px-4 py-2 text-sm font-medium text-blue-600 hover:underline"
              >
                {t("viewAllCategories")}
              </SmartLink>
            </li>
          </ul>

          {/* Right panel: subcategories for hovered category */}
          {activeItem?.children?.length ? (
            <div className="w-80 p-6" onMouseEnter={cancelDebounce}>
              <h3 className="mb-3 text-sm font-semibold text-neutral-900">
                {activeItem.title}
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {activeItem.children.map((child) => (
                  <SmartLink
                    key={child.path}
                    href={child.path}
                    className="py-1.5 text-sm text-neutral-600 transition-colors hover:text-black"
                  >
                    {child.title}
                  </SmartLink>
                ))}
              </div>
              <SmartLink
                href={activeItem.path}
                className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
              >
                {`${t("viewAllPrefix")} ${activeItem.title}`}
              </SmartLink>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
