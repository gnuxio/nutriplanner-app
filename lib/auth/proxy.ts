/**
 * Helper para validación de sesión en proxy.ts
 * Reemplaza lib/supabase/proxy.ts
 */

import { NextResponse, type NextRequest } from 'next/server';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://api.menuum.com/auth';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Obtener todas las cookies del request
  const cookieHeader = request.cookies
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  // Validar sesión con el auth-service
  let user = null;
  if (cookieHeader) {
    try {
      const authResponse = await fetch(`${AUTH_URL}/me`, {
        method: 'GET',
        headers: {
          'Cookie': cookieHeader,
        },
        cache: 'no-store',
      });

      if (authResponse.ok) {
        const data = await authResponse.json();
        user = data.user;
      }
    } catch (error) {
      console.error('Error validating session in proxy:', error);
    }
  }

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                    request.nextUrl.pathname.startsWith('/register');
  const isProtectedPage = request.nextUrl.pathname.startsWith('/onboarding') ||
                         request.nextUrl.pathname === '/';

  // Redirect authenticated users away from auth pages
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to login
  if (!user && isProtectedPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return response;
}
