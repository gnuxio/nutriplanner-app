'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { UserOnboardingData } from "@/lib/types/onboarding";
import { createProfile } from "@/lib/api/profile";

import Step1Objetivo from "@/components/onboarding/Step1Objetivo";
import Step2Basicos from "@/components/onboarding/Step2Basicos";
import Step3Personales from "@/components/onboarding/Step3Personales";
import Step4Sexo from "@/components/onboarding/Step3Sexo";
import Step5Actividad from "@/components/onboarding/Step4Actividad";
import Step6Preferencias from "@/components/onboarding/Step5Preferencias";
import Step7Restricciones from "@/components/onboarding/Step6Restricciones";
import Step8Habitos from "@/components/onboarding/Step7Habitos";
import Step9Confirmacion from "@/components/onboarding/Step8Confirmacion";

export default function Onboarding() {
    const router = useRouter();

    const totalSteps = 9;

    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [userData, setUserData] = useState<UserOnboardingData>({
        objetivo: "",
        edad: 0,
        peso: 0,
        estatura: 0,
        nombre: "",
        apellido: "",
        pais: "",
        sexo: "",
        nivel_actividad: "",
        preferencia_alimenticia: "",
        restricciones: [],
        comidas_al_dia: 4,
        nivel_cocina: "",
        tiempo_disponible: "",
        equipo_disponible: [],
    });

    const updateUserData = (partial: Partial<UserOnboardingData>) =>
        setUserData((prev) => ({ ...prev, ...partial }));

    const nextStep = () => currentStep < totalSteps && setCurrentStep((s) => s + 1);
    const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return userData.objetivo !== "";
            case 2:
                return userData.edad && userData.peso && userData.estatura;
            case 3:
                return userData.nombre.trim() !== "" && userData.apellido.trim() !== "" && userData.pais.trim() !== "";
            case 4:
                return userData.sexo !== "";
            case 5:
                return userData.nivel_actividad !== "";
            case 8:
                return userData.nivel_cocina && userData.tiempo_disponible;
            default:
                return true;
        }
    };

    const handleFinish = async () => {
        try {
            setIsSaving(true);
            setError(null);

            // Map frontend data to backend payload (basic fields only)
            await createProfile({
                name: userData.nombre,
                last_name: userData.apellido,
                age: userData.edad,
                weight: userData.peso,
                height: userData.estatura,
                gender: userData.sexo,
                goal: userData.objetivo,
                country: userData.pais,
                activity_level: userData.nivel_actividad,
                dislikes: [], // Not collected in onboarding yet
            });

            // Redirect to dashboard on success
            router.push("/");
        } catch (error) {
            console.error("Error guardando onboarding:", error);
            setError(error instanceof Error ? error.message : 'Error desconocido al guardar');
            setIsSaving(false);
        }
    };

    const renderStep = () => {
        const props = { data: userData, updateData: updateUserData };

        switch (currentStep) {
            case 1: return <Step1Objetivo {...props} />;
            case 2: return <Step2Basicos {...props} />;
            case 3: return <Step3Personales {...props} />;
            case 4: return <Step4Sexo {...props} />;
            case 5: return <Step5Actividad {...props} />;
            case 6: return <Step6Preferencias {...props} />;
            case 7: return <Step7Restricciones {...props} />;
            case 8: return <Step8Habitos {...props} />;
            case 9:
                return (
                    <Step9Confirmacion
                        data={userData}
                        isLoading={isSaving}
                        onFinish={handleFinish}
                        error={error}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-orange-50 relative overflow-hidden">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Header + progress */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200/50">
                <div className="max-w-2xl mx-auto px-6 py-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Paso {currentStep} de {totalSteps}</span>
                        <span className="text-sm font-semibold text-green-600">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
                    </div>

                    <div className="h-2 bg-gray-200/50 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-24 pb-12 px-4 relative z-10">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStep()}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {currentStep < totalSteps && (
                        <div className="flex gap-4 mt-12">
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={prevStep}
                                    className="border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Atrás
                                </Button>
                            )}

                            <Button
                                onClick={nextStep}
                                disabled={!canProceed()}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:scale-[1.02] rounded-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                Continuar
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}