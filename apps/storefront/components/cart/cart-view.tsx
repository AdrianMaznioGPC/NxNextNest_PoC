"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { useT } from "lib/i18n/messages-context";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";

type CartViewMode = "drawer" | "page";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export function CartView({
  mode = "drawer",
  onNavigate,
}: {
  mode?: CartViewMode;
  onNavigate?: () => void;
}) {
  const t = useT("cart");
  const { cart } = useCart();
  const wrapperClassName =
    mode === "drawer"
      ? "flex h-full flex-col justify-between overflow-hidden p-1"
      : "flex flex-col gap-6";
  const listClassName =
    mode === "drawer"
      ? "grow overflow-auto py-4"
      : "divide-y divide-neutral-300";
  const totalsClassName =
    mode === "drawer"
      ? "py-4 text-sm text-neutral-500"
      : "text-sm text-neutral-500";

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <ShoppingCartIcon className="h-16" />
        <p className="mt-6 text-center text-2xl font-bold">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <ul className={listClassName}>
        {cart.lines
          .sort((a, b) =>
            a.merchandise.product.title.localeCompare(
              b.merchandise.product.title,
            ),
          )
          .map((item, index) => {
            const merchandiseSearchParams = {} as MerchandiseSearchParams;

            item.merchandise.selectedOptions.forEach(({ name, value }) => {
              if (value !== DEFAULT_OPTION) {
                merchandiseSearchParams[name.toLowerCase()] = value;
              }
            });

            const merchandiseUrl = createUrl(
              item.merchandise.product.path,
              new URLSearchParams(merchandiseSearchParams),
            );

            return (
              <li
                key={item.id ?? `${item.merchandise.id}-${index}`}
                className="flex w-full flex-col border-b border-neutral-300"
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-1 -mt-2">
                    <DeleteItemButton item={item} />
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage.url}
                      />
                    </div>
                    <Link
                      href={merchandiseUrl}
                      onClick={onNavigate}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">
                          {item.merchandise.product.title}
                        </span>
                        {item.merchandise.title !== DEFAULT_OPTION ? (
                          <p className="text-sm text-neutral-500">
                            {item.merchandise.title}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right text-sm"
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center rounded-control border border-neutral-200">
                      <EditItemQuantityButton item={item} type="minus" />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">{item.quantity}</span>
                      </p>
                      <EditItemQuantityButton item={item} type="plus" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <div className={totalsClassName}>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1">
          <p>{t("taxes")}</p>
          <Price
            className="text-right text-base text-black"
            amount={cart.cost.totalTaxAmount.amount}
            currencyCode={cart.cost.totalTaxAmount.currencyCode}
          />
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
          <p>{t("shipping")}</p>
          <p className="text-right">{t("shippingAtCheckout")}</p>
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1">
          <p>{t("total")}</p>
          <Price
            className="text-right text-base text-black"
            amount={cart.cost.totalAmount.amount}
            currencyCode={cart.cost.totalAmount.currencyCode}
          />
        </div>
      </div>
      <form action={redirectToCheckout}>
        <CheckoutButton />
      </form>
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();
  const t = useT("cart");

  return (
    <button
      className="block w-full rounded-control bg-primary p-3 text-center text-sm font-medium text-primary-foreground opacity-90 hover:opacity-100"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : t("checkout")}
    </button>
  );
}
