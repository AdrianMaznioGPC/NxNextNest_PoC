import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
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
  const { megaMenu, featuredLinks } = await layoutDataPromise;

  return (
    <header>
      <FeaturedLinksBar links={featuredLinks} />
      <nav className="relative flex items-center justify-between p-4 lg:px-6">
        <div className="block flex-none md:hidden">
          <Suspense fallback={null}>
            <MobileMenu megaMenu={megaMenu} />
          </Suspense>
        </div>
        <div className="flex w-full items-center">
          <div className="flex w-full md:w-1/3">
            <Link
              href="/"
              prefetch={true}
              className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
            >
              <LogoSquare />
              <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
                {SITE_NAME}
              </div>
            </Link>
            <div className="hidden md:flex md:items-center">
              <MegaMenu items={megaMenu} />
            </div>
          </div>
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
          <div className="flex justify-end md:w-1/3">
            <CartModal />
          </div>
        </div>
      </nav>
    </header>
  );
}
