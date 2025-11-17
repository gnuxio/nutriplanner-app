import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const restriccionesComunes = [
    { id: "ninguna", label: "Ninguna" },
    { id: "lactosa", label: "Lactosa" },
    { id: "gluten", label: "Gluten" },
    { id: "nueces", label: "Nueces" },
    { id: "mariscos", label: "Mariscos" },
    { id: "huevo", label: "Huevo" },
    { id: "soja", label: "Soja" },
];

export default function Step6Restricciones({ data, updateData }) {
    const [otros, setOtros] = React.useState("");

    const toggleRestriccion = (id) => {
        if (id === "ninguna") {
            updateData({ restricciones: ["ninguna"] });
            return;
        }

        let newRestricciones = [...data.restricciones];

        // Remover "ninguna" si se selecciona otra
        newRestricciones = newRestricciones.filter(r => r !== "ninguna");

        if (newRestricciones.includes(id)) {
            newRestricciones = newRestricciones.filter(r => r !== id);
        } else {
            newRestricciones.push(id);
        }

        updateData({ restricciones: newRestricciones });
    };

    const handleOtrosBlur = () => {
        if (otros.trim()) {
            const newRestricciones = [...data.restricciones.filter(r => r !== "ninguna"), otros.trim()];
            updateData({ restricciones: newRestricciones });
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                    ¿Tienes alguna alergia o restricción?
                </motion.h1>
                <p className="text-slate-600 text-lg">
                    Selecciona todas las que apliquen
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
                {restriccionesComunes.map((rest, index) => {
                    const isSelected = data.restricciones.includes(rest.id);

                    return (
                        <motion.button
                            key={rest.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => toggleRestriccion(rest.id)}
                            className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                                isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                            }`}
                        >
                            <p className="text-base font-semibold text-slate-900">
                                {rest.label}
                            </p>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                                >
                                    <svg
                                        className="w-3.5 h-3.5 text-white"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-white rounded-2xl p-6 border-2 border-slate-200"
            >
                <label className="block text-sm font-medium text-slate-700 mb-3">
                    Otras restricciones (opcional)
                </label>
                <Input
                    placeholder="Ej: Cítricos, pescado, etc."
                    value={otros}
                    onChange={(e) => setOtros(e.target.value)}
                    onBlur={handleOtrosBlur}
                    className="h-12 text-base border-slate-300 focus:border-blue-500 rounded-xl"
                />
            </motion.div>
        </div>
    );
}