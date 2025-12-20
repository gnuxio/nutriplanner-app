/**
 * Hook de autenticación que usa el auth-service con cookies
 * Reemplaza el hook de Supabase
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authClient, type User } from '@/lib/auth/client';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Obtener usuario actual
  const fetchUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await authClient.me();
      setUser(userData);
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicializar: obtener usuario al montar
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Logout
  const signOut = useCallback(async () => {
    try {
      await authClient.logout();
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error('Error during logout:', err);
      // Limpiar estado local incluso si falla el request
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  // Refresh manual
  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    signOut,
    refreshUser,
  };
}
