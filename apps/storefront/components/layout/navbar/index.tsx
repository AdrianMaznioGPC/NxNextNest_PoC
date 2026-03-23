import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import SmartLink from "components/smart-link";
import type {
  DomainConfigModel,
  GlobalLayoutData,
  StoreContext,
} from "lib/types";
import { Suspense } from "react";
import CartPageLink from "./cart-page-link";
import DeferredCart from "./deferred-cart";
import DeferredMobileMenu from "./deferred-mobile-menu";
import { FeaturedLinksBar } from "./featured-links-bar";
import { MegaMenu } from "./mega-menu";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import { buildRegionOptions } from "./store-selector-options";
import StoreSelectorTrigger from "./store-selector-trigger";

const { SITE_NAME } = process.env;
const DEFER_SHELL_INTERACTIONS =
  process.env.NEXT_PUBLIC_DEFER_SHELL_INTERACTIONS !== "false";

export async function Navbar({
  layoutDataPromise,
  domainConfigPromise,
  storeContext,
  currentRegion,
}: {
  layoutDataPromise: Promise<GlobalLayoutData>;
  domainConfigPromise: Promise<DomainConfigModel>;
  storeContext: StoreContext;
  currentRegion: string;
}) {
  const [{ megaMenu, featuredLinks, routes }, domainConfig] = await Promise.all(
    [layoutDataPromise, domainConfigPromise],
  );
  const regionOptions = buildRegionOptions(domainConfig);
  const cartEntry =
    storeContext.cartUxMode === "page" ? (
      <CartPageLink cartPath={storeContext.cartPath} />
    ) : DEFER_SHELL_INTERACTIONS ? (
      <DeferredCart />
    ) : (
      <CartModal />
    );

  return (
    <header className="border-b border-border">
      {/* Row 1: Logo | Search | Actions */}
      <div className="flex items-center justify-between gap-4 p-4 lg:px-6">
        {/* Mobile menu button */}
        <div className="block flex-none md:hidden">
          {DEFER_SHELL_INTERACTIONS ? (
            <DeferredMobileMenu
              megaMenu={megaMenu}
              searchPath={routes.search}
            />
          ) : (
            <MobileMenu megaMenu={megaMenu} searchPath={routes.search} />
          )}
        </div>

        {/* Logo */}
        <SmartLink
          href={routes.home}
          intent="shell"
          className="flex items-center gap-2"
        >
          <LogoSquare
            storeFlagIconSrc={storeContext.storeFlagIconSrc}
            storeFlagIconLabel={storeContext.storeFlagIconLabel}
          />
          <span className="hidden text-sm font-medium uppercase lg:block">
            {SITE_NAME}
          </span>
        </SmartLink>

        {/* Search (center) */}
        <div className="hidden flex-1 justify-center md:flex">
          <div className="w-full max-w-xl">
            <Suspense fallback={<SearchSkeleton />}>
              <Search actionPath={routes.search} />
            </Suspense>
          </div>
        </div>

        {/* Actions (right) */}
        <div className="flex items-center gap-3">
          <StoreSelectorTrigger
            currentRegion={currentRegion}
            currentLanguage={storeContext.language}
            supportedLanguages={storeContext.supportedLanguages}
            regions={regionOptions}
          />
          {cartEntry}
        </div>
      </div>

      {/* Row 2: Browse Products + Featured Links */}
      <nav className="hidden border-t border-border md:block">
        <div className="flex items-center gap-6 px-4 lg:px-6">
          <MegaMenu items={megaMenu} categoryListPath={routes.categoryList} />
          <FeaturedLinksBar links={featuredLinks} />
        </div>
      </nav>
    </header>
  );
}
