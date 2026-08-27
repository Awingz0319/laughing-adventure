import { CheckCircle2, Circle, Flame, Trash2 } from "lucide-react";
import { calculateStreaks } from "../lib/streakCalculator";

export default function HabitItem({ habit, isCompleted, onToggle, onDelete }) {
    const dates = habit.habit_logs
        ? habit.habit_logs.map((log) => log.completed_at)
        : [];
    const { currentStreak } = calculateStreaks(dates);

    return (
        <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800 transition hover:border-slate-700">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onToggle(habit.id, isCompleted)}
                    className={`transition cursor-pointer ${
                        isCompleted
                            ? "text-emerald-400"
                            : "text-slate-500 hover:text-slate-400"
                    }`}
                >
                    {isCompleted ? (
                        <CheckCircle2 size={24} />
                    ) : (
                        <Circle size={24} />
                    )}
                </button>
                <div>
                    <h3
                        className={`font-medium text-sm transition ${
                            isCompleted
                                ? "line-through text-slate-500"
                                : "text-white"
                        }`}
                    >
                        {habit.title}
                    </h3>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                        {habit.category}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div
                    className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                        currentStreak > 0
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "text-slate-600"
                    }`}
                >
                    <Flame
                        size={14}
                        className={
                            currentStreak > 0
                                ? "text-amber-400"
                                : "text-slate-600"
                        }
                    />
                    <span>
                        {currentStreak} {currentStreak === 1 ? "day" : "days"}
                    </span>
                </div>

                <button
                    onClick={() => onDelete(habit.id)}
                    className="text-slate-600 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                    title="Delete Habit"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
