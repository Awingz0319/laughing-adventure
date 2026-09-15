import { Flame } from "lucide-react";

export default function ActivityHeatmap({ data }) {
    const getColorClass = (count) => {
        if (count === 0) return "bg-slate-800/60 border-slate-800";
        if (count === 1)
            return "bg-indigo-950 border-indigo-800 text-indigo-300";
        if (count === 2) return "bg-indigo-700 border-indigo-600 text-white";
        return "bg-indigo-500 border-indigo-400 text-white";
    };

    const totalCompletions = data.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Flame size={16} className="text-amber-400" />
                    <h2 className="text-sm font-semibold text-slate-200">
                        28-Day Consistency Map
                    </h2>
                </div>
                <span className="text-xs text-slate-400">
                    {totalCompletions} total check-ins
                </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 pt-2">
                {data.map((item, idx) => (
                    <div
                        key={idx}
                        title={`${item.dateStr}: ${item.count} completed`}
                        className={`h-7 rounded-md border text-[10px] flex items-center justify-center font-medium transition cursor-default ${getColorClass(
                            item.count,
                        )}`}
                    >
                        {item.count > 0 ? item.count : ""}
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>4 weeks ago</span>
                <div className="flex items-center gap-1">
                    <span>Less</span>
                    <span className="w-2.5 h-2.5 rounded bg-slate-800 border border-slate-700" />
                    <span className="w-2.5 h-2.5 rounded bg-indigo-950 border border-indigo-800" />
                    <span className="w-2.5 h-2.5 rounded bg-indigo-700 border border-indigo-600" />
                    <span className="w-2.5 h-2.5 rounded bg-indigo-500 border border-indigo-400" />
                    <span>More</span>
                </div>
                <span>Today</span>
            </div>
        </div>
    );
}
