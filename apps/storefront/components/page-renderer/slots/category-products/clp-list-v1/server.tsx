import Breadcrumbs from "components/layout/breadcrumbs";
import Container from "components/layout/container";
import { FilterSidebar } from "components/layout/filter-sidebar";
import { ListingToolbar } from "components/layout/listing-toolbar";
import { ProductListing } from "components/layout/product-listing";
import type { SlotRenderer } from "../../../slot-types";

const CategoryProductsListSlot: SlotRenderer<"page.category-products"> = ({
  breadcrumbs,
  title,
  description,
  products,
  sortOptions,
  filterGroups,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "py-8"}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black">{title}</h1>
        <p className="mt-2 text-neutral-500">{description}</p>
      </div>

      <div className="flex gap-6">
        <FilterSidebar filterGroups={filterGroups} />
        <div className="flex-1">
          <ListingToolbar
            sortOptions={sortOptions}
            resultsCount={products.length}
            showViewToggle={true}
          />

          {!products.length ? (
            <p className="py-3 text-lg">No products found in this category</p>
          ) : (
            <ProductListing products={products} defaultView="list" />
          )}
        </div>
      </div>
    </Container>
  );
};

export default CategoryProductsListSlot;
