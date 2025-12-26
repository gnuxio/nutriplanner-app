/**
 * API service for menu/plans operations with the Go backend
 */

import { fetchWithAuth } from '@/lib/auth/interceptor';
import {
  MenuHistoryResponse,
  MenuDetailResponse,
  MenuDetail,
  MenuHistoryItem
} from '@/lib/types/plans';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.menuum.com';

/**
 * Get menu history (all plans for the user)
 */
export async function getMenuHistory(): Promise<MenuHistoryItem[]> {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/v1/menu/history`, {
      method: 'GET',
    });

    const result: MenuHistoryResponse = await response.json();

    if (!response.ok) {
      const errorMessage = (result as any).error?.message || (result as any).message || 'Error al obtener historial de planes';
      throw new Error(errorMessage);
    }

    // Backend envuelve la respuesta en { data: [...] }
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al obtener historial de planes');
  }
}

/**
 * Get specific menu by ID with all details
 */
export async function getMenuById(id: string): Promise<MenuDetail> {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/v1/menu/${id}`, {
      method: 'GET',
    });

    const result: MenuDetailResponse = await response.json();

    if (!response.ok) {
      const errorMessage = (result as any).error?.message || (result as any).message || 'Error al obtener plan';
      throw new Error(errorMessage);
    }

    // Backend envuelve la respuesta en { data: {...} }
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al obtener plan');
  }
}

/**
 * Create new menu (asynchronous - returns 202 with status="processing")
 */
export async function createMenu(): Promise<MenuHistoryItem> {
  try {
    const response = await fetchWithAuth(`${API_URL}/api/v1/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result: MenuDetailResponse = await response.json();

    // 202 Accepted es válido para proceso asíncrono
    if (response.status !== 202 && !response.ok) {
      const errorMessage = (result as any).error?.message || (result as any).message || 'Error al generar nuevo plan';
      throw new Error(errorMessage);
    }

    // Backend envuelve la respuesta en { data: {...} }
    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error desconocido al generar nuevo plan');
  }
}
