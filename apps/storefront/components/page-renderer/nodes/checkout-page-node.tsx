import Container from "components/layout/container";
import { CheckoutOrchestrator } from "app/checkout/checkout-orchestrator";
import type { NodeRenderer } from "../node-types";

export const CheckoutPageNode: NodeRenderer<"checkout-page"> = ({ node }) => {
  return (
    <Container className={node.containerClassName}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CheckoutOrchestrator cart={node.cart} config={node.config} />
      </div>
    </Container>
  );
};
