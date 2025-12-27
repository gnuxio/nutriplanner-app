"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Lock, Sparkles, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth/client";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        // Validar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            setLoading(false);
            return;
        }

        // Validar longitud mínima
        if (newPassword.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres");
            setLoading(false);
            return;
        }

        try {
            await authClient.resetPassword(email.trim(), code.trim(), newPassword);
            setMessage("Contraseña actualizada correctamente. Redirigiendo al login...");

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al resetear contraseña');
        } finally {
            setLoading(false);
        }
    }

    async function handleResendCode() {
        if (!email.trim()) {
            setError("Por favor ingresa tu correo electrónico");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            await authClient.forgotPassword(email.trim());
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
                                <Lock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Nueva contraseña
                        </CardTitle>
                        <p className="text-gray-500 text-sm">
                            Ingresa el código y tu nueva contraseña
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                                    Nueva contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                                    Confirmar contraseña
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showConfirmPassword ? (
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
                                {loading ? "Actualizando..." : "Actualizar contraseña"}
                            </Button>

                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={loading}
                                className="text-sm text-center text-gray-500 hover:text-green-600 transition-colors"
                            >
                                ¿No recibiste el código? Reenviar
                            </button>

                            <p className="text-sm text-center text-gray-500 mt-3">
                                ¿Recordaste tu contraseña?{" "}
                                <a
                                    href="/login"
                                    className="text-green-600 hover:text-emerald-700 font-medium hover:underline"
                                >
                                    Inicia sesión
                                </a>
                            </p>
                        </form>
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

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-orange-50">
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <Card className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-3xl shadow-2xl shadow-green-200/30 w-[380px]">
                    <CardHeader className="text-center space-y-3">
                        <div className="flex justify-center">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30">
                                <Lock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            Nueva contraseña
                        </CardTitle>
                        <p className="text-gray-500 text-sm">
                            Cargando...
                        </p>
                    </CardHeader>
                </Card>
            </main>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
