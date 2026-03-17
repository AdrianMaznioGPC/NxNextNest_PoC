import { CartView } from "components/cart/cart-view";
import Container from "components/layout/container";
import type { NodeRenderer } from "../node-types";

export const CartPageNode: NodeRenderer<"cart-page"> = ({ node }) => {
  return (
    <Container className={node.containerClassName}>
      <div className="mx-auto w-full max-w-5xl py-8">
        <h1 className="text-3xl font-semibold tracking-tight">{node.title}</h1>
        {node.description ? (
          <p className="mt-2 text-muted">{node.description}</p>
        ) : null}
        <div className="mt-8 rounded-lg border border-neutral-200 bg-white p-6">
          <CartView mode="page" />
        </div>
      </div>
    </Container>
  );
};
