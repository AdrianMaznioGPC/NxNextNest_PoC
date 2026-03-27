import CategoryCard from "components/layout/category-card";
import Container from "components/layout/container";
import type { NodeRenderer } from "../node-types";

export const CategoryListNode: NodeRenderer<"category-list"> = ({ node }) => (
  <Container className={node.containerClassName ?? "pb-8"}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {node.collections.map((collection) => (
        <CategoryCard key={collection.handle} collection={collection} />
      ))}
    </div>
  </Container>
);
