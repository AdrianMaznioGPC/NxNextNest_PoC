import type { RichTextBlock } from "lib/types";
import Prose from "components/prose";
import { registerBlockRenderer } from "../block-registry";

function RichText({ block }: { block: RichTextBlock }) {
  return (
    <section>
      <Prose html={block.html} />
    </section>
  );
}

registerBlockRenderer("rich-text", RichText);
export default RichText;
