import Prose from "components/prose";
import type { RichTextBlock } from "lib/types";

export default function RichText({ block }: { block: RichTextBlock }) {
  return (
    <section>
      <Prose html={block.html} />
    </section>
  );
}
