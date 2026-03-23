import type { SwitchUrlRequest, SwitchUrlResponse } from "lib/types";
import { resolveSwitchUrl } from "lib/api";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

export async function POST(request: NextRequest) {
  let payload: SwitchUrlRequest;
  try {
    payload = (await request.json()) as SwitchUrlRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 },
    );
  }

  if (!payload?.path || !payload?.targetRegion || !payload?.targetLanguage) {
    return NextResponse.json(
      { error: "path, targetRegion and targetLanguage are required" },
      { status: 400 },
    );
  }

  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const sourceHost = host.split(":")[0] ?? "";
  const sourceOrigin = resolveSourceOrigin(request, host);

  const resolved: SwitchUrlResponse = await resolveSwitchUrl({
    ...payload,
    sourceHost,
    sourceOrigin,
  });

  const response = NextResponse.json(resolved);
  response.cookies.set("pref_region", payload.targetRegion.toUpperCase(), {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    secure: request.nextUrl.protocol === "https:",
    domain: ".example.com",
  });
  response.cookies.set("pref_lang", payload.targetLanguage, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    secure: request.nextUrl.protocol === "https:",
    domain: ".example.com",
  });

  return response;
}

function resolveSourceOrigin(request: NextRequest, hostHeader: string) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const normalizedHost = hostHeader || request.headers.get("host") || "";
  if (forwardedProto && normalizedHost) {
    return `${forwardedProto}://${normalizedHost}`;
  }
  return request.nextUrl.origin;
}
