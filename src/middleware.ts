import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res }, {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  });

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }

    if (session && req.nextUrl.pathname.startsWith('/auth/sign-in')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return res;
  } catch (error) {
    console.error('Auth error:', error);
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
    return res;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|realtime|images).*)",
  ],
};
