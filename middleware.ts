import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/repo\/(.+?)\/(.+)/);
  if (match) {
    const joined = `${match[1]}-${match[2]}`;
    const url = new URL(`/repo/${joined}`, request.url);
    return NextResponse.redirect(url, 308);
  }
}

export const config = {
  matcher: "/repo/:path*",
};
