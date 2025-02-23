import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Refresh session if expired
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Handle auth state
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/login', req.url);
      redirectUrl.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Update response
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, still allow public routes
    if (!req.nextUrl.pathname.startsWith('/dashboard')) {
      return res;
    }
    // Redirect to login on protected routes
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
