import { defaultStoreCode, stores } from "@commerce/store-config";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

export const STORE_CONTEXT_KEY = "__storeContext";

@Injectable()
export class StoreInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const code = req.headers?.["x-store-code"] ?? defaultStoreCode;
    const config = stores[code] ?? stores[defaultStoreCode]!;
    req[STORE_CONTEXT_KEY] = {
      storeCode: config.storeCode,
      locale: config.locale,
      currency: config.currency,
    };
    return next.handle();
  }
}
