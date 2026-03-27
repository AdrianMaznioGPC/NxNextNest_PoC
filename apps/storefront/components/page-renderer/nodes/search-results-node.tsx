import Container from "components/layout/container";
import { FilterSidebar } from "components/layout/filter-sidebar";
import { ListingToolbar } from "components/layout/listing-toolbar";
import { ProductListing } from "components/layout/product-listing";
import type { NodeRenderer } from "../node-types";

export const SearchResultsNode: NodeRenderer<"search-results"> = ({ node }) => (
  <Container className={node.containerClassName ?? "py-8"}>
    {node.summaryText ? (
      <p className="mb-4 text-black">{node.summaryText}</p>
    ) : null}

    {node.products.length > 0 ? (
      <div className="flex gap-6">
        <FilterSidebar filterGroups={node.filterGroups} />
        <div className="flex-1">
          <ListingToolbar
            sortOptions={node.sortOptions}
            resultsCount={node.products.length}
            showViewToggle={true}
          />
          <ProductListing products={node.products} defaultView="grid" />
        </div>
      </div>
    ) : (
      <p className="py-8 text-center text-sm text-neutral-700">
        No products found.
      </p>
    )}
  </Container>
);
