import { Prose } from "@commerce/ui";
import type { RichTextBlock } from "lib/types";

function RichText({ block }: { block: RichTextBlock }) {
  return (
    <section>
      <Prose html={block.html} />
    </section>
  );
}

export default RichText;
