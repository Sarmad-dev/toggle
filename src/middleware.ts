import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/webhook") {
    return NextResponse.redirect(`${request.nextUrl.pathname}/`, 308);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/auth/signup
     * - /api/auth/signin
     * - /api/auth/forgot-password
     * - /api/auth/reset-password
     * - /api/webhooks/lemon-squeezy
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth/signup|api/auth/signin|api/auth/forgot-password|api/auth/reset-password|api/webhooks/lemon-squeezy).*)",
  ],
};
