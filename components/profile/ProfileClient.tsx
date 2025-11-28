'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { UserOnboardingData } from '@/lib/types/onboarding';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Activity, Target, Utensils, Clock, ChefHat, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProfileClientProps {
    user: User;
    profile: UserOnboardingData & { user_id: string } | null;
}

export default function ProfileClient({ user, profile: initialProfile }: ProfileClientProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    // Local state for the profile data
    const [profile, setProfile] = useState(initialProfile);

    const [editedProfile, setEditedProfile] = useState({
        edad: profile?.edad || 0,
        peso: profile?.peso || 0,
        estatura: profile?.estatura || 0,
        comidas_al_dia: profile?.comidas_al_dia || 3,
    });

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProfile),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el perfil');
            }

            const result = await response.json();

            // Update local state with the new data
            if (result.data && profile) {
                setProfile({
                    ...profile,
                    ...editedProfile,
                });
            }

            setSuccess(true);
            setIsEditing(false);

            // Refresh server component data without full page reload
            router.refresh();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedProfile({
            edad: profile?.edad || 0,
            peso: profile?.peso || 0,
            estatura: profile?.estatura || 0,
            comidas_al_dia: profile?.comidas_al_dia || 3,
        });
    };

    const getObjetivoLabel = (objetivo: string) => {
        const labels: Record<string, string> = {
            perder_peso: 'Perder peso',
            mantener_peso: 'Mantener peso',
            ganar_musculo: 'Ganar músculo',
        };
        return labels[objetivo] || objetivo;
    };

    const getNivelActividadLabel = (nivel: string) => {
        const labels: Record<string, string> = {
            sedentario: 'Sedentario',
            ligero: 'Actividad ligera',
            moderado: 'Actividad moderada',
            alto: 'Actividad alta',
            muy_alto: 'Actividad muy alta',
        };
        return labels[nivel] || nivel;
    };

    const getPreferenciaLabel = (preferencia: string) => {
        const labels: Record<string, string> = {
            omnivoro: 'Omnívoro',
            vegetariano: 'Vegetariano',
            vegano: 'Vegano',
            mediterraneo: 'Mediterráneo',
            alto_proteina: 'Alto en proteína',
            bajo_carbohidratos: 'Bajo en carbohidratos',
            sin_preferencia: 'Sin preferencia',
        };
        return labels[preferencia] || preferencia;
    };

    const getNivelCocinaLabel = (nivel: string) => {
        const labels: Record<string, string> = {
            casi_no_cocino: 'Casi no cocino',
            basico: 'Básico',
            intermedio: 'Intermedio',
            avanzado: 'Avanzado',
        };
        return labels[nivel] || nivel;
    };

    if (!profile) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <p className="text-gray-600">No se encontraron datos de perfil. Por favor, completa el onboarding.</p>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Mi Perfil
                        </h1>
                        <p className="text-gray-600 mt-2">Gestiona tu información personal y preferencias</p>
                    </div>
                    {!isEditing ? (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                onClick={handleCancel}
                                variant="outline"
                                disabled={isSaving}
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="bg-green-600 hover:bg-green-700 text-white"
                                disabled={isSaving}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </Button>
                        </div>
                    )}
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-600"
                    >
                        ¡Perfil actualizado exitosamente!
                    </motion.div>
                )}
            </motion.div>

            {/* Información de cuenta */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <UserIcon className="h-6 w-6 text-green-600" />
                    Información de Cuenta
                </h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-800 font-medium">{user.email}</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Datos básicos */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Activity className="h-6 w-6 text-green-600" />
                    Datos Básicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {isEditing ? (
                        <>
                            <div>
                                <Label htmlFor="edad">Edad</Label>
                                <Input
                                    id="edad"
                                    type="number"
                                    value={editedProfile.edad}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, edad: parseInt(e.target.value) })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="peso">Peso (kg)</Label>
                                <Input
                                    id="peso"
                                    type="number"
                                    value={editedProfile.peso}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, peso: parseFloat(e.target.value) })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="estatura">Estatura (cm)</Label>
                                <Input
                                    id="estatura"
                                    type="number"
                                    value={editedProfile.estatura}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, estatura: parseInt(e.target.value) })}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="comidas_al_dia">Comidas al día</Label>
                                <Input
                                    id="comidas_al_dia"
                                    type="number"
                                    value={editedProfile.comidas_al_dia}
                                    onChange={(e) => setEditedProfile({ ...editedProfile, comidas_al_dia: parseInt(e.target.value) })}
                                    className="mt-1"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500">Edad</p>
                                <p className="text-2xl font-bold text-gray-800">{profile.edad} años</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500">Peso</p>
                                <p className="text-2xl font-bold text-gray-800">{profile.peso} kg</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500">Estatura</p>
                                <p className="text-2xl font-bold text-gray-800">{profile.estatura} cm</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl">
                                <p className="text-sm text-gray-500">Sexo</p>
                                <p className="text-2xl font-bold text-gray-800 capitalize">{profile.sexo}</p>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Objetivos y preferencias */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Target className="h-6 w-6 text-green-600" />
                    Objetivos y Preferencias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Objetivo</p>
                        <p className="text-lg font-semibold text-gray-800">{getObjetivoLabel(profile.objetivo)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Nivel de actividad</p>
                        <p className="text-lg font-semibold text-gray-800">{getNivelActividadLabel(profile.nivel_actividad)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Preferencia alimenticia</p>
                        <p className="text-lg font-semibold text-gray-800">{getPreferenciaLabel(profile.preferencia_alimenticia)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500">Comidas al día</p>
                        <p className="text-lg font-semibold text-gray-800">{profile.comidas_al_dia}</p>
                    </div>
                </div>

                {profile.restricciones && profile.restricciones.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-2">Restricciones alimentarias</p>
                        <div className="flex flex-wrap gap-2">
                            {profile.restricciones.map((restriccion, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium"
                                >
                                    {restriccion}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Hábitos de cocina */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-8"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <ChefHat className="h-6 w-6 text-green-600" />
                    Hábitos de Cocina
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Utensils className="h-4 w-4" />
                            Nivel de cocina
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mt-1">
                            {getNivelCocinaLabel(profile.nivel_cocina)}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Tiempo disponible
                        </p>
                        <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">
                            {profile.tiempo_disponible}
                        </p>
                    </div>
                </div>

                {profile.equipo_disponible && profile.equipo_disponible.length > 0 && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-2">Equipo disponible</p>
                        <div className="flex flex-wrap gap-2">
                            {profile.equipo_disponible.map((equipo, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                                >
                                    {equipo}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
