import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Use middleware client specifically for auth
  const supabase = createMiddlewareClient({ req, res });

  try {
    // Get session, not just user
    const { data: { session } } = await supabase.auth.getSession();

    // Handle auth state
    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/auth/sign-in', req.url);
      redirectUrl.searchParams.set('from', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Important: Set the session cookie
    const response = NextResponse.next({
      request: {
        headers: req.headers,
      },
    });

    // Set CORS headers for Supabase Realtime
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Only redirect to sign-in for dashboard routes
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
    return res;
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
     * - realtime (Supabase Realtime WebSocket)
     * - images (newly added for images)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|realtime|images).*)",
  ],
};
