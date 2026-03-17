"use client";

import type { CartUxMode } from "lib/types";
import { createContext, useContext, type ReactNode } from "react";

export type CartUxConfig = {
  mode: CartUxMode;
  cartPath: string;
  openCartOnAdd: boolean;
};

const DEFAULT_CART_UX_CONFIG: CartUxConfig = {
  mode: "drawer",
  cartPath: "/cart",
  openCartOnAdd: true,
};

const CartUxContext = createContext<CartUxConfig>(DEFAULT_CART_UX_CONFIG);

export function CartUxProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: CartUxConfig;
}) {
  return (
    <CartUxContext.Provider value={value}>{children}</CartUxContext.Provider>
  );
}

export function useCartUx() {
  return useContext(CartUxContext);
}
