"use client";

import type { Product, ProductVariant } from "lib/types";
import { useCallback } from "react";
import {
  addToCartClient,
  removeFromCartClient,
  updateCartClient,
} from "./client-api";
import { useCart } from "./cart-context";

export function useCartMutations() {
  const {
    isMutating,
    applyOptimistic,
    replaceCart,
    rollbackCart,
    getCartSnapshot,
    runSerializedMutation,
  } = useCart();

  const addItem = useCallback(
    (variant: ProductVariant, product: Product, quantity = 1) =>
      runSerializedMutation(async () => {
        const previous = getCartSnapshot();

        applyOptimistic({
          type: "ADD_ITEM",
          payload: { variant, product, quantity },
        });

        try {
          const nextCart = await addToCartClient(variant.id, quantity);
          replaceCart(nextCart);
          return nextCart;
        } catch (error) {
          rollbackCart(previous);
          throw error;
        }
      }),
    [
      runSerializedMutation,
      getCartSnapshot,
      applyOptimistic,
      replaceCart,
      rollbackCart,
    ],
  );

  const updateItem = useCallback(
    (merchandiseId: string, quantity: number) =>
      runSerializedMutation(async () => {
        const previous = getCartSnapshot();

        applyOptimistic({
          type: "SET_ITEM_QUANTITY",
          payload: { merchandiseId, quantity },
        });

        try {
          const nextCart = await updateCartClient(merchandiseId, quantity);
          replaceCart(nextCart);
          return nextCart;
        } catch (error) {
          rollbackCart(previous);
          throw error;
        }
      }),
    [
      runSerializedMutation,
      getCartSnapshot,
      applyOptimistic,
      replaceCart,
      rollbackCart,
    ],
  );

  const removeItem = useCallback(
    (merchandiseId: string) =>
      runSerializedMutation(async () => {
        const previous = getCartSnapshot();

        applyOptimistic({
          type: "REMOVE_ITEM",
          payload: { merchandiseId },
        });

        try {
          const nextCart = await removeFromCartClient(merchandiseId);
          replaceCart(nextCart);
          return nextCart;
        } catch (error) {
          rollbackCart(previous);
          throw error;
        }
      }),
    [
      runSerializedMutation,
      getCartSnapshot,
      applyOptimistic,
      replaceCart,
      rollbackCart,
    ],
  );

  return {
    isMutating,
    addItem,
    updateItem,
    removeItem,
  };
}
