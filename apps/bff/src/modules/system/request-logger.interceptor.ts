import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";
import { MetricsService } from "./metrics.service";

/**
 * Structured request logging with timing and metrics collection.
 * Logs every request/response as a JSON-shaped message.
 */
@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const start = performance.now();
    const req = context.switchToHttp().getRequest();
    const method: string = req.method ?? "GET";
    const url: string = req.url ?? req.raw?.url ?? "/";

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const status: number = res.statusCode ?? 200;
          const durationMs = Math.round(performance.now() - start);

          this.metrics.recordRequest(method, url, status, durationMs);

          this.logger.log(
            `${method} ${url} ${status} ${durationMs}ms`,
          );
        },
        error: (err: unknown) => {
          const status =
            err && typeof err === "object" && "status" in err
              ? (err as { status: number }).status
              : 500;
          const durationMs = Math.round(performance.now() - start);

          this.metrics.recordRequest(method, url, status, durationMs);
          this.metrics.recordError(`http:${status}`);

          this.logger.warn(
            `${method} ${url} ${status} ${durationMs}ms`,
          );
        },
      }),
    );
  }
}
