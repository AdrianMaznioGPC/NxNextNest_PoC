import Container from "components/layout/container";
import FilterList from "components/layout/search/filter";
import { sorting } from "lib/constants";
import { Suspense } from "react";
import ChildrenWrapper from "./children-wrapper";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-8">
      <div className="flex flex-col gap-8 text-black md:flex-row dark:text-white">
        <div className="min-h-screen w-full">
          <Suspense fallback={null}>
            <ChildrenWrapper>{children}</ChildrenWrapper>
          </Suspense>
        </div>
        <div className="flex-none md:w-[125px]">
          <FilterList list={sorting} title="Sort by" />
        </div>
      </div>
    </Container>
  );
}
