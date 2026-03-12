import { TAGS } from "lib/constants";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ status: 401 });
  }

  const body = await req.json();
  const tag = body?.tag;

  if (tag && Object.values(TAGS).includes(tag)) {
    revalidateTag(tag);
    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
    });
  }

  return NextResponse.json({ status: 200 });
}
