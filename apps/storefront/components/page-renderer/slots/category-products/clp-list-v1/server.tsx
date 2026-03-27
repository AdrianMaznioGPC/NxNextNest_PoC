import Container from "components/layout/container";
import { ListingContainer } from "components/layout/listing-container";
import type { SlotRenderer } from "../../../slot-types";

const CategoryProductsListSlot: SlotRenderer<"page.category-products"> = ({
  products,
  sortOptions,
  filterGroups,
  containerClassName,
}) => {
  return (
    <Container className={containerClassName ?? "pb-8"}>
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

export default CategoryProductsListSlot;
