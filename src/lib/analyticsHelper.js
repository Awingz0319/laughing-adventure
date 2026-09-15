import { format, subDays, startOfDay, isSameDay, parseISO } from "date-fns";

export function generateWeeklyData(habits = []) {
    const today = startOfDay(new Date());
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
        last7Days.push(subDays(today, i));
    }

    return last7Days.map((day) => {
        const completedHabitTitles = [];

        habits.forEach((habit) => {
            const isDoneOnDay = (habit.habit_logs || []).some((log) =>
                isSameDay(parseISO(log.completed_at), day),
            );
            if (isDoneOnDay) {
                completedHabitTitles.push(habit.title);
            }
        });

        return {
            day: format(day, "EEE"), // e.g. "Mon"
            fullDate: format(day, "MMM d, yyyy"), // e.g. "Sep 15, 2026"
            completed: completedHabitTitles.length,
            tasks: completedHabitTitles,
            totalHabits: habits.length,
        };
    });
}

// Generate the last 28 days (4 weeks) for the activity heat map
export function generateMonthlyHeatmap(habits = []) {
    const today = startOfDay(new Date());
    const days = [];

    for (let i = 27; i >= 0; i--) {
        const currentDay = subDays(today, i);
        let count = 0;

        habits.forEach((h) => {
            if (
                (h.habit_logs || []).some((log) =>
                    isSameDay(parseISO(log.completed_at), currentDay),
                )
            ) {
                count++;
            }
        });

        days.push({
            dateStr: format(currentDay, "MMM d"),
            count,
        });
    }

    return days;
}
