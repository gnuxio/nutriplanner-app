"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);

    async function handleLogin(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await authClient.login(email.trim(), password);
            console.log("Successfully logged in redirect...");
            router.push("/");
        } catch (err) {
            console.error("Error in login:", err);
            setLoading(false);
            const errorMessage = err instanceof Error ? err.message : "Error desconocido";

            // Manejar error específico de email no verificado
            if (errorMessage.includes('not confirmed') || errorMessage.includes('not verified')) {
                setError("Debes verificar tu email antes de iniciar sesión. Revisa tu correo.");
            } else {
                setError(errorMessage);
            }
        }
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setEmail(e.target.value);
        if (error) setError("");
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setPassword(e.target.value);
        if (error) setError("");
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-green-50 via-emerald-50 to-orange-50">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Animated card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-[380px]"
            >
                <Card className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-3xl shadow-2xl shadow-green-200/30">
                    <CardHeader className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                <ChefHat className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Bienvenido a Menuum
                        </CardTitle>
                        <p className="text-gray-500 text-sm">
                            Planifica tu semana sin complicarte 🍃
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email" className="text-gray-700 font-medium">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="tucorreo@ejemplo.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    required
                                    autoComplete="email"
                                    className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password" className="text-gray-700 font-medium">
                                        Contraseña
                                    </Label>
                                    <a
                                        href="/forgot-password"
                                        className="text-xs text-green-600 hover:text-emerald-700 font-medium hover:underline"
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        required
                                        autoComplete="current-password"
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg border border-red-100">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:scale-[1.02]"
                            >
                                {loading ? "Iniciando..." : "Entrar"}
                            </Button>

                            <p className="text-sm text-center text-gray-500 mt-3">
                                ¿No tienes cuenta?{" "}
                                <a
                                    href="/register"
                                    className="text-green-600 hover:text-emerald-700 font-medium hover:underline"
                                >
                                    Regístrate
                                </a>
                            </p>
                        </form>
                    </CardContent>
                </Card>

                {/* Decorative message */}
                <div className="mt-6 flex justify-center items-center text-gray-500 text-sm gap-2">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <span>Planificación inteligente con IA</span>
                </div>
            </motion.div>
        </main>
    );
}
