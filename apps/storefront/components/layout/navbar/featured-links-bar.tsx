import type { FeaturedLink } from "lib/types";
import SmartLink from "components/smart-link";

export function FeaturedLinksBar({ links }: { links: FeaturedLink[] }) {
  if (!links.length) return null;

  return (
    <ul className="flex items-center gap-6">
      {links.map((link) => (
        <li key={link.path}>
          <SmartLink
            href={link.path}
            intent="shell"
            className="whitespace-nowrap py-3 text-sm text-neutral-500 transition-colors hover:text-black"
          >
            {link.title}
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}
