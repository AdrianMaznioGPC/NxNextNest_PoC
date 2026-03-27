import Link from "next/link";

import Container from "components/layout/container";
import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/api";
import type { GlobalLayoutData, LocaleContext, StoreContext } from "lib/types";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer({
  layoutDataPromise,
  localeContext,
  storeContext,
}: {
  layoutDataPromise: Promise<GlobalLayoutData>;
  localeContext: LocaleContext;
  storeContext: StoreContext;
}) {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton = "h-6 w-full animate-pulse rounded-sm bg-muted-surface";
  const [{ routes }, menu] = await Promise.all([
    layoutDataPromise,
    getMenu("next-js-frontend-footer-menu", localeContext),
  ]);
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="border-t border-border text-sm text-muted">
      <Container>
        <div className="flex w-full flex-col gap-6 py-12 text-sm md:flex-row md:gap-12">
          <div>
            <Link
              className="flex items-center gap-2 text-link md:pt-1"
              href={routes.home}
            >
              <LogoSquare
                size="sm"
                storeFlagIconSrc={storeContext.storeFlagIconSrc}
                storeFlagIconLabel={storeContext.storeFlagIconLabel}
              />
              <span className="uppercase">{SITE_NAME}</span>
            </Link>
          </div>
          <Suspense
            fallback={
              <div className="flex h-[188px] w-[200px] flex-col gap-2">
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
                <div className={skeleton} />
              </div>
            }
          >
            <FooterMenu menu={menu} />
          </Suspense>
        </div>
      </Container>
    </footer>
  );
}
