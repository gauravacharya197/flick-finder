import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;

  // Only run middleware for admin routes and exclude signin page
  if (path.startsWith('/admin') && path !== '/admin/signin') {
    const adminCookie = request.cookies.get('admin-auth');

    // If not authenticated, redirect to signin
    if (!adminCookie?.value) {
      // Create the URL for the signin page
      const signInUrl = new URL('/not-found', request.url);
      // Add the original URL as a "from" parameter to redirect back after login
      //signInUrl.searchParams.set('from', path);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Specify paths for middleware to run on
export const config = {
  matcher: [
    // Match all admin routes except signin
    '/admin/:path*',
  ]
};