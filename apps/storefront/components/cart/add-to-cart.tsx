"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Product, ProductVariant } from "lib/types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useCartMutations } from "./use-cart-mutations";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  pending,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  pending: boolean;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-control bg-primary p-4 tracking-wide text-primary-foreground";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": !pending,
        [disabledClasses]: pending,
      })}
      disabled={pending}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {pending ? "Adding..." : "Add To Cart"}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addItem, isMutating } = useCartMutations();
  const [message, setMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  const pending = isMutating;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!selectedVariantId || !finalVariant) {
          setMessage("Error adding item to cart");
          return;
        }
        void (async () => {
          try {
            await addItem(finalVariant, product, 1);
            setMessage(null);
          } catch {
            setMessage("Error adding item to cart");
          }
        })();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        pending={pending}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message ?? ""}
      </p>
    </form>
  );
}
