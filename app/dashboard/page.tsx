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
        <div>
            <main className="flex justify-center items-center w-full h-screen flex-col gap-4">
                <h1 className="text-7xl">Dashboard!</h1>
                {user && <p className="text-gray-600">Bienvenido, {user.email}</p>}
            </main>
        </div>
    );
}
