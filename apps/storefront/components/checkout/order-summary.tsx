"use client";

import Price from "components/price";
import { useT } from "lib/i18n/messages-context";
import type { Cart, Money } from "lib/types";
import Image from "next/image";
import { useMemo } from "react";

interface OrderSummaryProps {
  cart: Cart;
  shippingCost: Money;
}

function OrderSummaryLineItem({ item }: { item: Cart["lines"][number] }) {
  return (
    <li className="flex gap-4 py-3">
      <div className="relative h-16 w-16 flex-none rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900">
        <Image
          src={item.merchandise.product.featuredImage.url}
          alt={
            item.merchandise.product.featuredImage.altText ||
            item.merchandise.product.title
          }
          width={64}
          height={64}
          className="h-full w-full rounded-md object-cover"
        />
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-medium text-white dark:bg-neutral-200 dark:text-black">
          {item.quantity}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <p className="text-sm font-medium">{item.merchandise.product.title}</p>
        {item.merchandise.title !== "Default Title" && (
          <p className="text-xs text-neutral-500">{item.merchandise.title}</p>
        )}
      </div>
      <Price
        className="flex items-center text-sm font-medium"
        amount={item.cost.totalAmount.amount}
        currencyCode={item.cost.totalAmount.currencyCode}
      />
    </li>
  );
}

export function OrderSummary({ cart, shippingCost }: OrderSummaryProps) {
  const t = useT("checkout");

  const totalAmount = useMemo(() => {
    const cartTotal = parseFloat(cart.cost.totalAmount.amount);
    const shipping = parseFloat(shippingCost.amount);
    return (cartTotal + shipping).toFixed(2);
  }, [cart.cost.totalAmount.amount, shippingCost.amount]);

  const currencyCode =
    cart.cost.totalAmount.currencyCode || shippingCost.currencyCode;

  return (
    <div className="lg:sticky lg:top-8">
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800">
        <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
          <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
        </div>
        <div className="px-6">
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {cart.lines
              .sort((a, b) =>
                a.merchandise.product.title.localeCompare(
                  b.merchandise.product.title,
                ),
              )
              .map((item, i) => (
                <OrderSummaryLineItem key={i} item={item} />
              ))}
          </ul>

          <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{t("subtotal")}</span>
              <Price
                amount={cart.cost.subtotalAmount.amount}
                currencyCode={cart.cost.subtotalAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{t("taxes")}</span>
              <Price
                amount={cart.cost.totalTaxAmount.amount}
                currencyCode={cart.cost.totalTaxAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>{t("shipping")}</span>
              <Price
                amount={shippingCost.amount}
                currencyCode={shippingCost.currencyCode}
              />
            </div>
          </div>

          <hr className="my-4 border-neutral-200 dark:border-neutral-800" />

          <div className="flex justify-between pb-6">
            <span className="text-base font-semibold">{t("total")}</span>
            <Price
              className="text-base font-semibold"
              amount={totalAmount}
              currencyCode={currencyCode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
