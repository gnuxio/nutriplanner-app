/**
 * Tipos compartidos para el flujo de onboarding
 */

export interface UserOnboardingData {
    objetivo: string;
    edad: number;
    peso: number;
    estatura: number;
    nombre: string;
    apellido: string;
    pais: string;
    sexo: string;
    nivel_actividad: string;
    preferencia_alimenticia: string;
    restricciones: string[];
    comidas_al_dia: number;
    nivel_cocina: string;
    tiempo_disponible: string;
    equipo_disponible: string[];
}

export interface OnboardingStepProps {
    data: UserOnboardingData;
    updateData: (partial: Partial<UserOnboardingData>) => void;
}

export interface Step8Props {
    data: UserOnboardingData;
    onFinish: () => Promise<void>;
    isLoading: boolean;
    error?: string | null;
}

// Constantes para los objetivos
export const OBJETIVOS = {
    PERDER_PESO: 'perder_peso',
    MANTENER_PESO: 'mantener_peso',
    GANAR_MUSCULO: 'ganar_musculo',
} as const;

// Constantes para sexo
export const SEXO = {
    MASCULINO: 'masculino',
    FEMENINO: 'femenino',
} as const;

// Constantes para nivel de actividad
export const NIVEL_ACTIVIDAD = {
    SEDENTARIO: 'sedentario',
    LIGERO: 'ligero',
    MODERADO: 'moderado',
    ALTO: 'alto',
    MUY_ALTO: 'muy_alto',
} as const;

// Constantes para preferencias alimenticias
export const PREFERENCIAS = {
    OMNIVORO: 'omnivoro',
    VEGETARIANO: 'vegetariano',
    VEGANO: 'vegano',
    MEDITERRANEO: 'mediterraneo',
    ALTO_PROTEINA: 'alto_proteina',
    BAJO_CARBOHIDRATOS: 'bajo_carbohidratos',
    SIN_PREFERENCIA: 'sin_preferencia',
} as const;

// Constantes para nivel de cocina
export const NIVEL_COCINA = {
    CASI_NO_COCINO: 'casi_no_cocino',
    BASICO: 'basico',
    INTERMEDIO: 'intermedio',
    AVANZADO: 'avanzado',
} as const;
