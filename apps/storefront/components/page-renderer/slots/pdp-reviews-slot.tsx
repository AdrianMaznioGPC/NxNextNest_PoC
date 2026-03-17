import Container from "components/layout/container";
import type { SlotRenderer } from "../slot-types";

const PdpReviewsSlot: SlotRenderer<"page.pdp-reviews"> = ({ reviews }) => {
  if (!reviews.length) return null;

  return (
    <Container className="py-8">
      <section className="rounded-lg border border-neutral-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-bold">Customer reviews</h2>
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
              <p className="text-sm text-neutral-600">
                {"★".repeat(review.rating)}
                <span className="ml-2 font-medium">{review.author}</span>
              </p>
              <p className="mt-1 font-semibold">{review.title}</p>
              <p className="mt-1 text-sm text-neutral-700">{review.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
};

export default PdpReviewsSlot;
