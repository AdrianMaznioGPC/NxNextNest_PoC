"use client";

import type { FilterGroup } from "@commerce/shared-types";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type FilterSidebarProps = {
  filterGroups?: FilterGroup[];
};

export function FilterSidebar({ filterGroups = [] }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const isFilterActive = (groupId: string, value: string) => {
    const param = searchParams.get(groupId);
    if (!param) return false;
    return param.split(",").includes(value);
  };

  const toggleFilter = useCallback(
    (groupId: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(groupId)?.split(",").filter(Boolean) || [];

      if (current.includes(value)) {
        const updated = current.filter((v) => v !== value);
        if (updated.length > 0) {
          params.set(groupId, updated.join(","));
        } else {
          params.delete(groupId);
        }
      } else {
        params.set(groupId, [...current, value].join(","));
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const clearAllFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    filterGroups.forEach((group) => params.delete(group.id));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router, searchParams, filterGroups]);

  const hasActiveFilters = filterGroups.some((group) =>
    group.options.some((opt) => isFilterActive(group.id, opt.value)),
  );

  if (!filterGroups.length) {
    return null;
  }

  return (
    <aside className="hidden w-64 flex-none border-r border-neutral-200 pr-6 lg:block">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-black">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-neutral-600 underline hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id} className="border-b border-neutral-100 pb-4">
            <button
              onClick={() => toggleGroup(group.id)}
              className="mb-3 flex w-full items-center justify-between text-sm font-medium text-black"
            >
              <span>{group.title}</span>
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${
                  collapsed[group.id] ? "" : "rotate-180"
                }`}
              />
            </button>

            {!collapsed[group.id] && (
              <ul className="space-y-2">
                {group.options.map((option) => {
                  const active = isFilterActive(group.id, option.value);
                  return (
                    <li key={option.id}>
                      <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFilter(group.id, option.value)}
                          className="rounded border-neutral-300"
                        />
                        <span className={active ? "font-medium" : ""}>
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-neutral-500">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
