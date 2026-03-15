import type { Collection, FeaturedCategoryBlock } from "lib/types";
import Image from "next/image";
import Link from "next/link";
import { registerBlockRenderer } from "../block-registry";

function FeaturedCategoryCard({ collection }: { collection: Collection }) {
  return (
    <Link
      href={collection.path}
      className="group relative flex aspect-[3/2] flex-col justify-end overflow-hidden rounded-lg"
    >
      {collection.image ? (
        <Image
          src={collection.image.url}
          alt={collection.image.altText}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 flex items-end justify-between gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold text-white">{collection.title}</h3>
          <p className="mt-1 text-sm text-white/70">{collection.description}</p>
          {collection.subcollections &&
            collection.subcollections.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {collection.subcollections.map((sub) => (
                  <span
                    key={sub.handle}
                    className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs text-white/90 backdrop-blur-sm"
                  >
                    {sub.title}
                  </span>
                ))}
              </div>
            )}
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M5 10a.75.75 0 0 1 .75-.75h6.638L10.23 7.29a.75.75 0 1 1 1.04-1.08l3.5 3.25a.75.75 0 0 1 0 1.08l-3.5 3.25a.75.75 0 1 1-1.04-1.08l2.158-1.96H5.75A.75.75 0 0 1 5 10Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

function FeaturedCategory({ block }: { block: FeaturedCategoryBlock }) {
  if (!block.collections.length) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">{block.heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.collections.map((collection) => (
          <FeaturedCategoryCard
            key={collection.handle}
            collection={collection}
          />
        ))}
      </div>
    </section>
  );
}

registerBlockRenderer("featured-category", FeaturedCategory);
export default FeaturedCategory;
