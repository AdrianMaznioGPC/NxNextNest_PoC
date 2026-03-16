"use client";

import { type StoreConfig, stores } from "@commerce/store-config";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const storeList = Object.values(stores);

export function StoreSwitcher({ currentCode }: { currentCode: string }) {
  const current = stores[currentCode] ?? storeList[0]!;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchStore(store: StoreConfig) {
    setOpen(false);
    if (store.storeCode === currentCode) return;
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${store.domain}${window.location.pathname}`;
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.storeCode.toUpperCase()}</span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-neutral-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-lg border border-neutral-200 bg-white py-2 shadow-lg dark:border-neutral-700 dark:bg-black">
          <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Country / Region
          </p>
          {storeList.map((store) => (
            <button
              key={store.storeCode}
              onClick={() => switchStore(store)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-black transition-colors hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
            >
              <span className="text-lg leading-none">{store.flag}</span>
              <span className="flex-1">
                {store.label}
                <span className="ml-1 text-neutral-400">
                  ({store.currencySymbol} {store.currency})
                </span>
              </span>
              {store.storeCode === currentCode && (
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
