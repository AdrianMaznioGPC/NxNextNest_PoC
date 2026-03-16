import { MegaMenuSidebar } from "components/layout/navbar/mega-menu-sidebar";
import type { HomepageHeroBlock } from "lib/types";
import { registerBlockRenderer } from "../block-registry";
import { BannerCard } from "./cms-banner";

function HomepageHero({ block }: { block: HomepageHeroBlock }) {
  return (
    <section className="relative flex gap-4">
      {/* Left: static mega menu sidebar — hidden below lg */}
      <div className="hidden self-stretch lg:block">
        <MegaMenuSidebar items={block.megaMenu} />
      </div>

      {/* Right: 2-row banner grid */}
      <div className="flex flex-1 flex-col gap-4">
        {/* Row 1: main banner + future slot */}
        <div className="flex gap-4">
          <div className="flex-1">
            <BannerCard banner={block.mainBanner} />
          </div>
          {/* Reserved slot for a future widget (e.g. vehicle selector) */}
          <div className="hidden w-64 shrink-0 xl:block" />
        </div>

        {/* Row 2: USPs */}
        {block.usps?.length > 0 ? (
          <div className="grid grid-cols-3">
            {block.usps.map((usp, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-3 py-2"
              >
                {usp.icons.map((icon, j) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={j}
                    src={icon.url}
                    alt={icon.altText}
                    width={icon.width}
                    height={icon.height}
                    className="h-8 w-auto object-contain"
                  />
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {/* Row 3: 3 small banners */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {block.smallBanners.map((banner, i) => (
            <BannerCard key={i} banner={banner} />
          ))}
        </div>
      </div>
    </section>
  );
}

registerBlockRenderer("homepage-hero", HomepageHero);
export default HomepageHero;
