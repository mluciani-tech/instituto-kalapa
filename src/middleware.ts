import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const PUBLIC_ADMIN_API = new Set(["/api/admin/login", "/api/admin/verify"]);

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin/") && !PUBLIC_ADMIN_API.has(pathname)) {
    const token = req.cookies.get("admin_session")?.value;
    if (!token || !verifySessionToken(token)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
