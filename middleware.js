import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Skip middleware for non-admin routes and static files
  if (!request.nextUrl.pathname.startsWith('/admin') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/images')) {
    return NextResponse.next();
  }

  try {
    // Get the cookie from the request
    const cookie = request.cookies.get('token');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: {
        'Cookie': `token=${cookie?.value || ''}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    });

    const data = await response.json();

    // Check if response is not ok before trying to access data
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed');
    }

    // Check if the user exists and is an admin
    if (!data.user || !data.user.isAdmin) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      loginUrl.searchParams.set('message', 'You must be an admin to access this area');
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    loginUrl.searchParams.set('error', 'auth_error');
    loginUrl.searchParams.set('message', error.message || 'Authentication failed. Please try logging in again.');
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*']
};