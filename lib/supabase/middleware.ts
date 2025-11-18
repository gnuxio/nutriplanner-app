import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Cliente de Supabase para usar en Middleware
 * Actualiza las cookies de sesión automáticamente
 */
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANTE: Evita escribir lógica entre createServerClient y
    // supabase.auth.getUser(). Un simple error podría hacer que el usuario
    // quede deslogueado aleatoriamente.

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
                      request.nextUrl.pathname.startsWith('/register');
    const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/onboarding');

    // Redirect authenticated users away from auth pages
    if (user && isAuthPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    // Redirect unauthenticated users to login
    if (!user && isProtectedPage) {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    // IMPORTANTE: Debes retornar la respuesta de supabaseResponse para que
    // las cookies se actualicen correctamente
    return supabaseResponse;
}
