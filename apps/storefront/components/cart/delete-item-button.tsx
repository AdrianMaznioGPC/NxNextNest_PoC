"use client";

import { IconButton } from "@commerce/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/types";
import { useTranslations } from "next-intl";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: (merchandiseId: string, action: "delete") => void;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const t = useTranslations("cart");
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate(merchandiseId, "delete");
        removeItemAction();
      }}
    >
      <IconButton
        type="submit"
        size="sm"
        aria-label={t("removeItem")}
        className="h-6 w-6 rounded-full bg-neutral-500 text-white hover:bg-neutral-600 dark:text-black"
      >
        <XMarkIcon className="h-4 w-4" />
      </IconButton>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
