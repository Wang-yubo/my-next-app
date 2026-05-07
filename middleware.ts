import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  // 保护 /dashboard、/profile 和 /admin 路径 - 未登录用户重定向到登录页
  if ((pathname.startsWith('/dashboard') || pathname.startsWith('/profile') || pathname.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 已登录用户访问登录页或注册页，重定向到 dashboard
  if ((pathname === '/' || pathname === '/register') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/', '/register'],
};
