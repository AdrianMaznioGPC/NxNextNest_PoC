import Container from "components/layout/container";
import FilterList from "components/layout/search/filter";
import type { SlotRenderer } from "../slot-types";

const SearchSummarySlot: SlotRenderer<"page.search-summary"> = ({
  query,
  summaryText,
  sortOptions,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "py-8"}>
      <div className="flex flex-col gap-6 text-black md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Search</h1>
          {summaryText ? (
            <p className="mt-2 text-sm text-neutral-700">
              {summaryText}
            </p>
          ) : query ? (
            <p className="mt-2 text-sm text-neutral-700">
              Results for &quot;{query}&quot;
            </p>
          ) : null}
        </div>
        <div className="md:w-[180px]">
          <FilterList list={sortOptions} title="Sort by" />
        </div>
      </div>
    </Container>
  );
};

export default SearchSummarySlot;
