import Prose from "components/prose";
import type { RichTextBlock } from "lib/types";

function RichText({ block }: { block: RichTextBlock }) {
  return (
    <section>
      <Prose html={block.html} />
    </section>
  );
}

export default RichText;
