import Grid from "components/grid";
import Container from "components/layout/container";
import ProductGridItems from "components/layout/product-grid-items";
import type { SlotRenderer } from "../slot-types";

const SearchProductsSlot: SlotRenderer<"page.search-products"> = ({
  products,
}) => {
  return (
    <Container className="pb-8">
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : (
        <p className="text-sm text-neutral-700">No products found.</p>
      )}
    </Container>
  );
};

export default SearchProductsSlot;
