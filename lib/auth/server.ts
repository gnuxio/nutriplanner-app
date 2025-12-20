/**
 * Cliente de autenticación para Server Components
 * Valida sesión server-side mediante /auth/me
 */

import { cookies } from 'next/headers';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://api.menuum.com/auth';

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
}

/**
 * Obtiene el usuario actual desde el servidor
 * Lee las cookies de Next.js y las envía al auth-service
 */
export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();

  // Construir header de cookies manualmente
  const cookieHeader = cookieStore
    .getAll()
    .map(cookie => `${cookie.name}=${cookie.value}`)
    .join('; ');

  if (!cookieHeader) {
    return null;
  }

  try {
    const response = await fetch(`${AUTH_URL}/me`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
      },
      credentials: 'include',
      cache: 'no-store', // No cachear la sesión
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error validating session:', error);
    return null;
  }
}

/**
 * Valida si hay una sesión activa
 */
export async function validateSession(): Promise<boolean> {
  const user = await getUser();
  return user !== null;
}
