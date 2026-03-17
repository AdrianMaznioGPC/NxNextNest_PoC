import { NextRequest } from "next/server";
import { proxyCartRequest } from "../../_proxy";

export async function POST(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current/lines");
}

export async function PATCH(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current/lines");
}

export async function DELETE(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current/lines");
}
