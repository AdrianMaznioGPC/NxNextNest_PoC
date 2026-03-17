import { BlockRenderer } from "components/cms/block-renderer";
import Container from "components/layout/container";
import type { NodeRenderer } from "../node-types";

export const HomeNode: NodeRenderer<"home"> = ({ node }) => (
  <Container className={node.containerClassName}>
    <BlockRenderer blocks={node.blocks} />
  </Container>
);
