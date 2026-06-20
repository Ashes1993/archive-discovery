import { type NextRequest, NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  console.log("🛡️ Proxy checking path:", path);

  // Check whether the user is viewing the admin pages and have verified cookie value (lightweight)
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const authCookie = request.cookies.get("admin_session");

    if (!authCookie || authCookie.value !== "authenticated") {
      console.log("🛑 Access Denied! Redirecting to login...");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
