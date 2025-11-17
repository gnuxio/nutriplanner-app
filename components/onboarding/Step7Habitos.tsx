import React from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { UtensilsCrossed, Clock, ChefHat, Microwave } from "lucide-react";

const comidasOpciones = [3, 4, 5];
const nivelCocina = [
    { id: "casi_no_cocino", label: "Casi no cocino" },
    { id: "basico", label: "Básico" },
    { id: "intermedio", label: "Intermedio" },
    { id: "avanzado", label: "Avanzado" },
];
const tiempoOpciones = [
    { id: "10_min", label: "10 min" },
    { id: "20_min", label: "20 min" },
    { id: "30_plus_min", label: "30+ min" },
];
const equipoOpciones = [
    { id: "estufa", label: "Estufa", emoji: "🔥" },
    { id: "microondas", label: "Microondas", emoji: "📟" },
    { id: "airfryer", label: "Airfryer", emoji: "🍟" },
    { id: "olla_arrocera", label: "Olla/arrocera", emoji: "🍚" },
    { id: "licuadora", label: "Licuadora", emoji: "🥤" },
    { id: "horno", label: "Horno", emoji: "🔥" },
];

export default function Step7Habitos({ data, updateData }) {
    const toggleEquipo = (id) => {
        const newEquipo = data.equipo_disponible.includes(id)
            ? data.equipo_disponible.filter(e => e !== id)
            : [...data.equipo_disponible, id];
        updateData({ equipo_disponible: newEquipo });
    };

    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                    Hábitos diarios
                </motion.h1>
                <p className="text-slate-600 text-lg">
                    Últimos detalles para personalizar tus recetas
                </p>
            </div>

            <div className="space-y-8 mt-12">
                {/* Comidas al día */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl p-6 border-2 border-slate-200"
                >
                    <Label className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-slate-400" />
                        ¿Cuántas comidas al día prefieres?
                    </Label>
                    <div className="flex gap-3 mt-4">
                        {comidasOpciones.map((num) => (
                            <button
                                key={num}
                                onClick={() => updateData({ comidas_al_dia: num })}
                                className={`flex-1 py-4 rounded-xl border-2 font-semibold text-lg transition-all ${
                                    data.comidas_al_dia === num
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Nivel de cocina */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl p-6 border-2 border-slate-200"
                >
                    <Label className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <ChefHat className="w-5 h-5 text-slate-400" />
                        Nivel de cocina
                    </Label>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {nivelCocina.map((nivel) => (
                            <button
                                key={nivel.id}
                                onClick={() => updateData({ nivel_cocina: nivel.id })}
                                className={`py-4 px-4 rounded-xl border-2 font-medium transition-all ${
                                    data.nivel_cocina === nivel.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                {nivel.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Tiempo disponible */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-6 border-2 border-slate-200"
                >
                    <Label className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        Tiempo disponible por comida
                    </Label>
                    <div className="flex gap-3 mt-4">
                        {tiempoOpciones.map((tiempo) => (
                            <button
                                key={tiempo.id}
                                onClick={() => updateData({ tiempo_disponible: tiempo.id })}
                                className={`flex-1 py-4 rounded-xl border-2 font-medium transition-all ${
                                    data.tiempo_disponible === tiempo.id
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                }`}
                            >
                                {tiempo.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Equipo disponible */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border-2 border-slate-200"
                >
                    <Label className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Microwave className="w-5 h-5 text-slate-400" />
                        Equipo disponible
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                        {equipoOpciones.map((equipo) => {
                            const isSelected = data.equipo_disponible.includes(equipo.id);
                            return (
                                <button
                                    key={equipo.id}
                                    onClick={() => toggleEquipo(equipo.id)}
                                    className={`py-3 px-4 rounded-xl border-2 font-medium transition-all text-left ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-slate-200 bg-white hover:border-slate-300"
                                    }`}
                                >
                                    <span className="mr-2">{equipo.emoji}</span>
                                    {equipo.label}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}