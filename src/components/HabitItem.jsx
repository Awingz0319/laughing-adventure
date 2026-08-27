import { CheckCircle2, Circle, Trash2 } from "lucide-react";

export default function HabitItem({ habit, isCompleted, onToggle, onDelete }) {
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

            <button
                onClick={() => onDelete(habit.id)}
                className="text-slate-600 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                title="Delete Habit"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
