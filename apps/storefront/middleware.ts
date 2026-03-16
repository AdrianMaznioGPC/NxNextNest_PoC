import { resolveStoreFromHostname } from "@commerce/store-config";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const store = resolveStoreFromHostname(hostname);
  const requestHeaders = new Headers(request.headers);
  if (store) {
    requestHeaders.set("x-store-code", store.storeCode);
  }
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
