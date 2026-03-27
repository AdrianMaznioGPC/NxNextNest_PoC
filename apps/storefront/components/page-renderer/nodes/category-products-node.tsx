import Container from "components/layout/container";
import { ListingContainer } from "components/layout/listing-container";
import type { NodeRenderer } from "../node-types";

export const CategoryProductsNode: NodeRenderer<"category-products"> = ({
  node,
}) => (
  <Container className={node.containerClassName ?? "pb-8"}>
    <ListingContainer
      products={node.products}
      sortOptions={node.sortOptions}
      filterGroups={node.filterGroups}
      defaultView="grid"
      showViewToggle={true}
      emptyMessage="No products found in this category"
    />
  </Container>
);
