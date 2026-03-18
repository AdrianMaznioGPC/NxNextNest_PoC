import { Skeleton } from "@commerce/ui";
import { Suspense } from "react";

import { getCategoryListPageData, getStoreCode } from "lib/api";
import { getTranslations } from "next-intl/server";
import FilterList from "./filter";

async function CollectionList() {
  const storeCode = await getStoreCode();
  const { collections } = await getCategoryListPageData(storeCode);
  const t = await getTranslations("search");
  return <FilterList list={collections} title={t("collections")} />;
}

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
          <Skeleton className="mb-3 h-4 w-5/6 opacity-60" />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
