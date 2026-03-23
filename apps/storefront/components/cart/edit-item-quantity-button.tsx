"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { CartItem } from "lib/types";
import { useState } from "react";
import { useCartMutations } from "./use-cart-mutations";

function SubmitButton({
  type,
  onClick,
  disabled,
}: {
  type: "plus" | "minus";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-control p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        },
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4" />
      ) : (
        <MinusIcon className="h-4 w-4" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
}: {
  item: CartItem;
  type: "plus" | "minus";
}) {
  const [message, setMessage] = useState<string | null>(null);
  const { updateItem, isMutating } = useCartMutations();
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };
  const handleUpdate = () => {
    void (async () => {
      try {
        await updateItem(payload.merchandiseId, payload.quantity);
        setMessage(null);
      } catch {
        setMessage("Error updating item quantity");
      }
    })();
  };

  return (
    <>
      <SubmitButton type={type} onClick={handleUpdate} disabled={isMutating} />
      <p aria-live="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </>
  );
}
