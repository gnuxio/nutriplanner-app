/**
 * Cliente de autenticación para Client Components
 * Maneja todas las operaciones de auth con cookies httpOnly
 *
 * En desarrollo local, usa el proxy de Next.js (/api/auth) para evitar problemas con cookies cross-origin
 * En producción, llama directamente al backend de auth
 */

// En desarrollo local, usar proxy de Next.js para evitar problemas con cookies cross-origin
const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
const AUTH_URL = isLocal
  ? '/api/auth' // Proxy local
  : (process.env.NEXT_PUBLIC_AUTH_URL || 'https://api.menuum.com/auth'); // Directo en producción

export interface User {
  id: string;
  email: string;
  email_verified: boolean;
  name: string;
}

export interface AuthResponse {
  user?: User;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

/**
 * Helper para hacer fetch con credentials
 */
async function authFetch(endpoint: string, options: RequestInit = {}): Promise<Response> {
  return fetch(`${AUTH_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // CRÍTICO: envía cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
}

export const authClient = {
  /**
   * Login con email y password
   * Establece cookies httpOnly automáticamente
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await authFetch('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    return data;
  },

  /**
   * Registro de nuevo usuario
   * NO establece cookies, requiere verificación de email
   */
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    const response = await authFetch('/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al registrarse');
    }

    return data;
  },

  /**
   * Verificar email con código
   */
  async verifyEmail(email: string, code: string): Promise<AuthResponse> {
    const response = await authFetch('/verify-email', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al verificar email');
    }

    return data;
  },

  /**
   * Reenviar código de verificación
   */
  async resendVerification(email: string): Promise<AuthResponse> {
    const response = await authFetch('/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al reenviar código');
    }

    return data;
  },

  /**
   * Obtener usuario actual
   * Lee desde cookies httpOnly automáticamente
   */
  async me(): Promise<User> {
    const response = await authFetch('/me', {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'No autenticado');
    }

    return data.user;
  },

  /**
   * Refrescar access token
   * Usa refresh_token desde cookies automáticamente
   */
  async refresh(): Promise<AuthResponse> {
    const response = await authFetch('/refresh', {
      method: 'POST',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al refrescar sesión');
    }

    return data;
  },

  /**
   * Logout
   * Limpia todas las cookies
   */
  async logout(): Promise<void> {
    const response = await authFetch('/logout', {
      method: 'POST',
    });

    if (!response.ok) {
      console.error('Error en logout, pero continuando...');
    }
  },

  /**
   * Iniciar reset de password
   */
  async forgotPassword(email: string): Promise<AuthResponse> {
    const response = await authFetch('/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al solicitar reset de password');
    }

    return data;
  },

  /**
   * Completar reset de password
   */
  async resetPassword(email: string, code: string, newPassword: string): Promise<AuthResponse> {
    const response = await authFetch('/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, new_password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al resetear password');
    }

    return data;
  },

  /**
   * Cambiar password (usuario autenticado)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResponse> {
    const response = await authFetch('/change-password', {
      method: 'POST',
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al cambiar password');
    }

    return data;
  },
};
