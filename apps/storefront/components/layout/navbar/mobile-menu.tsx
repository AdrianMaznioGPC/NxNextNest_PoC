"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, Suspense, useEffect, useState } from "react";

import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { MegaMenuItem } from "lib/types";
import Search, { SearchSkeleton } from "./search";

export type MobileMenuProps = {
  megaMenu: MegaMenuItem[];
  searchPath?: string;
  initialOpen?: boolean;
  hideTrigger?: boolean;
};

export default function MobileMenu({
  megaMenu,
  searchPath = "/search",
  initialOpen = false,
  hideTrigger = false,
}: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const openMobileMenu = () => setIsOpen(true);
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
      {!hideTrigger ? (
        <button
          onClick={openMobileMenu}
          aria-label="Open mobile menu"
          className="flex h-11 w-11 items-center justify-center rounded-control border border-neutral-200 text-black transition-colors md:hidden"
        >
          <Bars3Icon className="h-4" />
        </button>
      ) : null}
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6">
              <div className="p-4">
                <button
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-control border border-neutral-200 text-black transition-colors"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>

                <div className="mb-4 w-full">
                  <Suspense fallback={<SearchSkeleton />}>
                    <Search actionPath={searchPath} />
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
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
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
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <li className="border-b border-neutral-200">
      <div className="flex items-center justify-between">
        <Link
          href={item.path}
          prefetch={false}
          onClick={onNavigate}
          className="flex-1 py-3 text-lg text-black transition-colors hover:text-neutral-500"
        >
          {item.title}
        </Link>
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={`Expand ${item.title}`}
            className="p-3 text-neutral-500"
          >
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        ) : null}
      </div>
      {hasChildren && expanded ? (
        <ul className="pb-3 pl-4">
          {item.children!.map((child) => (
            <li key={child.path}>
              <Link
                href={child.path}
                prefetch={false}
                onClick={onNavigate}
                className="block py-1.5 text-base text-neutral-500 transition-colors hover:text-black"
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
