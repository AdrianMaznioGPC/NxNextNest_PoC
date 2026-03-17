import type { BffErrorResponse } from "@commerce/shared-types";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

/**
 * Global exception filter that returns structured error responses
 * matching the `BffErrorResponse` contract from shared-types.
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

    if (exception instanceof HttpException) {
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
      }
    } else if (exception instanceof Error) {
      message = exception.message;
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
      default:
        return "INTERNAL_ERROR";
    }
  }
}
