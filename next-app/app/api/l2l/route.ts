import { NextRequest, NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const legacyHandler = require("@/lib/l2l-handler");

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  let statusCode = 200;
  let payload: unknown = null;
  const headers = new Headers();

  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const req = { method: "GET", query };

  const res = {
    setHeader(name: string, value: string) {
      headers.set(name, value);
      return this;
    },
    status(code: number) {
      statusCode = code;
      return this;
    },
    json(value: unknown) {
      payload = value;
      return value;
    },
  };

  await legacyHandler(req, res);

  return NextResponse.json(payload ?? { success: false, error: "Empty L2L response." }, {
    status: statusCode,
    headers,
  });
}
