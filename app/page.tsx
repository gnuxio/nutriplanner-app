import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, ShoppingCart, BarChart3, TrendingUp } from "lucide-react";

export default async function Home() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                        Dashboard
                    </h1>
                    {user && <p className="text-gray-600">Bienvenido, {user.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Card de Perfil */}
                    <Link href="/profile">
                        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-6 hover:border-green-500 hover:shadow-lg hover:shadow-green-500/20 transition-all cursor-pointer group">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 bg-green-100 rounded-2xl group-hover:bg-green-600 transition-colors">
                                    <User className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">Mi Perfil</h3>
                            </div>
                            <p className="text-gray-600 text-sm">Ver y editar tu información personal</p>
                        </div>
                    </Link>

                    {/* Card de ejemplo */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-orange-100 rounded-2xl">
                                <ShoppingCart className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Planes de comida</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-emerald-100 rounded-2xl">
                                <BarChart3 className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Calorías de hoy</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>

                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-gray-200/50 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-3 bg-green-100 rounded-2xl">
                                <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">Progreso</h3>
                        </div>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
