import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import {
  LOAD_SHED_SCOPE_KEY,
  LOAD_SHEDDING_CONFIG,
  type LoadSheddingConfig,
} from "./load-shedding.config";

/**
 * Global guard that rejects requests when the BFF is overloaded.
 *
 * Tracks global and per-scope inflight request counts.
 * When a limit is exceeded, returns 503 with a `Retry-After` header.
 */
@Injectable()
export class LoadSheddingGuard implements CanActivate {
  private readonly logger = new Logger(LoadSheddingGuard.name);
  private readonly config: LoadSheddingConfig = LOAD_SHEDDING_CONFIG;

  private globalInflight = 0;
  private readonly scopeInflight = new Map<string, number>();
  private rejections = 0;

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Check global limit
    if (this.globalInflight >= this.config.globalMaxInflight) {
      this.reject("global", 2);
    }

    // Check per-scope limit
    const scope = this.reflector.getAllAndOverride<string | undefined>(
      LOAD_SHED_SCOPE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (scope) {
      const scopeConfig = this.config.scopes[scope];
      if (scopeConfig) {
        const current = this.scopeInflight.get(scope) ?? 0;
        if (current >= scopeConfig.maxInflight) {
          this.reject(scope, scopeConfig.retryAfterSeconds);
        }
        this.scopeInflight.set(scope, current + 1);
      }
    }

    this.globalInflight += 1;

    // Register cleanup when the response finishes
    const res = context.switchToHttp().getResponse();
    const cleanup = () => {
      this.globalInflight = Math.max(0, this.globalInflight - 1);
      if (scope) {
        const current = this.scopeInflight.get(scope) ?? 0;
        if (current <= 1) {
          this.scopeInflight.delete(scope);
        } else {
          this.scopeInflight.set(scope, current - 1);
        }
      }
    };

    // Fastify uses 'onResponse' hook
    if (typeof res.raw?.on === "function") {
      res.raw.on("close", cleanup);
    } else if (typeof res.on === "function") {
      res.on("close", cleanup);
    }

    return true;
  }

  getHealthSummary(): {
    globalInflight: number;
    scopeInflight: Record<string, number>;
    totalRejections: number;
  } {
    return {
      globalInflight: this.globalInflight,
      scopeInflight: Object.fromEntries(this.scopeInflight),
      totalRejections: this.rejections,
    };
  }

  private reject(scope: string, retryAfterSeconds: number): never {
    this.rejections += 1;
    this.logger.warn(
      `Load shedding: rejecting request (scope="${scope}", inflight=${this.globalInflight})`,
    );
    throw new ServiceUnavailableException({
      message: "Service temporarily overloaded",
      errorCode: "OVERLOADED",
      scope,
      retryAfterSeconds,
    });
  }
}
