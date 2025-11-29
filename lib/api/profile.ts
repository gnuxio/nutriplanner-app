/**
 * API service for profile operations with the Go backend
 */

import { createClient } from "@/lib/supabase/client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.menuum.com';

/**
 * Profile data structure matching the Go backend CreateProfileRequest
 * Only sending basic fields for now
 */
export interface CreateProfilePayload {
    name: string;
    last_name: string;
    country: string;
    goal: string;
    activity_level: string;
    dislikes?: string[];
}

/**
 * Backend response for profile creation (basic fields only)
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
 * Get the Supabase JWT token from the current session
 */
async function getAuthToken(): Promise<string> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        throw new Error('No hay sesión activa. Por favor inicia sesión nuevamente.');
    }

    return data.session.access_token;
}

/**
 * Create a new profile in the Go backend
 */
export async function createProfile(payload: CreateProfilePayload): Promise<ProfileResponse> {
    try {
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            // Extract error message from backend response
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
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
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
        const token = await getAuthToken();

        const response = await fetch(`${API_URL}/api/v1/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
