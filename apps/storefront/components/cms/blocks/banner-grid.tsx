import type { BannerGridBlock } from "lib/types";
import { BannerCard } from "./cms-banner";

const columnClasses: Record<number, string> = {
  1: "grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

function BannerGrid({ block }: { block: BannerGridBlock }) {
  if (!block.banners.length) return null;

  const cols = columnClasses[block.columns] ?? "md:grid-cols-2";

  return (
    <section className={`grid gap-4 ${cols}`}>
      {block.banners.map((banner, i) => (
        <BannerCard key={i} banner={banner} />
      ))}
    </section>
  );
}

export default BannerGrid;
