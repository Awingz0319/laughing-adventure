import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Auth from "./components/Auth";
import HabitModal from "./components/HabitModal";
import HabitItem from "./components/HabitItem";
import { LogOut, Plus, Loader2 } from "lucide-react";
import WeeklyChart from "./components/WeeklyChart";
import { generateWeeklyData } from "./lib/analyticsHelper";

export default function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [habits, setHabits] = useState([]);
    const [completedToday, setCompletedToday] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch habits along with all historical logs for streak calculations
    const fetchHabitsData = async () => {
        if (!session?.user?.id) return;

        try {
            // 1. UPDATED QUERY: Fetch all user habits and their nested habit_logs
            const { data: userHabits, error: habitError } = await supabase
                .from("habits")
                .select(
                    `
          id,
          title,
          category,
          created_at,
          habit_logs (
            completed_at
          )
        `,
                )
                .order("created_at", { ascending: false });

            if (habitError) throw habitError;

            // 2. Fetch today's completion logs to keep checkmark buttons accurate
            const { data: todayLogs, error: logError } = await supabase
                .from("habit_logs")
                .select("habit_id")
                .eq("completed_at", todayStr);

            if (logError) throw logError;

            setHabits(userHabits || []);
            setCompletedToday(
                new Set((todayLogs || []).map((log) => log.habit_id)),
            );
        } catch (error) {
            console.error("Error fetching habits data:", error.message);
        }
    };

    useEffect(() => {
        if (session) {
            fetchHabitsData();
        }
    }, [session]);

    // Handle Toggle Check-in / Uncheck
    const handleToggle = async (habitId, isCompleted) => {
        const updatedCompleted = new Set(completedToday);

        if (isCompleted) {
            updatedCompleted.delete(habitId);
            setCompletedToday(updatedCompleted);
            await supabase
                .from("habit_logs")
                .delete()
                .match({ habit_id: habitId, completed_at: todayStr });
        } else {
            updatedCompleted.add(habitId);
            setCompletedToday(updatedCompleted);
            await supabase.from("habit_logs").insert([
                {
                    habit_id: habitId,
                    user_id: session.user.id,
                    completed_at: todayStr,
                },
            ]);
        }

        // Refresh habit data to recompute streaks dynamically
        fetchHabitsData();
    };

    // Handle Habit Deletion
    const handleDeleteHabit = async (habitId) => {
        setHabits(habits.filter((h) => h.id !== habitId));
        await supabase.from("habits").delete().eq("id", habitId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
                <Loader2 className="animate-spin mr-2" size={20} /> Loading...
            </div>
        );
    }

    if (!session) {
        return <Auth />;
    }

    const weeklyData = generateWeeklyData(habits);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
            <div className="max-w-xl mx-auto space-y-6">
                <header className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Daily Habits
                        </h1>
                        <p className="text-xs text-slate-400">
                            {session.user.email}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer"
                        >
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

                <WeeklyChart data={weeklyData} />

                {/* Habit List Display */}
                <div className="space-y-3">
                    {habits.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                            No habits created yet. Click "New Habit" to get
                            started!
                        </div>
                    ) : (
                        habits.map((habit) => (
                            <HabitItem
                                key={habit.id}
                                habit={habit}
                                isCompleted={completedToday.has(habit.id)}
                                onToggle={handleToggle}
                                onDelete={handleDeleteHabit}
                            />
                        ))
                    )}
                </div>
            </div>

            <HabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onHabitAdded={() => fetchHabitsData()}
                userId={session.user.id}
            />
        </div>
    );
}
