import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Auth middleware for AdmitFlow dashboard routes.
 * Reads the `auth_token` cookie set on login.
 * Protects every route under the (dashboard) group.
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // All protected paths (mirrors the navGroups in layout.tsx)
  const protectedPaths = [
    '/dashboard',
    '/leads',
    '/calls',
    '/conversations',
    '/whatsapp',
    '/knowledge-base',
    '/bookings',
    '/settings',
    '/onboarding',
    '/account-details',
  ];

  const isProtected = protectedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );

  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';

  // Redirect unauthenticated users away from protected pages
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect already-authenticated users away from login/signup
  if ((isLoginPage || isSignupPage) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/leads/:path*',
    '/calls/:path*',
    '/conversations/:path*',
    '/whatsapp/:path*',
    '/knowledge-base/:path*',
    '/bookings/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
    '/account-details/:path*',
    '/login',
    '/signup',
  ],
};
