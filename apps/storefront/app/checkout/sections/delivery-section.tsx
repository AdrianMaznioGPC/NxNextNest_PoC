"use client";

import clsx from "clsx";
import Price from "components/price";
import type { DeliveryOption } from "lib/types";
import { useTranslations } from "next-intl";

interface DeliverySectionProps {
  options: DeliveryOption[];
  selected: string;
  onSelect: (id: string) => void;
}

export function DeliverySection({
  options,
  selected,
  onSelect,
}: DeliverySectionProps) {
  const t = useTranslations("checkout");

  return (
    <fieldset>
      <legend className="mb-4 text-lg font-semibold">
        {t("deliveryMethod")}
      </legend>
      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selected === option.id;

          return (
            <label
              key={option.id}
              className={clsx(
                "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors",
                isSelected
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                  : "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-black dark:hover:border-neutral-700",
              )}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={isSelected}
                  onChange={() => onSelect(option.id)}
                  className="h-4 w-4 border-neutral-300 text-blue-600"
                />
                <div>
                  <p className="text-sm font-medium text-black dark:text-white">
                    {t(option.labelKey)}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {t(option.descriptionKey)}
                  </p>
                </div>
              </div>
              <Price
                className="text-sm font-medium text-black dark:text-white"
                amount={option.price.amount}
                currencyCode={option.price.currencyCode}
              />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
