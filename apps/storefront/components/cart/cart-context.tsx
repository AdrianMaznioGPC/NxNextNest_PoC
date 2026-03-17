"use client";

import type { Cart, CartItem, Product, ProductVariant } from "lib/types";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  use,
  useContext,
  useMemo,
} from "react";

export type CartAction =
  | {
      type: "SET_ITEM_QUANTITY";
      payload: { merchandiseId: string; quantity: number };
    }
  | {
      type: "REMOVE_ITEM";
      payload: { merchandiseId: string };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product; quantity: number };
    };

type CartContextType = {
  cart: Cart;
  isMutating: boolean;
  applyOptimistic: (action: CartAction) => void;
  replaceCart: (nextCart: Cart | undefined) => void;
  rollbackCart: (previousCart: Cart | undefined) => void;
  getCartSnapshot: () => Cart;
  runSerializedMutation: <T>(operation: () => Promise<T>) => Promise<T>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function setCartItemQuantity(item: CartItem, quantity: number): CartItem | null {
  if (quantity <= 0) return null;

  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  const newTotalAmount = calculateItemCost(
    quantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
  deltaQuantity: number,
): CartItem {
  const quantity = Math.max(0, (existingItem?.quantity ?? 0) + deltaQuantity);
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        path: product.path,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

function emptyCartLike(currentCart: Cart): Cart {
  const currencyCode = currentCart.cost.totalAmount.currencyCode || "USD";
  return {
    ...currentCart,
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode },
      totalAmount: { amount: "0", currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "SET_ITEM_QUANTITY": {
      const { merchandiseId, quantity } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? setCartItemQuantity(item, quantity)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return emptyCartLike(currentCart);
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "REMOVE_ITEM": {
      const { merchandiseId } = action.payload;
      const updatedLines = currentCart.lines.filter(
        (item) => item.merchandise.id !== merchandiseId,
      );

      if (updatedLines.length === 0) {
        return emptyCartLike(currentCart);
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product, quantity } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
        quantity,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  const initialCart = normalizeCart(use(cartPromise));
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isMutating, setIsMutating] = useState(false);
  const cartRef = useRef(cart);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const pendingMutationsRef = useRef(0);

  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const setCartState = useCallback(
    (next: Cart | ((prev: Cart) => Cart)) => {
      setCart((previous) => {
        const resolved =
          typeof next === "function"
            ? (next as (prev: Cart) => Cart)(previous)
            : next;
        cartRef.current = resolved;
        return resolved;
      });
    },
    [],
  );

  const applyOptimistic = useCallback(
    (action: CartAction) => {
      setCartState((previous) => cartReducer(previous, action));
    },
    [setCartState],
  );

  const replaceCart = useCallback(
    (nextCart: Cart | undefined) => {
      setCartState(normalizeCart(nextCart));
    },
    [setCartState],
  );

  const rollbackCart = useCallback(
    (previousCart: Cart | undefined) => {
      setCartState(normalizeCart(previousCart));
    },
    [setCartState],
  );

  const getCartSnapshot = useCallback(() => cloneCart(cartRef.current), []);

  const runSerializedMutation = useCallback(
    <T,>(operation: () => Promise<T>): Promise<T> => {
      const task = new Promise<T>((resolve, reject) => {
        queueRef.current = queueRef.current
          .catch(() => undefined)
          .then(async () => {
            pendingMutationsRef.current += 1;
            setIsMutating(true);
            try {
              const result = await operation();
              resolve(result);
            } catch (error) {
              reject(error);
            } finally {
              pendingMutationsRef.current -= 1;
              if (pendingMutationsRef.current === 0) {
                setIsMutating(false);
              }
            }
          });
      });
      return task;
    },
    [],
  );

  const value = useMemo(
    () => ({
      cart,
      isMutating,
      applyOptimistic,
      replaceCart,
      rollbackCart,
      getCartSnapshot,
      runSerializedMutation,
    }),
    [
      cart,
      isMutating,
      applyOptimistic,
      replaceCart,
      rollbackCart,
      getCartSnapshot,
      runSerializedMutation,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}

function normalizeCart(cart: Cart | undefined): Cart {
  return cart ? cloneCart(cart) : createEmptyCart();
}

function cloneCart(cart: Cart): Cart {
  return {
    ...cart,
    lines: cart.lines.map((line) => ({
      ...line,
      cost: {
        ...line.cost,
        totalAmount: { ...line.cost.totalAmount },
      },
      merchandise: {
        ...line.merchandise,
        selectedOptions: line.merchandise.selectedOptions.map((option) => ({
          ...option,
        })),
        product: {
          ...line.merchandise.product,
          featuredImage: { ...line.merchandise.product.featuredImage },
        },
      },
    })),
    cost: {
      subtotalAmount: { ...cart.cost.subtotalAmount },
      totalAmount: { ...cart.cost.totalAmount },
      totalTaxAmount: { ...cart.cost.totalTaxAmount },
    },
  };
}
