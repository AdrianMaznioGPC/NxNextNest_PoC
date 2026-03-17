import Container from "components/layout/container";
import Prose from "components/prose";
import type { NodeRenderer } from "../node-types";

export const ContentPageNode: NodeRenderer<"content-page"> = ({ node }) => (
  <Container className={node.containerClassName ?? "max-w-2xl py-20"}>
    <h1 className="mb-8 text-5xl font-bold">{node.page.title}</h1>
    <Prose className="mb-8" html={node.page.body} />
    <p className="text-sm italic">
      {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(node.page.updatedAt))}.`}
    </p>
  </Container>
);
