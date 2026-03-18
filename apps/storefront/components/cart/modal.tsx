"use client";

import {
  Button,
  DrawerBackdrop,
  DrawerClose,
  DrawerPopup,
  DrawerRoot,
  IconButton,
  LoadingDots,
  Price,
  Separator,
} from "@commerce/ui";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl, productUrl } from "lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const t = useTranslations("cart");
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <OpenCart
        quantity={cart?.totalQuantity}
        onClick={openCart}
        aria-label={t("openCart")}
      />
      <DrawerRoot open={isOpen} onOpenChange={setIsOpen}>
        <DrawerBackdrop />
        <DrawerPopup
          side="right"
          className="flex flex-col bg-white/80 backdrop-blur-xl md:max-w-[390px] dark:bg-black/80"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">{t("myCart")}</p>
            <DrawerClose
              render={
                <IconButton size="lg" aria-label={t("closeCart")}>
                  <XMarkIcon className="h-6" />
                </IconButton>
              }
            />
          </div>

          {!cart || cart.lines.length === 0 ? (
            <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
              <ShoppingCartIcon className="h-16" />
              <p className="mt-6 text-center text-2xl font-bold">
                {t("empty")}
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col justify-between overflow-hidden p-1">
              <ul className="grow overflow-auto py-4">
                {cart.lines
                  .sort((a, b) =>
                    a.merchandise.product.title.localeCompare(
                      b.merchandise.product.title,
                    ),
                  )
                  .map((item, i) => {
                    const merchandiseSearchParams =
                      {} as MerchandiseSearchParams;

                    item.merchandise.selectedOptions.forEach(
                      ({ name, value }) => {
                        if (value !== DEFAULT_OPTION) {
                          merchandiseSearchParams[name.toLowerCase()] = value;
                        }
                      },
                    );

                    const merchandiseUrl = createUrl(
                      productUrl(item.merchandise.product),
                      new URLSearchParams(merchandiseSearchParams),
                    );

                    return (
                      <li key={i} className="flex w-full flex-col">
                        <div className="relative flex w-full flex-row justify-between px-1 py-4">
                          <div className="absolute z-40 -ml-1 -mt-2">
                            <DeleteItemButton
                              item={item}
                              optimisticUpdate={updateCartItem}
                            />
                          </div>
                          <div className="flex flex-row">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                              <Image
                                className="h-full w-full object-cover"
                                width={64}
                                height={64}
                                alt={
                                  item.merchandise.product.featuredImage
                                    .altText || item.merchandise.product.title
                                }
                                src={item.merchandise.product.featuredImage.url}
                              />
                            </div>
                            <Link
                              href={merchandiseUrl}
                              onClick={closeCart}
                              className="z-30 ml-2 flex flex-row space-x-4"
                            >
                              <div className="flex flex-1 flex-col text-base">
                                <span className="leading-tight">
                                  {item.merchandise.product.title}
                                </span>
                                {item.merchandise.title !== DEFAULT_OPTION ? (
                                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
                            <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                              <EditItemQuantityButton
                                item={item}
                                type="minus"
                                optimisticUpdate={updateCartItem}
                              />
                              <p className="w-6 text-center">
                                <span className="w-full text-sm">
                                  {item.quantity}
                                </span>
                              </p>
                              <EditItemQuantityButton
                                item={item}
                                type="plus"
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </li>
                    );
                  })}
              </ul>
              <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="mb-3 flex items-center justify-between pb-1">
                  <p>{t("taxes")}</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.cost.totalTaxAmount.amount}
                    currencyCode={cart.cost.totalTaxAmount.currencyCode}
                  />
                </div>
                <Separator />
                <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                  <p>{t("shipping")}</p>
                  <p className="text-right">{t("shippingCalculated")}</p>
                </div>
                <Separator />
                <div className="mb-3 flex items-center justify-between pb-1 pt-1">
                  <p>{t("total")}</p>
                  <Price
                    className="text-right text-base text-black dark:text-white"
                    amount={cart.cost.totalAmount.amount}
                    currencyCode={cart.cost.totalAmount.currencyCode}
                  />
                </div>
                <Separator />
              </div>
              <form action={redirectToCheckout}>
                <CheckoutButton />
              </form>
            </div>
          )}
        </DrawerPopup>
      </DrawerRoot>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();
  const t = useTranslations("cart");

  return (
    <Button
      className="w-full rounded-full"
      type="submit"
      disabled={pending}
      loading={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : t("checkout")}
    </Button>
  );
}
