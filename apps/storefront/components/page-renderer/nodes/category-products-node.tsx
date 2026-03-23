import Grid from "components/grid";
import Breadcrumbs from "components/layout/breadcrumbs";
import Container from "components/layout/container";
import ProductGridItems from "components/layout/product-grid-items";
import FilterList from "components/layout/search/filter";
import type { NodeRenderer } from "../node-types";

export const CategoryProductsNode: NodeRenderer<"category-products"> = ({
  node,
}) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <Breadcrumbs items={node.breadcrumbs} />
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-black">{node.title}</h1>
      <div className="w-[200px]">
        <FilterList list={node.sortOptions} title="Sort by" />
      </div>
    </div>
    <p className="mb-8 mt-2 text-neutral-500">{node.description}</p>
    {!node.products.length ? (
      <p className="py-3 text-lg">No products found in this category</p>
    ) : (
      <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <ProductGridItems products={node.products} />
      </Grid>
    )}
  </Container>
);
