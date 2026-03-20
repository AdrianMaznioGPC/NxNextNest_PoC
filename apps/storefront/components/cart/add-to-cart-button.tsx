"use client";

import { Button } from "@commerce/ui";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { addItem } from "components/cart/actions";
import type { ListingProduct } from "lib/types";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { useCart } from "./cart-context";

interface AddToCartButtonProps {
  product: ListingProduct;
}

/**
 * Compact add-to-cart button for product cards on listing pages.
 * Each ListingProduct is a single variant, so we can add directly
 * without needing a variant selector.
 */
export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addCartItem } = useCart();
  const t = useTranslations("cart");
  const [message, formAction] = useActionState(addItem, null);

  if (!product.purchasable) {
    return null;
  }

  const addItemAction = formAction.bind(null, product.variantId);

  // Build the variant and product objects expected by addCartItem
  const variant = {
    id: product.variantId,
    title: product.variantTitle,
    selectedOptions: product.selectedOptions,
    purchasable: product.purchasable,
    stockStatus: product.stockStatus,
    stockMessage: product.stockMessage,
    price: product.price,
  };

  const cartProduct = {
    id: product.productId,
    handle: product.productHandle,
    title: product.productTitle,
    description: product.description,
    descriptionHtml: "",
    options: [],
    featuredImage: product.featuredImage,
    images: [product.featuredImage],
    seo: { title: product.productTitle, description: product.description },
    tags: [],
    updatedAt: product.updatedAt,
    purchasable: product.purchasable,
    stockStatus: product.stockStatus,
    stockMessage: product.stockMessage,
    priceRange: {
      minVariantPrice: product.price,
      maxVariantPrice: product.price,
    },
    variants: [variant],
  };

  return (
    <form
      action={async () => {
        addCartItem(variant, cartProduct);
        addItemAction();
      }}
    >
      <Button
        type="submit"
        size="sm"
        className="w-full rounded-full"
        aria-label={t("addToCart")}
      >
        <ShoppingCartIcon className="h-4 w-4" />
        {t("addToCart")}
      </Button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
