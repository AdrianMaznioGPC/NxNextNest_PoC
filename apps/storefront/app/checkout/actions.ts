"use server";

import { createAddress, getStoreCode } from "lib/api";
import type { SavedAddress } from "lib/types";

export async function saveNewAddress(
  values: Record<string, string>,
  label: string,
): Promise<SavedAddress> {
  const storeCode = await getStoreCode();
  return createAddress(storeCode, {
    label,
    values,
    isDefaultShipping: false,
    isDefaultBilling: false,
  });
}
