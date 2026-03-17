import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap } from "rxjs";
import {
  CACHE_ROUTE_KIND_KEY,
  CachePolicyService,
} from "./cache-policy.service";

/**
 * Sets `Cache-Control` and `Vary` response headers based on route metadata.
 *
 * Controllers annotate endpoints with `@SetMetadata('cacheRouteKind', 'product-detail')`
 * and this interceptor resolves the appropriate cache policy.
 */
@Injectable()
export class CachePolicyInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly cachePolicy: CachePolicyService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      tap(() => {
        const routeKind = this.reflector.getAllAndOverride<string | undefined>(
          CACHE_ROUTE_KIND_KEY,
          [context.getHandler(), context.getClass()],
        );

        const res = context.switchToHttp().getResponse();
        const status = res.statusCode ?? 200;
        const hints = this.cachePolicy.getCacheHints(routeKind, status);
        const header = this.cachePolicy.toCacheControlHeader(hints);

        res.header("Cache-Control", header);
        res.header("Vary", "x-store-code");
      }),
    );
  }
}
