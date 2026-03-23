import { CheckoutSlotStateProvider } from "components/checkout/checkout-slot-state";
import { SlotBoundary } from "components/page-renderer/slot-boundary";
import type { Money, PageBootstrapModel, SlotManifest } from "lib/types";

function findSlot(slots: SlotManifest[], id: string) {
  return slots.find((slot) => slot.id === id);
}

function fallbackMoney(currencyCode: string): Money {
  return {
    amount: "0.00",
    currencyCode,
  };
}

export function CheckoutPageShell({
  bootstrap,
}: {
  bootstrap: PageBootstrapModel;
}) {
  const headerSlot = findSlot(bootstrap.slots, "slot:checkout-header");
  const mainSlot = findSlot(bootstrap.slots, "slot:checkout-main");
  const summarySlot = findSlot(bootstrap.slots, "slot:checkout-summary");
  const fallbackCurrency = bootstrap.page.localeContext?.currency ?? "USD";
  const initialShippingCost =
    summarySlot?.dataMode === "inline" && summarySlot.inlineProps
      ? ((summarySlot.inlineProps as { initialShippingCost?: Money })
          .initialShippingCost ?? fallbackMoney(fallbackCurrency))
      : fallbackMoney(fallbackCurrency);

  return (
    <CheckoutSlotStateProvider initialShippingCost={initialShippingCost}>
      {headerSlot ? <SlotBoundary slot={headerSlot} /> : null}
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <div className="min-w-0 lg:col-span-7">
          {mainSlot ? <SlotBoundary slot={mainSlot} /> : null}
        </div>
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          {summarySlot ? <SlotBoundary slot={summarySlot} /> : null}
        </div>
      </div>
    </CheckoutSlotStateProvider>
  );
}
