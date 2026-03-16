import type { Collection } from "lib/types";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function CategoryCard({
  collection,
}: {
  collection: Collection;
}) {
  const t = await getTranslations("categories");

  return (
    <Link
      href={collection.path}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-600"
    >
      <h3 className="text-lg font-semibold text-black group-hover:underline dark:text-white">
        {collection.title}
      </h3>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {collection.description}
      </p>
      {collection.subcollections && collection.subcollections.length > 0 && (
        <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
          {t("subcategoryCount", {
            count: collection.subcollections.length,
          })}
        </p>
      )}
    </Link>
  );
}
