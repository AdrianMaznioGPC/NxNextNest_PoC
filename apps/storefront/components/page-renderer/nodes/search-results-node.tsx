import Container from "components/layout/container";
import { ListingContainer } from "components/layout/listing-container";
import { ListingPageHeader } from "components/layout/listing-page-header";
import type { NodeRenderer } from "../node-types";

export const SearchResultsNode: NodeRenderer<"search-results"> = ({ node }) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <ListingPageHeader
      breadcrumbs={node.breadcrumbs}
      title={node.title}
      summaryText={node.summaryText}
    />

    <ListingContainer
      products={node.products}
      sortOptions={node.sortOptions}
      filterGroups={node.filterGroups}
      defaultView="grid"
      showViewToggle={true}
      emptyMessage="No products found."
    />
  </Container>
);
