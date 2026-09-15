import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function WeeklyChart({ data, selectedDay, onSelectDay }) {
    // Custom bar shape replaces <Cell> to dynamically handle highlighting
    const renderCustomBar = (props) => {
        const { x, y, width, height, payload } = props;
        const isSelected = selectedDay?.day === payload.day;
        const fillColor = isSelected ? "#818cf8" : "#6366f1";
        const radius = 4;

        if (height <= 0) return null;

        return (
            <path
                d={`
          M ${x},${y + radius}
          A ${radius},${radius} 0 0 1 ${x + radius},${y}
          L ${x + width - radius},${y}
          A ${radius},${radius} 0 0 1 ${x + width},${y + radius}
          L ${x + width},${y + height}
          L ${x},${y + height}
          Z
        `}
                fill={fillColor}
                className="transition-colors duration-150 cursor-pointer"
            />
        );
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-slate-200">
                        Weekly Activity
                    </h2>
                    <p className="text-xs text-slate-500">
                        Click any bar to see completed habits
                    </p>
                </div>
                <span className="text-xs text-slate-500">Completed Habits</span>
            </div>

            <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="day"
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#0f172a",
                                borderColor: "#334155",
                                borderRadius: "8px",
                                fontSize: "12px",
                            }}
                            itemStyle={{ color: "#818cf8" }}
                        />
                        <Bar
                            dataKey="completed"
                            shape={renderCustomBar}
                            onClick={(entry) => onSelectDay(entry)}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
