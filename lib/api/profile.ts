/**
 * API service for profile operations with the Go backend
 * ACTUALIZADO: Usa cookies httpOnly en lugar de JWT en header
 */

import { fetchWithAuth } from '@/lib/auth/interceptor';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.menuum.com';

/**
 * Profile data structure matching the Go backend CreateProfileRequest
 */
export interface CreateProfilePayload {
    name: string;
    last_name: string;
    age: number;
    weight: number;
    height: number;
    gender: string;
    country: string;
    goal: string;
    activity_level: string;
    dislikes?: string[];
}

/**
 * Backend response for profile creation
 */
export interface ProfileResponse {
    id: string;
    name?: string;
    last_name?: string;
    goal?: string;
    calories?: number;
    dislikes?: string[];
    country?: string;
}

/**
 * Create a new profile in the Go backend
 */
export async function createProfile(payload: CreateProfilePayload): Promise<ProfileResponse> {
    try {
        // CAMBIO: usar fetchWithAuth que maneja cookies automáticamente
        const response = await fetchWithAuth(`${API_URL}/api/v1/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // NO Authorization header - las cookies se envían automáticamente
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || data.message || 'Error al crear el perfil';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al crear el perfil');
    }
}

/**
 * Get user profile from the Go backend
 */
export async function getProfile(): Promise<ProfileResponse> {
    try {
        const response = await fetchWithAuth(`${API_URL}/api/v1/profile`, {
            method: 'GET',
            // NO Authorization header - las cookies se envían automáticamente
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || data.message || 'Error al obtener el perfil';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al obtener el perfil');
    }
}

/**
 * Update user profile in the Go backend
 */
export async function updateProfile(payload: Partial<CreateProfilePayload>): Promise<ProfileResponse> {
    try {
        const response = await fetchWithAuth(`${API_URL}/api/v1/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // NO Authorization header - las cookies se envían automáticamente
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            const errorMessage = data.error || data.message || 'Error al actualizar el perfil';
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error desconocido al actualizar el perfil');
    }
}
