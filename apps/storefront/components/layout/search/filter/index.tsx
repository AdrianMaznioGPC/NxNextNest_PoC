import type { SortOption } from "lib/types";
import { Suspense } from "react";
import FilterItemDropdown from "./dropdown";

export type ListItem = SortOption | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

export default function FilterList({
  list,
  title,
}: {
  list: ListItem[];
  title?: string;
}) {
  return (
    <nav>
      {title ? (
        <h3 className="mb-1 text-xs text-neutral-500 dark:text-neutral-400">
          {title}
        </h3>
      ) : null}
      <Suspense fallback={null}>
        <FilterItemDropdown list={list} />
      </Suspense>
    </nav>
  );
}
