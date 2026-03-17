import type { Collection } from "lib/types";
import SmartLink from "components/smart-link";

export default function CategoryCard({
  collection,
}: {
  collection: Collection;
}) {
  return (
    <SmartLink
      href={collection.path}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-card-border bg-card p-6 transition-colors hover:border-card-border-hover"
    >
      <h3 className="text-lg font-semibold text-card-foreground group-hover:underline">
        {collection.title}
      </h3>
      <p className="mt-2 text-sm text-muted">
        {collection.description}
      </p>
      {collection.subcollections && collection.subcollections.length > 0 && (
        <p className="mt-4 text-xs text-muted">
          {collection.subcollections.length} subcategories
        </p>
      )}
    </SmartLink>
  );
}
