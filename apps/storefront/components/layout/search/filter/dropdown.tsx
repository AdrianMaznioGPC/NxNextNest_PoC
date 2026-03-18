"use client";

import {
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@commerce/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { ListItem } from ".";
import { FilterItem } from "./item";

export default function FilterItemDropdown({ list }: { list: ListItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if ("path" in listItem && pathname === listItem.path) {
        setActive(listItem.title);
      } else if (
        "slug" in listItem &&
        (searchParams.get("sort") === listItem.slug ||
          (!searchParams.get("sort") && listItem.isDefault))
      ) {
        setActive(listItem.label);
      }
    });
  }, [pathname, list, searchParams]);

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="flex w-full items-center justify-between rounded-sm border border-input px-4 py-2 text-sm">
        <span>{active}</span>
        <ChevronDownIcon className="h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner>
          <DropdownMenuPopup className="w-full p-2">
            {list.map((item: ListItem, i) => (
              <FilterItem key={i} item={item} />
            ))}
          </DropdownMenuPopup>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
}
