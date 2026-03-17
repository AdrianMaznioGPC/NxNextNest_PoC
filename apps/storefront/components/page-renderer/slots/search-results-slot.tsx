import type { SlotRenderer } from "../slot-types";
import { SearchResultsNode } from "../nodes/search-results-node";

const SearchResultsSlot: SlotRenderer<"page.search-results"> = (props) => {
  return <SearchResultsNode node={{ type: "search-results", ...props }} />;
};

export default SearchResultsSlot;
