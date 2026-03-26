import type { HeroBannerBlock } from "lib/types";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner({ block }: { block: HeroBannerBlock }) {
  return (
    <section className="relative w-full overflow-hidden rounded-lg">
      <Image
        src={block.image.url}
        alt={block.image.altText}
        width={block.image.width}
        height={block.image.height}
        className="w-full object-cover"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
        <h1 className="text-4xl font-bold">{block.heading}</h1>
        {block.subheading && <p className="mt-2 text-lg">{block.subheading}</p>}
        {block.ctaLabel && block.ctaUrl && (
          <Link
            href={block.ctaUrl}
            className="mt-4 rounded bg-white px-6 py-2 font-semibold text-black hover:bg-gray-100"
          >
            {block.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
