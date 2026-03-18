import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@commerce/ui";
import type { Breadcrumb as BreadcrumbType } from "lib/types";
import Link from "next/link";

export default function Breadcrumbs({ items }: { items: BreadcrumbType[] }) {
  if (!items.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <>
              {i > 0 && <BreadcrumbSeparator key={`sep-${item.path}`} />}
              <BreadcrumbItem key={item.path}>
                {isLast ? (
                  <BreadcrumbLink isCurrentPage>{item.title}</BreadcrumbLink>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
