import { defaultStoreCode, stores } from "@commerce/store-config";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { STORE_CONTEXT_KEY } from "./store.middleware";

const defaults = stores[defaultStoreCode]!;

@Injectable({ scope: Scope.REQUEST })
export class StoreContext {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  get storeCode(): string {
    return this.request?.[STORE_CONTEXT_KEY]?.storeCode ?? defaults.storeCode;
  }

  get locale(): string {
    return this.request?.[STORE_CONTEXT_KEY]?.locale ?? defaults.locale;
  }

  get currency(): string {
    return this.request?.[STORE_CONTEXT_KEY]?.currency ?? defaults.currency;
  }

  get customerId(): string | undefined {
    return this.request?.[STORE_CONTEXT_KEY]?.customerId;
  }

  get isAuthenticated(): boolean {
    return this.customerId !== undefined;
  }
}
