import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const BFF_URL = process.env.BFF_URL || "http://localhost:4000";

type CartEndpoint = "/cart/current" | "/cart/current/lines";

type HeadersWithSetCookie = Headers & {
  getSetCookie?: () => string[];
};

export async function proxyCartRequest(
  request: NextRequest,
  endpoint: CartEndpoint,
): Promise<NextResponse> {
  const query = buildLocaleQuery(request);
  const upstreamUrl = `${BFF_URL}${endpoint}${query ? `?${query}` : ""}`;
  const rawBody = request.method === "GET" ? undefined : await request.text();

  const upstreamResponse = await fetch(upstreamUrl, {
    method: request.method,
    headers: {
      ...(rawBody ? { "Content-Type": "application/json" } : {}),
      cookie: request.headers.get("cookie") ?? "",
      "x-request-id": request.headers.get("x-request-id") ?? randomUUID(),
    },
    body: rawBody && rawBody.length > 0 ? rawBody : undefined,
    cache: "no-store",
  });

  const responseText = await upstreamResponse.text();
  const response = new NextResponse(responseText || null, {
    status: upstreamResponse.status,
  });

  const contentType = upstreamResponse.headers.get("content-type");
  if (contentType) {
    response.headers.set("content-type", contentType);
  }
  const requestId = upstreamResponse.headers.get("x-request-id");
  if (requestId) {
    response.headers.set("x-request-id", requestId);
  }

  const setCookies =
    (upstreamResponse.headers as HeadersWithSetCookie).getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      response.headers.append("set-cookie", cookie);
    }
  } else {
    const singleSetCookie = upstreamResponse.headers.get("set-cookie");
    if (singleSetCookie) {
      response.headers.set("set-cookie", singleSetCookie);
    }
  }

  return response;
}

function buildLocaleQuery(request: NextRequest): string {
  const params = new URLSearchParams();
  const prefLanguage = request.cookies.get("pref_lang")?.value;
  const prefRegion = request.cookies.get("pref_region")?.value;
  const localeCookie = request.cookies.get("locale")?.value;
  const language = normalizeLanguage(prefLanguage) ?? normalizeLanguage(localeCookie);
  const region = prefRegion || localeCookie?.split("-")[1] || "US";

  if (language) {
    params.set("language", language);
    params.set("locale", localeFromLanguage(language));
  }
  params.set("region", region);
  params.set("market", region);

  const hostHeader =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const domain = normalizeHost(hostHeader);
  if (domain) {
    params.set("domain", domain);
  }

  return params.toString();
}

function normalizeHost(host: string | null): string | undefined {
  if (!host) return undefined;
  const normalized = host.toLowerCase().split(":")[0];
  return normalized || undefined;
}

function normalizeLanguage(value?: string): "en" | "es" | "nl" | "fr" | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase().split("-")[0];
  if (
    normalized === "en" ||
    normalized === "es" ||
    normalized === "nl" ||
    normalized === "fr"
  ) {
    return normalized;
  }
  return undefined;
}

function localeFromLanguage(language: "en" | "es" | "nl" | "fr") {
  switch (language) {
    case "es":
      return "es-ES";
    case "nl":
      return "nl-NL";
    case "fr":
      return "fr-FR";
    case "en":
    default:
      return "en-US";
  }
}
