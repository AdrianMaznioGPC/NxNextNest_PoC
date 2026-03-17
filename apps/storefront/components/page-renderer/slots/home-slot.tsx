import type { SlotRenderer } from "../slot-types";
import { HomeNode } from "../nodes/home-node";

const HomeSlot: SlotRenderer<"page.home"> = (props) => {
  return <HomeNode node={{ type: "home", ...props }} />;
};

export default HomeSlot;
