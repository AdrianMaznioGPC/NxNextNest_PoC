import Container from "components/layout/container";
import { ListingPageHeader } from "components/layout/listing-page-header";
import type { NodeRenderer } from "../node-types";

export const CategorySummaryNode: NodeRenderer<"category-summary"> = ({
  node,
}) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <ListingPageHeader
      breadcrumbs={node.breadcrumbs}
      title={node.title}
      description={node.description}
    />
  </Container>
);
