import Breadcrumbs from "components/layout/breadcrumbs";
import CategoryCard from "components/layout/category-card";
import Container from "components/layout/container";
import type { NodeRenderer } from "../node-types";

export const CategorySubcollectionsNode: NodeRenderer<
  "category-subcollections"
> = ({ node }) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <Breadcrumbs items={node.breadcrumbs} />
    <h1 className="mb-8 text-3xl font-bold text-black">{node.title}</h1>
    <p className="mb-8 text-neutral-500">{node.description}</p>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {node.subcollections.map((sub) => (
        <CategoryCard key={sub.handle} collection={sub} />
      ))}
    </div>
  </Container>
);
