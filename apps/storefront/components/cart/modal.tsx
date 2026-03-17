"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { subscribeCartOpenEvent } from "components/cart/cart-events";
import { ensureCartClient } from "components/cart/client-api";
import { useCart } from "components/cart/cart-context";
import { CartView } from "components/cart/cart-view";
import { useT } from "lib/i18n/messages-context";
import { Fragment, useEffect, useState } from "react";
import OpenCart from "./open-cart";

export type CartModalProps = {
  initialOpen?: boolean;
  hideTrigger?: boolean;
};

export default function CartModal({
  initialOpen = false,
  hideTrigger = false,
}: CartModalProps) {
  const t = useT("cart");
  const { cart } = useCart();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      void ensureCartClient();
    }
  }, [cart]);

  useEffect(() => subscribeCartOpenEvent(openCart), []);

  return (
    <>
      {!hideTrigger ? (
        <button aria-label="Open cart" onClick={openCart}>
          <OpenCart quantity={cart?.totalQuantity} />
        </button>
      ) : null}

      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-neutral-200 bg-white/80 p-6 text-black backdrop-blur-xl md:w-[390px]">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">{t("title")}</p>
                <button aria-label="Close cart" onClick={closeCart}>
                  <CloseCart />
                </button>
              </div>
              <CartView mode="drawer" onNavigate={closeCart} />
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-control border border-neutral-200 text-black transition-colors">
      <XMarkIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}
