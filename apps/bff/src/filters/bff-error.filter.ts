import type { BffErrorResponse } from "@commerce/shared-types";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import {
  CircuitOpenError,
  ConcurrencyLimitError,
  TimeoutPolicyError,
} from "../modules/system/resilience.types";

/**
 * Global exception filter that returns structured error responses
 * matching the `BffErrorResponse` contract from shared-types.
 *
 * Maps resilience errors (timeout, circuit open, concurrency limit)
 * to appropriate 503/504 status codes with Retry-After headers.
 */
@Catch()
export class BffErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = "INTERNAL_ERROR";
    let message = "An unexpected error occurred";
    let details: Record<string, unknown> | undefined;
    let retryAfterSeconds: number | undefined;

    // -- Resilience errors ---------------------------------------------------
    if (exception instanceof TimeoutPolicyError) {
      statusCode = HttpStatus.GATEWAY_TIMEOUT;
      errorCode = "UPSTREAM_TIMEOUT";
      message = exception.message;
      retryAfterSeconds = 2;
    } else if (exception instanceof CircuitOpenError) {
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorCode = "CIRCUIT_OPEN";
      message = exception.message;
      retryAfterSeconds = 5;
    } else if (exception instanceof ConcurrencyLimitError) {
      statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorCode = "CONCURRENCY_LIMIT";
      message = exception.message;
      retryAfterSeconds = 2;
      // -- HTTP exceptions (NestJS built-in) -----------------------------------
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      errorCode = this.toErrorCode(statusCode);
      const response = exception.getResponse();

      if (typeof response === "string") {
        message = response;
      } else if (typeof response === "object" && response !== null) {
        const res = response as Record<string, unknown>;
        message =
          typeof res.message === "string"
            ? res.message
            : Array.isArray(res.message)
              ? res.message.join("; ")
              : message;
        if (res.error) {
          errorCode =
            typeof res.error === "string"
              ? res.error.toUpperCase().replace(/\s+/g, "_")
              : errorCode;
        }
        if (res.errorCode) {
          errorCode = res.errorCode as string;
        }
        if (typeof res.retryAfterSeconds === "number") {
          retryAfterSeconds = res.retryAfterSeconds;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (retryAfterSeconds !== undefined) {
      reply.header("Retry-After", String(retryAfterSeconds));
    }

    const body: BffErrorResponse = {
      statusCode,
      errorCode,
      message,
      ...(details && { details }),
    };

    reply.status(statusCode).send(body);
  }

  private toErrorCode(status: number): string {
    switch (status) {
      case 400:
        return "BAD_REQUEST";
      case 401:
        return "UNAUTHORIZED";
      case 403:
        return "FORBIDDEN";
      case 404:
        return "NOT_FOUND";
      case 409:
        return "CONFLICT";
      case 422:
        return "VALIDATION_ERROR";
      case 429:
        return "TOO_MANY_REQUESTS";
      case 503:
        return "SERVICE_UNAVAILABLE";
      case 504:
        return "GATEWAY_TIMEOUT";
      default:
        return "INTERNAL_ERROR";
    }
  }
}
