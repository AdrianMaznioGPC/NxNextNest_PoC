import type { CmsBannerBlock, CmsBannerItem } from "lib/types";
import Image from "next/image";
import Link from "next/link";
import { registerBlockRenderer } from "../block-registry";

export function BannerCard({ banner }: { banner: CmsBannerItem }) {
  const overlay = banner.overlayOpacity ?? 0.3;

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <Image
        src={banner.image.url}
        alt={banner.image.altText}
        width={banner.image.width}
        height={banner.image.height}
        className="w-full object-cover"
      />
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
        style={{ backgroundColor: `rgba(0,0,0,${overlay})` }}
      >
        <h2 className="text-3xl font-bold">{banner.heading}</h2>
        {banner.subheading && (
          <p className="mt-2 text-lg">{banner.subheading}</p>
        )}
        {banner.ctaLabel && banner.ctaUrl && (
          <Link
            href={banner.ctaUrl}
            className="mt-4 rounded bg-white px-6 py-2 font-semibold text-black hover:bg-gray-100"
          >
            {banner.ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

function CmsBanner({ block }: { block: CmsBannerBlock }) {
  return (
    <section>
      <BannerCard banner={block} />
    </section>
  );
}

registerBlockRenderer("cms-banner", CmsBanner);
export default CmsBanner;
