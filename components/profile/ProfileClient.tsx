'use client';

import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/types/onboarding';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Activity, Target, Utensils, Clock, ChefHat } from 'lucide-react';

interface ProfileClientProps {
    user: User;
    profile: UserProfile | null;
}

export default function ProfileClient({ user, profile }: ProfileClientProps) {
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Mi Perfil
                </h1>
                <p className="text-gray-600 mt-2">Tu información personal y preferencias</p>
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
