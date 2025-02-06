import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  const { data: { session } } = await supabase.auth.getSession()
  console.log("SESSION: ",session?.access_token)

  // URLs that don't require authentication
  const publicUrls = ['/', '/auth/sign-in', '/auth/sign-up', '/auth/forgot-password', '/auth/callback', '/dashboard']
  const isPublicUrl = publicUrls.includes(request.nextUrl.pathname)

  // Auth URLs that logged-in users shouldn't access
  const authUrls = ['/auth/sign-in', '/auth/sign-up', '/auth/callback', '/auth/forgot-password']
  const isAuthUrl = authUrls.includes(request.nextUrl.pathname)

  // If user is signed in and tries to access auth pages, redirect to dashboard
  if (session && isAuthUrl) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user is not signed in and tries to access protected pages, redirect to sign in
  if (!session && !isPublicUrl && !request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  return res
}

// Specify which routes this middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|api/auth/.*).*)',
  ],
} 