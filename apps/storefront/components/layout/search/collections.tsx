import { cn } from "@commerce/ui";
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

const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-neutral-800 dark:bg-neutral-300";
const items = "bg-neutral-400 dark:bg-neutral-700";

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={cn(skeleton, activeAndTitles)} />
          <div className={cn(skeleton, activeAndTitles)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
          <div className={cn(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
