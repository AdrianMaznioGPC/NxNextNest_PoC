import Container from "components/layout/container";
import { ListingPageHeader } from "components/layout/listing-page-header";
import type { SlotRenderer } from "../slot-types";

const SearchSummarySlot: SlotRenderer<"page.search-summary"> = ({
  breadcrumbs,
  title,
  query,
  summaryText,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "py-8"}>
      <ListingPageHeader
        breadcrumbs={breadcrumbs}
        title={title}
        summaryText={
          summaryText ?? (query ? `Showing results for "${query}"` : undefined)
        }
      />
    </Container>
  );
};

export default SearchSummarySlot;
