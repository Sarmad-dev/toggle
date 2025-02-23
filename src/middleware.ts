
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "./lib/supabase/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = await createClient()

  try {
    // Refresh the auth session
    await supabase.auth.getSession();

    // Get the user
    const { data: { user } } = await supabase.auth.getUser();

    // console.log("User in middleware: ", user)

    // Handle auth redirects
    if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }

    if (req.nextUrl.pathname.startsWith('/auth/sign-in')) {
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
