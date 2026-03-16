import CartModal from "components/cart/modal";
import { StoreSwitcher } from "components/layout/store-switcher";
import LogoSquare from "components/logo-square";
import { getStoreCode } from "lib/api";
import type { GlobalLayoutData } from "lib/types";
import Link from "next/link";
import { Suspense } from "react";
import { FeaturedLinksBar } from "./featured-links-bar";
import { MegaMenu } from "./mega-menu";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar({
  layoutDataPromise,
}: {
  layoutDataPromise: Promise<GlobalLayoutData>;
}) {
  const [{ megaMenu, featuredLinks }, storeCode] = await Promise.all([
    layoutDataPromise,
    getStoreCode(),
  ]);

  return (
    <header className="border-b border-neutral-200 dark:border-neutral-700">
      {/* Row 1: Logo | Search | Actions */}
      <div className="flex items-center justify-between gap-4 p-4 lg:px-6">
        {/* Mobile menu button */}
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu megaMenu={megaMenu} />
          </Suspense>
        </div>

        {/* Logo */}
        <Link href="/" prefetch={true} className="flex items-center gap-2">
          <LogoSquare />
          <span className="hidden text-sm font-medium uppercase lg:block">
            {SITE_NAME}
          </span>
        </Link>

        {/* Search (center) */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="w-full max-w-xl">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
        </div>

        {/* Actions (right) */}
        <div className="flex items-center gap-3">
          <StoreSwitcher currentCode={storeCode} />
          <CartModal />
        </div>
      </div>

      {/* Row 2: Browse Products + Featured Links */}
      <nav className="hidden border-t border-neutral-200 md:block dark:border-neutral-700">
        <div className="mx-auto flex h-11 w-full max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
          <MegaMenu items={megaMenu} />
          <FeaturedLinksBar links={featuredLinks} />
        </div>
      </nav>
    </header>
  );
}
