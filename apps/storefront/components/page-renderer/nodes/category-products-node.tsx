import Breadcrumbs from "components/layout/breadcrumbs";
import Container from "components/layout/container";
import { FilterSidebar } from "components/layout/filter-sidebar";
import { ListingToolbar } from "components/layout/listing-toolbar";
import { ProductListing } from "components/layout/product-listing";
import type { NodeRenderer } from "../node-types";

export const CategoryProductsNode: NodeRenderer<"category-products"> = ({
  node,
}) => (
  <Container className={node.containerClassName ?? "py-8"}>
    <Breadcrumbs items={node.breadcrumbs} />
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-black">{node.title}</h1>
      <p className="mt-2 text-neutral-500">{node.description}</p>
    </div>

    <div className="flex gap-6">
      <FilterSidebar filterGroups={node.filterGroups} />
      <div className="flex-1">
        <ListingToolbar
          sortOptions={node.sortOptions}
          resultsCount={node.products.length}
          showViewToggle={true}
        />

        {!node.products.length ? (
          <p className="py-3 text-lg">No products found in this category</p>
        ) : (
          <ProductListing products={node.products} defaultView="grid" />
        )}
      </div>
    </div>
  </Container>
);
