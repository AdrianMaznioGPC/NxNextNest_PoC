import Prose from "components/prose";
import type { RichTextBlock } from "lib/types";

export default function RichText({ block }: { block: RichTextBlock }) {
  return (
    <section className="py-8 px-4">
      <Prose html={block.html} />
    </section>
  );
}
