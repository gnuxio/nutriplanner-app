/**
 * Proxy para el servicio de auth en desarrollo local
 *
 * Este proxy resuelve el problema de cookies cross-origin:
 * - En local: localhost:3000 -> localhost:3000/api/auth/* -> api.menuum.com/auth/*
 * - En producción: app.menuum.com -> api.menuum.com/auth/* (cookies funcionan directamente)
 *
 * Las cookies del backend se transfieren al cliente a través del mismo origen
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || 'https://api.menuum.com/auth';

// Cookies que manejamos del backend de auth
const AUTH_COOKIES = ['access_token', 'id_token', 'refresh_token'];

async function handleRequest(
  request: NextRequest,
  method: string,
  path: string
): Promise<NextResponse> {
  try {
    // Construir URL del backend
    const backendUrl = `${AUTH_URL}/${path}`;

    // Obtener cookies actuales para enviarlas al backend
    const cookieStore = await cookies();
    const cookieHeader = AUTH_COOKIES
      .map(name => {
        const value = cookieStore.get(name)?.value;
        return value ? `${name}=${value}` : null;
      })
      .filter(Boolean)
      .join('; ');

    // Preparar headers para el backend
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Enviar cookies existentes al backend si las hay
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Obtener body si existe
    let body: string | undefined;
    if (method !== 'GET' && method !== 'HEAD') {
      try {
        const text = await request.text();
        body = text || undefined;
      } catch {
        body = undefined;
      }
    }

    // Hacer la petición al backend
    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Leer el body de la respuesta
    const responseData = await response.text();

    // Crear la respuesta para el cliente
    const nextResponse = new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Transferir cookies del backend al cliente
    const setCookieHeaders = response.headers.getSetCookie?.() ||
                           response.headers.get('set-cookie')?.split(', ') ||
                           [];

    for (const cookieString of setCookieHeaders) {
      // Parsear cookie
      const [nameValue, ...attributes] = cookieString.split(';').map(s => s.trim());
      const [name, value] = nameValue.split('=');

      if (AUTH_COOKIES.includes(name)) {
        // Extraer atributos de la cookie
        const maxAge = attributes.find(attr => attr.toLowerCase().startsWith('max-age='));
        const maxAgeValue = maxAge ? parseInt(maxAge.split('=')[1]) : undefined;

        // Establecer cookie en el cliente con los mismos atributos
        const cookieStore = await cookies();
        cookieStore.set({
          name,
          value,
          maxAge: maxAgeValue,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        });
      }
    }

    // Si es logout, limpiar todas las cookies
    if (path === 'logout') {
      const cookieStore = await cookies();
      for (const cookieName of AUTH_COOKIES) {
        cookieStore.delete(cookieName);
      }
    }

    return nextResponse;
  } catch (error) {
    console.error('Error en proxy de auth:', error);
    return NextResponse.json(
      {
        error: 'Proxy error',
        message: error instanceof Error ? error.message : 'Error desconocido en el proxy'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, 'GET', path.join('/'));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, 'POST', path.join('/'));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, 'PUT', path.join('/'));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, 'DELETE', path.join('/'));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleRequest(request, 'PATCH', path.join('/'));
}
