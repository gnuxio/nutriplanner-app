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

export default function Register() {
    const router = useRouter();
    const [step, setStep] = useState<'register' | 'verify'>('register');

    // Registro
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    // Verificación
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authClient.register(email, password, name || undefined);
            setMessage("Cuenta creada. Revisa tu correo para obtener el código de verificación.");
            setStep('verify');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authClient.verifyEmail(email, code);
            setMessage("Email verificado correctamente. Redirigiendo...");

            // Auto-login después de verificar
            setTimeout(async () => {
                try {
                    await authClient.login(email, password);
                    router.push("/onboarding");
                } catch (err) {
                    // Si el auto-login falla, redirigir a login manual
                    router.push("/login");
                }
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al verificar email');
        } finally {
            setLoading(false);
        }
    }

    async function handleResendCode() {
        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authClient.resendVerification(email);
            setMessage("Código reenviado. Revisa tu correo.");
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reenviar código');
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-orange-50">
            {/* Fondos decorativos */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Tarjeta principal */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="relative z-10 w-[380px]"
            >
                <Card className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-3xl shadow-2xl shadow-green-200/30">
                    <CardHeader className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                <ChefHat className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            {step === 'register' ? 'Crear cuenta' : 'Verificar email'}
                        </CardTitle>
                        <p className="text-gray-500 text-sm">
                            {step === 'register'
                                ? 'Únete y empieza a planificar mejor tus comidas 🍽️'
                                : 'Ingresa el código que enviamos a tu correo'
                            }
                        </p>
                    </CardHeader>

                    <CardContent>
                        {step === 'register' ? (
                            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="name" className="text-gray-700 font-medium">
                                        Nombre (opcional)
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email" className="text-gray-700 font-medium">
                                        Correo electrónico
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tucorreo@ejemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password" className="text-gray-700 font-medium">
                                        Contraseña
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
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

                                {message && (
                                    <p className="text-sm text-green-600 text-center bg-green-50 py-2 rounded-lg border border-green-100">
                                        {message}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:scale-[1.02]"
                                >
                                    {loading ? "Creando cuenta..." : "Registrarme"}
                                </Button>

                                <p className="text-sm text-center text-gray-500 mt-3">
                                    ¿Ya tienes cuenta?{" "}
                                    <a
                                        href="/login"
                                        className="text-green-600 hover:text-emerald-700 font-medium hover:underline"
                                    >
                                        Inicia sesión
                                    </a>
                                </p>
                            </form>
                        ) : (
                            <form onSubmit={handleVerify} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="code" className="text-gray-700 font-medium">
                                        Código de verificación
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all text-center text-2xl tracking-widest"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 text-center bg-red-50 py-2 rounded-lg border border-red-100">
                                        {error}
                                    </p>
                                )}

                                {message && (
                                    <p className="text-sm text-green-600 text-center bg-green-50 py-2 rounded-lg border border-green-100">
                                        {message}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all hover:scale-[1.02]"
                                >
                                    {loading ? "Verificando..." : "Verificar email"}
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="text-sm text-center text-gray-500 hover:text-green-600 transition-colors"
                                >
                                    ¿No recibiste el código? Reenviar
                                </button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Mensaje decorativo inferior */}
                <div className="mt-6 flex justify-center items-center text-gray-500 text-sm gap-2">
                    <Sparkles className="w-4 h-4 text-green-500" />
                    <span>Planificación inteligente con IA</span>
                </div>
            </motion.div>
        </main>
    );
}
