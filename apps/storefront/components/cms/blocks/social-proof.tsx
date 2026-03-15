import type { SocialProofBlock } from "lib/types";
import { registerBlockRenderer } from "../block-registry";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < rating
              ? "text-yellow-400"
              : "text-neutral-300 dark:text-neutral-600"
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SocialProof({ block }: { block: SocialProofBlock }) {
  if (!block.testimonials.length) return null;

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">{block.heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {block.testimonials.map((t, i) => (
          <blockquote
            key={i}
            className="flex flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-black"
          >
            <StarRating rating={t.rating} />
            <p className="text-sm italic text-neutral-700 dark:text-neutral-300">
              &ldquo;{t.quote}&rdquo;
            </p>
            <cite className="mt-auto text-sm font-semibold not-italic text-black dark:text-white">
              — {t.author}
            </cite>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

registerBlockRenderer("social-proof", SocialProof);
export default SocialProof;
