"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import { useState } from "react";
import type { ReactNode } from "react";
import type { MobileMenuProps } from "./mobile-menu";

type MobileMenuComponent = (props: MobileMenuProps) => ReactNode;

export default function DeferredMobileMenu({
  megaMenu,
  searchPath,
}: {
  megaMenu: MegaMenuItem[];
  searchPath?: string;
}) {
  const [MobileMenu, setMobileMenu] = useState<MobileMenuComponent | null>(
    null,
  );
  const [menuKey, setMenuKey] = useState(0);

  const openMenu = async () => {
    if (!MobileMenu) {
      const mod = await import("./mobile-menu");
      setMobileMenu(() => mod.default as MobileMenuComponent);
      setMenuKey(1);
      return;
    }

    setMenuKey((prev) => prev + 1);
  };

  return (
    <>
      <button
        onClick={openMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-control border border-neutral-200 text-black transition-colors md:hidden"
      >
        <Bars3Icon className="h-4" />
      </button>
      {MobileMenu ? (
        <MobileMenu
          key={menuKey}
          megaMenu={megaMenu}
          searchPath={searchPath}
          hideTrigger={true}
          initialOpen={true}
        />
      ) : null}
    </>
  );
}
