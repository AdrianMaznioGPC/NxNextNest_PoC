"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SortOption } from "@commerce/shared-types";

type SortDropdownProps = {
  options: SortOption[];
};

export function SortDropdown({ options }: SortDropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentSort = searchParams.get("sort") || options[0]?.slug || null;
  const activeOption =
    options.find((opt) => opt.slug === currentSort) || options[0];

  const handleSelect = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("sort", slug);
      } else {
        params.delete("sort");
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      setIsOpen(false);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative min-w-[180px]" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm hover:bg-neutral-50"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{activeOption?.title || "Sort by"}</span>
        <ChevronDownIcon className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
        >
          {options.map((option) => (
            <li key={option.slug || "default"}>
              <button
                onClick={() => handleSelect(option.slug)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 ${
                  option.slug === currentSort ? "bg-neutral-50 font-medium" : ""
                }`}
                role="option"
                aria-selected={option.slug === currentSort}
              >
                {option.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
