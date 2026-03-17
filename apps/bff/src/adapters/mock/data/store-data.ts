import { defaultStoreCode } from "@commerce/store-config";

/**
 * Retrieves store-specific data from a store-keyed map, falling back to
 * the default store's data if the requested store code is not found.
 */
export function getStoreData<T>(
  map: Record<string, T>,
  storeCode: string,
): T {
  return map[storeCode] ?? map[defaultStoreCode]!;
}
