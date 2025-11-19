'use client';

import { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType>({
    isCollapsed: false,
    setIsCollapsed: () => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Rutas que no deberían mostrar el sidebar
    const noSidebarRoutes = ['/login', '/register', '/onboarding'];
    const shouldShowSidebar = !noSidebarRoutes.some(route => pathname.startsWith(route));

    if (!shouldShowSidebar) {
        return <>{children}</>;
    }

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            {/* Sidebar */}
            <Sidebar
                isMobileOpen={isMobileMenuOpen}
                onMobileClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Main Content Wrapper - Full width on mobile, with margin on desktop */}
            <div
                className={`transition-all duration-300 ${isCollapsed
                    ? 'md:ml-20'
                    : 'md:ml-64'}
                `}
            >
                {/* Mobile Header */}
                <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

                {/* Main Content */}
                <main className="bg-gray-50 min-h-screen pt-16 md:pt-0">
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    );
}
