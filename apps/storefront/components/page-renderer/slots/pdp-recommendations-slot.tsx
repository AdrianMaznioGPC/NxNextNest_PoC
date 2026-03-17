import Container from "components/layout/container";
import { RelatedProducts } from "../nodes/related-products";
import type { SlotRenderer } from "../slot-types";

const PdpRecommendationsSlot: SlotRenderer<"page.pdp-recommendations"> = ({
  products,
}) => {
  return (
    <Container>
      <RelatedProducts products={products} />
    </Container>
  );
};

export default PdpRecommendationsSlot;
