import type { FeaturedLink } from "lib/types";
import Link from "next/link";

export function FeaturedLinksBar({ links }: { links: FeaturedLink[] }) {
  if (!links.length) return null;

  return (
    <ul className="flex items-center gap-6">
      {links.map((link) => (
        <li key={link.path}>
          <Link
            href={link.path}
            prefetch={true}
            className="whitespace-nowrap py-3 text-sm text-neutral-500 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-white"
          >
            {link.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
