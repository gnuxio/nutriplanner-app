import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, MapPin } from "lucide-react";
import { OnboardingStepProps } from "@/lib/types/onboarding";

export default function Step3Personales({ data, updateData }: OnboardingStepProps) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
                >
                    ¿Cómo te llamas?
                </motion.h1>
                <p className="text-gray-600 text-lg">
                    Queremos conocerte mejor para personalizar tu experiencia
                </p>
            </div>

            <div className="space-y-6 mt-12 bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-green-200/30 border border-gray-200/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <Label htmlFor="nombre" className="text-base font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        Nombre
                    </Label>
                    <Input
                        id="nombre"
                        type="text"
                        placeholder="Ej: Juan"
                        value={data.nombre || ''}
                        onChange={(e) => updateData({ nombre: e.target.value })}
                        className="h-14 text-lg border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl transition-all"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <Label htmlFor="apellido" className="text-base font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-400" />
                        Apellido
                    </Label>
                    <Input
                        id="apellido"
                        type="text"
                        placeholder="Ej: Pérez"
                        value={data.apellido || ''}
                        onChange={(e) => updateData({ apellido: e.target.value })}
                        className="h-14 text-lg border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl transition-all"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <Label htmlFor="pais" className="text-base font-medium text-gray-700 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        País
                    </Label>
                    <Input
                        id="pais"
                        type="text"
                        placeholder="Ej: México"
                        value={data.pais || ''}
                        onChange={(e) => updateData({ pais: e.target.value })}
                        className="h-14 text-lg border-2 border-gray-300 focus:border-green-500 focus:ring-green-500 rounded-xl transition-all"
                    />
                </motion.div>
            </div>
        </div>
    );
}
