import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export default function Step8Confirmacion({ data, onFinish, isLoading }) {
    return (
        <div className="space-y-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                    <Sparkles className="w-12 h-12 text-white" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        ¡Listo!
                    </h1>
                    <p className="text-xl text-slate-600 max-w-md mx-auto">
                        Con esta información generaremos tu menú semanal perfecto
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border-2 border-blue-100 mt-12"
            >
                <div className="space-y-4 text-sm text-slate-700">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="font-medium">Objetivo</span>
                        <span className="text-slate-900 font-semibold">
              {data.objetivo === "perder_peso" && "Perder peso"}
                            {data.objetivo === "mantener_peso" && "Mantener peso"}
                            {data.objetivo === "ganar_musculo" && "Ganar músculo"}
            </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="font-medium">Perfil</span>
                        <span className="text-slate-900 font-semibold">
              {data.edad} años • {data.peso} kg • {data.estatura} cm
            </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                        <span className="font-medium">Actividad</span>
                        <span className="text-slate-900 font-semibold capitalize">
              {data.nivel_actividad?.replace(/_/g, " ")}
            </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-medium">Preferencia</span>
                        <span className="text-slate-900 font-semibold capitalize">
              {data.preferencia_alimenticia?.replace(/_/g, " ")}
            </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-6"
            >
                <Button
                    onClick={onFinish}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-8 text-lg font-semibold rounded-2xl shadow-2xl shadow-blue-500/40 transition-all hover:scale-[1.02]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                            Generando tu menú...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5 mr-3" />
                            Generar mi menú
                        </>
                    )}
                </Button>
                <p className="text-center text-sm text-slate-500 mt-4">
                    Tarda aproximadamente 30 segundos
                </p>
            </motion.div>
        </div>
    );
}