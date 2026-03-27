"use client";

import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { ViewMode } from "@commerce/shared-types";

type ViewToggleProps = {
  defaultView?: ViewMode;
};

export function ViewToggle({ defaultView = "grid" }: ViewToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = (searchParams.get("view") as ViewMode) || defaultView;

  const setView = useCallback(
    (view: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("view", view);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const buttonClass = (view: ViewMode) =>
    `p-2 rounded-md transition-colors ${
      currentView === view
        ? "bg-black text-white"
        : "bg-white text-black border border-neutral-300 hover:bg-neutral-100"
    }`;

  return (
    <div className="flex gap-1" role="group" aria-label="View toggle">
      <button
        onClick={() => setView("grid")}
        className={buttonClass("grid")}
        aria-label="Grid view"
        aria-pressed={currentView === "grid"}
      >
        <Squares2X2Icon className="h-5 w-5" />
      </button>
      <button
        onClick={() => setView("list")}
        className={buttonClass("list")}
        aria-label="List view"
        aria-pressed={currentView === "list"}
      >
        <ListBulletIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
