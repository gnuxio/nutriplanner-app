/**
 * Interceptor para refrescar tokens automáticamente cuando expiran
 * Útil para requests al backend Go (api.menuum.com/api/v1/...)
 */

import { authClient } from './client';

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Hace fetch con refresh automático en caso de 401
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const makeRequest = () => fetch(url, {
    ...options,
    credentials: 'include', // CRÍTICO
    headers: {
      ...options.headers,
    },
  });

  // Primer intento
  let response = await makeRequest();

  // Si es 401, intentar refresh
  if (response.status === 401) {
    // Si ya se está refrescando, esperar
    if (isRefreshing && refreshPromise) {
      await refreshPromise;
      // Reintentar después del refresh
      response = await makeRequest();
    } else {
      // Iniciar refresh
      isRefreshing = true;
      refreshPromise = authClient.refresh()
        .then(() => {
          isRefreshing = false;
          refreshPromise = null;
        })
        .catch((err) => {
          isRefreshing = false;
          refreshPromise = null;
          throw err;
        });

      await refreshPromise;

      // Reintentar request original
      response = await makeRequest();
    }
  }

  return response;
}
