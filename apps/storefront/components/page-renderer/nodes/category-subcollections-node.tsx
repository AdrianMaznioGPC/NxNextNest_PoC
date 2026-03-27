import CategoryCard from "components/layout/category-card";
import Container from "components/layout/container";
import type { NodeRenderer } from "../node-types";

export const CategorySubcollectionsNode: NodeRenderer<
  "category-subcollections"
> = ({ node }) => (
  <Container className={node.containerClassName ?? "pb-8"}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {node.subcollections.map((sub) => (
        <CategoryCard key={sub.handle} collection={sub} />
      ))}
    </div>
  </Container>
);
