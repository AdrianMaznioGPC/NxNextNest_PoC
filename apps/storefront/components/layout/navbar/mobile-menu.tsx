"use client";

import {
  CollapsiblePanel,
  CollapsibleRoot,
  CollapsibleTrigger,
  DrawerBackdrop,
  DrawerClose,
  DrawerPopup,
  DrawerRoot,
  IconButton,
} from "@commerce/ui";
import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Search, { SearchSkeleton } from "./search";

export default function MobileMenu({ megaMenu }: { megaMenu: MegaMenuItem[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <IconButton
        size="lg"
        onClick={() => setIsOpen(true)}
        aria-label={t("openMobileMenu")}
        className="md:hidden"
      >
        <Bars3Icon className="h-4" />
      </IconButton>
      <DrawerRoot open={isOpen} onOpenChange={setIsOpen}>
        <DrawerBackdrop />
        <DrawerPopup side="left" className="max-w-full pb-6">
          <div className="p-4">
            <DrawerClose
              render={
                <IconButton
                  size="lg"
                  className="mb-4"
                  aria-label={t("closeMobileMenu")}
                >
                  <XMarkIcon className="h-6" />
                </IconButton>
              }
            />

            <div className="mb-4 w-full">
              <Suspense fallback={<SearchSkeleton />}>
                <Search />
              </Suspense>
            </div>
            {megaMenu.length ? (
              <ul className="flex w-full flex-col">
                {megaMenu.map((item) => (
                  <MobileMenuItem
                    key={item.path}
                    item={item}
                    onNavigate={closeMobileMenu}
                  />
                ))}
              </ul>
            ) : null}
          </div>
        </DrawerPopup>
      </DrawerRoot>
    </>
  );
}

function MobileMenuItem({
  item,
  onNavigate,
}: {
  item: MegaMenuItem;
  onNavigate: () => void;
}) {
  const t = useTranslations("nav");
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <li className="border-b border-border">
        <Link
          href={item.path}
          prefetch={true}
          onClick={onNavigate}
          className="block py-3 text-lg text-foreground transition-colors hover:text-muted-foreground"
        >
          {item.title}
        </Link>
      </li>
    );
  }

  return (
    <li className="border-b border-border">
      <CollapsibleRoot>
        <div className="flex items-center justify-between">
          <Link
            href={item.path}
            prefetch={true}
            onClick={onNavigate}
            className="flex-1 py-3 text-lg text-foreground transition-colors hover:text-muted-foreground"
          >
            {item.title}
          </Link>
          <CollapsibleTrigger
            aria-label={t("expand", { title: item.title })}
            className="p-3 text-muted-foreground"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </CollapsibleTrigger>
        </div>
        <CollapsiblePanel>
          <ul className="pb-3 pl-4">
            {item.children!.map((child) => (
              <li key={child.path}>
                <Link
                  href={child.path}
                  prefetch={true}
                  onClick={onNavigate}
                  className="block py-1.5 text-base text-muted-foreground transition-colors hover:text-foreground"
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </CollapsiblePanel>
      </CollapsibleRoot>
    </li>
  );
}
