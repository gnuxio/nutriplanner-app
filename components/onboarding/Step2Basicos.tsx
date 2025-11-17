import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Weight, Ruler } from "lucide-react";

export default function Step2Basicos({ data, updateData }) {
    return (
        <div className="space-y-8">
            <div className="text-center space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent"
                >
                    Cuéntame un poco más sobre ti
                </motion.h1>
                <p className="text-slate-600 text-lg">
                    Necesitamos estos datos para crear tu plan perfecto
                </p>
            </div>

            <div className="space-y-6 mt-12 bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-3"
                >
                    <Label htmlFor="edad" className="text-base font-medium text-slate-700 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        Edad
                    </Label>
                    <Input
                        id="edad"
                        type="number"
                        placeholder="Ej: 28"
                        value={data.edad}
                        onChange={(e) => updateData({ edad: parseFloat(e.target.value) })}
                        className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                >
                    <Label htmlFor="peso" className="text-base font-medium text-slate-700 flex items-center gap-2">
                        <Weight className="w-5 h-5 text-slate-400" />
                        Peso (kg)
                    </Label>
                    <Input
                        id="peso"
                        type="number"
                        placeholder="Ej: 70"
                        value={data.peso}
                        onChange={(e) => updateData({ peso: parseFloat(e.target.value) })}
                        className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-3"
                >
                    <Label htmlFor="estatura" className="text-base font-medium text-slate-700 flex items-center gap-2">
                        <Ruler className="w-5 h-5 text-slate-400" />
                        Estatura (cm)
                    </Label>
                    <Input
                        id="estatura"
                        type="number"
                        placeholder="Ej: 170"
                        value={data.estatura}
                        onChange={(e) => updateData({ estatura: parseFloat(e.target.value) })}
                        className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                    />
                </motion.div>
            </div>
        </div>
    );
}