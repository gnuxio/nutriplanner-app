import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { UserProfileUpdate } from '@/lib/types/onboarding';

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();

        // Crear cliente de Supabase desde el servidor
        const supabase = await createClient();

        // Obtener el usuario autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Usuario no autenticado' },
                { status: 401 }
            );
        }

        // Preparar datos para actualizar con tipo seguro
        const updateData: UserProfileUpdate = {
            updated_at: new Date().toISOString(),
        };

        // Solo actualizar campos que están presentes en el body
        if (body.edad !== undefined) updateData.edad = body.edad;
        if (body.peso !== undefined) updateData.peso = body.peso;
        if (body.estatura !== undefined) updateData.estatura = body.estatura;
        if (body.comidas_al_dia !== undefined) updateData.comidas_al_dia = body.comidas_al_dia;
        if (body.objetivo !== undefined) updateData.objetivo = body.objetivo;
        if (body.sexo !== undefined) updateData.sexo = body.sexo;
        if (body.nivel_actividad !== undefined) updateData.nivel_actividad = body.nivel_actividad;
        if (body.preferencia_alimenticia !== undefined) updateData.preferencia_alimenticia = body.preferencia_alimenticia;
        if (body.restricciones !== undefined) updateData.restricciones = body.restricciones;
        if (body.nivel_cocina !== undefined) updateData.nivel_cocina = body.nivel_cocina;
        if (body.tiempo_disponible !== undefined) updateData.tiempo_disponible = body.tiempo_disponible;
        if (body.equipo_disponible !== undefined) updateData.equipo_disponible = body.equipo_disponible;

        // Actualizar el perfil
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error actualizando perfil:', error);
            return NextResponse.json(
                { error: 'Error al actualizar el perfil', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (error) {
        console.error('Error en API update profile:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
