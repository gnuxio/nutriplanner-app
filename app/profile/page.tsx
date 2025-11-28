import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from '@/components/profile/ProfileClient';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default async function ProfilePage() {
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/login');
    }

    // Obtener datos del perfil
    const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

    // Manejar errores específicos
    if (profileError) {
        // PGRST116 = No rows found (usuario no ha completado onboarding)
        if (profileError.code === 'PGRST116') {
            redirect('/onboarding');
        }

        // Otros errores de base de datos
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border-2 border-red-200/50 p-8">
                        <h2 className="text-2xl font-bold text-red-600 mb-2">Error al cargar el perfil</h2>
                        <p className="text-gray-600 mb-6">
                            No pudimos cargar tu información. Por favor, intenta nuevamente.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Volver al Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <ProfileClient
                    user={user}
                    profile={profile}
                />
            </div>
        </div>
    );
}
