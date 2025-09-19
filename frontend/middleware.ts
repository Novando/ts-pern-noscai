import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that don't require authentication
const publicPaths = ['/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for clinicId cookie
  const clinicId = request.cookies.get('clinicId')?.value;

  // If no clinicId and trying to access protected route, redirect to home
  if (!clinicId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
