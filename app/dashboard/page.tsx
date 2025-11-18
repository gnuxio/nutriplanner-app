import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");
    }

    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                {user && <p className="text-gray-600 mb-8">Bienvenido, {user.email}</p>}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card de ejemplo */}
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Planes de comida</h3>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Calorías de hoy</h3>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Progreso</h3>
                        <p className="text-gray-600 text-sm">Próximamente...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
