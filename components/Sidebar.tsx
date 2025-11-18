'use client';

import { Home, Calendar, User, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Calendar, label: 'Planes', href: '/dashboard/plans' },
        { icon: User, label: 'Perfil', href: '/dashboard/profile' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    NutriPlanner.ai
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <li key={item.href}>
                                <button
                                    onClick={() => router.push(item.href)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                        isActive
                                            ? 'bg-green-50 text-green-600 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
}
