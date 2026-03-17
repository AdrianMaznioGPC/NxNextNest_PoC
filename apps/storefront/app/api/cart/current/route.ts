import { NextRequest } from "next/server";
import { proxyCartRequest } from "../_proxy";

export async function GET(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current");
}

export async function POST(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current");
}

export async function DELETE(request: NextRequest) {
  return proxyCartRequest(request, "/cart/current");
}
