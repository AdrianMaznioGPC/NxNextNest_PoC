import Grid from "components/grid";
import Container from "components/layout/container";
import ProductGridItems from "components/layout/product-grid-items";
import FilterList from "components/layout/search/filter";
import type { NodeRenderer } from "../node-types";

export const SearchResultsNode: NodeRenderer<"search-results"> = ({ node }) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <div className="flex flex-col gap-8 text-black md:flex-row">
      <div className="min-h-screen w-full">
        {node.summaryText ? <p className="mb-4">{node.summaryText}</p> : null}

        {node.products.length > 0 ? (
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={node.products} />
          </Grid>
        ) : null}
      </div>
      <div className="flex-none md:w-[125px]">
        <FilterList list={node.sortOptions} title="Sort by" />
      </div>
    </div>
  </Container>
);
