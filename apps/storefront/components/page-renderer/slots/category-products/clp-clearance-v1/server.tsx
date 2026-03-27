import Container from "components/layout/container";
import { ListingContainer } from "components/layout/listing-container";
import type { SlotRenderer } from "../../../slot-types";

const CategoryProductsClearanceSlot: SlotRenderer<"page.category-products"> = ({
  products,
  sortOptions,
  filterGroups,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "pb-8"}>
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2">
        <p className="text-sm font-medium text-red-900">
          Clearance Sale - Limited Stock
        </p>
      </div>

      <ListingContainer
        products={products}
        sortOptions={sortOptions}
        filterGroups={filterGroups}
        defaultView="list"
        showViewToggle={true}
        emptyMessage="No products found in this category"
      />
    </Container>
  );
};

export default CategoryProductsClearanceSlot;
