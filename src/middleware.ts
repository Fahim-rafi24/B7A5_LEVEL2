import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type Role = 'tenant' | 'landlord' | 'admin';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    const uri = encodeURIComponent(json).replace(
      /%([0-9A-F]{2})/g,
      (_, hex: string) => `%${hex.toLowerCase()}`
    );
    return JSON.parse(decodeURIComponent(uri)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function resolveRole(token?: string): Role | null {
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const role = payload?.role;
  if (role === 'tenant' || role === 'landlord' || role === 'admin') return role;
  return null;
}

interface RouteRule {
  prefix: string;
  roles: Role[];
}

const protectedRoutes: RouteRule[] = [
  { prefix: '/dashboard/tenant', roles: ['tenant'] },
  { prefix: '/dashboard/landlord', roles: ['landlord'] },
  { prefix: '/dashboard/admin', roles: ['admin'] },
  { prefix: '/payment/init', roles: ['tenant'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const role = resolveRole(accessToken);

  const matchesRule = (rule: RouteRule) =>
    pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`);

  for (const rule of protectedRoutes) {
    if (matchesRule(rule)) {
      if (!role) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', `${pathname}${request.nextUrl.search}`);
        return NextResponse.redirect(loginUrl);
      }
      if (!rule.roles.includes(role)) {
        return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
      }
    }
  }

  if (role && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/payment/:path*', '/auth/:path*'],
};
