import { NestFactory } from "@nestjs/core";
import { Logger } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const requestLogger = new Logger("RequestLogger");
  const bootstrapLogger = new Logger("Bootstrap");
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook("onRequest", (request, _reply, done) => {
    const reply = _reply;
    const forwardedProto = request.headers["x-forwarded-proto"];
    const protocol =
      (Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto) ||
      request.protocol ||
      "http";
    const host = request.headers.host || "localhost:4000";
    const incomingRequestId = request.headers["x-request-id"];
    const normalizedIncomingRequestId = Array.isArray(incomingRequestId)
      ? incomingRequestId[0]
      : incomingRequestId;
    const requestId =
      normalizedIncomingRequestId && normalizedIncomingRequestId.trim().length > 0
        ? normalizedIncomingRequestId
        : randomUUID();
    request.headers["x-request-id"] = requestId;
    reply.header("X-Request-Id", requestId);
    requestLogger.log(
      JSON.stringify({
        requestId,
        method: request.method,
        url: `${protocol}://${host}${request.url}`,
      }),
    );
    done();
  });

  app.enableCors();
  await app.listen(4000, "0.0.0.0");
  bootstrapLogger.log("BFF running on http://localhost:4000");
}
bootstrap();
