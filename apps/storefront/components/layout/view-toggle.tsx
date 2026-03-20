"use client";

import { IconButton } from "@commerce/ui";
import { ListBulletIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { createUrl } from "lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
  activeView: ViewMode;
}

export default function ViewToggle({ activeView }: ViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setView = useCallback(
    (view: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      if (view === "grid") {
        params.delete("view");
      } else {
        params.set("view", view);
      }
      router.push(createUrl(pathname, params), { scroll: false });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex">
      <IconButton
        size="sm"
        variant={activeView === "grid" ? "default" : "ghost"}
        aria-label="Grid view"
        aria-pressed={activeView === "grid"}
        onClick={() => setView("grid")}
        className="rounded-r-none"
      >
        <Squares2X2Icon />
      </IconButton>
      <IconButton
        size="sm"
        variant={activeView === "list" ? "default" : "ghost"}
        aria-label="List view"
        aria-pressed={activeView === "list"}
        onClick={() => setView("list")}
        className="-ml-px rounded-l-none"
      >
        <ListBulletIcon />
      </IconButton>
    </div>
  );
}
