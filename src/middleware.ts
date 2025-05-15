import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const user = req.cookies.get("@IMAC:T")?.value;
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/auth";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/propriedade/:path*",
    "/auth",
  ],
};
