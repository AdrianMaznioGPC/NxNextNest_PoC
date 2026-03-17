"use client";

import { cn } from "@commerce/ui";
import type { SortOption } from "lib/types";
import { createUrl } from "lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem, PathFilterItem } from ".";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? "p" : Link;

  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={cn(
          "w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
          active && "underline underline-offset-4",
        )}
      >
        {item.title}
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortOption }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDefault = item.isDefault === true;
  const active = isDefault
    ? !searchParams.get("sort")
    : searchParams.get("sort") === item.slug;
  const q = searchParams.get("q");
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(!isDefault && { sort: item.slug }),
    }),
  );
  const DynamicTag = active ? "p" : Link;

  return (
    <li
      className="mt-2 flex text-sm text-black dark:text-white"
      key={item.slug}
    >
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={cn(
          "w-full hover:underline hover:underline-offset-4",
          active && "underline underline-offset-4",
        )}
      >
        {item.label}
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? (
    <PathFilterItem item={item} />
  ) : (
    <SortFilterItem item={item} />
  );
}
