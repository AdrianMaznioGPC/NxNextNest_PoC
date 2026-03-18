"use client";

import { type StoreConfig, stores } from "@commerce/store-config";
import {
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuPopup,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from "@commerce/ui";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

const storeList = Object.values(stores);

export function StoreSwitcher({ currentCode }: { currentCode: string }) {
  const current = stores[currentCode] ?? storeList[0]!;
  const t = useTranslations("storeSwitcher");

  function switchStore(store: StoreConfig) {
    if (store.storeCode === currentCode) return;
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${store.domain}${window.location.pathname}`;
  }

  return (
    <DropdownMenuRoot>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">
          {current.storeCode.toUpperCase()}
        </span>
        <ChevronDownIcon className="h-3.5 w-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuPositioner align="end">
          <DropdownMenuPopup className="min-w-[200px]">
            <DropdownMenuGroup>
              <DropdownMenuGroupLabel className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {t("countryRegion")}
              </DropdownMenuGroupLabel>
              {storeList.map((store) => (
                <DropdownMenuItem
                  key={store.storeCode}
                  className="gap-3 py-2.5"
                  onClick={() => switchStore(store)}
                >
                  <span className="text-lg leading-none">{store.flag}</span>
                  <span className="flex-1">
                    {store.label}
                    <span className="ml-1 text-muted-foreground">
                      ({store.currencySymbol} {store.currency})
                    </span>
                  </span>
                  {store.storeCode === currentCode && (
                    <svg
                      className="h-4 w-4 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuPopup>
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  );
}
