"use client";

import { cn } from "@commerce/ui";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import type { SavedAddress } from "lib/types";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

interface AddressPickerProps {
  addresses: SavedAddress[];
  selectedId: string | null;
  onSelect: (address: SavedAddress | null) => void;
}

function formatSummary(values: Record<string, string>): string {
  const parts = [
    values.address,
    [values.postalCode, values.city].filter(Boolean).join(" "),
  ].filter(Boolean);
  return parts.join(", ");
}

function useScrollOverflow(ref: React.RefObject<HTMLDivElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [ref, update]);

  return { canScrollLeft, canScrollRight };
}

function ScrollButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute top-1/2 z-10 -translate-y-1/2 rounded-full border border-neutral-200 bg-white/90 p-1.5 shadow-sm backdrop-blur-sm transition-opacity hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-800",
        direction === "left" ? "left-0" : "right-0",
      )}
      aria-label={`Scroll ${direction}`}
    >
      {direction === "left" ? (
        <ChevronLeftIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      ) : (
        <ChevronRightIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
      )}
    </button>
  );
}

export function AddressPicker({
  addresses,
  selectedId,
  onSelect,
}: AddressPickerProps) {
  const t = useTranslations("checkout");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight } = useScrollOverflow(scrollRef);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  if (addresses.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {t("savedAddresses")}
      </p>
      <div className="relative min-w-0">
        {canScrollLeft && (
          <ScrollButton direction="left" onClick={() => scroll("left")} />
        )}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
        >
          {addresses.map((address) => {
            const isSelected = selectedId === address.id;

            return (
              <button
                key={address.id}
                type="button"
                onClick={() => onSelect(address)}
                className={cn(
                  "flex min-w-[140px] max-w-[220px] shrink-0 flex-col rounded-lg border p-3 text-left transition-colors sm:min-w-[180px]",
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700",
                )}
              >
                <span className="text-sm font-medium text-black dark:text-white">
                  {address.label}
                </span>
                <span className="mt-1 line-clamp-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {formatSummary(address.values)}
                </span>
                {(address.isDefaultShipping || address.isDefaultBilling) && (
                  <span className="mt-2 text-[10px] font-medium uppercase tracking-wide text-blue-600">
                    {address.isDefaultShipping && address.isDefaultBilling
                      ? t("defaultShippingAndBilling")
                      : address.isDefaultShipping
                        ? t("defaultShipping")
                        : t("defaultBilling")}
                  </span>
                )}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onSelect(null)}
            className={cn(
              "flex min-w-[140px] shrink-0 flex-col items-center justify-center rounded-lg border p-3 transition-colors sm:min-w-[180px]",
              selectedId === null
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-dashed border-neutral-300 bg-white hover:border-neutral-400 dark:border-neutral-700 dark:bg-black dark:hover:border-neutral-600",
            )}
          >
            <PlusIcon className="h-5 w-5 text-neutral-500 dark:text-neutral-400" />
            <span className="mt-1 text-sm font-medium text-neutral-600 dark:text-neutral-300">
              {t("newAddress")}
            </span>
          </button>
        </div>

        {canScrollRight && (
          <ScrollButton direction="right" onClick={() => scroll("right")} />
        )}
      </div>
    </div>
  );
}
