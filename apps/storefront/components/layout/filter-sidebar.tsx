"use client";

import {
  Checkbox,
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
  Separator,
} from "@commerce/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import type { FilterDefinition } from "lib/types";
import { createUrl } from "lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterSidebarProps {
  filters: FilterDefinition[];
  activeFilters?: Record<string, string[]>;
}

export default function FilterSidebar({
  filters,
  activeFilters = {},
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleFilter = useCallback(
    (filterKey: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // Parse current filters from URL
      let current: Record<string, string[]> = {};
      const filtersParam = params.get("filters");
      if (filtersParam) {
        try {
          current = JSON.parse(filtersParam);
        } catch {
          /* ignore */
        }
      }

      // Toggle the value
      const values = current[filterKey] ?? [];
      const idx = values.indexOf(value);
      if (idx >= 0) {
        values.splice(idx, 1);
      } else {
        values.push(value);
      }

      if (values.length > 0) {
        current[filterKey] = values;
      } else {
        delete current[filterKey];
      }

      // Update URL
      if (Object.keys(current).length > 0) {
        params.set("filters", JSON.stringify(current));
      } else {
        params.delete("filters");
      }

      // Reset to page 1 when filters change
      params.delete("page");

      router.push(createUrl(pathname, params), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  if (filters.length === 0) return null;

  return (
    <aside className="space-y-1">
      {filters.map((filter, index) => (
        <div key={filter.key}>
          {index > 0 && <Separator className="my-1" />}
          <CollapsibleRoot defaultOpen>
            <CollapsibleTrigger className="py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              {filter.label}
              <ChevronDownIcon className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsiblePanel>
              <div className="space-y-2 pb-3">
                {filter.values.map((filterValue) => {
                  const isChecked =
                    activeFilters[filter.key]?.includes(filterValue.value) ??
                    false;
                  return (
                    <label
                      key={filterValue.value}
                      className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() =>
                          toggleFilter(filter.key, filterValue.value)
                        }
                      />
                      <span className="flex-1">{filterValue.label}</span>
                      <span className="text-xs text-neutral-400">
                        {filterValue.count}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CollapsiblePanel>
          </CollapsibleRoot>
        </div>
      ))}
    </aside>
  );
}
