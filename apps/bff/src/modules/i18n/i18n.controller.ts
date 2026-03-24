import { Controller, Get, Headers, Query, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";
import { createHash } from "node:crypto";
import { I18nService } from "./i18n.service";

@Controller("i18n")
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  @Get("domain-config")
  getDomainConfig(
    @Headers("if-none-match") ifNoneMatch: string | undefined,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const payload = this.i18n.getDomainConfig();
    const etag = weakContentEtag(payload);
    response.header("ETag", etag);
    response.header(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );

    if (ifNoneMatch === etag) {
      response.status(304);
      return;
    }

    return payload;
  }

  @Get("messages")
  getMessages(
    @Query("locale") locale?: string,
    @Query("namespaces") namespaces?: string,
    @Headers("if-none-match") ifNoneMatch?: string,
    @Res({ passthrough: true }) response?: FastifyReply,
  ) {
    const resolvedLocale = locale || this.i18n.resolveLocaleContext().locale;
    const requestedNamespaces = parseNamespaces(namespaces);
    const payload = this.i18n.getMessages(resolvedLocale, requestedNamespaces);
    const etag = `W/"msg-${payload.translationVersion}-${payload.locale}-${requestedNamespaces.join("|")}"`;

    response?.header("ETag", etag);
    response?.header(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );

    if (ifNoneMatch === etag) {
      response?.status(304);
      return;
    }

    return payload;
  }
}

function parseNamespaces(raw?: string): string[] {
  if (!raw) return ["common"];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function weakContentEtag(input: unknown): string {
  const canonical = stableStringify(input);
  const digest = createHash("sha256").update(canonical).digest("base64url");
  return `W/"domain-${digest}"`;
}

function stableStringify(input: unknown): string {
  if (input === null || typeof input !== "object") {
    return JSON.stringify(input);
  }

  if (Array.isArray(input)) {
    return `[${input.map((item) => stableStringify(item)).join(",")}]`;
  }

  const entries = Object.entries(input as Record<string, unknown>).sort(
    ([a], [b]) => a.localeCompare(b),
  );
  return `{${entries
    .map(([key, value]) => `${JSON.stringify(key)}:${stableStringify(value)}`)
    .join(",")}}`;
}
