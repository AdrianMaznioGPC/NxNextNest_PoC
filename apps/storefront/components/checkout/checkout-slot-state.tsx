"use client";

import type { Money } from "lib/types";
import { createContext, useContext, useMemo, useState } from "react";

type CheckoutSlotStateValue = {
  shippingCost: Money;
  selectedDeliveryId?: string;
  syncSelectedDelivery: (id: string, shippingCost: Money) => void;
};

const CheckoutSlotStateContext = createContext<CheckoutSlotStateValue | null>(null);

export function CheckoutSlotStateProvider({
  children,
  initialShippingCost,
}: {
  children: React.ReactNode;
  initialShippingCost: Money;
}) {
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | undefined>();
  const [shippingCost, setShippingCost] = useState(initialShippingCost);

  const value = useMemo<CheckoutSlotStateValue>(
    () => ({
      shippingCost,
      selectedDeliveryId,
      syncSelectedDelivery: (id, nextShippingCost) => {
        setSelectedDeliveryId(id);
        setShippingCost(nextShippingCost);
      },
    }),
    [selectedDeliveryId, shippingCost],
  );

  return (
    <CheckoutSlotStateContext.Provider value={value}>
      {children}
    </CheckoutSlotStateContext.Provider>
  );
}

export function useCheckoutSlotState() {
  const value = useContext(CheckoutSlotStateContext);
  if (!value) {
    throw new Error("Checkout slot state is not available");
  }
  return value;
}
