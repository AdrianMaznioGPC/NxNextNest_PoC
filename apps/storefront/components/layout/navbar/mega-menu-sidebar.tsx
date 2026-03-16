"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

export function MegaMenuSidebar({ items }: { items: MegaMenuItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActiveDebounced = useCallback((index: number) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    hoverTimeout.current = setTimeout(() => setActiveIndex(index), 200);
  }, []);

  const cancelTimers = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  const scheduleClose = useCallback(() => {
    cancelTimers();
    closeTimeout.current = setTimeout(() => setActiveIndex(null), 150);
  }, [cancelTimers]);

  const cancelClose = useCallback(() => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
  }, []);

  const handleOverlayEnter = useCallback(() => {
    cancelTimers();
    setActiveIndex(null);
  }, [cancelTimers]);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const flyoutChildren = activeItem?.children;
  const showFlyout = flyoutChildren && flyoutChildren.length > 0;

  return (
    <>
      {/* Background overlay when flyout is open */}
      {showFlyout ? (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onMouseEnter={handleOverlayEnter}
        />
      ) : null}

      {/* Sidebar */}
      <div
        className="relative z-50 h-full w-56 shrink-0"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <div
          className={`flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 ${
            showFlyout ? "rounded-r-none border-r-0" : ""
          }`}
        >
          <h2 className="flex shrink-0 items-center gap-2 border-b border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">
            <Bars3Icon className="h-4 w-4" />
            Browse Products
          </h2>
          <ul className="flex-1 py-1">
            {items.map((item, i) => (
              <li key={item.path} onMouseEnter={() => setActiveDebounced(i)}>
                <Link
                  href={item.path}
                  prefetch={true}
                  className={`flex items-center justify-between px-4 py-2 text-sm transition-colors ${
                    activeIndex === i
                      ? "bg-neutral-100 font-medium text-black dark:bg-neutral-800 dark:text-white"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  }`}
                >
                  {item.title}
                  {item.children?.length ? (
                    <span className="text-neutral-400">›</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Flyout panel — positioned relative to the parent section, fills remaining width */}
      {showFlyout && activeItem ? (
        <div
          className="absolute inset-y-0 left-56 right-0 z-50 flex flex-col rounded-r-lg border border-l-0 border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          {/* Divider line between sidebar and flyout */}
          <div className="absolute inset-y-0 left-0 w-px bg-neutral-200 dark:bg-neutral-700" />

          {/* Header aligned with sidebar header */}
          <h3 className="shrink-0 border-b border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 dark:border-neutral-700 dark:text-white">
            {activeItem.title}
          </h3>

          {/* Subcategory links */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3 lg:grid-cols-4">
              {flyoutChildren.map((child) => (
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
              View all {activeItem.title}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
