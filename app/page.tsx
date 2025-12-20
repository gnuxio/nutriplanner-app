import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/server";

export default async function Home() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
                <p className="text-gray-600 mb-6 md:mb-8">Bienvenido, {user.email}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
