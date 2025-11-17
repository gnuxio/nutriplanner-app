import React from "react";
import { motion } from "framer-motion";

const actividades = [
    {
        id: "sedentario",
        emoji: "🪑",
        titulo: "Sedentario",
        descripcion: "Poco o ningún ejercicio",
    },
    {
        id: "ligero",
        emoji: "🚶",
        titulo: "Ligero",
        descripcion: "Caminatas ocasionales",
    },
    {
        id: "moderado",
        emoji: "🏃",
        titulo: "Moderado",
        descripcion: "Ejercicio 3-4 días/semana",
    },
    {
        id: "alto",
        emoji: "🏋️",
        titulo: "Alto",
        descripcion: "Ejercicio 5-6 días/semana",
    },
    {
        id: "muy_alto",
        emoji: "🔥",
        titulo: "Muy alto",
        descripcion: "Entrenamiento intenso diario",
    },
];

export default function Step4Actividad({ data, updateData }) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                    ¿Cuánta actividad física realizas?
                </motion.h1>
                <p className="text-slate-600 text-lg">
                    Esto nos ayuda a calcular tus necesidades calóricas
                </p>
            </div>

            <div className="grid gap-4 mt-12">
                {actividades.map((actividad, index) => {
                    const isSelected = data.nivel_actividad === actividad.id;

                    return (
                        <motion.button
                            key={actividad.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.08 }}
                            onClick={() => updateData({ nivel_actividad: actividad.id })}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                                isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-xl shadow-blue-500/20"
                                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                            }`}
                        >
                            <div className="flex items-center gap-5">
                                <div className="text-5xl">{actividad.emoji}</div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                                        {actividad.titulo}
                                    </h3>
                                    <p className="text-slate-600">{actividad.descripcion}</p>
                                </div>
                                {isSelected && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
                                    >
                                        <svg
                                            className="w-4 h-4 text-white"
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
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}