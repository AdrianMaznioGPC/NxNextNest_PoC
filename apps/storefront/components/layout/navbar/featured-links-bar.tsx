import type { FeaturedLink } from "lib/types";
import Link from "next/link";

export function FeaturedLinksBar({ links }: { links: FeaturedLink[] }) {
  if (!links.length) return null;

  return (
    <div className="border-b border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 text-xs lg:px-6">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            prefetch={true}
            className="whitespace-nowrap text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            {link.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
