"use client";

import type { WinterEffectsBlock } from "lib/types";
import dynamic from "next/dynamic";

const Snowfall = dynamic(() => import("react-snowfall"), { ssr: false });

export default function WinterEffects({
  block,
}: {
  block: WinterEffectsBlock;
}) {
  const {
    snowflakeCount = 150,
    speed = [0.5, 3.0],
    wind = [-0.5, 2.0],
    radius = [0.5, 3.0],
  } = block;

  return (
    <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
      <Snowfall
        snowflakeCount={snowflakeCount}
        speed={speed}
        wind={wind}
        radius={radius}
      />
    </div>
  );
}
