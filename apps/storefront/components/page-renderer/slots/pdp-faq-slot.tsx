import Container from "components/layout/container";
import type { SlotRenderer } from "../slot-types";

const PdpFaqSlot: SlotRenderer<"page.pdp-faq"> = ({ items }) => {
  if (!items.length) return null;

  return (
    <Container className="py-8">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">FAQ</h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={`${item.q}-${index}`}
              className="group rounded-md border border-neutral-200 px-4 py-3"
            >
              <summary className="cursor-pointer list-none font-medium">
                {item.q}
              </summary>
              <p className="pt-3 text-sm text-neutral-700">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default PdpFaqSlot;
