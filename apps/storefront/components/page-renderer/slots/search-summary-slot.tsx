import Container from "components/layout/container";
import type { SlotRenderer } from "../slot-types";

const SearchSummarySlot: SlotRenderer<"page.search-summary"> = ({
  query,
  summaryText,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "py-8"}>
      <div className="text-black">
        <h1 className="text-2xl font-semibold">Search</h1>
        {summaryText ? (
          <p className="mt-2 text-sm text-neutral-700">{summaryText}</p>
        ) : query ? (
          <p className="mt-2 text-sm text-neutral-700">
            Showing {/* results count will be in toolbar */} results for &quot;
            {query}&quot;
          </p>
        ) : null}
      </div>
    </Container>
  );
};

export default SearchSummarySlot;
