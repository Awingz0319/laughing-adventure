import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import { LogOut, Plus, CheckCircle2, Flame } from "lucide-react";

export default function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check initial active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Listen for auth state changes (login, logout, token refresh)
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                Loading...
            </div>
        );
    }

    // If not logged in, render the Auth component
    if (!session) {
        return <Auth />;
    }

    // If logged in, render the Habit Tracker Dashboard
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-xl mx-auto space-y-6">
                {/* Header */}
                <header className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daily Habit Tracker
                        </h1>
                        <p className="text-xs text-slate-400">
                            {session.user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer">
                            <Plus size={16} /> New Habit
                        </button>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
                            title="Log Out"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </header>

                {/* Dashboard Placeholder */}
                <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-3">
                        <button className="text-emerald-400 hover:text-emerald-300">
                            <CheckCircle2 size={24} />
                        </button>
                        <span className="font-medium">Drink 2L Water</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                        <Flame size={16} /> 5 Days
                    </div>
                </div>
            </div>
        </div>
    );
}
