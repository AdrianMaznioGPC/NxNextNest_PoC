"use client";

import {
  Button,
  DrawerBackdrop,
  DrawerClose,
  DrawerPopup,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "@commerce/ui";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { FilterDefinition } from "lib/types";
import FilterSidebar from "./filter-sidebar";

interface MobileFilterDrawerProps {
  filters: FilterDefinition[];
  activeFilters?: Record<string, string[]>;
  label: string;
}

export default function MobileFilterDrawer({
  filters,
  activeFilters,
  label,
}: MobileFilterDrawerProps) {
  const activeCount = Object.values(activeFilters ?? {}).reduce(
    (sum, vals) => sum + vals.length,
    0,
  );

  return (
    <DrawerRoot>
      <DrawerTrigger
        render={
          <Button variant="outline" size="sm">
            <AdjustmentsHorizontalIcon className="mr-2 h-4 w-4" />
            {label}
            {activeCount > 0 && (
              <span className="ml-1 rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </Button>
        }
      />
      <DrawerPortal>
        <DrawerBackdrop />
        <DrawerPopup className="w-[320px]">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <DrawerTitle className="text-lg font-semibold">{label}</DrawerTitle>
            <DrawerClose
              render={
                <button className="rounded-md p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              }
            />
          </div>
          <div className="overflow-y-auto p-4">
            <FilterSidebar filters={filters} activeFilters={activeFilters} />
          </div>
        </DrawerPopup>
      </DrawerPortal>
    </DrawerRoot>
  );
}
