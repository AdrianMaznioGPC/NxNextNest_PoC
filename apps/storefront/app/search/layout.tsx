import Container from "components/layout/container";
import FilterList from "components/layout/search/filter";
import { getSearchPageData, getStoreCode } from "lib/api";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

export default async function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("search");
  const storeCode = await getStoreCode();
  const { sortOptions } = await getSearchPageData(storeCode, {});

  return (
    <Container>
      <div className="flex flex-col gap-8 text-black md:flex-row dark:text-white">
        <div className="min-h-screen w-full">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        <div className="flex-none md:w-[125px]">
          <FilterList list={sortOptions} title={t("sortBy")} />
        </div>
      </div>
    </Container>
  );
}
