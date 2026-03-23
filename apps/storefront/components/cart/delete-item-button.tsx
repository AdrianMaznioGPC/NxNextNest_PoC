"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CartItem } from "lib/types";
import { useState } from "react";
import { useCartMutations } from "./use-cart-mutations";

export function DeleteItemButton({ item }: { item: CartItem }) {
  const [message, setMessage] = useState<string | null>(null);
  const { removeItem, isMutating } = useCartMutations();
  const merchandiseId = item.merchandise.id;
  const handleRemove = () => {
    void (async () => {
      try {
        await removeItem(merchandiseId);
        setMessage(null);
      } catch {
        setMessage("Error removing item from cart");
      }
    })();
  };

  return (
    <>
      <button
        type="button"
        aria-label="Remove cart item"
        onClick={handleRemove}
        disabled={isMutating}
        className="flex h-[24px] w-[24px] items-center justify-center rounded-control bg-primary text-primary-foreground"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </>
  );
}
