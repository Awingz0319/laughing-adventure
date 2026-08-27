import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { X, Loader2 } from "lucide-react";

export default function HabitModal({ isOpen, onClose, onHabitAdded, userId }) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("General");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase
                .from("habits")
                .insert([{ title: title.trim(), category, user_id: userId }])
                .select();

            if (insertError) throw insertError;

            onHabitAdded(data[0]);
            setTitle("");
            setCategory("General");
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-4">
                    Create New Habit
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Habit Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Read 15 mins, Exercise, Meditate"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="General">General</option>
                            <option value="Health">Health & Fitness</option>
                            <option value="Productivity">Productivity</option>
                            <option value="Learning">Learning</option>
                            <option value="Mindfulness">Mindfulness</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-slate-400 hover:text-white transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading && (
                                <Loader2 className="animate-spin" size={16} />
                            )}
                            Save Habit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
