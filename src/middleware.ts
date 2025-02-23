

export async function middleware() {
  // const res = NextResponse.next();
  // const supabase = await createClient();

  // try {
  //   const { data: { session } } = await supabase.auth.getSession();

  //   if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  //   }

  //   if (session && req.nextUrl.pathname.startsWith('/auth/sign-in')) {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }

  //   return res;
  // } catch (error) {
  //   console.error('Auth error:', error);
  //   if (req.nextUrl.pathname.startsWith('/dashboard')) {
  //     return NextResponse.redirect(new URL('/auth/sign-in', req.url));
  //   }
  //   return res;
  // }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|realtime|images).*)",
  ],
};
