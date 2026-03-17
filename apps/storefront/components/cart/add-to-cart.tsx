"use client";

import { cn } from "@commerce/ui";
import { PlusIcon } from "@heroicons/react/24/outline";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

function SubmitButton({
  purchasable,
  stockMessage,
  selectedVariantId,
}: {
  purchasable: boolean;
  stockMessage: string;
  selectedVariantId: string | undefined;
}) {
  const t = useTranslations("cart");
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!purchasable) {
    return (
      <button disabled className={cn(buttonClasses, disabledClasses)}>
        {stockMessage}
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label={t("addToCart")}
        disabled
        className={cn(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        {t("addToCart")}
      </button>
    );
  }

  return (
    <button
      aria-label={t("addToCart")}
      className={cn(buttonClasses, "hover:opacity-90")}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      {t("addToCart")}
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, purchasable, stockMessage } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        purchasable={purchasable}
        stockMessage={stockMessage}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
